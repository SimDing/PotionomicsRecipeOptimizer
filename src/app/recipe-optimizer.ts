import { Color, COLORS, FormulaType, IngredientsService, Trait, TRAITS } from "./ingredients.service";
import { PotionRank } from "./potion-rank.repo";
import glpkLoader, { LP, GLPK, Result } from "glpk.js";

const glpk = (glpkLoader() as unknown as Promise<GLPK>).then(glpk => glpk);

type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type Objective = LP['objective'];
type Constraint = ArrayElement<LP['subjectTo']>;
type VariableBound = ArrayElement<LP['bounds'] & []>;
type ConstraintBound = Constraint['bnds'];
interface Variable {
    name: string;
    coef: number;
}

interface UpperBound {
    upperBound: number;
    lowerBound?: number; // Optional, if only upper bound is specified
}
interface LowerBound {
    lowerBound: number;
    upperBound?: number; // Optional, if only lower bound is specified
}
type SafeBound = UpperBound | LowerBound;

interface OptimalResult {
    objective: number;
    recipe: Record<string, number>;
}

/*
Example of a linear programming model in Highs format:
Maximize
 obj:
    x1 + 2 x2 + 4 x3 + x4
Subject To
 c1: - x1 + x2 + x3 + 10 x4 <= 20
 c2: x1 - 4 x2 + x3 <= 30
 c3: x2 - 0.5 x4 = 0
Bounds
 0 <= x1 <= 40
 2 <= x4 <= 3
End`;
*/

export enum OptimalityCriteria {
  MINIMIZE_COST,
  MAXIMIZE_PROFIT,
  MAXIMIZE_VALUE,
}

export default class RecipeOptimizer {

    private readonly relevantIngredients: string[] = [];
    private glpk!: GLPK;
    private readonly glpkInitialized: Promise<void>;
    private readonly blacklistConstraints: Constraint[] = [];
    private baseValue: number = 0;

    constructor(
        private readonly rank: PotionRank,
        private readonly criteria: OptimalityCriteria,
        private readonly stocks: IngredientsService,
        private readonly formula: FormulaType,
        private readonly shopBonus: number,
        private readonly ingriedientCount: number,
    ) {
        this.glpkInitialized = glpk.then(glpkInstance => {
            this.glpk = glpkInstance;
        }).catch(error => {
            console.error("Error initializing GLPK:", error);
        });
        const colors: Record<Color, boolean> = {} as any;
        const formulaData = this.stocks.formulas.find(f => f.type === this.formula)!;
        for (const color of COLORS) {
            colors[color] = formulaData[color] > 0;
        }
        this.relevantIngredients = this.stocks.ingredientNames.filter((ingredientName) => {
            const max = this.stocks.ingredientAvailability[ingredientName] || 0;
            if (max === 0) return false;
            const stats = this.stocks.ingredients[ingredientName];
            for (const color of COLORS) {
                const colorInIngredient = stats[color] > 0;
                if (colorInIngredient && !colors[color]) {
                    return false;
                }
            }
            return true;
        });
    }

    blackListRecipe(ingredients: Record<string, number>): void {
        const similarity = this.dot(ingredients, ingredients);
        const ingredientNames = Object.keys(ingredients);
        const variables = this.createVariables(ingredientNames, ingredientNames.map(name => ingredients[name]));
        const constraint: Constraint = {
            name: `c_blacklist_${this.blacklistConstraints.length}`,
            vars: variables,
            bnds: this.bound({
                upperBound: similarity - 1,
            }),
        };
        this.blacklistConstraints.push(constraint);
    }

    private dot(a: Record<string, number>, b: Record<string, number>): number {
        let sum = 0;
        for (const key of Object.keys(a)) {
            if (b[key] !== undefined) {
                sum += a[key] * b[key];
            }
        }
        return sum;
    }

    async optimizeRecipe(): Promise<OptimalResult|'Infeasible'> {
        await this.glpkInitialized;
        if (this.relevantIngredients.length === 0) {
            console.warn("No relevant ingredients found for optimization. Please check your ingredient availability and formula.");
            return 'Infeasible';
        }
        const model = this.createModel();
        let solution: Result;
        try {
            solution = await ((this.glpk.solve(model)) as unknown as Promise<Result>);
        } catch (error) {
            throw new Error(`Error running model in worker: ${error} Model:\n${model}`);
        }

        if (this.isOk(solution)) {
            return this.parseResults(solution);
        } else if (this.isInfeasible(solution)) {
            return 'Infeasible';
        } else {
            console.error("Optimization failed with status:", solution.result.status, "Model:\n", model);
            throw new Error(`Optimization failed with status: ${solution.result.status}. Model:\n${model}`);
        }
    }

    private createModel(): LP {
        return {
            name: this.rank.rank,
            objective: this.createObjectiveFunction(),
            subjectTo: this.createConstraints(),
            bounds: this.createBounds(),
            generals: this.createGeneralSection(),
            binaries: this.createBinariesSection()
        };
    }

