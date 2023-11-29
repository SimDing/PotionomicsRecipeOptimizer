/**
 * This is the repo class for the ingredient CSV import. It's quite literally a copy and paste of an excel sheet, a lot easier than trying to JSON the whole thing every change.
 */
export class Repo {  
ingredientStr = `Name,A,B,C,D,E,Cost,Total Magimin,Taste,Touch,Smell,Sight,Sound,Rarity,Location,Type
Abominable Tarantula,0,0,0,0,66,105,66,0,0,0,-5,5,Uncommon,4-Arctic,Bug
Abyssalite,30,20,0,0,10,79,60,0,0,0,0,0,Uncommon,2-Ocean Coasts,Mineral
Acid Pitfall Plant,16,0,40,0,40,145,96,0,0,0,0,0,Uncommon,3-Sulfuric Falls,Plant
Acid Rutabaga,0,48,0,0,0,54,48,-5,0,0,0,5,Common,3-Sulfuric Falls,Plant
Amethyst Ore,66,66,0,0,33,206,165,0,0,0,0,-5,Uncommon,4-Dragon Oasis,Ores
Amphitere's Shadow,44,0,44,0,0,114,88,0,0,0,0,0,Common,4-Dragon Oasis,Essences
Antlered Jelly,30,0,0,0,0,28,30,0,-5,0,5,0,Uncommon,2-Storm Plains,Slime
Arcane Quartz,84,0,0,84,42,264,210,0,0,0,0,-5,Uncommon,5-Magical Wasteland,Gem
Arcane Truffle,0,42,42,42,42,236,168,0,0,0,0,0,Rare,5-Magical Wasteland,Fungus
Armored Pudding,44,0,0,44,0,115,88,0,0,0,0,0,Common,4-Crater,Slime
Avalanche Cricket,24,24,32,32,0,140,112,5,-5,0,0,0,Common,3-Ice Craggs,Bug
Banshee's Bloody Tongue,0,40,0,0,0,32,40,0,0,-5,0,0,Common,2-Shadow Steppe,Flesh
Barghast Canine,0,30,0,0,10,55,40,0,0,0,0,0,Rare,2-Shadow Steppe,Bone
Barracuda Plant,22,55,0,0,55,172,132,0,0,0,0,0,Common,4-Crater,Plant
Basilisk's Cornea,0,22,0,0,0,54,22,5,5,0,0,0,Uncommon,4-Dragon Oasis,Flesh
Bedazzled Custard,0,0,44,0,22,95,66,0,0,0,5,0,Common,4-Dragon Oasis,Slime
Bioplasm,0,48,32,16,0,125,96,0,0,0,-5,5,Rare,3-Sulfuric Falls,Essences
Blackfrost Lobster,0,0,0,0,44,104,44,0,0,5,0,0,Uncommon,4-Arctic,Fish
Blackgold Ore,84,84,0,0,42,256,210,0,0,0,0,-5,Uncommon,5-Magical Wasteland,Ores
Blightroach,0,42,42,42,0,185,126,0,0,0,0,0,Common,5-Magical Wasteland,Bug
Body Snatcher's Sloughed Skin,0,0,0,66,22,132,88,0,0,0,0,0,Rare,4-Crater,Flesh
Bog Beet,0,27,0,0,0,27,27,-5,0,0,0,5,Rare,1-Mushroom Mire,Plant
Bogeyberry,30,0,0,0,0,30,30,0,0,0,0,0,Common,2-Storm Plains,Fruit
Bramble Rose,16,0,0,0,0,45,16,0,5,0,0,5,Uncommon,3-Sulfuric Falls,Flower
Bubble Ooze,9,9,12,12,0,60,42,0,0,0,0,0,Epic,1-Mushroom Mire,Slime
Buoyant Blowfish,96,0,48,0,0,138,144,0,0,0,-5,-5,Uncommon,3-Ice Craggs,Fish
Celestial Ore,0,0,16,0,0,45,16,0,0,5,5,0,Uncommon,3-Ice Craggs,Ores
Charredonnay,48,0,48,24,24,260,144,-5,0,0,0,0,Rare,3-Sulfuric Falls,Fruit
Chimera Waste,0,0,64,32,0,118,96,0,0,-5,0,0,Common,3-Crystalline Forest,Essences
Cobweb Crayfish,10,0,20,0,0,48,30,0,0,5,0,0,Rare,2-Shadow Steppe,Fish
Copper Dollop,15,15,15,15,0,95,60,0,0,0,0,0,Rare,2-Storm Plains,Slime
Cosmic Cassava,0,66,0,0,0,82,66,-5,0,0,0,5,Common,4-Crater,Plant
Cosmic Quartz,66,33,0,66,0,204,165,0,0,0,0,-5,Uncommon,4-Crater,Gem
Courtier's Orchid,8,24,24,0,0,72,56,0,0,5,0,0,Epic,3-Ice Craggs,Flower
Crag Crab,0,0,0,0,32,75,32,0,0,5,0,0,Rare,3-Ice Craggs,Fish
Creeping Mildew,16,0,0,0,48,92,64,0,0,0,0,0,Uncommon,3-Sulfuric Falls,Fungus
Crocodile Tooth,6,0,12,0,0,20,18,0,0,0,0,0,Common,1-Mushroom Mire,Bone
Cubic Ooze,3,3,3,0,0,16,9,0,0,0,0,0,Rare,0-Enchanted Forest,Slime
Cyclops Skull,0,0,42,42,42,200,126,0,0,0,0,0,Common,5-Magical Wasteland,Bone
Daredevil Pepper,0,32,0,32,0,90,64,0,0,0,0,0,Common,3-Crystalline Forest,Plant
Daydream Pomme,0,24,8,0,0,75,32,0,0,0,5,5,Rare,3-Sulfuric Falls,Fruit
Dazzling Mana,42,42,42,42,42,345,210,0,5,5,0,0,Epic,5-Magical Wasteland,Pure Mana
Death's Embrace,33,33,33,0,33,196,132,0,0,0,0,0,Epic,4-Arctic,Plant
Delirium Shroom,0,0,48,0,0,63,48,5,0,0,0,-5,Common,3-Crystalline Forest,Fungus
Desert Metal,0,12,0,0,0,25,12,0,5,0,0,0,Common,1-Bone Wastes,Ores
Diamond Salt,33,0,0,0,11,85,44,5,0,0,5,0,Uncommon,4-Arctic,Mineral
Direwolf's-Breath Diamond,0,44,44,0,0,118,88,0,0,0,0,0,Common,4-Arctic,Gem
Djinn Blossom,24,0,0,8,0,68,32,5,0,5,0,0,Uncommon,3-Crystalline Forest,Flower
Dragon Dung,0,0,88,44,0,173,132,0,0,-5,0,0,Uncommon,4-Dragon Oasis,Essences
Dragon Pheromones,0,0,0,0,88,151,88,0,0,-5,0,0,Uncommon,4-Dragon Oasis,Essences
Dragon Tear,0,33,33,11,0,118,77,0,5,0,0,0,Uncommon,4-Dragon Oasis,Essences
Dragonblood Tick,132,66,0,0,0,174,198,0,-5,0,0,-5,Uncommon,4-Dragon Oasis,Bug
Dragonbreath Blossom,33,0,0,11,0,76,44,5,0,5,0,0,Uncommon,4-Dragon Oasis,Flower
Dragonegg Citrus,0,22,0,0,66,124,88,0,0,0,0,0,Uncommon,4-Dragon Oasis,Fruit
Dragonfire Pearl,0,0,0,44,0,76,44,0,0,0,5,0,Rare,4-Dragon Oasis,Gem
Draugr's Tibia,0,0,55,55,22,184,132,0,0,0,0,0,Uncommon,4-Arctic,Bone
Dropspider's Shadow,0,0,30,20,10,90,60,0,0,0,0,0,Rare,2-Shadow Steppe,Essences
Dwarf Kraken,40,0,0,0,0,30,40,0,-5,0,0,0,Common,2-Ocean Coasts,Fish
Ectoplasm,0,70,70,28,0,226,168,0,0,0,-5,5,Rare,5-Magical Wasteland,Essences
Elder Being's Tusk,0,66,0,0,22,114,88,0,-5,0,0,5,Uncommon,4-Crater,Bone
Electrocution Eel,10,10,10,0,0,45,30,0,0,0,5,0,Uncommon,2-Storm Plains,Fish
Ember of Mana,24,24,24,24,24,165,120,0,0,0,0,0,Epic,3-Ice Craggs,Pure Mana
Eye of Newt,0,16,0,0,0,34,16,5,5,0,0,0,Uncommon,3-Crystalline Forest,Flesh
Fairy Flower Bloom,20,0,0,0,0,35,20,0,0,5,0,0,Common,2-Shadow Steppe,Flower
Fairy Flower Bud,12,0,0,0,0,23,12,0,0,5,0,0,Common,1-Bone Wastes,Flower
Fairy Flower Bulb,4,0,0,0,0,14,4,0,0,5,0,0,Common,0-Enchanted Forest,Flower
Feathered Gelatin,0,0,0,48,0,62,48,0,5,-5,0,0,Uncommon,3-Ice Craggs,Slime
Feyberry,6,0,0,0,0,4,6,0,0,0,0,0,Common,0-Enchanted Forest,Fruit
Figment Pomme,0,18,6,0,0,26,24,0,0,0,0,0,Uncommon,1-Bone Wastes,Fruit
Fire Flower,40,0,0,20,0,55,60,0,0,-5,0,0,Rare,2-Storm Plains,Flower
Frog Leg,0,0,24,12,0,33,36,0,0,0,-5,0,Epic,1-Bone Wastes,Flesh
Frost Hopper,33,33,44,44,0,196,154,5,-5,0,0,0,Common,4-Arctic,Bug
Fulgurite Ore,0,0,0,30,0,40,30,0,0,0,0,0,Uncommon,2-Storm Plains,Ores
Funeral Pyre Enoki,88,88,44,44,0,280,264,0,-5,-5,0,0,Epic,4-Dragon Oasis,Fungus
Geode Citrus,0,16,0,0,48,94,64,0,0,0,0,0,Uncommon,3-Crystalline Forest,Fruit
Ghostlight Bloom,18,0,0,6,0,28,24,0,0,0,0,0,Uncommon,1-Mushroom Mire,Flower
Giantstool Mushroom,0,20,0,0,0,40,20,0,5,0,0,0,Common,2-Storm Plains,Fungus
Glass Ore,0,0,0,18,0,24,18,0,0,0,0,0,Common,1-Bone Wastes,Ores
Gold Dollop,33,33,33,33,0,176,132,0,0,0,0,0,Rare,4-Dragon Oasis,Slime
Golem's-Eye Diamond,0,12,12,0,0,28,24,0,0,0,0,0,Uncommon,1-Bone Wastes,Gem
Golemite,18,12,0,10,0,38,40,0,0,0,0,0,Rare,1-Bone Wastes,Mineral
Griffin's-Whetstone Diamond,0,32,32,0,0,86,64,0,0,0,0,0,Common,3-Ice Craggs,Gem
Guillotine Eel,33,33,33,0,0,126,99,0,0,0,0,0,Common,4-Crater,Fish
Hallucinatory Shroom,0,0,30,0,0,36,30,5,0,0,0,-5,Rare,2-Shadow Steppe,Fungus
Hangman Eel,24,24,24,0,0,95,72,0,0,0,0,0,Uncommon,3-Sulfuric Falls,Fish
Harpy's Heart of Stone,16,0,0,32,0,76,48,0,5,0,0,0,Uncommon,3-Ice Craggs,Flesh
Harpy's Snare,24,24,24,0,24,150,96,0,0,0,0,0,Epic,3-Ice Craggs,Plant
Hellhound Daisy,0,22,0,66,0,125,88,0,0,0,0,0,Uncommon,4-Arctic,Flower
Hoarite,55,55,0,22,0,167,132,-5,0,0,5,0,Rare,4-Arctic,Mineral
Hocus Locust,28,28,140,28,0,287,224,5,-5,0,0,0,Epic,5-Magical Wasteland,Bug
Horned Jelly,18,0,0,0,0,20,18,0,-5,0,5,0,Uncommon,1-Bone Wastes,Slime
Hydra Vertebra,9,9,9,0,0,35,27,0,0,0,0,0,Common,1-Mushroom Mire,Bone
Icicle Pufferfish,132,0,66,0,0,210,198,0,0,0,-5,-5,Uncommon,4-Arctic,Fish
Impstool Mushroom,0,4,0,0,0,17,4,0,5,0,0,0,Common,0-Enchanted Forest,Fungus
Inverted Brable-Rose,22,0,0,0,0,46,22,0,5,0,0,5,Uncommon,4-Crater,Flower
Jelly Blossom,0,0,0,0,30,55,30,0,0,0,0,0,Rare,2-Ocean Coasts,Flower
Jeweled Scarab,0,24,24,24,0,105,72,0,0,0,0,0,Common,3-Crystalline Forest,Bug
Jotunn's Frozen Heart,22,0,0,44,0,98,66,0,5,0,0,0,Uncommon,4-Arctic,Flesh
Kappa Pheromones,4,0,4,0,0,13,8,0,0,0,0,0,Uncommon,0-Enchanted Forest,Essences
Lamia's Shed Scales,0,0,0,48,16,110,64,0,0,0,0,0,Uncommon,3-Sulfuric Falls,Flesh
Lazuli Ore,64,48,0,0,32,174,144,0,0,0,0,-5,Rare,3-Crystalline Forest,Ores
Leech Snail's Shell,12,12,0,0,0,26,24,0,0,0,0,0,Uncommon,1-Bone Wastes,Mineral
Lethal Injection Eel,42,42,42,0,0,164,126,0,0,0,0,0,Common,5-Magical Wasteland,Fish
Lich's Femur,0,0,70,70,28,247,168,0,0,0,0,0,Uncommon,5-Magical Wasteland,Bone
Liquid Metal Ore,0,44,88,0,0,162,132,0,-5,0,0,0,Common,4-Crater,Ores
Lustrous Pearl,0,0,0,32,0,60,32,0,0,0,5,0,Common,3-Crystalline Forest,Gem
Magma Beetle,0,33,33,33,0,124,99,0,0,0,0,0,Common,4-Dragon Oasis,Bug
Malachite Ore,30,10,0,0,20,93,60,0,0,0,0,0,Rare,2-Ocean Coasts,Ores
Mana Blaze,50,40,30,20,10,234,150,0,5,5,0,0,Epic,4-Dragon Oasis,Pure Mana
Mana Conflagration,35,45,55,65,75,316,275,0,0,-5,-5,0,Epic,4-Arctic,Pure Mana
Mana Heart,28,28,28,98,28,450,210,5,0,5,0,0,Epic,5-Magical Wasteland,Pure Mana
Mana Maelstrom,98,28,28,28,28,375,210,0,0,0,5,5,Epic,5-Magical Wasteland,Pure Mana
Mana Prism,28,28,98,28,28,425,210,0,5,0,5,0,Epic,5-Magical Wasteland,Pure Mana
Mana Singularity,28,28,28,28,98,475,210,0,0,5,0,5,Epic,5-Magical Wasteland,Pure Mana
Mana Vortex,28,98,28,28,28,400,210,5,0,0,0,5,Epic,5-Magical Wasteland,Pure Mana
Mandragon Root,0,30,0,0,0,34,30,0,0,0,0,0,Common,2-Ocean Coasts,Plant
Mandrake Root,0,6,0,0,0,6,6,0,0,0,0,0,Common,0-Enchanted Forest,Plant
Manwyrm Root,0,18,0,0,0,14,18,0,0,0,0,0,Common,1-Bone Wastes,Plant
Mass Grave Enoki,56,112,112,56,0,386,336,0,-5,-5,0,0,Rare,5-Magical Wasteland,Fungus
Medusa Spore,0,48,0,16,0,94,64,-5,0,5,0,0,Common,3-Ice Craggs,Fungus
Miasma Spore,0,18,0,6,0,30,24,0,0,0,0,0,Uncommon,1-Mushroom Mire,Fungus
Mosquito Plant,10,0,20,0,30,105,60,0,0,0,0,0,Epic,2-Shadow Steppe,Plant
Moss Berries,0,10,0,20,0,35,30,0,0,0,0,0,Common,1-Mushroom Mire,Fruit
Mote of Mana,15,15,15,15,15,130,75,0,0,0,0,0,Epic,2-Shadow Steppe,Pure Mana
Mud Shrimp,6,0,12,0,0,26,18,0,0,5,0,0,Rare,1-Mushroom Mire,Fish
Murkwater Pearl,0,0,0,12,0,27,12,0,0,0,5,0,Uncommon,1-Mushroom Mire,Gem
Naga's Fang,0,48,0,0,16,98,64,0,-5,0,0,5,Common,3-Sulfuric Falls,Bone
Nessie Pheromones,20,0,20,0,0,50,40,0,0,0,0,0,Common,2-Ocean Coasts,Essences
Nether Ore,0,0,22,0,0,51,22,0,0,5,5,0,Rare,4-Arctic,Ores
Nightmare Pomme,0,33,11,0,0,72,44,0,0,0,5,5,Rare,4-Crater,Fruit
Nuclear Shadow,0,70,70,28,0,228,168,0,5,0,0,0,Rare,5-Magical Wasteland,Essences
Ogre's Shadow,32,0,32,0,0,74,64,0,0,0,0,0,Common,3-Crystalline Forest,Essences
Orchid of the Ice Princess,11,33,0,33,0,116,77,0,0,5,0,0,Rare,4-Arctic,Flower
Orchid of the Witch Queen,28,70,0,70,0,248,168,0,0,5,0,0,Rare,5-Magical Wasteland,Flower
Owlbear Pheromones,0,0,0,0,64,90,64,0,0,-5,0,0,Uncommon,3-Crystalline Forest,Essences
Pandemonium Shroom,66,0,0,0,0,72,66,5,0,0,0,-5,Common,4-Dragon Oasis,Fungus
Pegasus Mite,96,48,0,0,0,134,144,0,-5,0,0,-5,Uncommon,3-Crystalline Forest,Bug
Phantom Pomme,0,10,30,0,0,64,40,5,0,0,0,-5,Epic,2-Ocean Coasts,Fruit
Phoenix Tear,0,24,24,8,0,82,56,0,5,0,0,0,Epic,3-Crystalline Forest,Essence
Photonic Spore,0,10,0,30,0,52,40,-5,0,5,0,0,Epic,2-Shadow Steppe,Fungus
Pixiedust Diamond,0,4,4,0,0,14,8,0,0,0,0,0,Uncommon,0-Enchanted Forest,Gem
Platinum Slime,42,42,42,42,0,178,168,0,0,0,0,0,Rare,5-Magical Wasteland,Slime
Poison Quartz,64,48,0,32,0,185,144,0,0,0,0,-5,Rare,3-Sulfuric Falls,Gem
Puckberry,18,0,0,0,0,16,18,0,0,0,0,0,Common,1-Mushroom Mire,Fruit
Qilin's Tri-Horn,0,0,24,0,0,18,24,-5,0,0,0,0,Common,1-Mushroom Mire,Bone
Raiju Droppings,0,0,30,10,0,55,40,0,0,0,0,0,Uncommon,2-Storm Plains,Essences
Raven's Shadow,0,10,12,18,0,52,40,0,0,0,0,0,Rare,1-Mushroom Mire,Essences
Reef Radish,0,30,0,0,0,32,30,-5,0,0,0,5,Rare,2-Ocean Coasts,Plant
River Calamari,8,0,0,0,0,5,8,0,-5,0,0,0,Common,0-Enchanted Forest,Fish
River-Pixie's Shell,4,4,0,0,0,11,8,0,0,0,0,0,Uncommon,0-Enchanted Forest,Mineral
Rock Salt,24,0,0,0,8,68,32,5,0,0,5,0,Uncommon,3-Ice Craggs,Mineral
Rotfly Adult,0,0,20,0,0,38,20,5,0,0,0,0,Uncommon,2-Ocean Coasts,Bug
Rotfly Cocoon,0,0,12,0,0,25,12,5,0,0,0,0,Uncommon,1-Bone Wastes,Bug
Rotfly Larva,0,0,4,0,0,10,4,5,0,0,0,0,Common,0-Enchanted Forest,Bug
Rotfly Matriarch,0,0,32,0,0,65,32,5,0,0,0,0,Common,3-Sulfuric Falls,Bug
Rotfly Mutant,0,0,44,0,0,74,44,5,0,0,0,0,Common,4-Crater,Bug
Rottermelon,0,0,0,64,0,68,64,0,0,0,-5,0,Common,3-Sulfuric Falls,Fruit
Sack of Composite Slime,0,0,30,0,0,36,30,0,0,0,0,0,Common,2-Shadow Steppe,Slime
Sack of Hive Slime,0,0,18,0,0,21,18,0,0,0,0,0,Common,1-Mushroom Mire,Slime
Sack of Slime,0,0,6,0,0,7,6,0,0,0,0,0,Common,0-Enchanted Forest,Slime
Salamander's Fiery Tongue,0,24,0,0,0,22,24,0,0,-5,0,0,Common,1-Bone Wastes,Flesh
Saltwatermelon,0,0,0,40,0,44,40,0,0,0,-5,0,Uncommon,2-Ocean Coasts,Fruit
Scimitar Crab's Shell,32,32,0,0,0,76,64,0,0,0,0,0,Common,3-Sulfuric Falls,Mineral
Sea Salt,30,0,0,0,10,55,40,0,0,0,0,0,Uncommon,2-Ocean Coasts,Mineral
Selkie Lice,10,20,0,0,0,50,30,0,5,0,0,0,Rare,2-Ocean Coasts,Bug
Sepulcher Widow,0,0,0,0,48,82,48,0,0,0,5,-5,Uncommon,3-Ice Craggs,Bug
Sequined Custard,0,0,32,0,16,84,48,0,0,0,5,0,Uncommon,3-Crystalline Forest,Slime
Serpent's Slippery Tongue,0,8,0,0,0,6,8,0,0,-5,0,0,Common,0-Enchanted Forest,Flesh
Shadowveil Pearl,0,0,0,20,0,38,20,0,0,0,5,0,Uncommon,2-Shadow Steppe,Gem
Shallow Grave Enoki,32,64,64,32,0,200,192,0,-5,-5,0,0,Rare,3-Crystalline Forest,Fungus
Shelled Pudding,32,0,0,32,0,90,64,0,0,0,0,0,Common,3-Sulfuric Falls,Slime
Silver Dollop,24,24,24,24,0,138,96,0,0,0,0,0,Epic,3-Crystalline Forest,Slime
Silver Stag Antler,0,0,64,0,0,72,64,-5,0,0,0,0,Common,3-Ice Craggs,Bone
Sinfandel,80,0,80,80,40,362,280,-5,0,0,0,0,Rare,5-Magical Wasteland,Fruit
Slapping Turtle's Shell,20,20,0,0,0,46,40,0,0,0,0,0,Common,2-Storm Plains,Mineral
Slaughtermelon,0,0,0,76,0,105,76,0,0,0,-5,0,Common,4-Crater,Fruit
Snowflake Spore,0,66,0,22,0,105,88,-5,0,5,0,0,Common,4-Arctic,Fungus
Sorcerite,70,70,0,28,0,232,168,-5,0,0,5,0,Rare,5-Magical Wasteland,Mineral
Space Nautilus's Shell,44,44,0,0,0,102,88,0,0,0,0,0,Common,4-Crater,Mineral
Spark of Mana,33,33,33,33,33,215,165,0,0,0,0,0,Epic,4-Crater,Pure Mana
Sphinx Flea,12,6,0,0,0,35,18,0,5,0,0,0,Rare,1-Bone Wastes,Bug
Spider's-Bait Diamond,0,20,20,0,0,50,40,0,0,0,0,0,Uncommon,2-Shadow Steppe,Gem
Spriggan Antler,0,0,40,0,0,38,40,-5,0,0,0,0,Uncommon,2-Storm Plains,Bone
Squid Vine,20,20,15,0,15,135,70,0,0,0,0,0,Rare,2-Ocean Coasts,Plant
Stalking Mold,22,0,0,0,66,123,88,0,0,0,0,0,Uncommon,4-Crater,Fungus
Stalking Skeleton's Fibula,0,0,40,40,16,150,96,0,0,0,0,0,Uncommon,3-Ice Craggs,Bone
Static Spiderling,0,0,0,0,30,50,30,0,0,0,-5,5,Rare,2-Storm Plains,Bug
Supernalite,48,32,0,16,0,134,96,-5,0,0,5,0,Rare,3-Ice Craggs,Mineral
Swamp Fish,12,0,0,6,0,22,18,0,0,0,0,0,Common,1-Mushroom Mire,Fish
Swamp Octopus,24,0,0,0,0,18,24,0,-5,0,0,0,Common,1-Mushroom Mire,Fish
Thunder Quartz,30,10,20,0,0,72,60,0,0,0,0,0,Uncommon,2-Storm Plains,Gem
Thunderbird's Molted Feather,0,0,30,0,10,60,40,0,0,0,0,0,Rare,2-Storm Plains,Flesh
Trollstool Mushroom,0,12,0,0,0,20,12,0,5,0,0,0,Common,1-Mushroom Mire,Fungus
Underworld Pomegranate,28,28,28,140,0,332,224,5,0,0,-5,0,Epic,5-Magical Wasteland,Fruit
Unicorn Horn,0,0,8,0,0,6,8,-5,0,0,0,0,Common,0-Enchanted Forest,Bone
Venous Witch-Trap,28,0,70,0,70,214,168,0,0,0,0,0,Uncommon,5-Magical Wasteland,Plant
Warg Pheromones,12,0,12,0,0,26,24,0,0,0,0,0,Uncommon,1-Mushroom Mire,Essences
Watchdog Daisy,0,16,0,48,0,83,64,0,0,0,0,0,Common,3-Ice Craggs,Flower
Weeping Metal Ore,0,32,64,0,0,66,96,0,-5,0,0,0,Common,3-Sulfuric Falls,Ores
Wendigo Antler,0,0,88,0,0,104,88,-5,0,0,0,0,Common,4-Arctic,Bone
Widowmaker Pepper,0,44,0,44,0,126,88,0,0,0,0,0,Common,4-Dragon Oasis,Plant
Winged Gelatin,0,0,0,66,0,103,66,0,5,-5,0,0,Uncommon,4-Arctic,Slime
Witchbramble Vine,42,42,42,0,42,210,168,0,0,0,0,0,Rare,5-Magical Wasteland,Plant
Wraith Orchid,0,0,0,12,0,19,12,0,0,0,0,0,Common,1-Mushroom Mire,Flower
Xeno Noir,66,0,66,33,33,236,198,-5,0,0,0,0,Rare,4-Crater,Fruit
Xenoplasm,0,55,55,22,0,166,132,0,0,0,-5,5,Rare,4-Crater,Essences
Yeti Antler,0,0,88,0,0,104,88,-5,0,0,0,0,Common,4-Arctic,Bone
EndOfLine,,,,,,,,,,,,,,,`;
}