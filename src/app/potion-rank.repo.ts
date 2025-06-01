/** Type for potion ranks, uses the total power to decide rank and associated price mult */
export type PotionRank = { rank: string, min: number, max: number, mult: number }

/**
 * This is the repo class for potion ranks. Dynamically calculating the multiplier is much more effective than changing each entry in case of any changes.
 */
export class RankRepo {
    ranks: PotionRank[] = [{
        rank: 'Minor 0*',
        min: 0,
        max: 10,
        mult: 1
    },
    {
        rank: 'Minor 1*',
        min: 10,
        max: 20,
        mult: 1
    },
    {
        rank: 'Minor 2*',
        min: 20,
        max: 30,
        mult: 1
    },
    {
        rank: 'Minor 3*',
        min: 30,
        max: 40,
        mult: 1
    },
    {
        rank: 'Minor 4*',
        min: 40,
        max: 50,
        mult: 1
    },
    {
        rank: 'Minor 5*',
        min: 50,
        max: 60,
        mult: 1
    },
    {
        rank: 'Common 0*',
        min: 60,
        max: 75,
        mult: 1
    },
    {
        rank: 'Common 1*',
        min: 75,
        max: 90,
        mult: 1
    },
    {
        rank: 'Common 2*',
        min: 90,
        max: 105,
        mult: 1
    },
    {
        rank: 'Common 3*',
        min: 105,
        max: 115,
        mult: 1
    },
    {
        rank: 'Common 4*',
        min: 115,
        max: 130,
        mult: 1
    },
    {
        rank: 'Common 5*',
        min: 130,
        max: 150,
        mult: 1
    },
    {
        rank: 'Greater 0*',
        min: 150,
        max: 170,
        mult: 1
    },
    {
        rank: 'Greater 1*',
        min: 170,
        max: 195,
        mult: 1
    },
    {
        rank: 'Greater 2*',
        min: 195,
        max: 215,
        mult: 1
    },
    {
        rank: 'Greater 3*',
        min: 215,
        max: 235,
        mult: 1
    },
    {
        rank: 'Greater 4*',
        min: 235,
        max: 260,
        mult: 1
    },
    {
        rank: 'Greater 5*',
        min: 260,
        max: 290,
        mult: 1
    },
    {
        rank: 'Grand 0*',
        min: 290,
        max: 315,
        mult: 1
    },
    {
        rank: 'Grand 1*',
        min: 315,
        max: 345,
        mult: 1
    },
    {
        rank: 'Grand 2*',
        min: 345,
        max: 370,
        mult: 1
    },
    {
        rank: 'Grand 3*',
        min: 370,
        max: 400,
        mult: 1
    },
    {
        rank: 'Grand 4*',
        min: 400,
        max: 430,
        mult: 1
    },
    {
        rank: 'Grand 5*',
        min: 430,
        max: 470,
        mult: 1
    },
    {
        rank: 'Superior 0*',
        min: 470,
        max: 505,
        mult: 1
    },
    {
        rank: 'Superior 1*',
        min: 505,
        max: 545,
        mult: 1
    },
    {
        rank: 'Superior 2*',
        min: 545,
        max: 580,
        mult: 1
    },
    {
        rank: 'Superior 3*',
        min: 580,
        max: 620,
        mult: 1
    },
    {
        rank: 'Superior 4*',
        min: 620,
        max: 660,
        mult: 1
    },
    {
        rank: 'Superior 5*',
        min: 660,
        max: 720,
        mult: 1
    },
    {
        rank: 'Masterwork 0*',
        min: 720,
        max: 800,
        mult: 1
    },
    {
        rank: 'Masterwork 1*',
        min: 800,
        max: 880,
        mult: 1
    },
    {
        rank: 'Masterwork 2*',
        min: 880,
        max: 960,
        mult: 1
    },
    {
        rank: 'Masterwork 3*',
        min: 960,
        max: 1120,
        mult: 1
    },
    {
        rank: 'Masterwork 4*',
        min: 1120,
        max: 1200,
        mult: 1
    },
    {
        rank: 'Masterwork 5*',
        min: 1200,
        max: 2001,
        mult: 1
    }]

    constructor() {
        for (let i = 0; i < this.ranks.length; i++) {
            // Increases by 1.125 per grade, and 1.25 when moving up a rank. 1.125^5 * 1.25 ~ 2.252540588
            this.ranks[i].mult = Math.pow(1.125, i % 6) * Math.pow(2.252540588, Math.floor(i / 6))
        }
    }

    /**
     * Returns the rank for a given magimin value.
     */
    getRank(magimin: number): PotionRank {
        for (const rank of this.ranks) {
            if (magimin >= rank.min && magimin < rank.max) {
                return rank;
            }
        }
        throw new Error(`No rank found for magimin value: ${magimin}`);
    }
}