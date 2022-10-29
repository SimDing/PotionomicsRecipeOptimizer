import { Injectable } from '@angular/core';

export interface IngredientStats {
  index: number;
  name: string;
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  Total: number;
  Price: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {

  private str = `Fairy Flower Bulb,4,0,0,0,0,4,14
  Impstool Mushroom,0,4,0,0,0,4,17
  Rotfly Larva,0,0,4,0,0,4,10
  Feyberry,6,0,0,0,0,6,4
  Mandrake Root,0,6,0,0,0,6,4
  Sack of Slime,0,0,6,0,0,6,7
  Kappa Pheromones,4,0,4,0,0,8,13
  Pixiedust Diamond,0,4,4,0,0,8,14
  River Calamari,8,0,0,0,0,8,5
  River-Pixie's Shell,4,4,0,0,0,8,11
  Serpent's Slippery Tongue,0,8,0,0,0,8,6
  Unicorn Horn,0,0,8,0,0,8,6
  Cubic Ooze,3,3,3,0,0,9,16
  Desert Metal / Trollstool Mushroom,0,12,0,0,0,12,25
  Fairy Flower Bud,12,0,0,0,0,12,23
  Murkwater Pearl / Wraith Orchid,0,0,0,12,0,12,27
  Rotfly Cocoon,0,0,12,0,0,12,25
  Celestial Ore,0,0,16,0,0,16,
  Glass Ore,0,0,0,18,0,18,24
  Horned Jelly / Puckberry,18,0,0,0,0,18,20
  Manwyrm Root,0,18,0,0,0,18,14
  Sack of Hive Slime,0,0,18,0,0,18,21
  Sphinx Flea,12,6,0,0,0,18,35
  Swamp Fish,12,0,0,6,0,18,22
  Fairy Flower Bloom,20,0,0,0,0,20,35
  Giantstool Mushroom,0,20,0,0,0,20,80
  Rotfly Adult,0,0,20,0,0,20,38
  Shadowveil Pearl,0,0,0,20,0,20,38
  Basilisk’s Cornea,0,22,0,0,0,22,
  Nether Ore,0,0,22,0,0,22,
  Figment Pomme,0,18,6,0,0,24,26
  Ghostlight Bloom,18,0,0,6,0,24,28
  Golem's-Eye Diamond,0,12,12,0,0,24,28
  Leech Snail's Shell,12,12,0,0,0,24,26
  Miasma Spore,0,18,0,6,0,24,30
  Qilin's Tri-Horn,0,0,24,0,0,24,18
  Salamander's Fiery Tongue,0,24,0,0,0,24,22
  Swamp Octopus,24,0,0,0,0,24,18
  Warg Pheromones,12,0,12,0,0,24,26
  Bog Beet,0,27,0,0,0,27,27
  Hydra Vertebra,9,9,9,0,0,27,35
  Antlered Jelly / Bogeyberry,30,0,0,0,0,30,28
  Cobweb Crayfish,10,0,20,0,0,30,48
  Electrocution Eel,10,10,10,0,0,30,45
  Fulgurite Ore,0,0,0,30,0,30,40
  Hallucinatory Shroom / Sack of Composite Slime,0,0,30,0,0,30,18
  Jelly Blossom / Static Spiderling,0,0,0,0,30,30,55
  Mandragon Root / Reef Radish,0,30,0,0,0,30,34
  Moss Berries,0,10,0,20,0,30,35
  Selkie Lice,10,20,0,0,0,30,50
  Crag Crab,0,0,0,0,32,32,75
  Daydream Pomme,0,24,8,0,0,32,
  Djinn Blossom,24,0,0,8,0,32,
  Lustrous Pearl,0,0,0,32,0,32,
  Frog Leg,0,0,24,12,0,36,33
  Banshee's Bloody Tongue,0,40,0,0,0,40,64
  Barghast Canine,0,30,0,0,10,40,110
  Dwarf Kraken,40,0,0,0,0,40,30
  Golemite,18,12,0,10,0,40,38
  Nessie Pheromones,20,0,20,0,0,40,50
  Phantom Pomme,0,10,30,0,0,40,64
  Photonic Spore,0,10,0,30,0,40,52
  Raiju Droppings,0,0,30,10,0,40,55
  Raven's Shadow,0,10,12,18,0,40,52
  Saltwatermelon,0,0,0,40,0,40,44
  Sea Salt,30,0,0,0,10,40,55
  Slapping Turtle's Shell,20,20,0,0,0,40,92
  Spider's-Bait Diamond,0,20,20,0,0,40,50
  Spriggan Antler,0,0,40,0,0,40,38
  Thunderbird’s Molted Feather,0,0,30,0,10,40,
  Bubble Ooze,9,9,12,12,0,42,60
  Blackfrost Lobster,0,0,0,0,44,44,
  Diamond Salt,33,0,0,0,11,44,
  Dragonbreath Blossom,33,0,0,11,0,44,
  Dragonfire Pearl,0,0,0,44,0,44,76
  Nightmare Pomme,0,33,11,0,0,44,
  Delirium Shroom,0,0,48,0,0,48,
  Sepulcher Widow,0,0,0,0,48,48,82
  Sequined Custard,0,0,32,0,16,48,
  Courtier's Orchid,8,24,24,0,0,56,72
  Phoenix Tear,0,24,24,8,0,56,
  Abyssalite,30,20,0,0,10,60,79
  Copper Dollop,15,15,15,15,0,60,95
  Dropspider's Shadow,0,0,30,20,10,60,90
  Fire Flower,40,0,0,20,0,60,55
  Malachite Ore,30,10,0,0,20,60,93
  Mosquito Plant,10,0,20,0,30,60,105
  Thunder Quartz,30,10,20,0,0,60,144
  Creeping Mildew,16,0,0,0,48,64,
  Daredevil Pepper,0,32,0,32,0,64,
  Geode Citrus,0,16,0,0,48,64,94
  Lamia’s Shed Scales,0,0,0,48,16,64,
  Medusa Spore,0,48,0,16,0,64,
  Naga’s Fang,0,48,0,0,16,64,
  Ogre's Shadow,32,0,32,0,0,64,74
  Rottermelon,0,0,0,64,0,64,
  Scimitar Crab’s Shell,32,32,0,0,0,64,
  Shelled Pudding,32,0,0,32,0,64,90
  Silver Stag Antler,0,0,64,0,0,64,72
  Watchdog Daisy,0,16,0,48,0,64,
  Cosmic Cassava,0,66,0,0,0,66,
  Jotunn’s Frozen Heart,22,0,0,44,0,66,
  Pandemonium Shroom,66,0,0,0,0,66,
  Squid Vine,20,20,15,0,15,70,135
  Mote of Mana,15,15,15,15,15,75,130
  Dragon Tear,0,33,33,11,0,77,
  Orchid of the Ice Princess,11,33,0,33,0,77,
  Amphithere’s Shadow,44,0,44,0,0,88,
  Body Snatcher's Sloughed Skin,0,0,0,66,22,88,132
  Dragonegg Citrus,0,22,0,0,66,88,
  Elder Being’s Tusk,0,66,0,0,22,88,
  Snowflake Spore,0,66,0,22,0,88,
  Space Nautilus’s Shell,44,44,0,0,0,88,
  Wendigo Antler,0,0,88,0,0,88,
  Widowmaker Pepper,0,44,0,44,0,88,
  Bioplasm,0,48,32,16,0,96,125
  Chimera Waste,0,0,64,32,0,96,118
  Harpy’s Snare,24,24,24,0,24,96,
  Silver Dollop,24,24,24,24,0,96,138
  Supernalite,48,32,0,16,0,96,134
  Weeping Metal Ore,0,32,64,0,0,96,
  Avalanche Cricket,24,24,32,32,0,112,
  Ember of Mana,24,24,24,24,24,120,
  Blightroach,0,42,42,42,0,126,
  Cyclops Skull,0,0,42,42,42,126,
  Lethal Injection Eel / Platinum Slime,42,42,42,0,0,126,
  Death's Embrace,33,33,33,0,33,132,196
  Dragon Dung,0,0,88,44,0,132,
  Gold Dollop,33,33,33,33,0,132,
  Hoarite,55,55,0,22,0,132,167
  Liquid Metal Ore,0,44,88,0,0,132,
  Xenoplasm,0,55,55,22,0,132,
  Charredonnay,48,0,48,24,24,144,260
  Lazuli Ore,64,48,0,0,32,144,
  Pegasus Mite,96,48,0,0,0,144,134
  Poison Quartz,64,48,0,32,0,144,185
  Mana Blaze,50,40,30,20,10,150,234
  Amethyst Ore,66,66,0,0,33,165,
  Cosmic Quartz,66,33,0,66,0,165,
  Spark of Mana,33,33,33,33,33,165,215
  Arcane Truffle,0,42,42,42,42,168,236
  Ectoplasm / Nuclear Shadow,0,70,70,28,0,168,226
  Lich’s Femur,0,0,70,70,28,168,
  Orchid of the Witch Queen,28,70,0,70,0,168,248
  Sorcerite,70,70,0,28,0,168,232
  Venous Witch-Trap,28,0,70,0,70,168,
  Witchbramble Vine,42,42,42,0,42,168,
  Dragonblood Tick,132,66,0,0,0,198,
  Arcane Quartz,84,0,0,84,42,210,
  Dazzling Mana,42,42,42,42,42,210,
  Mana Heart,28,28,28,98,28,210,450
  Mana Maelstrom,98,28,28,28,28,210,375
  Mana Singularity,28,28,28,28,98,210,475
  Mana Vortex,28,98,28,28,28,210,400
  Hocus Locust,28,28,140,28,0,224,
  Underworld Pomegranate,28,28,28,140,0,224,332
  Mana Conflagration,35,45,55,65,75,275,
  Sinfandel,80,0,80,80,40,280,
  Mass Grave Enoki,56,112,112,56,0,336,386
  `;

  ingredients: IngredientStats[] = [
    {
      index: 0,
      name: "(blank)",
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      Total: 0,
      Price: 0
    }
  ]

  constructor(
  ) {
    this.parseCSV(this.str);
  }

  parseCSV(str: string) {
    //init the array
    this.ingredients = [];
    //parse for IngredientStats
    const regex = /([\/\ \-'’A-z]*)(\,)([0-9]*)(\,)([0-9]*)(\,)([0-9]*)(\,)([0-9]*)(\,)([0-9]*)(\,)([0-9]*)(\,)([0-9]*)(\n|\r)/gi;
    let m;
    let i = 0;
    let tempStats: IngredientStats = {
      index: 0,
      name: "",
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      Total: 0,
      Price: 0
    };
    while ((m = regex.exec(str)) != null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      tempStats.index = i;
      tempStats.name = m[1];
      tempStats.A = +m[3];
      tempStats.B = +m[5];
      tempStats.C = +m[7];
      tempStats.D = +m[9];
      tempStats.E = +m[11];
      tempStats.Total = +m[13];
      tempStats.Price = +m[15];
      //Add the matches to ingredients
      this.ingredients.push(JSON.parse(JSON.stringify(tempStats)));
      i++;
    }
  }
}