    private parseResults(results: Result): OptimalResult {
        const names: Record<string, string> = {};
        for (const name of this.relevantIngredients) {
            names[this.safeVariableName(name)] = name;
        }
        const parsedResults: Record<string, number> = {};
        for (const [key, value] of Object.entries(results.result.vars)) {
            const roundedValue = Math.round(value);
            if (names[key] && roundedValue > 0) {
                parsedResults[names[key]] = roundedValue;
            }
        }
        return {
            recipe: parsedResults,
            objective: results.result.z + this.baseValue,
        };
    }

    private isOk(status: Result): boolean {
        return status.result.status ===  this.glpk.GLP_OPT;
    }
    private isInfeasible(status: any): boolean {
        return status.result.status === this.glpk.GLP_INFEAS || status.result.status === this.glpk.GLP_NOFEAS;
    }

    private createObjectiveFunction(): Objective {
        const useValue = this.criteria === OptimalityCriteria.MAXIMIZE_VALUE || this.criteria === OptimalityCriteria.MAXIMIZE_PROFIT;
        const useCost = this.criteria === OptimalityCriteria.MINIMIZE_COST || this.criteria === OptimalityCriteria.MAXIMIZE_PROFIT;
        const variables: Variable[] = [];
        if (useValue) {
            variables.push(...this.createValueVars());
        }
        if (useCost) {
            variables.push(...this.createCostVariables());
        }
        return {
            name: OptimalityCriteria[this.criteria],
            direction: this.glpk.GLP_MAX,
            vars: variables,
        };
    }

    private createCostVariables(): Variable[] {
        return this.createVariables(this.relevantIngredients, this.relevantIngredients.map(ingredientName => {
            const stats = this.stocks.ingredients[ingredientName];
            return -stats.cost;
        }));
    }

