// @ts-check
/**
 * @typedef {import("./types.js").item} item
 */

import { writeDataFileRequest } from "./data/dataIO.js";

let sanesItemPrices = {
        "+1 Shield": {
                price: 1500,
                rarity: "uncommon"
        },
        "+2 Shield": {
                price: 6000,
                rarity: "rare"
        },
        "+3 Shield": {
                price: 24000,
                rarity: "very rare"
        },
        "Alchemy Jug": {
                price: 6000,
                rarity: "uncommon"
        },
        "Ammunition +1 (each)": {
                price: 25,
                rarity: "uncommon"
        },
        "Ammunition +2 (each)": {
                price: 100,
                rarity: "rare"
        },
        "Ammunition +3 (each)": {
                price: 400,
                rarity: "very rare"
        },
        "Amulet of Health": {
                price: 8000,
                rarity: "rare"
        },
        "Amulet of Proof Against Detection and Location": {
                price: 20000,
                rarity: "uncommon"
        },
        "Amulet of the Planes": {
                price: 160000,
                rarity: "very rare"
        },
        "Animated Shield": {
                price: 6000,
                rarity: "very rare"
        },
        "Apparatus of Kwalish": {
                price: 10000,
                rarity: "legendary"
        },
        "Arrow of Slaying (each)": {
                price: 600,
                rarity: "very rare"
        },
        "Arrow-Catching Shield": {
                price: 6000,
                rarity: "rare"
        },
        "Bag of Holding": {
                price: 4000,
                rarity: "uncommon"
        },
        "Bead of Force": {
                price: 960,
                rarity: "rare"
        },
        "Belt of Dwarvenkind": {
                price: 6000,
                rarity: "rare"
        },
        "Boots of Elvenkind": {
                price: 2500,
                rarity: "uncommon"
        },
        "Boots of Levitation": {
                price: 4000,
                rarity: "rare"
        },
        "Boots of Speed": {
                price: 4000,
                rarity: "rare"
        },
        "Boots of Striding and Springing": {
                price: 5000,
                rarity: "uncommon"
        },
        "Boots of the Winterlands": {
                price: 10000,
                rarity: "uncommon"
        },
        "Bowl of Commanding Water Elementals": {
                price: 8000,
                rarity: "rare"
        },
        "Bracers of Archery": {
                price: 1500,
                rarity: "uncommon"
        },
        "Bracers of Defense": {
                price: 6000,
                rarity: "rare"
        },
        "Brass Horn of Valhalla": {
                price: 8400,
                rarity: "rare"
        },
        "Brazier of Commanding Fire Elementals": {
                price: 8000,
                rarity: "rare"
        },
        "Bronze Griffon": {
                price: 8000,
                rarity: "rare"
        },
        "Bronze Horn of Valhalla": {
                price: 11200,
                rarity: "very rare"
        },
        "Brooch of Shielding": {
                price: 7500,
                rarity: "uncommon"
        },
        "Broom of Flying": {
                price: 8000,
                rarity: "uncommon"
        },
        "Cap of Water Breathing": {
                price: 1000,
                rarity: "uncommon"
        },
        "Cape of the Mountebank": {
                price: 8000,
                rarity: "rare"
        },
        "Carpet of Flying": {
                price: 12000,
                rarity: "very rare"
        },
        "Censer of Controlling Air Elementals": {
                price: 8000,
                rarity: "rare"
        },
        "Chime of Opening": {
                price: 1500,
                rarity: "rare"
        },
        "Circlet of Blasting": {
                price: 1500,
                rarity: "uncommon"
        },
        "Cloak of Arachnida": {
                price: 5000,
                rarity: "very rare"
        },
        "Cloak of Displacement": {
                price: 60000,
                rarity: "rare"
        },
        "Cloak of Elvenkind": {
                price: 5000,
                rarity: "uncommon"
        },
        "Cloak of Invisibility": {
                price: 80000,
                rarity: "legendary"
        },
        "Cloak of Protection": {
                price: 3500,
                rarity: "uncommon"
        },
        "Cloak of the Bat": {
                price: 6000,
                rarity: "rare"
        },
        "Cloak of the Manta Ray": {
                price: 6000,
                rarity: "uncommon"
        },
        "Crystal Ball": {
                price: 50000,
                rarity: "very rare"
        },
        "Cube of Force": {
                price: 16000,
                rarity: "rare"
        },
        "Cubic Gate": {
                price: 40000,
                rarity: "legendary"
        },
        "Daern's Instant Fortress": {
                price: 75000,
                rarity: "rare"
        },
        "Dagger of Venom": {
                price: 2500,
                rarity: "rare"
        },
        "Decanter of Endless Water": {
                price: 135000,
                rarity: "uncommon"
        },
        "Deck of Illusions": {
                price: 6120,
                rarity: "uncommon"
        },
        "Dimensional Shackles": {
                price: 3000,
                rarity: "rare"
        },
        "Dragon Scale Mail": {
                price: 4000,
                rarity: "very rare"
        },
        "Driftglobe": {
                price: 750,
                rarity: "uncommon"
        },
        "Dust of Disappearance": {
                price: 300,
                rarity: "uncommon"
        },
        "Dust of Dryness (1 pellet)": {
                price: 120,
                rarity: "uncommon"
        },
        "Dust of Sneezing and Choking": {
                price: 480,
                rarity: "uncommon"
        },
        "Dwarven Plate": {
                price: 9000,
                rarity: "very rare"
        },
        "Dwarven Thrower": {
                price: 18000,
                rarity: "very rare"
        },
        "Ebony Fly": {
                price: 6000,
                rarity: "rare"
        },
        "Efreeti Chain": {
                price: 20000,
                rarity: "legendary"
        },
        "Elemental Gem": {
                price: 960,
                rarity: "uncommon"
        },
        "Elixir of Health": {
                price: 120,
                rarity: "rare"
        },
        "Elven Chain": {
                price: 4000,
                rarity: "rare"
        },
        "Eversmoking Bottle": {
                price: 1000,
                rarity: "uncommon"
        },
        "Eyes of Charming": {
                price: 3000,
                rarity: "uncommon"
        },
        "Eyes of Minute Seeing": {
                price: 2500,
                rarity: "uncommon"
        },
        "Eyes of the Eagle": {
                price: 2500,
                rarity: "uncommon"
        },
        "Folding Boat": {
                price: 10000,
                rarity: "rare"
        },
        "Gauntlets of Ogre Power": {
                price: 8000,
                rarity: "uncommon"
        },
        "Gem of Brightness": {
                price: 5000,
                rarity: "uncommon"
        },
        "Gem of Seeing": {
                price: 32000,
                rarity: "rare"
        },
        "Glamoured Studded Leather": {
                price: 2000,
                rarity: "rare"
        },
        "Gloves of Missile Snaring": {
                price: 3000,
                rarity: "uncommon"
        },
        "Gloves of Swimming and Climbing": {
                price: 2000,
                rarity: "uncommon"
        },
        "Gloves of Thievery": {
                price: 5000,
                rarity: "uncommon"
        },
        "Goggles of Night": {
                price: 1500,
                rarity: "uncommon"
        },
        "Golden Lion (each)": {
                price: 600,
                rarity: "rare"
        },
        "Hammer of Thunderbolts": {
                price: 16000,
                rarity: "legendary"
        },
        "Hat of Disguise": {
                price: 5000,
                rarity: "uncommon"
        },
        "Headband of Intellect": {
                price: 8000,
                rarity: "uncommon"
        },
        "Helm of Comprehend Languages": {
                price: 500,
                rarity: "uncommon"
        },
        "Helm of Telepathy": {
                price: 12000,
                rarity: "uncommon"
        },
        "Helm of Teleportation": {
                price: 64000,
                rarity: "rare"
        },
        "Heward's Handy Haversack": {
                price: 2000,
                rarity: "rare"
        },
        "Horn of Blasting": {
                price: 450,
                rarity: "rare"
        },
        "Horseshoes of Speed": {
                price: 5000,
                rarity: "rare"
        },
        "Horseshoes of the Zephyr": {
                price: 1500,
                rarity: "very rare"
        },
        "Immovable Rod": {
                price: 5000,
                rarity: "uncommon"
        },
        "Instrument of the Bards - Anstruth Harp": {
                price: 109000,
                rarity: "very rare"
        },
        "Instrument of the Bards - Canaith Mandolin": {
                price: 30000,
                rarity: "rare"
        },
        "Instrument of the Bards - Cli Lyre": {
                price: 35000,
                rarity: "rare"
        },
        "Instrument of the Bards - Doss Lute": {
                price: 28500,
                rarity: "uncommon"
        },
        "Instrument of the Bards - Fochulan Bandlore": {
                price: 26500,
                rarity: "uncommon"
        },
        "Instrument of the Bards - Mac-Fuirmidh Cittern": {
                price: 27000,
                rarity: "uncommon"
        },
        "Instrument of the Bards - Ollamh Harp": {
                price: 125000,
                rarity: "legendary"
        },
        "Ioun Stone of Absorption": {
                price: 2400,
                rarity: "very rare"
        },
        "Ioun Stone of Agility": {
                price: 3000,
                rarity: "very rare"
        },
        "Ioun Stone of Awareness": {
                price: 12000,
                rarity: "rare"
        },
        "Ioun Stone of Fortitude": {
                price: 3000,
                rarity: "very rare"
        },
        "Ioun Stone Greater Absorption": {
                price: 31000,
                rarity: "legendary"
        },
        "Ioun Stone of Insight": {
                price: 3000,
                rarity: "very rare"
        },
        "Ioun Stone of Intellect": {
                price: 3000,
                rarity: "very rare"
        },
        "Ioun Stone of Leadership": {
                price: 3000,
                rarity: "very rare"
        },
        "Ioun Stone of Mastery": {
                price: 15000,
                rarity: "legendary"
        },
        "Ioun Stone of Protection": {
                price: 1200,
                rarity: "rare"
        },
        "Ioun Stone of Regeneration": {
                price: 4000,
                rarity: "legendary"
        },
        "Ioun Stone of Reserve": {
                price: 6000,
                rarity: "rare"
        },
        "Ioun Stone of Strength": {
                price: 3000,
                rarity: "very rare"
        },
        "Ioun Stone of Sustenance": {
                price: 1000,
                rarity: "rare"
        },
        "Iron Bands of Bilarro": {
                price: 4000,
                rarity: "rare"
        },
        "Iron Horn of Valhalla": {
                price: 14000,
                rarity: "legendary"
        },
        "Ivory Goat (Terror)": {
                price: 20000,
                rarity: "rare"
        },
        "Ivory Goat (Travail)": {
                price: 400,
                rarity: "rare"
        },
        "Ivory Goat (Traveling)": {
                price: 1000,
                rarity: "rare"
        },
        "Javelin of Lightning": {
                price: 1500,
                rarity: "uncommon"
        },
        "Keoghtoms Ointment (Per Dose)": {
                price: 120,
                rarity: "uncommon"
        },
        "Lantern of Revealing": {
                price: 5000,
                rarity: "uncommon"
        },
        "Luckstone": {
                price: 4200,
                rarity: "uncommon"
        },
        "Mace of Disruption": {
                price: 8000,
                rarity: "rare"
        },
        "Mace of Smiting": {
                price: 7000,
                rarity: "rare"
        },
        "Mace of Terror": {
                price: 8000,
                rarity: "rare"
        },
        "Mantle of Spell Resistance": {
                price: 30000,
                rarity: "rare"
        },
        "Marble Elephant": {
                price: 6000,
                rarity: "rare"
        },
        "Medallion of Thoughts": {
                price: 3000,
                rarity: "uncommon"
        },
        "Mirror of Life Trapping": {
                price: 18000,
                rarity: "very rare"
        },
        "Necklace of Adaption": {
                price: 1500,
                rarity: "uncommon"
        },
        "Necklace of Fireballs (6 Beads)": {
                price: 7680,
                rarity: "rare"
        },
        "Necklace of Fireballs (5 Beads)": {
                price: 3840,
                rarity: "rare"
        },
        "Necklace of Fireballs (4 Beads)": {
                price: 1600,
                rarity: "rare"
        },
        "Necklace of Fireballs (3 Beads)": {
                price: 960,
                rarity: "rare"
        },
        "Necklace of Fireballs (2 Beads)": {
                price: 480,
                rarity: "rare"
        },
        "Necklace of Fireballs (1 Beads)": {
                price: 300,
                rarity: "rare"
        },
        "Nolzur's Marvelous Pigments": {
                price: 200,
                rarity: "very rare"
        },
        "Oathbow": {
                price: 3500,
                rarity: "very rare"
        },
        "Obsidian Steed": {
                price: 128000,
                rarity: "very rare"
        },
        "Oil of Etherealness": {
                price: 1920,
                rarity: "rare"
        },
        "Oil of Sharpness": {
                price: 3200,
                rarity: "very rare"
        },
        "Oil of Slipperiness": {
                price: 480,
                rarity: "uncommon"
        },
        "Onyx Dog": {
                price: 3000,
                rarity: "rare"
        },
        "Pearl of Power": {
                price: 6000,
                rarity: "uncommon"
        },
        "Periapt of Health": {
                price: 5000,
                rarity: "uncommon"
        },
        "Periapt of Proof Against Poison": {
                price: 5000,
                rarity: "rare"
        },
        "Periapt of Wound Closure": {
                price: 5000,
                rarity: "uncommon"
        },
        "Philter of Love": {
                price: 90,
                rarity: "uncommon"
        },
        "Pipes of Haunting": {
                price: 6000,
                rarity: "uncommon"
        },
        "Pipes of the Sewers": {
                price: 2000,
                rarity: "uncommon"
        },
        "Plate Armor of Etherealness": {
                price: 48000,
                rarity: "legendary"
        },
        "Portable Hole": {
                price: 8000,
                rarity: "rare"
        },
        "Potion of Animal Friendship": {
                price: 200,
                rarity: "uncommon"
        },
        "Potion of Clairvoyance": {
                price: 960,
                rarity: "rare"
        },
        "Potion of Climbing": {
                price: 180,
                rarity: "common"
        },
        "Potion of Diminution": {
                price: 270,
                rarity: "rare"
        },
        "Potion of Fire Breath": {
                price: 150,
                rarity: "uncommon"
        },
        "Potion of Flying": {
                price: 500,
                rarity: "very rare"
        },
        "Potion of Gaseous Form": {
                price: 300,
                rarity: "rare"
        },
        "Potion of Greater Healing": {
                price: 150,
                rarity: "uncommon"
        },
        "Potion of Growth": {
                price: 270,
                rarity: "uncommon"
        },
        "Potion of Healing": {
                price: 50,
                rarity: "common"
        },
        "Potion of Heroism": {
                price: 180,
                rarity: "rare"
        },
        "Potion of Invisibility": {
                price: 180,
                rarity: "very rare"
        },
        "Potion of Invulnerability": {
                price: 3840,
                rarity: "rare"
        },
        "Potion of Longevity": {
                price: 9000,
                rarity: "very rare"
        },
        "Potion of Mind Reading": {
                price: 180,
                rarity: "rare"
        },
        "Potion of Poison": {
                price: 100,
                rarity: "uncommon"
        },
        "Potion of Resistance": {
                price: 300,
                rarity: "uncommon"
        },
        "Potion of Speed": {
                price: 400,
                rarity: "very rare"
        },
        "Potion of Superior Healing": {
                price: 450,
                rarity: "rare"
        },
        "Potion of Supreme Healing": {
                price: 1350,
                rarity: "very rare"
        },
        "Potion of Vitality": {
                price: 960,
                rarity: "very rare"
        },
        "Potion of Water Breathing": {
                price: 180,
                rarity: "uncommon"
        },
        "Prayer Bead - Bless": {
                price: 2000,
                rarity: "rare"
        },
        "Prayer Bead - Curing": {
                price: 4000,
                rarity: "rare"
        },
        "Prayer Bead - Favor": {
                price: 32000,
                rarity: "rare"
        },
        "Prayer Bead - Smiting": {
                price: 1500,
                rarity: "rare"
        },
        "Prayer Bead - Summons": {
                price: 128000,
                rarity: "rare"
        },
        "Prayer Bead - Wind Walking": {
                price: 96000,
                rarity: "rare"
        },
        "Quaal's Feather Token Anchor": {
                price: 50,
                rarity: "rare"
        },
        "Quaal's Feather Token Bird": {
                price: 3000,
                rarity: "rare"
        },
        "Quaal's Feather Token Fan": {
                price: 250,
                rarity: "rare"
        },
        "Quaal's Feather Token Swan Boat": {
                price: 3000,
                rarity: "rare"
        },
        "Quaal's Feather Token Whip": {
                price: 250,
                rarity: "rare"
        },
        "Quiver of Ehlonna": {
                price: 1000,
                rarity: "rare"
        },
        "Ring of Air Elemental Command": {
                price: 35000,
                rarity: "legendary"
        },
        "Ring of Animal Influence": {
                price: 4000,
                rarity: "rare"
        },
        "Ring of Earth Elemental Command": {
                price: 31000,
                rarity: "legendary"
        },
        "Ring of Evasion": {
                price: 5000,
                rarity: "rare"
        },
        "Ring of Feather Falling": {
                price: 2000,
                rarity: "rare"
        },
        "Ring of Fire Elemental Command": {
                price: 17000,
                rarity: "legendary"
        },
        "Ring of Free Action": {
                price: 20000,
                rarity: "rare"
        },
        "Ring of Invisibility": {
                price: 10000,
                rarity: "legendary"
        },
        "Ring of Jumping": {
                price: 2500,
                rarity: "uncommon"
        },
        "Ring of Mind Shielding": {
                price: 16000,
                rarity: "uncommon"
        },
        "Ring of Protection": {
                price: 3500,
                rarity: "rare"
        },
        "Ring of Regeneration": {
                price: 12000,
                rarity: "very rare"
        },
        "Ring of Resistance": {
                price: 6000,
                rarity: "rare"
        },
        "Ring of Shooting Stars": {
                price: 14000,
                rarity: "very rare"
        },
        "Ring of Spell Storing": {
                price: 24000,
                rarity: "rare"
        },
        "Ring of Spell Turning": {
                price: 30000,
                rarity: "legendary"
        },
        "Ring of Swimming": {
                price: 3000,
                rarity: "uncommon"
        },
        "Ring of Telekinesis": {
                price: 80000,
                rarity: "very rare"
        },
        "Ring of the Ram": {
                price: 5000,
                rarity: "rare"
        },
        "Ring of Warmth": {
                price: 1000,
                rarity: "uncommon"
        },
        "Ring of Water Elemental Command": {
                price: 25000,
                rarity: "legendary"
        },
        "Ring of Water Walking": {
                price: 1500,
                rarity: "uncommon"
        },
        "Ring of X-Ray Vision": {
                price: 6000,
                rarity: "rare"
        },
        "Robe of Eyes": {
                price: 30000,
                rarity: "rare"
        },
        "Robe of Scintillating Colors": {
                price: 6000,
                rarity: "very rare"
        },
        "Robe of Stars": {
                price: 60000,
                rarity: "very rare"
        },
        "Robe of the Archmagi": {
                price: 34000,
                rarity: "very rare"
        },
        //Robe of Useful Items
        "Rod of Absorption": {
                price: 50000,
                rarity: "very rare"
        },
        "Rod of Alertness": {
                price: 25000,
                rarity: "very rare"
        },
        "Rod of Lordly Might": {
                price: 28000,
                rarity: "legendary"
        },
        "Rod of Rulership": {
                price: 16000,
                rarity: "rare"
        },
        "Rod of Security": {
                price: 90000,
                rarity: "very rare"
        },
        "Rod of the Pact Keeper +1": {
                price: 12000,
                rarity: "uncommon"
        },
        "Rod of the Pact Keeper +2": {
                price: 16000,
                rarity: "rare"
        },
        "Rod of the Pact Keeper +3": {
                price: 28000,
                rarity: "very rare"
        },
        "Amulet of the Devout +1": {
                price: 12000,
                rarity: "uncommon"
        },
        "Amulet of the Devout +2": {
                price: 16000,
                rarity: "rare"
        },
        "Amulet of the Devout +3": {
                price: 28000,
                rarity: "very rare"
        },
        "Bloodwell Vial +1": {
                price: 12000,
                rarity: "uncommon"
        },
        "Bloodwell Vial +2": {
                price: 16000,
                rarity: "rare"
        },
        "Bloodwell Vial +3": {
                price: 28000,
                rarity: "very rare"
        },
        "Arcane Grimoire +1": {
                price: 12000,
                rarity: "uncommon"
        },
        "Arcane Grimoire +2": {
                price: 16000,
                rarity: "rare"
        },
        "Arcane Grimoire +3": {
                price: 28000,
                rarity: "very rare"
        },
        "Moon Sickle +1": {
                price: 12000,
                rarity: "uncommon"
        },
        "Moon Sickle +2": {
                price: 16000,
                rarity: "rare"
        },
        "Moon Sickle +3": {
                price: 28000,
                rarity: "very rare"
        },
        "Rhythm Maker's Drum +1": {
                price: 12000,
        },
        "Rhythm Maker's Drum +2": {
                price: 16000,
                rarity: "rare"
        },
        "Rhythm Maker's Drum +3": {
                price: 28000,
                rarity: "very rare"
        },
        "All-Purpose Tool +1": {
                price: 12000,
                rarity: "uncommon"
        },
        "All-Purpose Tool +2": {
                price: 16000,
                rarity: "rare"
        },
        "All-Purpose Tool +3": {
                price: 28000,
                rarity: "very rare"
        },
        "Dragonhide Belt +1": {
                price: 12000,
                rarity: "uncommon"
        },
        "Dragonhide Belt +2": {
                price: 16000,
                rarity: "rare"
        },
        "Dragonhide Belt +3": {
                price: 28000,
                rarity: "very rare"
        },

        "Rope of Climbing": {
                price: 2000,
                rarity: "uncommon"
        },
        "Rope of Entanglement": {
                price: 4000,
                rarity: "rare"
        },
        "Saddle of the Cavalier": {
                price: 2000,
                rarity: "uncommon"
        },
        "Scarab of Protection": {
                price: 36000,
                rarity: "legendary"
        },
        "Scimitar of Speed": {
                price: 6000,
                rarity: "very rare"
        },
        "Scroll of Protection": {
                price: 180,
                rarity: "rare"
        },
        "Sending Stones": {
                price: 2000,
                rarity: "uncommon"
        },
        "Sentinel Shield": {
                price: 20000,
                rarity: "uncommon"
        },
        "Serpentine Owl": {
                price: 8000,
                rarity: "rare"
        },
        "Shield of Missile Attraction": {
                price: 6000,
                rarity: "rare"
        },
        "Silver Horn of Valhalla": {
                price: 5600,
                rarity: "rare"
        },
        "Silver Raven": {
                price: 5000,
                rarity: "uncommon"
        },
        "Slippers of Spider Climbing": {
                price: 5000,
                rarity: "uncommon"
        },
        "Sovereign Glue": {
                price: 400,
                rarity: "legendary"
        },
        "Spellguard Shield": {
                price: 50000,
                rarity: "very rare"
        },
        "Sphere of Annihilation": {
                price: 15000,
                rarity: "legendary"
        },
        "Staff of Charming": {
                price: 12000,
                rarity: "rare"
        },
        "Staff of Fire": {
                price: 16000,
                rarity: "very rare"
        },
        "Staff of Frost": {
                price: 26000,
                rarity: "very rare"
        },
        "Staff of Healing": {
                price: 13000,
                rarity: "rare"
        },
        "Staff of Power": {
                price: 95500,
                rarity: "very rare"
        },
        "Staff of Striking": {
                price: 21000,
                rarity: "very rare"
        },
        "Staff of Swarming Insects": {
                price: 16000,
                rarity: "rare"
        },
        "Staff of the Adder": {
                price: 1800,
                rarity: "uncommon"
        },
        "Staff of the Python": {
                price: 2000,
                rarity: "uncommon"
        },
        "Staff of the Woodlands": {
                price: 44000,
                rarity: "rare"
        },
        "Staff of Thunder and Lightning": {
                price: 10000,
                rarity: "very rare"
        },
        "Staff of Withering": {
                price: 3000,
                rarity: "rare"
        },
        "Stone of Controlling Earth Elementals": {
                price: 8000,
                rarity: "rare"
        },
        "Sun Blade": { // only longsword, no variants
                price: 12000,
                rarity: "rare"
        },  
        "Sword of Answering": { // only longsword, no variants
                price: 36000,
                rarity: "legendary"
        },
        "Talisman of Pure Good": {
                price: 71680,
                rarity: "legendary"
        },
        "Talisman of the Sphere": {
                price: 20000,
                rarity: "legendary"
        },
        "Talisman of Ultimate Evil": {
                price: 61440,
                rarity: "legendary"
        },
        "Tentacle Rod": {
                price: 5000,
                rarity: "rare"
        },
        "Trident of Fish Command": {
                price: 800,
                rarity: "uncommon"
        },
        "Universal Solvent": {
                price: 300,
                rarity: "legendary"
        },
        "Wand of Binding": {
                price: 10000,
                rarity: "rare"
        },
        "Wand of Enemy Detection": {
                price: 4000,
                rarity: "rare"
        },
        "Wand of Fear": {
                price: 10000,
                rarity: "rare"
        },
        "Wand of Fireballs": {
                price: 32000,
                rarity: "rare"
        },
        "Wand of Lightning Bolts": {
                price: 32000,
                rarity: "rare"
        },
        "Wand of Magic Detection": {
                price: 1500,
                rarity: "uncommon"
        },
        "Wand of Magic Missiles": {
                price: 8000,
                rarity: "uncommon"
        },
        "Wand of Paralysis": {
                price: 16000,
                rarity: "rare"
        },
        "Wand of Polymorph": {
                price: 32000,
                rarity: "very rare"
        },
        "Wand of Secrets": {
                price: 1500,
                rarity: "uncommon"
        },
        "Wand of the War Mage +1": {
                price: 1200,
                rarity: "uncommon"
        },
        "Wand of the War Mage +2": {
                price: 4800,
                rarity: "rare"
        },
        "Wand of the War Mage +3": {
                price: 19200,
                rarity: "very rare"
        },
        "Wand of Web": {
                price: 8000,
                rarity: "uncommon"
        },
        "Wind Fan": {
                price: 1500,
                rarity: "uncommon"
        },
        "Winged Boots": {
                price: 8000,
                rarity: "uncommon"
        },
        "Wings of Flying": {
                price: 5000,
                rarity: "rare"
        },
        "Spell Scroll Level 0": {
                price: 10,
                rarity: ""
        },
        "Spell Scroll Level 1": {
                price: 60,
                rarity: ""
        },
        "Spell Scroll Level 2": {
                price: 120,
                rarity: "uncommon"
        },
        "Spell Scroll Level 3": {
                price: 200,
                rarity: "uncommon"
        },
        "Spell Scroll Level 4": {
                price: 320,
                rarity: "rare"
        },
        "Spell Scroll Level 5": {
                price: 640,
                rarity: "rare"
        },
        "Spell Scroll Level 6": {
                price: 1280,
                rarity: "very rare"
        },
        "Spell Scroll Level 7": {
                price: 2560,
                rarity: "very rare"
        },
        "Spell Scroll Level 8": {
                price: 5120,
                rarity: "very rare"
        },
        "Spell Scroll Level 9": {
                price: 10240,
                rarity: "legendary"
        },

        // Things with variants (armors  / weapons)

        "+1 Padded": {
                price: 1505,
                rarity: "uncommon"
        },
        "+1 Leather": {
                price: 1510,
                rarity: "uncommon"
        },
        "+1 Studded Leather": {
                price: 1545,
                rarity: "uncommon"
        },
        "+1 Hide": {
                price: 1510,
                rarity: "uncommon"
        },
        "+1 Chain shirt": {
                price: 1550,
                rarity: "uncommon"
        },
        "+1 Scale mail": {
                price: 1550,
                rarity: "uncommon"
        },
        "+1 Breastplate": {
                price: 1900,
                rarity: "uncommon"
        },
        "+1 Half plate": {
                price: 2250,
                rarity: "uncommon"
        },
        "+1 Ring mail": {
                price: 1530,
                rarity: "uncommon"
        },
        "+1 Chain mail": {
                price: 1575,
                rarity: "uncommon"
        },
        "+1 Splint": {
                price: 1700,
                rarity: "uncommon"
        },
        "+1 Plate": {
                price: 3000,
                rarity: "uncommon"
        },
        "+2 Padded": {
                price: 6005,
                rarity: "rare"
        },
        "+2 Leather": {
                price: 6010,
                rarity: "rare"
        },
        "+2 Studded Leather": {
                price: 6045,
                rarity: "rare"
        },
        "+2 Hide": {
                price: 6010,
                rarity: "rare"
        },
        "+2 Chain shirt": {
                price: 6050,
                rarity: "rare"
        },
        "+2 Scale mail": {
                price: 6050,
                rarity: "rare"
        },
        "+2 Breastplate": {
                price: 6400,
                rarity: "rare"
        },
        "+2 Half plate": {
                price: 6750,
                rarity: "rare"
        },
        "+2 Ring mail": {
                price: 6030,
                rarity: "rare"
        },
        "+2 Chain mail": {
                price: 6075,
                rarity: "rare"
        },
        "+2 Splint": {
                price: 6200,
                rarity: "rare"
        },
        "+2 Plate": {
                price: 7500,
                rarity: "rare"
        },
        "+3 Padded": {
                price: 24005,
                rarity: "very rare"
        },
        "+3 Leather": {
                price: 24010,
                rarity: "very rare"
        },
        "+3 Studded Leather": {
                price: 24045,
                rarity: "very rare"
        },
        "+3 Hide": {
                price: 24010,
                rarity: "very rare"
        },
        "+3 Chain shirt": {
                price: 24050,
                rarity: "very rare"
        },
        "+3 Scale mail": {
                price: 24050,
                rarity: "very rare"
        },
        "+3 Breastplate": {
                price: 24400,
                rarity: "very rare"
        },
        "+3 Half plate": {
                price: 24750,
                rarity: "very rare"
        },
        "+3 Ring mail": {
                price: 24030,
                rarity: "very rare"
        },
        "+3 Chain mail": {
                price: 24075,
                rarity: "very rare"
        },
        "+3 Splint": {
                price: 24200,
                rarity: "very rare"
        },
        "+3 Plate": {
                price: 25500,
                rarity: "very rare"
        },
        "Adamantine Armor Chain shirt": {
                price: 550,
                rarity: "uncommon"
        },
        "Adamantine Armor Scale mail": {
                price: 550,
                rarity: "uncommon"
        },
        "Adamantine Armor Breastplate": {
                price: 900,
                rarity: "uncommon"
        },
        "Adamantine Armor Half plate": {
                price: 1250,
                rarity: "uncommon"
        },
        "Adamantine Armor Ring mail": {
                price: 530,
                rarity: "uncommon"
        },
        "Adamantine Armor Chain mail": {
                price: 575,
                rarity: "uncommon"
        },
        "Adamantine Armor Splint": {
                price: 700,
                rarity: "uncommon"
        },
        "Adamantine Armor Plate": {
                price: 2000,
                rarity: "uncommon"
        },
        "Mithral Armor Chain shirt": {
                price: 850,
                rarity: "uncommon"
        },
        "Mithral Armor Scale mail": {
                price: 850,
                rarity: "uncommon"
        },
        "Mithral Armor Breastplate": {
                price: 1200,
                rarity: "uncommon"
        },
        "Mithral Armor Half plate": {
                price: 1550,
                rarity: "uncommon"
        },
        "Mithral Armor Ring mail": {
                price: 830,
                rarity: "uncommon"
        },
        "Mithral Armor Chain mail": {
                price: 875,
                rarity: "uncommon"
        },
        "Mithral Armor Splint": {
                price: 1000,
                rarity: "uncommon"
        },
        "Mithral Armor Plate": {
                price: 2300,
                rarity: "uncommon"
        },
        "Armor of Resistance Chain shirt": {
                price: 6050,
                rarity: "rare"
        },
        "Armor of Resistance Scale mail": {
                price: 6050,
                rarity: "rare"
        },
        "Armor of Resistance Breastplate": {
                price: 6400,
                rarity: "rare"
        },
        "Armor of Resistance Half plate": {
                price: 6750,
                rarity: "rare"
        },
        "Armor of Resistance Ring mail": {
                price: 6030,
                rarity: "rare"
        },
        "Armor of Resistance Chain mail": {
                price: 6075,
                rarity: "rare"
        },
        "Armor of Resistance Splint": {
                price: 6200,
                rarity: "rare"
        },
        "Armor of Resistance Plate": {
                price: 7500,
                rarity: "rare"
        },
        "Mariner's Armor Chain shirt": {
                price: 1550,
                rarity: "uncommon"
        },
        "Mariner's Armor Scale mail": {
                price: 1550,
                rarity: "uncommon"
        },
        "Mariner's Armor Breastplate": {
                price: 1900,
                rarity: "uncommon"
        },
        "Mariner's Armor Half plate": {
                price: 2250,
                rarity: "uncommon"
        },
        "Mariner's Armor Ring mail": {
                price: 1530,
                rarity: "uncommon"
        },
        "Mariner's Armor Chain mail": {
                price: 1575,
                rarity: "uncommon"
        },
        "Mariner's Armor Splint": {
                price: 1700,
                rarity: "uncommon"
        },
        "Mariner's Armor Plate": {
                price: 3000,
                rarity: "uncommon"
        },
        "Plate Armor of Etherealness Chain shirt": {
                price: 48050,
                rarity: "legendary"
        },
        "Plate Armor of Etherealness Scale mail": {
                price: 48050,
                rarity: "legendary"
        },
        "Plate Armor of Etherealness Breastplate": {
                price: 48400,
                rarity: "legendary"
        },
        "Plate Armor of Etherealness Half plate": {
                price: 48750,
                rarity: "legendary"
        },
        "Plate Armor of Etherealness Ring mail": {
                price: 48030,
                rarity: "legendary"
        },
        "Plate Armor of Etherealness Chain mail": {
                price: 48075,
                rarity: "legendary"
        },
        "Plate Armor of Etherealness Splint": {
                price: 48200,
                rarity: "legendary"
        },
        "Plate Armor of Etherealness Plate": {
                price: 49500,
                rarity: "legendary"
        },
        "Armor of Invulnerability Chain shirt": {
                price: 18050,
                rarity: "legendary"
        },
        "Armor of Invulnerability Scale mail": {
                price: 18050,
                rarity: "legendary"
        },
        "Armor of Invulnerability Breastplate": {
                price: 18400,
                rarity: "legendary"
        },
        "Armor of Invulnerability Half plate": {
                price: 18750,
                rarity: "legendary"
        },
        "Armor of Invulnerability Ring mail": {
                price: 18030,
                rarity: "legendary"
        },
        "Armor of Invulnerability Chain mail": {
                price: 18075,
                rarity: "legendary"
        },
        "Armor of Invulnerability Splint": {
                price: 18200,
                rarity: "legendary"
        },
        "Armor of Invulnerability Plate": {
                price: 19500,
                rarity: "legendary"
        },
        "+1 Battleaxe": {
                price: 1010,
                rarity: "uncommon"
        },
        "+1 Greataxe": {
                price: 1030,
                rarity: "uncommon"
        },
        "+1 Handaxe": {
                price: 1005,
                rarity: "uncommon"
        },
        "+1 Greatsword": {
                price: 1050,
                rarity: "uncommon"
        },
        "+1 Longsword": {
                price: 1015,
                rarity: "uncommon"
        },
        "+1 Scimitar": {
                price: 1025,
                rarity: "uncommon"
        },
        "+1 Rapier": {
                price: 1025,
                rarity: "uncommon"
        },
        "+1 Shortsword": {
                price: 1010,
                rarity: "uncommon"
        },
        "+1 Club": {
                price: 1000.1,
                rarity: "uncommon"
        },
        "+1 Dagger": {
                price: 1002,
                rarity: "uncommon"
        },
        "+1 Greatclub": {
                price: 1000.2,
                rarity: "uncommon"
        },
        "+1 Javelin": {
                price: 1000.5,
                rarity: "uncommon"
        },
        "+1 Light Hammer": {
                price: 1000.2,
                rarity: "uncommon"
        },
        "+1 Mace": {
                price: 1005,
        },
        "+1 Quarterstaff": {
                price: 1000.2,
                rarity: "uncommon"
        },
        "+1 Sickle": {
                price: 1001,
                rarity: "uncommon"
        },
        "+1 Spear": {
                price: 1001,
                rarity: "uncommon"
        },
        "+1 Yklwa": {
                price: 1001,
                rarity: "uncommon"
        },
        "+1 Crossbow, light": {
                price: 1025,
                rarity: "uncommon"
        },
        "+1 Dart": {
                price: 1000.05,
                rarity: "uncommon"
        },
        "+1 Shortbow": {
                price: 1025,
                rarity: "uncommon"
        },
        "+1 Sling": {
                price: 1000.1,
                rarity: "uncommon"
        },
        "+1 Double-bladed Scimitar": {
                price: 1100,
                rarity: "uncommon"
        },
        "+1 Flail": {
                price: 1010,
                rarity: "uncommon"
        },
        "+1 Glaive": {
                price: 1020,
                rarity: "uncommon"
        },
        "+1 Halberd": {
                price: 1020,
                rarity: "uncommon"
        },
        "+1 Lance": {
                price: 1010,
                rarity: "uncommon"
        },
        "+1 Maul": {
                price: 1010,
                rarity: "uncommon"
        },
        "+1 Morningstar": {
                price: 1015,
                rarity: "uncommon"
        },
        "+1 Pike": {
                price: 1005,
                rarity: "uncommon"
        },
        "+1 Trident": {
                price: 1005,
                rarity: "uncommon"
        },
        "+1 War Pick": {
                price: 1005,
                rarity: "uncommon"
        },
        "+1 Warhammer": {
                price: 1015,
                rarity: "uncommon"
        },
        "+1 Whip": {
                price: 1002,
                rarity: "uncommon"
        },
        "+1 Blowgun": {
                price: 1010,
                rarity: "uncommon"
        },
        "+1 Crossbow, hand": {
                price: 1075,
                rarity: "uncommon"
        },
        "+1 Crossbow, heavy": {
                price: 1050,
                rarity: "uncommon"
        },
        "+1 Longbow": {
                price: 1050,
                rarity: "uncommon"
        },
        "+1 Net": {
                price: 1001,
                rarity: "uncommon"
        },
        "+2 Battleaxe": {
                price: 4010,
                rarity: "rare"
        },
        "+2 Greataxe": {
                price: 4030,
                rarity: "rare"
        },
        "+2 Handaxe": {
                price: 4005,
                rarity: "rare"
        },
        "+2 Greatsword": {
                price: 4050,
                rarity: "rare"
        },
        "+2 Longsword": {
                price: 4015,
                rarity: "rare"
        },
        "+2 Scimitar": {
                price: 4025,
                rarity: "rare"
        },
        "+2 Rapier": {
                price: 4025,
                rarity: "rare"
        },
        "+2 Shortsword": {
                price: 4010,
                rarity: "rare"
        },
        "+2 Club": {
                price: 4000.1,
                rarity: "rare"
        },
        "+2 Dagger": {
                price: 4002,
                rarity: "rare"
        },
        "+2 Greatclub": {
                price: 4000.2,
                rarity: "rare"
        },
        "+2 Javelin": {
                price: 4000.5,
                rarity: "rare"
        },
        "+2 Light Hammer": {
                price: 4000.2,
                rarity: "rare"
        },
        "+2 Mace": {
                price: 4005,
                rarity: "rare"
        },
        "+2 Quarterstaff": {
                price: 4000.2,
                rarity: "rare"
        },
        "+2 Sickle": {
                price: 4001,
                rarity: "rare"
        },
        "+2 Spear": {
                price: 4001,
                rarity: "rare"
        },
        "+2 Yklwa": {
                price: 4001,
                rarity: "rare"
        },
        "+2 Crossbow, light": {
                price: 4025,
                rarity: "rare"
        },
        "+2 Dart": {
                price: 4000.05,
                rarity: "rare"
        },
        "+2 Shortbow": {
                price: 4025,
                rarity: "rare"
        },
        "+2 Sling": {
                price: 4000.1,
                rarity: "rare"
        },
        "+2 Double-bladed Scimitar": {
                price: 4100,
                rarity: "rare"
        },
        "+2 Flail": {
                price: 4010,
                rarity: "rare"
        },
        "+2 Glaive": {
                price: 4020,
                rarity: "rare"
        },
        "+2 Halberd": {
                price: 4020,
                rarity: "rare"
        },
        "+2 Lance": {
                price: 4010,
                rarity: "rare"
        },
        "+2 Maul": {
                price: 4010,
                rarity: "rare"
        },
        "+2 Morningstar": {
                price: 4015,
                rarity: "rare"
        },
        "+2 Pike": {
                price: 4005,
                rarity: "rare"
        },
        "+2 Trident": {
                price: 4005,
                rarity: "rare"
        },
        "+2 War Pick": {
                price: 4005,
                rarity: "rare"
        },
        "+2 Warhammer": {
                price: 4015,
                rarity: "rare"
        },
        "+2 Whip": {
                price: 4002,
                rarity: "rare"
        },
        "+2 Blowgun": {
                price: 4010,
                rarity: "rare"
        },
        "+2 Crossbow, hand": {
                price: 4075,
                rarity: "rare"
        },
        "+2 Crossbow, heavy": {
                price: 4050,
                rarity: "rare"
        },
        "+2 Longbow": {
                price: 4050,
                rarity: "rare"
        },
        "+2 Net": {
                price: 4001,
                rarity: "rare"
        },
        "+3 Battleaxe": {
                price: 16010,
                rarity: "very rare"
        },
        "+3 Greataxe": {
                price: 16030,
                rarity: "very rare"
        },
        "+3 Handaxe": {
                price: 16005,
                rarity: "very rare"
        },
        "+3 Greatsword": {
                price: 16050,
                rarity: "very rare"
        },
        "+3 Longsword": {
                price: 16015,
                rarity: "very rare"
        },
        "+3 Scimitar": {
                price: 16025,
                rarity: "very rare"
        },
        "+3 Rapier": {
                price: 16025,
                rarity: "very rare"
        },
        "+3 Shortsword": {
                price: 16010,
                rarity: "very rare"
        },
        "+3 Club": {
                price: 16000.1,
                rarity: "very rare"
        },
        "+3 Dagger": {
                price: 16002,
                rarity: "very rare"
        },
        "+3 Greatclub": {
                price: 16000.2,
                rarity: "very rare"
        },
        "+3 Javelin": {
                price: 16000.5,
                rarity: "very rare"
        },
        "+3 Light Hammer": {
                price: 16000.2,
                rarity: "very rare"
        },
        "+3 Mace": {
                price: 16005,
                rarity: "very rare"
        },
        "+3 Quarterstaff": {
                price: 16000.2,
                rarity: "very rare"
        },
        "+3 Sickle": {
                price: 16001,
                rarity: "very rare"
        },
        "+3 Spear": {
                price: 16001,
                rarity: "very rare"
        },
        "+3 Yklwa": {
                price: 16001,
                rarity: "very rare"
        },
        "+3 Crossbow, light": {
                price: 16025,
                rarity: "very rare"
        },
        "+3 Dart": {
                price: 16000.05,
                rarity: "very rare"
        },
        "+3 Shortbow": {
                price: 16025,
                rarity: "very rare"
        },
        "+3 Sling": {
                price: 16000.1,
                rarity: "very rare"
        },
        "+3 Double-bladed Scimitar": {
                price: 16100,
                rarity: "very rare"
        },
        "+3 Flail": {
                price: 16010,
                rarity: "very rare"
        },
        "+3 Glaive": {
                price: 16020,
                rarity: "very rare"
        },
        "+3 Halberd": {
                price: 16020,
                rarity: "very rare"
        },
        "+3 Lance": {
                price: 16010,
                rarity: "very rare"
        },
        "+3 Maul": {
                price: 16010,
                rarity: "very rare"
        },
        "+3 Morningstar": {
                price: 16015,
                rarity: "very rare"
        },
        "+3 Pike": {
                price: 16005,
                rarity: "very rare"
        },
        "+3 Trident": {
                price: 16005,
                rarity: "very rare"
        },
        "+3 War Pick": {
                price: 16005,
                rarity: "very rare"
        },
        "+3 Warhammer": {
                price: 16015,
                rarity: "very rare"
        },
        "+3 Whip": {
                price: 16002,
                rarity: "very rare"
        },
        "+3 Blowgun": {
                price: 16010,
                rarity: "very rare"
        },
        "+3 Crossbow, hand": {
                price: 16075,
                rarity: "very rare"
        },
        "+3 Crossbow, heavy": {
                price: 16050,
                rarity: "very rare"
        },
        "+3 Longbow": {
                price: 16050,
                rarity: "very rare"
        },
        "+3 Net": {
                price: 16001,
                rarity: "very rare"
        },
        "Nine Lives Stealer Greatsword (Fully Charged)": {
                price: 8050,
                rarity: "very rare"
        },
        "Nine Lives Stealer Longsword (Fully Charged)": {
                price: 8015,
                rarity: "very rare"
        },
        "Nine Lives Stealer Scimitar (Fully Charged)": {
                price: 8025,
                rarity: "very rare"
        },
        "Nine Lives Stealer Rapier (Fully Charged)": {
                price: 8025,
                rarity: "very rare"
        },
        "Nine Lives Stealer Shortsword (Fully Charged)": {
                price: 8010,
                rarity: "very rare"
        },
        "Dancing Greatsword": {
                price: 2050,
                rarity: "very rare"
        },
        "Dancing Longsword": {
                price: 2015,
                rarity: "very rare"
        },
        "Dancing Scimitar": {
                price: 2025,
                rarity: "very rare"
        },
        "Dancing Rapier": {
                price: 2025,
                rarity: "very rare"
        },
        "Dancing Shortsword": {
                price: 2010,
                rarity: "very rare"
        },
        "Defender Greatsword": {
                price: 24050,
                rarity: "legendary"
        },
        "Defender Longsword": {
                price: 24015,
                rarity: "legendary"
        },
        "Defender Scimitar": {
                price: 24025,
                rarity: "legendary"
        },
        "Defender Rapier": {
                price: 24025,
                rarity: "legendary"
        },
        "Defender Shortsword": {
                price: 24010,
                rarity: "legendary"
        },
        "Dragon Slayer Greatsword": {
                price: 8050,
                rarity: "rare"
        },
        "Dragon Slayer Longsword": {
                price: 8015,
                rarity: "rare"
        },
        "Dragon Slayer Scimitar": {
                price: 8025,
                rarity: "rare"
        },
        "Dragon Slayer Rapier": {
                price: 8025,
                rarity: "rare"
        },
        "Dragon Slayer Shortsword": {
                price: 8010,
                rarity: "rare"
        },
        "Flame Tongue Greatsword": {
                price: 5050,
                rarity: "rare"
        },
        "Flame Tongue Longsword": {
                price: 5015,
                rarity: "rare"
        },
        "Flame Tongue Scimitar": {
                price: 5025,
                rarity: "rare"
        },
        "Flame Tongue Rapier": {
                price: 5025,
                rarity: "rare"
        },
        "Flame Tongue Shortsword": {
                price: 5010,
                rarity: "rare"
        },
        "Frost Brand Greatsword": {
                price: 2250,
                rarity: "very rare"
        },
        "Frost Brand Longsword": {
                price: 2215,
                rarity: "very rare"
        },
        "Frost Brand Scimitar": {
                price: 2225,
                rarity: "very rare"
        },
        "Frost Brand Rapier": {
                price: 2225,
                rarity: "very rare"
        },
        "Frost Brand Shortsword": {
                price: 2210,
                rarity: "very rare"
        },
        "Giant Slayer Battleaxe": {
                price: 7010,
                rarity: "rare"
        },
        "Giant Slayer Greataxe": {
                price: 7030,
                rarity: "rare"
        },
        "Giant Slayer Handaxe": {
                price: 7005,
                rarity: "rare"
        },
        "Giant Slayer Greatsword": {
                price: 7050,
                rarity: "rare"
        },
        "Giant Slayer Longsword": {
                price: 7015,
                rarity: "rare"
        },
        "Giant Slayer Scimitar": {
                price: 7025,
                rarity: "rare"
        },
        "Giant Slayer Rapier": {
                price: 7025,
                rarity: "rare"
        },
        "Giant Slayer Shortsword": {
                price: 7010,
                rarity: "rare"
        },
        "Holy Avenger Greatsword": {
                price: 165050,
                rarity: "legendary"
        },
        "Holy Avenger Longsword": {
                price: 165015,
                rarity: "legendary"
        },
        "Holy Avenger Scimitar": {
                price: 165025,
                rarity: "legendary"
        },
        "Holy Avenger Rapier": {
                price: 165025,
                rarity: "legendary"
        },
        "Holy Avenger Shortsword": {
                price: 165010,
                rarity: "legendary"
        },
        "Greatsword of Life-Stealing": {
                price: 1050,
                rarity: "rare"
        },
        "Longsword of Life-Stealing": {
                price: 1015,
                rarity: "rare"
        },
        "Scimitar of Life-Stealing": {
                price: 1025,
                rarity: "rare"
        },
        "Rapier of Life-Stealing": {
                price: 1025,
                rarity: "rare"
        },
        "Shortsword of Life-Stealing": {
                price: 1010,
                rarity: "rare"
        },
        "Greatsword of Sharpness": {
                price: 1750,
                rarity: "very rare"
        },
        "Longsword of Sharpness": {
                price: 1715,
                rarity: "very rare"
        },
        "Scimitar of Sharpness": {
                price: 1725,
                rarity: "very rare"
        },
        "Greatsword of Wounding": {
                price: 2050,
                rarity: "rare"
        },
        "Longsword of Wounding": {
                price: 2015,
                rarity: "rare"
        },
        "Scimitar of Wounding": {
                price: 2025,
                rarity: "rare"
        },
        "Rapier of Wounding": {
                price: 2025,
                rarity: "rare"
        },
        "Shortsword of Wounding": {
                price: 2010,
                rarity: "rare"
        },
        "Vicious Battleaxe": {
                price: 360,
        },
        "Vicious Greataxe": {
                price: 380,
                rarity: "rare"
        },
        "Vicious Handaxe": {
                price: 355,
                rarity: "rare"
        },
        "Vicious Greatsword": {
                price: 400,
                rarity: "rare"
        },
        "Vicious Longsword": {
                price: 365,
                rarity: "rare"
        },
        "Vicious Scimitar": {
                price: 375,
                rarity: "rare"
        },
        "Vicious Rapier": {
                price: 375,
                rarity: "rare"
        },
        "Vicious Shortsword": {
                price: 360,
                rarity: "rare"
        },
        "Vicious Club": {
                price: 350.1,
                rarity: "rare"
        },
        "Vicious Dagger": {
                price: 352,
                rarity: "rare"
        },
        "Vicious Greatclub": {
                price: 350.2,
                rarity: "rare"
        },
        "Vicious Javelin": {
                price: 350.5,
                rarity: "rare"
        },
        "Vicious Light Hammer": {
                price: 350.2,
                rarity: "rare"
        },
        "Vicious Mace": {
                price: 355,
                rarity: "rare"
        },
        "Vicious Quarterstaff": {
                price: 350.2,
                rarity: "rare"
        },
        "Vicious Sickle": {
                price: 351,
                rarity: "rare"
        },
        "Vicious Spear": {
                price: 351,
                rarity: "rare"
        },
        "Vicious Yklwa": {
                price: 351,
                rarity: "rare"
        },
        "Vicious Crossbow, light": {
                price: 375,
                rarity: "rare"
        },
        "Vicious Dart": {
                price: 350.05,
                rarity: "rare"
        },
        "Vicious Shortbow": {
                price: 375,
                rarity: "rare"
        },
        "Vicious Sling": {
                price: 350.1,
                rarity: "rare"
        },
        "Vicious Double-bladed Scimitar": {
                price: 450,
                rarity: "rare"
        },
        "Vicious Flail": {
                price: 360,
                rarity: "rare"
        },
        "Vicious Glaive": {
                price: 370,
                rarity: "rare"
        },
        "Vicious Halberd": {
                price: 370,
                rarity: "rare"
        },
        "Vicious Lance": {
                price: 360,
                rarity: "rare"
        },
        "Vicious Maul": {
                price: 360,
                rarity: "rare"
        },
        "Vicious Morningstar": {
                price: 365,
                rarity: "rare"
        },
        "Vicious Pike": {
                price: 355,
                rarity: "rare"
        },
        "Vicious Trident": {
                price: 355,
                rarity: "rare"
        },
        "Vicious War Pick": {
                price: 355,
                rarity: "rare"
        },
        "Vicious Warhammer": {
                price: 365,
                rarity: "rare"
        },
        "Vicious Whip": {
                price: 352,
                rarity: "rare"
        },
        "Vicious Blowgun": {
                price: 360,
                rarity: "rare"
        },
        "Vicious Crossbow, hand": {
                price: 425,
                rarity: "rare"
        },
        "Vicious Crossbow, heavy": {
                price: 400,
                rarity: "rare"
        },
        "Vicious Longbow": {
                price: 400,
                rarity: "rare"
        },
        "Vicious Net": {
                price: 351,
                rarity: "rare"
        },
        "Vorpal Greatsword": {
                price: 24050,
                rarity: "legendary"
        },
        "Vorpal Longsword": {
                price: 24015,
                rarity: "legendary"
        },
        "Vorpal Scimitar": {
                price: 24025,
                rarity: "legendary"
        },
        "Battleaxe of Warning": {
                price: 60010,
                rarity: "uncommon"
        },
        "Greataxe of Warning": {
                price: 60030,
                rarity: "uncommon"
        },
        "Handaxe of Warning": {
                price: 60005,
                rarity: "uncommon"
        },
        "Greatsword of Warning": {
                price: 60050,
                rarity: "uncommon"
        },
        "Longsword of Warning": {
                price: 60015,
                rarity: "uncommon"
        },
        "Scimitar of Warning": {
                price: 60025,
                rarity: "uncommon"
        },
        "Rapier of Warning": {
                price: 60025,
                rarity: "uncommon"
        },
        "Shortsword of Warning": {
                price: 60010,
                rarity: "uncommon"
        },
        "Club of Warning": {
                price: 60000.1,
                rarity: "uncommon"
        },
        "Dagger of Warning": {
                price: 60002,
                rarity: "uncommon"
        },
        "Greatclub of Warning": {
                price: 60000.2,
                rarity: "uncommon"
        },
        "Javelin of Warning": {
                price: 60000.5,
                rarity: "uncommon"
        },
        "Light Hammer of Warning": {
                price: 60000.2,
                rarity: "uncommon"
        },
        "Mace of Warning": {
                price: 60005,
                rarity: "uncommon"
        },
        "Quarterstaff of Warning": {
                price: 60000.2,
                rarity: "uncommon"
        },
        "Sickle of Warning": {
                price: 60001,
                rarity: "uncommon"
        },
        "Spear of Warning": {
                price: 60001,
                rarity: "uncommon"
        },
        "Yklwa of Warning": {
                price: 60001,
                rarity: "uncommon"
        },
        "Crossbow, light of Warning": {
                price: 60025,
                rarity: "uncommon"
        },
        "Dart of Warning": {
                price: 60000.05,
                rarity: "uncommon"
        },
        "Shortbow of Warning": {
                price: 60025,
                rarity: "uncommon"
        },
        "Sling of Warning": {
                price: 60000.1,
                rarity: "uncommon"
        },
        "Double-bladed Scimitar of Warning": {
                price: 60100,
                rarity: "uncommon"
        },
        "Flail of Warning": {
                price: 60010,
                rarity: "uncommon"
        },
        "Glaive of Warning": {
                price: 60020,
                rarity: "uncommon"
        },
        "Halberd of Warning": {
                price: 60020,
                rarity: "uncommon"
        },
        "Lance of Warning": {
                price: 60010,
                rarity: "uncommon"
        },
        "Maul of Warning": {
                price: 60010,
                rarity: "uncommon"
        },
        "Morningstar of Warning": {
                price: 60015,
                rarity: "uncommon"
        },
        "Pike of Warning": {
                price: 60005,
                rarity: "uncommon"
        },
        "Trident of Warning": {
                price: 60005,
                rarity: "uncommon"
        },
        "War Pick of Warning": {
                price: 60005,
                rarity: "uncommon"
        },
        "Warhammer of Warning": {
                price: 60015,
                rarity: "uncommon"
        },
        "Whip of Warning": {
                price: 60002,
                rarity: "uncommon"
        },
        "Blowgun of Warning": {
                price: 60010,
                rarity: "uncommon"
        },
        "Crossbow, hand of Warning": {
                price: 60075,
                rarity: "uncommon"
        },
        "Crossbow, heavy of Warning": {
                price: 60050,
                rarity: "uncommon"
        },
        "Longbow of Warning": {
                price: 60050,
                rarity: "uncommon"
        },
        "Net of Warning": {
                price: 60001,
                rarity: "uncommon"
        },
        "Battleaxe": {
                price: 10,
                rarity: ""
        },
        "Greataxe": {
                price: 30,rarity: ""
        },
        "Handaxe": {
                price: 5,rarity: ""
        },
        "Greatsword": {
                price: 50,rarity: ""
        },
        "Longsword": {
                price: 15,rarity: ""
        },
        "Scimitar": {
                price: 25,rarity: ""
        },
        "Rapier": {
                price: 25,rarity: ""
        },
        "Shortsword": {
                price: 10,rarity: ""
        },
        "Club": {
                price: 0.1,rarity: ""
        },
        "Dagger": {
                price: 2,rarity: ""
        },
        "Greatclub": {
                price: 0.2,rarity: ""
        },
        "Javelin": {
                price: 0.5,rarity: ""
        },
        "Light Hammer": {
                price: 0.2,rarity: ""
        },
        "Mace": {
                price: 5,rarity: ""
        },
        "Quarterstaff": {
                price: 0.2,rarity: ""
        },
        "Sickle": {
                price: 1,rarity: ""
        },
        "Spear": {
                price: 1,rarity: ""
        },
        "Yklwa": {
                price: 1,rarity: ""
        },
        "Crossbow, light": {
                price: 25,rarity: ""
        },
        "Dart": {
                price: 0.05,rarity: ""
        },
        "Shortbow": {
                price: 25,rarity: ""
        },
        "Sling": {
                price: 0.1,rarity: ""
        },
        "Double-bladed Scimitar": {
                price: 100,rarity: ""
        },
        "Flail": {
                price: 10,rarity: ""
        },
        "Glaive": {
                price: 20,rarity: ""
        },
        "Halberd": {
                price: 20,rarity: ""
        },
        "Lance": {
                price: 10,rarity: ""
        },
        "Maul": {
                price: 10,rarity: ""
        },
        "Morningstar": {
                price: 15,rarity: ""
        },
        "Pike": {
                price: 5,rarity: ""
        },
        "Trident": {
                price: 5,rarity: ""
        },
        "War Pick": {
                price: 5,rarity: ""
        },
        "Warhammer": {
                price: 15,rarity: ""
        },
        "Whip": {
                price: 2,rarity: ""
        },
        "Blowgun": {
                price: 10,rarity: ""
        },
        "Crossbow, hand": {
                price: 75,rarity: ""
        },
        "Crossbow, heavy": {
                price: 50,rarity: ""
        },
        "Longbow": {
                price: 50,rarity: ""
        },
        "Net": {
                price: 1,rarity: ""
        },
        "Padded Armor": {
                price: 5,rarity: ""
        },
        "Leather Armor": {
                price: 10,rarity: ""
        },
        "Studded Leather Armor": {
                price: 45,rarity: ""
        },
        "Hide Armor": {
                price: 10,rarity: ""
        },
        "Chain shirt Armor": {
                price: 50,rarity: ""
        },
        "Scale mail Armor": {
                price: 50,rarity: ""
        },
        "Breastplate Armor": {
                price: 400,rarity: ""
        },
        "Half plate Armor": {
                price: 750,rarity: ""
        },
        "Ring mail Armor": {
                price: 30,rarity: ""
        },
        "Chain mail Armor": {
                price: 75,rarity: ""
        },
        "Splint Armor": {
                price: 200,rarity: ""
        },
        "Plate Armor": {
                price: 1500,rarity: ""
        },
        "Shield": {
                price: 10,rarity: ""
        },

        // common items / adventuring gear

        "Abacus": {
                price: 2,rarity: ""
        },
        "Acid (vial)": {
                price: 1,rarity: ""
        },
        "Airship": {
                price: 20000,rarity: ""
        },
        "Alchemist's Fire (flask)": {
                price: 50,rarity: ""
        },
        "Alchemist's Supplies": {
                price: 50,rarity: ""
        },
        "Alexandrite": {
                price: 500,rarity: ""
        },
        "Amber": {
                price: 100,rarity: ""
        },
        "Amethyst": {
                price: 100,rarity: ""
        },
        "Amulet": {
                price: 5,rarity: ""
        },
        "Antitoxin": {
                price: 50,rarity: ""
        },
        "Aquamarine": {
                price: 500,rarity: ""
        },
        "Arrows (each)": {
                price: 0.05,rarity: ""
        },
        "Assassin's Blood (Ingested)": {
                price: 150,rarity: ""
        },
        "Azurite": {
                price: 10,rarity: ""
        },
        "Backpack": {
                price: 2,rarity: ""
        },
        "Bagpipes": {
                price: 30,rarity: ""
        },
        "Ball Bearings (bag of 1000)": {
                price: 1,rarity: ""
        },
        "Banded Agate": {
                price: 10,rarity: ""
        },
        "Barrel": {
                price: 2,rarity: ""
        },
        "Basket": {
                price: 0.4,rarity: ""
        },
        "Bedroll": {
                price: 1,rarity: ""
        },
        "Bell": {
                price: 1,rarity: ""
        },
        "Bit and Bridle": {
                price: 2,rarity: ""
        },
        "Black Opal": {
                price: 1000,rarity: ""
        },
        "Black Pearl": {
                price: 500,rarity: ""
        },
        "Black Sapphire": {
                price: 5000,rarity: ""
        },
        "Blanket": {
                price: 0.5,rarity: ""
        },
        "Block and Tackle": {
                price: 1,rarity: ""
        },
        "Bloodstone": {
                price: 50,rarity: ""
        },
        "Blowgun Needles": {
                price: 0.02,rarity: ""
        },
        "Blue Sapphire": {
                price: 1000,rarity: ""
        },
        "Blue quartz": {
                price: 10,rarity: ""
        },
        "Blue spinel": {
                price: 500,rarity: ""
        },
        "Bomb": {
                price: 150,rarity: ""
        },
        "Book": {
                price: 25,rarity: ""
        },
        "Bottle, Glass": {
                price: 2,rarity: ""
        },
        "Brewer's Supplies": {
                price: 20,rarity: ""
        },
        "Bucket": {
                price: 0.05,rarity: ""
        },
        "Burglar's Pack": {
                price: 16,rarity: ""
        },
        "Burnt Othur Fumes (Inhaled)": {
                price: 500,rarity: ""
        },
        "Calligrapher's Supplies": {
                price: 10,rarity: ""
        },
        "Caltrops (bag of 20)": {
                price: 0.05,rarity: ""
        },
        "Camel": {
                price: 50,rarity: ""
        },
        "Candle": {
                price: 0.01,rarity: ""
        },
        "Carnelian": {
                price: 50,rarity: ""
        },
        "Carpenter's Tools": {
                price: 8,rarity: ""
        },
        "Carriage": {
                price: 100,rarity: ""
        },
        "Cart": {
                price: 15,rarity: ""
        },
        "Cartographer's Tools": {
                price: 15,rarity: ""
        },
        "Case, Crossbow Bolt": {
                price: 1,rarity: ""
        },
        "Case, Map or Scroll": {
                price: 1,rarity: ""
        },
        "Chain (10 feet)": {
                price: 5,rarity: ""
        },
        "Chalcedony": {
                price: 50,rarity: ""
        },
        "Chalk (1 piece)": {
                price: 0.01,rarity: ""
        },
        "Chariot": {
                price: 250,rarity: ""
        },
        "Chest": {
                price: 5,rarity: ""
        },
        "Chrysoberyl": {
                price: 100,rarity: ""
        },
        "Chrysoprase": {
                price: 50,rarity: ""
        },
        "Citrine": {
                price: 50,rarity: ""
        },
        "Climber's Kit": {
                price: 25,rarity: ""
        },
        "Clothes, Common": {
                price: 0.5,rarity: ""
        },
        "Clothes, Costume": {
                price: 5,rarity: ""
        },
        "Clothes, Fine": {
                price: 15,rarity: ""
        },
        "Clothes, Traveler's": {
                price: 2,rarity: ""
        },
        "Cobbler's Tools": {
                price: 5,rarity: ""
        },
        "Component Pouch": {
                price: 25,rarity: ""
        },
        "Cook's Utensils": {
                price: 1,rarity: ""
        },
        "Coral": {
                price: 100,rarity: ""
        },
        "Crawler Mucus (Contact)": {
                price: 200,rarity: ""
        },
        "Crossbow Bolts": {
                price: 0.05,rarity: ""
        },
        "Crowbar": {
                price: 2,rarity: ""
        },
        "Crystal": {
                price: 10,rarity: ""
        },
        "Diamond": {
                price: 5000,rarity: ""
        },
        "Diamond (Revivify)": {
                price: 300,rarity: ""
        },
        "Diamond (Raise Dead)": {
                price: 500,rarity: ""
        },
        "Diamond (Resurrection)": {
                price: 1000,rarity: ""
        },
        "Diamond (True Resurrection)": {
                price: 25000,rarity: ""
        },
        "Dice Set": {
                price: 0.1,rarity: ""
        },
        "Diplomat's Pack": {
                price: 39,rarity: ""
        },
        "Disguise Kit": {
                price: 25,rarity: ""
        },
        "Donkey (or Mule)": {
                price: 8,rarity: ""
        },
        "Draft Horse": {
                price: 50,rarity: ""
        },
        "Dragonchess Set": {
                price: 1,rarity: ""
        },
        "Drow Poison (Injury)": {
                price: 200,rarity: ""
        },
        "Drum": {
                price: 6,rarity: ""
        },
        "Dulcimer": {
                price: 25,rarity: ""
        },
        "Dungeoneer's Pack": {
                price: 12,rarity: ""
        },
        "Elephant": {
                price: 200,rarity: ""
        },
        "Emblem": {
                price: 5,rarity: ""
        },
        "Emerald": {
                price: 1000,rarity: ""
        },
        "Entertainer's Pack": {
                price: 40,rarity: ""
        },
        "Essence of Ether (Inhaled)": {
                price: 300,rarity: ""
        },
        "Explorer's Pack": {
                price: 10,rarity: ""
        },
        "Eye agate": {
                price: 10,rarity: ""
        },
        "Feed (per day)": {
                price: 0.05,rarity: ""
        },
        "Fire Opal": {
                price: 1000,rarity: ""
        },
        "Fishing Tackle": {
                price: 1,rarity: ""
        },
        "Flask or Tankard": {
                price: 0.02,rarity: ""
        },
        "Flute": {
                price: 2,rarity: ""
        },
        "Forgery Kit": {
                price: 15,rarity: ""
        },
        "Galley": {
                price: 30000,rarity: ""
        },
        "Garnet": {
                price: 100,rarity: ""
        },
        "Glassblower's Tools": {
                price: 30,rarity: ""
        },
        "Grappling Hook": {
                price: 2,rarity: ""
        },
        "Gunpowder, Keg": {
                price: 250,rarity: ""
        },
        "Gunpowder, Powder Horn": {
                price: 35,rarity: ""
        },
        "Hammer": {
                price: 1,rarity: ""
        },
        "Hammer, Sledge": {
                price: 2,rarity: ""
        },
        "Healer's Kit": {
                price: 5,rarity: ""
        },
        "Hematite": {
                price: 10,rarity: ""
        },
        "Herbalism Kit": {
                price: 5,rarity: ""
        },
        "Holy Water (flask)": {
                price: 25,rarity: ""
        },
        "Horn": {
                price: 3,rarity: ""
        },
        "Hourglass": {
                price: 25,rarity: ""
        },
        "Hunting Trap": {
                price: 5,rarity: ""
        },
        "Ink (1 ounce bottle)": {
                price: 10,rarity: ""
        },
        "Ink Pen": {
                price: 0.02,rarity: ""
        },
        "Jacinth": {
                price: 5000,rarity: ""
        },
        "Jade": {
                price: 100,rarity: ""
        },
        "Jasper": {
                price: 50,rarity: ""
        },
        "Jet": {
                price: 100,rarity: ""
        },
        "Jeweler's Tools": {
                price: 25,rarity: ""
        },
        "Jug or Pitcher": {
                price: 0.02,rarity: ""
        },
        "Keelboat": {
                price: 3000,rarity: ""
        },
        "Ladder (10 foot)": {
                price: 0.1,rarity: ""
        },
        "Lamp": {
                price: 0.5,rarity: ""
        },
        "Lantern, Bullseye": {
                price: 10,rarity: ""
        },
        "Lantern, Hooded": {
                price: 5,rarity: ""
        },
        "Lapis Lazuli": {
                price: 10,rarity: ""
        },
        "Leatherworker's Tools": {
                price: 5,rarity: ""
        },
        "Lock": {
                price: 10,rarity: ""
        },
        "Longship": {
                price: 10000,rarity: ""
        },
        "Lute": {
                price: 35,rarity: ""
        },
        "Lyre": {
                price: 30,rarity: ""
        },
        "Magnifying Glass": {
                price: 100,rarity: ""
        },
        "Malachite": {
                price: 10,rarity: ""
        },
        "Malice (Inhaled)": {
                price: 250,rarity: ""
        },
        "Manacles": {
                price: 2,rarity: ""
        },
        "Mason's Tools": {
                price: 10,rarity: ""
        },
        "Mastiff": {
                price: 25,rarity: ""
        },
        "Mess Kit": {
                price: 0.2,rarity: ""
        },
        "Midnight Tears (Ingested)": {
                price: 1500,rarity: ""
        },
        "Mirror, Steel": {
                price: 5,rarity: ""
        },
        "Monster Hunter's Pack": {
                price: 33,rarity: ""
        },
        "Moonstone": {
                price: 50,rarity: ""
        },
        "Moss agate": {
                price: 10,rarity: ""
        },
        "Navigator's Tools": {
                price: 25,rarity: ""
        },
        "Obsidian": {
                price: 10,rarity: ""
        },
        "Oil (flask)": {
                price: 0.1,rarity: ""
        },
        "Oil of Taggit (Contact)": {
                price: 400,rarity: ""
        },
        "Onyx": {
                price: 50,rarity: ""
        },
        "Opal": {
                price: 1000,rarity: ""
        },
        "Orb": {
                price: 20,rarity: ""
        },
        "Painter's Supplies": {
                price: 10,rarity: ""
        },
        "Pale Tincture (Ingested)": {
                price: 250,rarity: ""
        },
        "Pan Flute": {
                price: 12,rarity: ""
        },
        "Paper (one sheet)": {
                price: 0.2,rarity: ""
        },
        "Parchment (one sheet)": {
                price: 0.1,rarity: ""
        },
        "Pearl": {
                price: 100,rarity: ""
        },
        "Perfume (vial)": {
                price: 5,rarity: ""
        },
        "Peridot": {
                price: 500,rarity: ""
        },
        "Pick, Miner's": {
                price: 2,rarity: ""
        },
        "Piton": {
                price: 0.05,rarity: ""
        },
        "Playing Card Set": {
                price: 0.5,rarity: ""
        },
        "Poison, Basic (vial)": {
                price: 100,rarity: ""
        },
        "Poisoner's Kit": {
                price: 50,rarity: ""
        },
        "Pole (10-foot)": {
                price: 0.05,rarity: ""
        },
        "Pony": {
                price: 30,rarity: ""
        },
        "Pot, Iron": {
                price: 2,rarity: ""
        },
        "Potter's Tools": {
                price: 10,rarity: ""
        },
        "Pouch": {
                price: 0.5,rarity: ""
        },
        "Priest's Pack": {
                price: 19,rarity: ""
        },
        "Purple Worm Poison (Injury)": {
                price: 2000,rarity: ""
        },
        "Quartz": {
                price: 50,rarity: ""
        },
        "Quiver": {
                price: 1,rarity: ""
        },
        "Ram, Portable": {
                price: 4,rarity: ""
        },
        "Rations (1 day)": {
                price: 0.5,rarity: ""
        },
        "Reliquary": {
                price: 5,rarity: ""
        },
        "Rhodochrosite": {
                price: 10,rarity: ""
        },
        "Riding Horse": {
                price: 75,rarity: ""
        },
        "Robes": {
                price: 1,rarity: ""
        },
        "Rod": {
                price: 10,rarity: ""
        },
        "Rope, Hempen (50 feet)": {
                price: 1,rarity: ""
        },
        "Rope, Silk (50 feet)": {
                price: 10,rarity: ""
        },
        "Rowboat": {
                price: 50,rarity: ""
        },
        "Ruby": {
                price: 5000,rarity: ""
        },
        "Sack": {
                price: 0.01,rarity: ""
        },
        "Saddle, Exotic": {
                price: 60,rarity: ""
        },
        "Saddle, Military": {
                price: 20,rarity: ""
        },
        "Saddle, Pack": {
                price: 5,rarity: ""
        },
        "Saddle, Riding": {
                price: 10,rarity: ""
        },
        "Saddlebags": {
                price: 4,rarity: ""
        },
        "Sailing Ship": {
                price: 10000,rarity: ""
        },
        "Sardonyx": {
                price: 50,rarity: ""
        },
        "Scale, Merchant's": {
                price: 5,rarity: ""
        },
        "Scholar's Pack": {
                price: 40,rarity: ""
        },
        "Sealing Wax": {
                price: 0.5,rarity: ""
        },
        "Serpent Venom (Injury)": {
                price: 200,rarity: ""
        },
        "Shawm": {
                price: 2,rarity: ""
        },
        "Shovel": {
                price: 2,rarity: ""
        },
        "Signal Whistle": {
                price: 0.05,rarity: ""
        },
        "Signet Ring": {
                price: 5,rarity: ""
        },
        "Sled": {
                price: 20,rarity: ""
        },
        "Smith's Tools": {
                price: 20,rarity: ""
        },
        "Soap": {
                price: 0.02,rarity: ""
        },
        "Spellbook": {
                price: 50,rarity: ""
        },
        "Spikes, Iron (10)": {
                price: 0.1,rarity: ""
        },
        "Spinel": {
                price: 100,rarity: ""
        },
        "Sprig of Mistletoe": {
                price: 1,rarity: ""
        },
        "Spyglass": {
                price: 1000,rarity: ""
        },
        "Staff": {
                price: 5,rarity: ""
        },
        "Star Rose Quartz": {
                price: 50,rarity: ""
        },
        "Star Ruby": {
                price: 1000,rarity: ""
        },
        "Star Sapphire": {
                price: 1000,rarity: ""
        },
        "Tent, Two-Person": {
                price: 2,rarity: ""
        },
        "Thieves' Tools": {
                price: 25,rarity: ""
        },
        "Three-Dragon Ante Set": {
                price: 1,rarity: ""
        },
        "Tiger Eye": {
                price: 10,rarity: ""
        },
        "Tinderbox": {
                price: 0.5,rarity: ""
        },
        "Tinker's Tools": {
                price: 50,rarity: ""
        },
        "Topaz": {
                price: 500,rarity: ""
        },
        "Torch": {
                price: 0.01,rarity: ""
        },
        "Torpor (Ingested)": {
                price: 600,rarity: ""
        },
        "Totem": {
                price: 1,rarity: ""
        },
        "Tourmaline": {
                price: 100,rarity: ""
        },
        "Truth Serum (Ingested)": {
                price: 150,rarity: ""
        },
        "Turquoise": {
                price: 10,rarity: ""
        },
        "Vial": {
                price: 1,rarity: ""
        },
        "Viol": {
                price: 30,rarity: ""
        },
        "Wagon": {
                price: 35,rarity: ""
        },
        "Wand": {
                price: 10,rarity: ""
        },
        "Warhorse": {
                price: 400,rarity: ""
        },
        "Warship": {
                price: 25000,rarity: ""
        },
        "Waterskin": {
                price: 0.2,rarity: ""
        },
        "Weaver's Tools": {
                price: 1,rarity: ""
        },
        "Whetstone": {
                price: 0.01,rarity: ""
        },
        "Woodcarver's Tools": {
                price: 1,rarity: ""
        },
        "Wooden Staff": {
                price: 5,rarity: ""
        },
        "Wyvern Poison (Injury)": {
                price: 1200,rarity: ""
        },
        "Yellow sapphire": {
                price: 1000,rarity: ""
        },
        "Yew Wand": {
                price: 10,rarity: ""
        },
        "Zircon": {
                price: 50,rarity: ""
        },
};