    private safeVariableName(variable: string): string {
        // Variables can be named anything provided that the name does not exceed 255 characters,
        // all of which must be alphanumeric (a-z, A-Z, 0-9) or one of these symbols: ! " # $ % & ( ) / , . ; ? @ _ ` ' { } | ~.
        // Longer names are truncated to 255 characters. A variable name cannot begin with a number or a period.

        const startsWithNumberOrPeriod = /^[0-9.]/.test(variable);
        if (startsWithNumberOrPeriod) {
            variable = "_" + variable;
        }

        return variable.replace(/[^a-zA-Z0-9!"#$%&()/,.;?@_`'{}|~]/g, '_')
            .substring(0, 255); // Truncate to 255 characters
    }

    private createValueVars(): Variable[] {
        const formula = this.stocks.formulas.find(f => f.type === this.formula)!;
        const outputAmunt = Math.floor(this.ingriedientCount / 2);
        this.baseValue = formula.value * this.rank.mult * outputAmunt * (1 + 0.01 * this.shopBonus);
        const changePerTrait = 0.05 * this.baseValue;
        const positiveTraits = TRAITS.map(RecipeOptimizer.positiveTraitName);
        const negativeTraits = TRAITS.map(RecipeOptimizer.negativeTraitName);
        const positiveVariables = this.createVariables(positiveTraits, positiveTraits.map(_ => changePerTrait));
        const negativeVariables = this.createVariables(negativeTraits, negativeTraits.map(_ => -changePerTrait));
        return [...positiveVariables, ...negativeVariables];
    }

    private createVariables(names: string[], coefficients: number[]): Variable[] {
        if (names.length !== coefficients.length) {
            throw new Error("Names and coefficients must have the same length.");
        }
        return names.map((name, index) => ({
            name: this.safeVariableName(name),
            coef: coefficients[index],
        }));
    }

    private static positiveTraitName(trait: Trait): string {
        return `positive_${trait.toLowerCase()}`;
    }
    private static negativeTraitName(trait: Trait): string {
        return `negative_${trait.toLowerCase()}`;
    }

    private createConstraints(): Constraint[] {
        return [
            this.createTotalMagicConstraint(),
            ...this.createColorConstraints(),
            this.createTotalIngredientConstraint(),
            ...this.createTraitConstraints(),
            ...this.blacklistConstraints,
        ];
    }

    private createTraitConstraints(): Constraint[] {
        const constraints: Constraint[] = [];
        for (const trait of TRAITS) {
            // Force positive traits to be false if there are no ingredients with that trait.
            // The optimization will try to set it to true!
            const positiveTrait = RecipeOptimizer.positiveTraitName(trait);
            const ingriedientsWithTrait = this.relevantIngredients.filter(ingredientName => {
                const stats = this.stocks.ingredients[ingredientName];
                return stats[trait] > 0;
            });
            constraints.push({
                name: `c_${positiveTrait}`,
                vars: [
                    ...this.createVariables([positiveTrait], [1]),
                    ...this.createVariables(ingriedientsWithTrait, ingriedientsWithTrait.map(_ => -1)),
                ],
                bnds: this.bound({
                    upperBound: 0,
                }),
            });
        }
        for (const trait of TRAITS) {
            // Force negative traits to be true if there are ingredients with that trait.
            // The optimization will try to set it to false!
            const negativeTrait = RecipeOptimizer.negativeTraitName(trait);
            const ingriedientsWithTrait = this.relevantIngredients.filter(ingredientName => {
                const stats = this.stocks.ingredients[ingredientName];
                return stats[trait] < 0;
            });
            constraints.push({
                name: `c_${negativeTrait}`,
                vars: [
                    ...this.createVariables([negativeTrait], [1]),
                    ...this.createVariables(ingriedientsWithTrait, ingriedientsWithTrait.map(_ => -1)),
                ],
                bnds: this.bound({
                    lowerBound: 0,
                }),
            });
        }
        return constraints;
    }

    private createTotalMagicConstraint(): Constraint {
        const minInclusive = this.rank.min;
        const maxExclusive = this.rank.max;
        const totalMagic = this.createVariables(this.relevantIngredients, this.relevantIngredients.map((ingredientName) => {
            const stats = this.stocks.ingredients[ingredientName];
            return stats.Total;
        }));
        return {
            name: "c_total_magic",
            vars: totalMagic,
            bnds: this.bound({
                lowerBound: minInclusive,
                upperBound: maxExclusive - 1,
            }),
        };
    }

    private bound(bounds: SafeBound): ConstraintBound {
        if (bounds.lowerBound !== undefined && bounds.upperBound !== undefined) {
            return {
                type: bounds.lowerBound == bounds.upperBound ? this.glpk.GLP_FX : this.glpk.GLP_DB,
                lb: bounds.lowerBound,
                ub: bounds.upperBound,
            };
        } else if (bounds.upperBound !== undefined) {
            return {
                type: this.glpk.GLP_UP,
                ub: bounds.upperBound,
                lb: -Infinity,
            };
        } else if (bounds.lowerBound !== undefined) {
            return {
                type: this.glpk.GLP_LO,
                lb: bounds.lowerBound,
                ub: Infinity,
            };
        }
        throw new Error();
    }

    private createColorConstraints(): Constraint[] {
        const colors = ['A', 'B', 'C', 'D', 'E'] as const;
        const fromula = this.stocks.formulas.find(f => f.type === this.formula)!;
        const usedColors = colors.filter(color => fromula[color] > 0);
        const constraints: Constraint[] = [];
        for (let i = 0; i < usedColors.length; i++) {
            for (let j = i + 1; j < usedColors.length; j++) {
                const color1 = usedColors[i];
                const color2 = usedColors[j];
                const ratio1 = fromula[color1];
                const ratio2 = fromula[color2];
                constraints.push(this.createColorConstraint(color1, color2, ratio1, ratio2));
            }
        }
        return constraints;
    }

    private createColorConstraint(color1: Color, color2: Color, ratio1: number, ratio2: number): Constraint {
        // We need to ensure: color1 / color2 == ratio1 / ratio2
        // This means: color1 * ratio2 - color2 * ratio1 = 0
        const variables = this.createVariables(this.relevantIngredients, this.relevantIngredients.map((ingredientName) => {
            const stats = this.stocks.ingredients[ingredientName];
            const color1Amount = stats[color1];
            const color2Amount = stats[color2];
            const k = color1Amount * ratio2 - color2Amount * ratio1;
            return k;
        }));
        return {
            name: `c_color_${color1}_${color2}`,
            vars: variables,
            bnds: this.bound({
                lowerBound: 0,
                upperBound: 0,
            }),
        };
    }

    private createTotalIngredientConstraint(): Constraint {
        const totalIngredients = this.createVariables(this.relevantIngredients, this.relevantIngredients.map(() => 1));
        return {
            name: "c_total_ingredients",
            vars: totalIngredients,
            bnds: this.bound({
                lowerBound: this.ingriedientCount,
                upperBound: this.ingriedientCount,
            }),
        };
    }

    private createBounds(): VariableBound[] {
        return this.relevantIngredients.map((ingredientName) => {
            const min = this.stocks.ingredientMustHaves[ingredientName] || 0;
            const max = this.stocks.ingredientAvailability[ingredientName] || 0;
            return {
                ...this.bound({
                    lowerBound: min,
                    upperBound: max,
                }),
                name: this.safeVariableName(ingredientName),
            };
        });
    }

    createGeneralSection(): string[] {
        return this.relevantIngredients.map(ingredientName => this.safeVariableName(ingredientName));
    }

    createBinariesSection(): string[] {
        const positiveTraits = TRAITS.map(RecipeOptimizer.positiveTraitName);
        const negativeTraits = TRAITS.map(RecipeOptimizer.negativeTraitName);
        return positiveTraits.concat(negativeTraits)
            .map(trait => this.safeVariableName(trait));
    }

}