/**
 * @returns {[string, ...item][]}
 */
export function getSanesItemPrices() {
  return Object.entries(sanesItemPrices);
}

/**
 * @return {string[]}
 */
export function getSanesItemNameIndex() {
  return Object.keys(sanesItemPrices);
}

/** @type {Map<number, {min: number, max: number}>} */
export const tierToCostLimits = new Map();
tierToCostLimits.set(1, {min: 500, max: 1000});
tierToCostLimits.set(2, {min: 1000, max: 3000});
tierToCostLimits.set(3, {min: 3000, max: 5000});
tierToCostLimits.set(4, {min: 5000, max: 10000});

/**
 * Adds new attributes to each item, may store in file
 * @param {boolean} store 
 */
function createUpdatedData(store) {
  /** @type {[string, ...item[]][]} */
  const items = getSanesItemPrices();
  /** @type {Object} */
  const newItems = {};
  for (let index = 0; index < items.length; index++) {
    const itemData = items[index][1];
    if(itemData.rarity === "") itemData.rarity = "Common";
    // @ts-ignore
    if(itemData.price < tierToCostLimits.get(1).min) {
      itemData.priceTier = 0;
    // @ts-ignore
    } else if(itemData.price <= tierToCostLimits.get(2).min) {
      itemData.priceTier = 1;
    // @ts-ignore
    } else if(itemData.price <= tierToCostLimits.get(3).min) {
      itemData.priceTier = 2;
    // @ts-ignore
    } else if(itemData.price <= tierToCostLimits.get(4).min) {
      itemData.priceTier = 3;
    // @ts-ignore
    } else if(itemData.price <= tierToCostLimits.get(4).max) {
      itemData.priceTier = 4;
    } else {
      itemData.priceTier = 5;
    }
    newItems[items[index][0]] = itemData;
  }
  
  sanesItemPrices = newItems;
  if(!store) 
    return;

  try {
    const output = JSON.stringify(newItems, null, "\t");
    writeDataFileRequest("./data/itemsList2.json", output);
  } catch (err) {
    console.error(err);
  }
}

createUpdatedData(false);