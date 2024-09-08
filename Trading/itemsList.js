// @ts-check
/**
 * @typedef {import("./types.js").item} item
 */

let sanesItemPrices = {
	"+1 Shield": {
		"price": 1500,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+2 Shield": {
		"price": 6000,
		"rarity": "rare",
		"priceTier": 4
	},
	"+3 Shield": {
		"price": 24000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Alchemy Jug": {
		"price": 6000,
		"rarity": "uncommon",
		"priceTier": 4
	},
	"Ammunition +1 (each)": {
		"price": 25,
		"rarity": "uncommon",
		"priceTier": 0
	},
	"Ammunition +2 (each)": {
		"price": 100,
		"rarity": "rare",
		"priceTier": 0
	},
	"Ammunition +3 (each)": {
		"price": 400,
		"rarity": "very rare",
		"priceTier": 0
	},
	"Amulet of Health": {
		"price": 8000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Amulet of Proof Against Detection and Location": {
		"price": 20000,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Amulet of the Planes": {
		"price": 160000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Animated Shield": {
		"price": 6000,
		"rarity": "very rare",
		"priceTier": 4
	},
	"Apparatus of Kwalish": {
		"price": 10000,
		"rarity": "legendary",
		"priceTier": 4
	},
	"Arrow of Slaying (each)": {
		"price": 600,
		"rarity": "very rare",
		"priceTier": 1
	},
	"Arrow-Catching Shield": {
		"price": 6000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Bag of Holding": {
		"price": 4000,
		"rarity": "uncommon",
		"priceTier": 3
	},
	"Bead of Force": {
		"price": 960,
		"rarity": "rare",
		"priceTier": 1
	},
	"Belt of Dwarvenkind": {
		"price": 6000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Boots of Elvenkind": {
		"price": 2500,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Boots of Levitation": {
		"price": 4000,
		"rarity": "rare",
		"priceTier": 3
	},
	"Boots of Speed": {
		"price": 4000,
		"rarity": "rare",
		"priceTier": 3
	},
	"Boots of Striding and Springing": {
		"price": 5000,
		"rarity": "uncommon",
		"priceTier": 3
	},
	"Boots of the Winterlands": {
		"price": 10000,
		"rarity": "uncommon",
		"priceTier": 4
	},
	"Bowl of Commanding Water Elementals": {
		"price": 8000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Bracers of Archery": {
		"price": 1500,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Bracers of Defense": {
		"price": 6000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Brass Horn of Valhalla": {
		"price": 8400,
		"rarity": "rare",
		"priceTier": 4
	},
	"Brazier of Commanding Fire Elementals": {
		"price": 8000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Bronze Griffon": {
		"price": 8000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Bronze Horn of Valhalla": {
		"price": 11200,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Brooch of Shielding": {
		"price": 7500,
		"rarity": "uncommon",
		"priceTier": 4
	},
	"Broom of Flying": {
		"price": 8000,
		"rarity": "uncommon",
		"priceTier": 4
	},
	"Cap of Water Breathing": {
		"price": 1000,
		"rarity": "uncommon",
		"priceTier": 1
	},
	"Cape of the Mountebank": {
		"price": 8000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Carpet of Flying": {
		"price": 12000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Censer of Controlling Air Elementals": {
		"price": 8000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Chime of Opening": {
		"price": 1500,
		"rarity": "rare",
		"priceTier": 2
	},
	"Circlet of Blasting": {
		"price": 1500,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Cloak of Arachnida": {
		"price": 5000,
		"rarity": "very rare",
		"priceTier": 3
	},
	"Cloak of Displacement": {
		"price": 60000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Cloak of Elvenkind": {
		"price": 5000,
		"rarity": "uncommon",
		"priceTier": 3
	},
	"Cloak of Invisibility": {
		"price": 80000,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Cloak of Protection": {
		"price": 3500,
		"rarity": "uncommon",
		"priceTier": 3
	},
	"Cloak of the Bat": {
		"price": 6000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Cloak of the Manta Ray": {
		"price": 6000,
		"rarity": "uncommon",
		"priceTier": 4
	},
	"Crystal Ball": {
		"price": 50000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Cube of Force": {
		"price": 16000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Cubic Gate": {
		"price": 40000,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Daern's Instant Fortress": {
		"price": 75000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Dagger of Venom": {
		"price": 2500,
		"rarity": "rare",
		"priceTier": 2
	},
	"Decanter of Endless Water": {
		"price": 135000,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Deck of Illusions": {
		"price": 6120,
		"rarity": "uncommon",
		"priceTier": 4
	},
	"Dimensional Shackles": {
		"price": 3000,
		"rarity": "rare",
		"priceTier": 2
	},
	"Dragon Scale Mail": {
		"price": 4000,
		"rarity": "very rare",
		"priceTier": 3
	},
	"Driftglobe": {
		"price": 750,
		"rarity": "uncommon",
		"priceTier": 1
	},
	"Dust of Disappearance": {
		"price": 300,
		"rarity": "uncommon",
		"priceTier": 0
	},
	"Dust of Dryness (1 pellet)": {
		"price": 120,
		"rarity": "uncommon",
		"priceTier": 0
	},
	"Dust of Sneezing and Choking": {
		"price": 480,
		"rarity": "uncommon",
		"priceTier": 0
	},
	"Dwarven Plate": {
		"price": 9000,
		"rarity": "very rare",
		"priceTier": 4
	},
	"Dwarven Thrower": {
		"price": 18000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Ebony Fly": {
		"price": 6000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Efreeti Chain": {
		"price": 20000,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Elemental Gem": {
		"price": 960,
		"rarity": "uncommon",
		"priceTier": 1
	},
	"Elixir of Health": {
		"price": 120,
		"rarity": "rare",
		"priceTier": 0
	},
	"Elven Chain": {
		"price": 4000,
		"rarity": "rare",
		"priceTier": 3
	},
	"Eversmoking Bottle": {
		"price": 1000,
		"rarity": "uncommon",
		"priceTier": 1
	},
	"Eyes of Charming": {
		"price": 3000,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Eyes of Minute Seeing": {
		"price": 2500,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Eyes of the Eagle": {
		"price": 2500,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Folding Boat": {
		"price": 10000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Gauntlets of Ogre Power": {
		"price": 8000,
		"rarity": "uncommon",
		"priceTier": 4
	},
	"Gem of Brightness": {
		"price": 5000,
		"rarity": "uncommon",
		"priceTier": 3
	},
	"Gem of Seeing": {
		"price": 32000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Glamoured Studded Leather": {
		"price": 2000,
		"rarity": "rare",
		"priceTier": 2
	},
	"Gloves of Missile Snaring": {
		"price": 3000,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Gloves of Swimming and Climbing": {
		"price": 2000,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Gloves of Thievery": {
		"price": 5000,
		"rarity": "uncommon",
		"priceTier": 3
	},
	"Goggles of Night": {
		"price": 1500,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Golden Lion (each)": {
		"price": 600,
		"rarity": "rare",
		"priceTier": 1
	},
	"Hammer of Thunderbolts": {
		"price": 16000,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Hat of Disguise": {
		"price": 5000,
		"rarity": "uncommon",
		"priceTier": 3
	},
	"Headband of Intellect": {
		"price": 8000,
		"rarity": "uncommon",
		"priceTier": 4
	},
	"Helm of Comprehend Languages": {
		"price": 500,
		"rarity": "uncommon",
		"priceTier": 1
	},
	"Helm of Telepathy": {
		"price": 12000,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Helm of Teleportation": {
		"price": 64000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Heward's Handy Haversack": {
		"price": 2000,
		"rarity": "rare",
		"priceTier": 2
	},
	"Horn of Blasting": {
		"price": 450,
		"rarity": "rare",
		"priceTier": 0
	},
	"Horseshoes of Speed": {
		"price": 5000,
		"rarity": "rare",
		"priceTier": 3
	},
	"Horseshoes of the Zephyr": {
		"price": 1500,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Immovable Rod": {
		"price": 5000,
		"rarity": "uncommon",
		"priceTier": 3
	},
	"Instrument of the Bards - Anstruth Harp": {
		"price": 109000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Instrument of the Bards - Canaith Mandolin": {
		"price": 30000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Instrument of the Bards - Cli Lyre": {
		"price": 35000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Instrument of the Bards - Doss Lute": {
		"price": 28500,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Instrument of the Bards - Fochulan Bandlore": {
		"price": 26500,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Instrument of the Bards - Mac-Fuirmidh Cittern": {
		"price": 27000,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Instrument of the Bards - Ollamh Harp": {
		"price": 125000,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Ioun Stone of Absorption": {
		"price": 2400,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Ioun Stone of Agility": {
		"price": 3000,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Ioun Stone of Awareness": {
		"price": 12000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Ioun Stone of Fortitude": {
		"price": 3000,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Ioun Stone Greater Absorption": {
		"price": 31000,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Ioun Stone of Insight": {
		"price": 3000,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Ioun Stone of Intellect": {
		"price": 3000,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Ioun Stone of Leadership": {
		"price": 3000,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Ioun Stone of Mastery": {
		"price": 15000,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Ioun Stone of Protection": {
		"price": 1200,
		"rarity": "rare",
		"priceTier": 2
	},
	"Ioun Stone of Regeneration": {
		"price": 4000,
		"rarity": "legendary",
		"priceTier": 3
	},
	"Ioun Stone of Reserve": {
		"price": 6000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Ioun Stone of Strength": {
		"price": 3000,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Ioun Stone of Sustenance": {
		"price": 1000,
		"rarity": "rare",
		"priceTier": 1
	},
	"Iron Bands of Bilarro": {
		"price": 4000,
		"rarity": "rare",
		"priceTier": 3
	},
	"Iron Horn of Valhalla": {
		"price": 14000,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Ivory Goat (Terror)": {
		"price": 20000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Ivory Goat (Travail)": {
		"price": 400,
		"rarity": "rare",
		"priceTier": 0
	},
	"Ivory Goat (Traveling)": {
		"price": 1000,
		"rarity": "rare",
		"priceTier": 1
	},
	"Javelin of Lightning": {
		"price": 1500,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Keoghtoms Ointment (Per Dose)": {
		"price": 120,
		"rarity": "uncommon",
		"priceTier": 0
	},
	"Lantern of Revealing": {
		"price": 5000,
		"rarity": "uncommon",
		"priceTier": 3
	},
	"Luckstone": {
		"price": 4200,
		"rarity": "uncommon",
		"priceTier": 3
	},
	"Mace of Disruption": {
		"price": 8000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Mace of Smiting": {
		"price": 7000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Mace of Terror": {
		"price": 8000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Mantle of Spell Resistance": {
		"price": 30000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Marble Elephant": {
		"price": 6000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Medallion of Thoughts": {
		"price": 3000,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Mirror of Life Trapping": {
		"price": 18000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Necklace of Adaption": {
		"price": 1500,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Necklace of Fireballs (6 Beads)": {
		"price": 7680,
		"rarity": "rare",
		"priceTier": 4
	},
	"Necklace of Fireballs (5 Beads)": {
		"price": 3840,
		"rarity": "rare",
		"priceTier": 3
	},
	"Necklace of Fireballs (4 Beads)": {
		"price": 1600,
		"rarity": "rare",
		"priceTier": 2
	},
	"Necklace of Fireballs (3 Beads)": {
		"price": 960,
		"rarity": "rare",
		"priceTier": 1
	},
	"Necklace of Fireballs (2 Beads)": {
		"price": 480,
		"rarity": "rare",
		"priceTier": 0
	},
	"Necklace of Fireballs (1 Beads)": {
		"price": 300,
		"rarity": "rare",
		"priceTier": 0
	},
	"Nolzur's Marvelous Pigments": {
		"price": 200,
		"rarity": "very rare",
		"priceTier": 0
	},
	"Oathbow": {
		"price": 3500,
		"rarity": "very rare",
		"priceTier": 3
	},
	"Obsidian Steed": {
		"price": 128000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Oil of Etherealness": {
		"price": 1920,
		"rarity": "rare",
		"priceTier": 2
	},
	"Oil of Sharpness": {
		"price": 3200,
		"rarity": "very rare",
		"priceTier": 3
	},
	"Oil of Slipperiness": {
		"price": 480,
		"rarity": "uncommon",
		"priceTier": 0
	},
	"Onyx Dog": {
		"price": 3000,
		"rarity": "rare",
		"priceTier": 2
	},
	"Pearl of Power": {
		"price": 6000,
		"rarity": "uncommon",
		"priceTier": 4
	},
	"Periapt of Health": {
		"price": 5000,
		"rarity": "uncommon",
		"priceTier": 3
	},
	"Periapt of Proof Against Poison": {
		"price": 5000,
		"rarity": "rare",
		"priceTier": 3
	},
	"Periapt of Wound Closure": {
		"price": 5000,
		"rarity": "uncommon",
		"priceTier": 3
	},
	"Philter of Love": {
		"price": 90,
		"rarity": "uncommon",
		"priceTier": 0
	},
	"Pipes of Haunting": {
		"price": 6000,
		"rarity": "uncommon",
		"priceTier": 4
	},
	"Pipes of the Sewers": {
		"price": 2000,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Plate Armor of Etherealness": {
		"price": 48000,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Portable Hole": {
		"price": 8000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Potion of Animal Friendship": {
		"price": 200,
		"rarity": "uncommon",
		"priceTier": 0
	},
	"Potion of Clairvoyance": {
		"price": 960,
		"rarity": "rare",
		"priceTier": 1
	},
	"Potion of Climbing": {
		"price": 180,
		"rarity": "common",
		"priceTier": 0
	},
	"Potion of Diminution": {
		"price": 270,
		"rarity": "rare",
		"priceTier": 0
	},
	"Potion of Fire Breath": {
		"price": 150,
		"rarity": "uncommon",
		"priceTier": 0
	},
	"Potion of Flying": {
		"price": 500,
		"rarity": "very rare",
		"priceTier": 1
	},
	"Potion of Gaseous Form": {
		"price": 300,
		"rarity": "rare",
		"priceTier": 0
	},
	"Potion of Greater Healing": {
		"price": 150,
		"rarity": "uncommon",
		"priceTier": 0
	},
	"Potion of Growth": {
		"price": 270,
		"rarity": "uncommon",
		"priceTier": 0
	},
	"Potion of Healing": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Potion of Heroism": {
		"price": 180,
		"rarity": "rare",
		"priceTier": 0
	},
	"Potion of Invisibility": {
		"price": 180,
		"rarity": "very rare",
		"priceTier": 0
	},
	"Potion of Invulnerability": {
		"price": 3840,
		"rarity": "rare",
		"priceTier": 3
	},
	"Potion of Longevity": {
		"price": 9000,
		"rarity": "very rare",
		"priceTier": 4
	},
	"Potion of Mind Reading": {
		"price": 180,
		"rarity": "rare",
		"priceTier": 0
	},
	"Potion of Poison": {
		"price": 100,
		"rarity": "uncommon",
		"priceTier": 0
	},
	"Potion of Resistance": {
		"price": 300,
		"rarity": "uncommon",
		"priceTier": 0
	},
	"Potion of Speed": {
		"price": 400,
		"rarity": "very rare",
		"priceTier": 0
	},
	"Potion of Superior Healing": {
		"price": 450,
		"rarity": "rare",
		"priceTier": 0
	},
	"Potion of Supreme Healing": {
		"price": 1350,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Potion of Vitality": {
		"price": 960,
		"rarity": "very rare",
		"priceTier": 1
	},
	"Potion of Water Breathing": {
		"price": 180,
		"rarity": "uncommon",
		"priceTier": 0
	},
	"Prayer Bead - Bless": {
		"price": 2000,
		"rarity": "rare",
		"priceTier": 2
	},
	"Prayer Bead - Curing": {
		"price": 4000,
		"rarity": "rare",
		"priceTier": 3
	},
	"Prayer Bead - Favor": {
		"price": 32000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Prayer Bead - Smiting": {
		"price": 1500,
		"rarity": "rare",
		"priceTier": 2
	},
	"Prayer Bead - Summons": {
		"price": 128000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Prayer Bead - Wind Walking": {
		"price": 96000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Quaal's Feather Token Anchor": {
		"price": 50,
		"rarity": "rare",
		"priceTier": 0
	},
	"Quaal's Feather Token Bird": {
		"price": 3000,
		"rarity": "rare",
		"priceTier": 2
	},
	"Quaal's Feather Token Fan": {
		"price": 250,
		"rarity": "rare",
		"priceTier": 0
	},
	"Quaal's Feather Token Swan Boat": {
		"price": 3000,
		"rarity": "rare",
		"priceTier": 2
	},
	"Quaal's Feather Token Whip": {
		"price": 250,
		"rarity": "rare",
		"priceTier": 0
	},
	"Quiver of Ehlonna": {
		"price": 1000,
		"rarity": "rare",
		"priceTier": 1
	},
	"Ring of Air Elemental Command": {
		"price": 35000,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Ring of Animal Influence": {
		"price": 4000,
		"rarity": "rare",
		"priceTier": 3
	},
	"Ring of Earth Elemental Command": {
		"price": 31000,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Ring of Evasion": {
		"price": 5000,
		"rarity": "rare",
		"priceTier": 3
	},
	"Ring of Feather Falling": {
		"price": 2000,
		"rarity": "rare",
		"priceTier": 2
	},
	"Ring of Fire Elemental Command": {
		"price": 17000,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Ring of Free Action": {
		"price": 20000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Ring of Invisibility": {
		"price": 10000,
		"rarity": "legendary",
		"priceTier": 4
	},
	"Ring of Jumping": {
		"price": 2500,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Ring of Mind Shielding": {
		"price": 16000,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Ring of Protection": {
		"price": 3500,
		"rarity": "rare",
		"priceTier": 3
	},
	"Ring of Regeneration": {
		"price": 12000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Ring of Resistance": {
		"price": 6000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Ring of Shooting Stars": {
		"price": 14000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Ring of Spell Storing": {
		"price": 24000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Ring of Spell Turning": {
		"price": 30000,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Ring of Swimming": {
		"price": 3000,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Ring of Telekinesis": {
		"price": 80000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Ring of the Ram": {
		"price": 5000,
		"rarity": "rare",
		"priceTier": 3
	},
	"Ring of Warmth": {
		"price": 1000,
		"rarity": "uncommon",
		"priceTier": 1
	},
	"Ring of Water Elemental Command": {
		"price": 25000,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Ring of Water Walking": {
		"price": 1500,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Ring of X-Ray Vision": {
		"price": 6000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Robe of Eyes": {
		"price": 30000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Robe of Scintillating Colors": {
		"price": 6000,
		"rarity": "very rare",
		"priceTier": 4
	},
	"Robe of Stars": {
		"price": 60000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Robe of the Archmagi": {
		"price": 34000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Rod of Absorption": {
		"price": 50000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Rod of Alertness": {
		"price": 25000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Rod of Lordly Might": {
		"price": 28000,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Rod of Rulership": {
		"price": 16000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Rod of Security": {
		"price": 90000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Rod of the Pact Keeper +1": {
		"price": 12000,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Rod of the Pact Keeper +2": {
		"price": 16000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Rod of the Pact Keeper +3": {
		"price": 28000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Amulet of the Devout +1": {
		"price": 12000,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Amulet of the Devout +2": {
		"price": 16000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Amulet of the Devout +3": {
		"price": 28000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Bloodwell Vial +1": {
		"price": 12000,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Bloodwell Vial +2": {
		"price": 16000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Bloodwell Vial +3": {
		"price": 28000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Arcane Grimoire +1": {
		"price": 12000,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Arcane Grimoire +2": {
		"price": 16000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Arcane Grimoire +3": {
		"price": 28000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Moon Sickle +1": {
		"price": 12000,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Moon Sickle +2": {
		"price": 16000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Moon Sickle +3": {
		"price": 28000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Rhythm Maker's Drum +1": {
		"price": 12000,
		"priceTier": 5
	},
	"Rhythm Maker's Drum +2": {
		"price": 16000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Rhythm Maker's Drum +3": {
		"price": 28000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"All-Purpose Tool +1": {
		"price": 12000,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"All-Purpose Tool +2": {
		"price": 16000,
		"rarity": "rare",
		"priceTier": 5
	},
	"All-Purpose Tool +3": {
		"price": 28000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Dragonhide Belt +1": {
		"price": 12000,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Dragonhide Belt +2": {
		"price": 16000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Dragonhide Belt +3": {
		"price": 28000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Rope of Climbing": {
		"price": 2000,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Rope of Entanglement": {
		"price": 4000,
		"rarity": "rare",
		"priceTier": 3
	},
	"Saddle of the Cavalier": {
		"price": 2000,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Scarab of Protection": {
		"price": 36000,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Scimitar of Speed": {
		"price": 6000,
		"rarity": "very rare",
		"priceTier": 4
	},
	"Scroll of Protection": {
		"price": 180,
		"rarity": "rare",
		"priceTier": 0
	},
	"Sending Stones": {
		"price": 2000,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Sentinel Shield": {
		"price": 20000,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Serpentine Owl": {
		"price": 8000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Shield of Missile Attraction": {
		"price": 6000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Silver Horn of Valhalla": {
		"price": 5600,
		"rarity": "rare",
		"priceTier": 4
	},
	"Silver Raven": {
		"price": 5000,
		"rarity": "uncommon",
		"priceTier": 3
	},
	"Slippers of Spider Climbing": {
		"price": 5000,
		"rarity": "uncommon",
		"priceTier": 3
	},
	"Sovereign Glue": {
		"price": 400,
		"rarity": "legendary",
		"priceTier": 0
	},
	"Spellguard Shield": {
		"price": 50000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Sphere of Annihilation": {
		"price": 15000,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Staff of Charming": {
		"price": 12000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Staff of Fire": {
		"price": 16000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Staff of Frost": {
		"price": 26000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Staff of Healing": {
		"price": 13000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Staff of Power": {
		"price": 95500,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Staff of Striking": {
		"price": 21000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Staff of Swarming Insects": {
		"price": 16000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Staff of the Adder": {
		"price": 1800,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Staff of the Python": {
		"price": 2000,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Staff of the Woodlands": {
		"price": 44000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Staff of Thunder and Lightning": {
		"price": 10000,
		"rarity": "very rare",
		"priceTier": 4
	},
	"Staff of Withering": {
		"price": 3000,
		"rarity": "rare",
		"priceTier": 2
	},
	"Stone of Controlling Earth Elementals": {
		"price": 8000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Sun Blade": {
		"price": 12000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Sword of Answering": {
		"price": 36000,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Talisman of Pure Good": {
		"price": 71680,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Talisman of the Sphere": {
		"price": 20000,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Talisman of Ultimate Evil": {
		"price": 61440,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Tentacle Rod": {
		"price": 5000,
		"rarity": "rare",
		"priceTier": 3
	},
	"Trident of Fish Command": {
		"price": 800,
		"rarity": "uncommon",
		"priceTier": 1
	},
	"Universal Solvent": {
		"price": 300,
		"rarity": "legendary",
		"priceTier": 0
	},
	"Wand of Binding": {
		"price": 10000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Wand of Enemy Detection": {
		"price": 4000,
		"rarity": "rare",
		"priceTier": 3
	},
	"Wand of Fear": {
		"price": 10000,
		"rarity": "rare",
		"priceTier": 4
	},
	"Wand of Fireballs": {
		"price": 32000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Wand of Lightning Bolts": {
		"price": 32000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Wand of Magic Detection": {
		"price": 1500,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Wand of Magic Missiles": {
		"price": 8000,
		"rarity": "uncommon",
		"priceTier": 4
	},
	"Wand of Paralysis": {
		"price": 16000,
		"rarity": "rare",
		"priceTier": 5
	},
	"Wand of Polymorph": {
		"price": 32000,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Wand of Secrets": {
		"price": 1500,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Wand of the War Mage +1": {
		"price": 1200,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Wand of the War Mage +2": {
		"price": 4800,
		"rarity": "rare",
		"priceTier": 3
	},
	"Wand of the War Mage +3": {
		"price": 19200,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Wand of Web": {
		"price": 8000,
		"rarity": "uncommon",
		"priceTier": 4
	},
	"Wind Fan": {
		"price": 1500,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Winged Boots": {
		"price": 8000,
		"rarity": "uncommon",
		"priceTier": 4
	},
	"Wings of Flying": {
		"price": 5000,
		"rarity": "rare",
		"priceTier": 3
	},
	"Spell Scroll Level 0": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Spell Scroll Level 1": {
		"price": 60,
		"rarity": "common",
		"priceTier": 0
	},
	"Spell Scroll Level 2": {
		"price": 120,
		"rarity": "uncommon",
		"priceTier": 0
	},
	"Spell Scroll Level 3": {
		"price": 200,
		"rarity": "uncommon",
		"priceTier": 0
	},
	"Spell Scroll Level 4": {
		"price": 320,
		"rarity": "rare",
		"priceTier": 0
	},
	"Spell Scroll Level 5": {
		"price": 640,
		"rarity": "rare",
		"priceTier": 1
	},
	"Spell Scroll Level 6": {
		"price": 1280,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Spell Scroll Level 7": {
		"price": 2560,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Spell Scroll Level 8": {
		"price": 5120,
		"rarity": "very rare",
		"priceTier": 4
	},
	"Spell Scroll Level 9": {
		"price": 10240,
		"rarity": "legendary",
		"priceTier": 5
	},

  // Things with variants (armors  / weapons)

  "+1 Padded": {
		"price": 1505,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Leather": {
		"price": 1510,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Studded Leather": {
		"price": 1545,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Hide": {
		"price": 1510,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Chain shirt": {
		"price": 1550,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Scale mail": {
		"price": 1550,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Breastplate": {
		"price": 1900,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Half plate": {
		"price": 2250,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Ring mail": {
		"price": 1530,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Chain mail": {
		"price": 1575,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Splint": {
		"price": 1700,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Plate": {
		"price": 3000,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+2 Padded": {
		"price": 6005,
		"rarity": "rare",
		"priceTier": 4
	},
	"+2 Leather": {
		"price": 6010,
		"rarity": "rare",
		"priceTier": 4
	},
	"+2 Studded Leather": {
		"price": 6045,
		"rarity": "rare",
		"priceTier": 4
	},
	"+2 Hide": {
		"price": 6010,
		"rarity": "rare",
		"priceTier": 4
	},
	"+2 Chain shirt": {
		"price": 6050,
		"rarity": "rare",
		"priceTier": 4
	},
	"+2 Scale mail": {
		"price": 6050,
		"rarity": "rare",
		"priceTier": 4
	},
	"+2 Breastplate": {
		"price": 6400,
		"rarity": "rare",
		"priceTier": 4
	},
	"+2 Half plate": {
		"price": 6750,
		"rarity": "rare",
		"priceTier": 4
	},
	"+2 Ring mail": {
		"price": 6030,
		"rarity": "rare",
		"priceTier": 4
	},
	"+2 Chain mail": {
		"price": 6075,
		"rarity": "rare",
		"priceTier": 4
	},
	"+2 Splint": {
		"price": 6200,
		"rarity": "rare",
		"priceTier": 4
	},
	"+2 Plate": {
		"price": 7500,
		"rarity": "rare",
		"priceTier": 4
	},
	"+3 Padded": {
		"price": 24005,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Leather": {
		"price": 24010,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Studded Leather": {
		"price": 24045,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Hide": {
		"price": 24010,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Chain shirt": {
		"price": 24050,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Scale mail": {
		"price": 24050,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Breastplate": {
		"price": 24400,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Half plate": {
		"price": 24750,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Ring mail": {
		"price": 24030,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Chain mail": {
		"price": 24075,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Splint": {
		"price": 24200,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Plate": {
		"price": 25500,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Adamantine Armor Chain shirt": {
		"price": 550,
		"rarity": "uncommon",
		"priceTier": 1
	},
	"Adamantine Armor Scale mail": {
		"price": 550,
		"rarity": "uncommon",
		"priceTier": 1
	},
	"Adamantine Armor Breastplate": {
		"price": 900,
		"rarity": "uncommon",
		"priceTier": 1
	},
	"Adamantine Armor Half plate": {
		"price": 1250,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Adamantine Armor Ring mail": {
		"price": 530,
		"rarity": "uncommon",
		"priceTier": 1
	},
	"Adamantine Armor Chain mail": {
		"price": 575,
		"rarity": "uncommon",
		"priceTier": 1
	},
	"Adamantine Armor Splint": {
		"price": 700,
		"rarity": "uncommon",
		"priceTier": 1
	},
	"Adamantine Armor Plate": {
		"price": 2000,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Mithral Armor Chain shirt": {
		"price": 850,
		"rarity": "uncommon",
		"priceTier": 1
	},
	"Mithral Armor Scale mail": {
		"price": 850,
		"rarity": "uncommon",
		"priceTier": 1
	},
	"Mithral Armor Breastplate": {
		"price": 1200,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Mithral Armor Half plate": {
		"price": 1550,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Mithral Armor Ring mail": {
		"price": 830,
		"rarity": "uncommon",
		"priceTier": 1
	},
	"Mithral Armor Chain mail": {
		"price": 875,
		"rarity": "uncommon",
		"priceTier": 1
	},
	"Mithral Armor Splint": {
		"price": 1000,
		"rarity": "uncommon",
		"priceTier": 1
	},
	"Mithral Armor Plate": {
		"price": 2300,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Armor of Resistance Chain shirt": {
		"price": 6050,
		"rarity": "rare",
		"priceTier": 4
	},
	"Armor of Resistance Scale mail": {
		"price": 6050,
		"rarity": "rare",
		"priceTier": 4
	},
	"Armor of Resistance Breastplate": {
		"price": 6400,
		"rarity": "rare",
		"priceTier": 4
	},
	"Armor of Resistance Half plate": {
		"price": 6750,
		"rarity": "rare",
		"priceTier": 4
	},
	"Armor of Resistance Ring mail": {
		"price": 6030,
		"rarity": "rare",
		"priceTier": 4
	},
	"Armor of Resistance Chain mail": {
		"price": 6075,
		"rarity": "rare",
		"priceTier": 4
	},
	"Armor of Resistance Splint": {
		"price": 6200,
		"rarity": "rare",
		"priceTier": 4
	},
	"Armor of Resistance Plate": {
		"price": 7500,
		"rarity": "rare",
		"priceTier": 4
	},
	"Mariner's Armor Chain shirt": {
		"price": 1550,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Mariner's Armor Scale mail": {
		"price": 1550,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Mariner's Armor Breastplate": {
		"price": 1900,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Mariner's Armor Half plate": {
		"price": 2250,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Mariner's Armor Ring mail": {
		"price": 1530,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Mariner's Armor Chain mail": {
		"price": 1575,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Mariner's Armor Splint": {
		"price": 1700,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Mariner's Armor Plate": {
		"price": 3000,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"Plate Armor of Etherealness Chain shirt": {
		"price": 48050,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Plate Armor of Etherealness Scale mail": {
		"price": 48050,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Plate Armor of Etherealness Breastplate": {
		"price": 48400,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Plate Armor of Etherealness Half plate": {
		"price": 48750,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Plate Armor of Etherealness Ring mail": {
		"price": 48030,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Plate Armor of Etherealness Chain mail": {
		"price": 48075,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Plate Armor of Etherealness Splint": {
		"price": 48200,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Plate Armor of Etherealness Plate": {
		"price": 49500,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Armor of Invulnerability Chain shirt": {
		"price": 18050,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Armor of Invulnerability Scale mail": {
		"price": 18050,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Armor of Invulnerability Breastplate": {
		"price": 18400,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Armor of Invulnerability Half plate": {
		"price": 18750,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Armor of Invulnerability Ring mail": {
		"price": 18030,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Armor of Invulnerability Chain mail": {
		"price": 18075,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Armor of Invulnerability Splint": {
		"price": 18200,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Armor of Invulnerability Plate": {
		"price": 19500,
		"rarity": "legendary",
		"priceTier": 5
	},
	"+1 Battleaxe": {
		"price": 1010,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Greataxe": {
		"price": 1030,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Handaxe": {
		"price": 1005,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Greatsword": {
		"price": 1050,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Longsword": {
		"price": 1015,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Scimitar": {
		"price": 1025,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Rapier": {
		"price": 1025,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Shortsword": {
		"price": 1010,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Club": {
		"price": 1000.1,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Dagger": {
		"price": 1002,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Greatclub": {
		"price": 1000.2,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Javelin": {
		"price": 1000.5,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Light Hammer": {
		"price": 1000.2,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Mace": {
		"price": 1005,
		"priceTier": 2
	},
	"+1 Quarterstaff": {
		"price": 1000.2,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Sickle": {
		"price": 1001,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Spear": {
		"price": 1001,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Yklwa": {
		"price": 1001,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Crossbow, light": {
		"price": 1025,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Dart": {
		"price": 1000.05,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Shortbow": {
		"price": 1025,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Sling": {
		"price": 1000.1,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Double-bladed Scimitar": {
		"price": 1100,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Flail": {
		"price": 1010,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Glaive": {
		"price": 1020,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Halberd": {
		"price": 1020,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Lance": {
		"price": 1010,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Maul": {
		"price": 1010,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Morningstar": {
		"price": 1015,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Pike": {
		"price": 1005,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Trident": {
		"price": 1005,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 War Pick": {
		"price": 1005,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Warhammer": {
		"price": 1015,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Whip": {
		"price": 1002,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Blowgun": {
		"price": 1010,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Crossbow, hand": {
		"price": 1075,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Crossbow, heavy": {
		"price": 1050,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Longbow": {
		"price": 1050,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+1 Net": {
		"price": 1001,
		"rarity": "uncommon",
		"priceTier": 2
	},
	"+2 Battleaxe": {
		"price": 4010,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Greataxe": {
		"price": 4030,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Handaxe": {
		"price": 4005,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Greatsword": {
		"price": 4050,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Longsword": {
		"price": 4015,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Scimitar": {
		"price": 4025,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Rapier": {
		"price": 4025,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Shortsword": {
		"price": 4010,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Club": {
		"price": 4000.1,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Dagger": {
		"price": 4002,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Greatclub": {
		"price": 4000.2,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Javelin": {
		"price": 4000.5,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Light Hammer": {
		"price": 4000.2,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Mace": {
		"price": 4005,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Quarterstaff": {
		"price": 4000.2,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Sickle": {
		"price": 4001,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Spear": {
		"price": 4001,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Yklwa": {
		"price": 4001,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Crossbow, light": {
		"price": 4025,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Dart": {
		"price": 4000.05,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Shortbow": {
		"price": 4025,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Sling": {
		"price": 4000.1,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Double-bladed Scimitar": {
		"price": 4100,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Flail": {
		"price": 4010,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Glaive": {
		"price": 4020,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Halberd": {
		"price": 4020,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Lance": {
		"price": 4010,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Maul": {
		"price": 4010,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Morningstar": {
		"price": 4015,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Pike": {
		"price": 4005,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Trident": {
		"price": 4005,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 War Pick": {
		"price": 4005,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Warhammer": {
		"price": 4015,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Whip": {
		"price": 4002,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Blowgun": {
		"price": 4010,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Crossbow, hand": {
		"price": 4075,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Crossbow, heavy": {
		"price": 4050,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Longbow": {
		"price": 4050,
		"rarity": "rare",
		"priceTier": 3
	},
	"+2 Net": {
		"price": 4001,
		"rarity": "rare",
		"priceTier": 3
	},
	"+3 Battleaxe": {
		"price": 16010,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Greataxe": {
		"price": 16030,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Handaxe": {
		"price": 16005,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Greatsword": {
		"price": 16050,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Longsword": {
		"price": 16015,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Scimitar": {
		"price": 16025,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Rapier": {
		"price": 16025,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Shortsword": {
		"price": 16010,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Club": {
		"price": 16000.1,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Dagger": {
		"price": 16002,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Greatclub": {
		"price": 16000.2,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Javelin": {
		"price": 16000.5,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Light Hammer": {
		"price": 16000.2,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Mace": {
		"price": 16005,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Quarterstaff": {
		"price": 16000.2,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Sickle": {
		"price": 16001,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Spear": {
		"price": 16001,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Yklwa": {
		"price": 16001,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Crossbow, light": {
		"price": 16025,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Dart": {
		"price": 16000.05,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Shortbow": {
		"price": 16025,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Sling": {
		"price": 16000.1,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Double-bladed Scimitar": {
		"price": 16100,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Flail": {
		"price": 16010,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Glaive": {
		"price": 16020,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Halberd": {
		"price": 16020,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Lance": {
		"price": 16010,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Maul": {
		"price": 16010,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Morningstar": {
		"price": 16015,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Pike": {
		"price": 16005,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Trident": {
		"price": 16005,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 War Pick": {
		"price": 16005,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Warhammer": {
		"price": 16015,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Whip": {
		"price": 16002,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Blowgun": {
		"price": 16010,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Crossbow, hand": {
		"price": 16075,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Crossbow, heavy": {
		"price": 16050,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Longbow": {
		"price": 16050,
		"rarity": "very rare",
		"priceTier": 5
	},
	"+3 Net": {
		"price": 16001,
		"rarity": "very rare",
		"priceTier": 5
	},
	"Nine Lives Stealer Greatsword (Fully Charged)": {
		"price": 8050,
		"rarity": "very rare",
		"priceTier": 4
	},
	"Nine Lives Stealer Longsword (Fully Charged)": {
		"price": 8015,
		"rarity": "very rare",
		"priceTier": 4
	},
	"Nine Lives Stealer Scimitar (Fully Charged)": {
		"price": 8025,
		"rarity": "very rare",
		"priceTier": 4
	},
	"Nine Lives Stealer Rapier (Fully Charged)": {
		"price": 8025,
		"rarity": "very rare",
		"priceTier": 4
	},
	"Nine Lives Stealer Shortsword (Fully Charged)": {
		"price": 8010,
		"rarity": "very rare",
		"priceTier": 4
	},
	"Dancing Greatsword": {
		"price": 2050,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Dancing Longsword": {
		"price": 2015,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Dancing Scimitar": {
		"price": 2025,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Dancing Rapier": {
		"price": 2025,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Dancing Shortsword": {
		"price": 2010,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Defender Greatsword": {
		"price": 24050,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Defender Longsword": {
		"price": 24015,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Defender Scimitar": {
		"price": 24025,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Defender Rapier": {
		"price": 24025,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Defender Shortsword": {
		"price": 24010,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Dragon Slayer Greatsword": {
		"price": 8050,
		"rarity": "rare",
		"priceTier": 4
	},
	"Dragon Slayer Longsword": {
		"price": 8015,
		"rarity": "rare",
		"priceTier": 4
	},
	"Dragon Slayer Scimitar": {
		"price": 8025,
		"rarity": "rare",
		"priceTier": 4
	},
	"Dragon Slayer Rapier": {
		"price": 8025,
		"rarity": "rare",
		"priceTier": 4
	},
	"Dragon Slayer Shortsword": {
		"price": 8010,
		"rarity": "rare",
		"priceTier": 4
	},
	"Flame Tongue Greatsword": {
		"price": 5050,
		"rarity": "rare",
		"priceTier": 4
	},
	"Flame Tongue Longsword": {
		"price": 5015,
		"rarity": "rare",
		"priceTier": 4
	},
	"Flame Tongue Scimitar": {
		"price": 5025,
		"rarity": "rare",
		"priceTier": 4
	},
	"Flame Tongue Rapier": {
		"price": 5025,
		"rarity": "rare",
		"priceTier": 4
	},
	"Flame Tongue Shortsword": {
		"price": 5010,
		"rarity": "rare",
		"priceTier": 4
	},
	"Frost Brand Greatsword": {
		"price": 2250,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Frost Brand Longsword": {
		"price": 2215,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Frost Brand Scimitar": {
		"price": 2225,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Frost Brand Rapier": {
		"price": 2225,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Frost Brand Shortsword": {
		"price": 2210,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Giant Slayer Battleaxe": {
		"price": 7010,
		"rarity": "rare",
		"priceTier": 4
	},
	"Giant Slayer Greataxe": {
		"price": 7030,
		"rarity": "rare",
		"priceTier": 4
	},
	"Giant Slayer Handaxe": {
		"price": 7005,
		"rarity": "rare",
		"priceTier": 4
	},
	"Giant Slayer Greatsword": {
		"price": 7050,
		"rarity": "rare",
		"priceTier": 4
	},
	"Giant Slayer Longsword": {
		"price": 7015,
		"rarity": "rare",
		"priceTier": 4
	},
	"Giant Slayer Scimitar": {
		"price": 7025,
		"rarity": "rare",
		"priceTier": 4
	},
	"Giant Slayer Rapier": {
		"price": 7025,
		"rarity": "rare",
		"priceTier": 4
	},
	"Giant Slayer Shortsword": {
		"price": 7010,
		"rarity": "rare",
		"priceTier": 4
	},
	"Holy Avenger Greatsword": {
		"price": 165050,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Holy Avenger Longsword": {
		"price": 165015,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Holy Avenger Scimitar": {
		"price": 165025,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Holy Avenger Rapier": {
		"price": 165025,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Holy Avenger Shortsword": {
		"price": 165010,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Greatsword of Life-Stealing": {
		"price": 1050,
		"rarity": "rare",
		"priceTier": 2
	},
	"Longsword of Life-Stealing": {
		"price": 1015,
		"rarity": "rare",
		"priceTier": 2
	},
	"Scimitar of Life-Stealing": {
		"price": 1025,
		"rarity": "rare",
		"priceTier": 2
	},
	"Rapier of Life-Stealing": {
		"price": 1025,
		"rarity": "rare",
		"priceTier": 2
	},
	"Shortsword of Life-Stealing": {
		"price": 1010,
		"rarity": "rare",
		"priceTier": 2
	},
	"Greatsword of Sharpness": {
		"price": 1750,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Longsword of Sharpness": {
		"price": 1715,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Scimitar of Sharpness": {
		"price": 1725,
		"rarity": "very rare",
		"priceTier": 2
	},
	"Greatsword of Wounding": {
		"price": 2050,
		"rarity": "rare",
		"priceTier": 2
	},
	"Longsword of Wounding": {
		"price": 2015,
		"rarity": "rare",
		"priceTier": 2
	},
	"Scimitar of Wounding": {
		"price": 2025,
		"rarity": "rare",
		"priceTier": 2
	},
	"Rapier of Wounding": {
		"price": 2025,
		"rarity": "rare",
		"priceTier": 2
	},
	"Shortsword of Wounding": {
		"price": 2010,
		"rarity": "rare",
		"priceTier": 2
	},
	"Vicious Battleaxe": {
		"price": 360,
		"priceTier": 0
	},
	"Vicious Greataxe": {
		"price": 380,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Handaxe": {
		"price": 355,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Greatsword": {
		"price": 400,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Longsword": {
		"price": 365,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Scimitar": {
		"price": 375,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Rapier": {
		"price": 375,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Shortsword": {
		"price": 360,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Club": {
		"price": 350.1,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Dagger": {
		"price": 352,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Greatclub": {
		"price": 350.2,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Javelin": {
		"price": 350.5,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Light Hammer": {
		"price": 350.2,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Mace": {
		"price": 355,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Quarterstaff": {
		"price": 350.2,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Sickle": {
		"price": 351,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Spear": {
		"price": 351,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Yklwa": {
		"price": 351,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Crossbow, light": {
		"price": 375,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Dart": {
		"price": 350.05,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Shortbow": {
		"price": 375,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Sling": {
		"price": 350.1,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Double-bladed Scimitar": {
		"price": 450,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Flail": {
		"price": 360,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Glaive": {
		"price": 370,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Halberd": {
		"price": 370,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Lance": {
		"price": 360,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Maul": {
		"price": 360,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Morningstar": {
		"price": 365,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Pike": {
		"price": 355,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Trident": {
		"price": 355,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious War Pick": {
		"price": 355,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Warhammer": {
		"price": 365,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Whip": {
		"price": 352,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Blowgun": {
		"price": 360,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Crossbow, hand": {
		"price": 425,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Crossbow, heavy": {
		"price": 400,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Longbow": {
		"price": 400,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vicious Net": {
		"price": 351,
		"rarity": "rare",
		"priceTier": 0
	},
	"Vorpal Greatsword": {
		"price": 24050,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Vorpal Longsword": {
		"price": 24015,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Vorpal Scimitar": {
		"price": 24025,
		"rarity": "legendary",
		"priceTier": 5
	},
	"Battleaxe of Warning": {
		"price": 60010,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Greataxe of Warning": {
		"price": 60030,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Handaxe of Warning": {
		"price": 60005,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Greatsword of Warning": {
		"price": 60050,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Longsword of Warning": {
		"price": 60015,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Scimitar of Warning": {
		"price": 60025,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Rapier of Warning": {
		"price": 60025,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Shortsword of Warning": {
		"price": 60010,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Club of Warning": {
		"price": 60000.1,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Dagger of Warning": {
		"price": 60002,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Greatclub of Warning": {
		"price": 60000.2,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Javelin of Warning": {
		"price": 60000.5,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Light Hammer of Warning": {
		"price": 60000.2,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Mace of Warning": {
		"price": 60005,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Quarterstaff of Warning": {
		"price": 60000.2,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Sickle of Warning": {
		"price": 60001,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Spear of Warning": {
		"price": 60001,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Yklwa of Warning": {
		"price": 60001,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Crossbow, light of Warning": {
		"price": 60025,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Dart of Warning": {
		"price": 60000.05,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Shortbow of Warning": {
		"price": 60025,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Sling of Warning": {
		"price": 60000.1,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Double-bladed Scimitar of Warning": {
		"price": 60100,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Flail of Warning": {
		"price": 60010,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Glaive of Warning": {
		"price": 60020,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Halberd of Warning": {
		"price": 60020,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Lance of Warning": {
		"price": 60010,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Maul of Warning": {
		"price": 60010,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Morningstar of Warning": {
		"price": 60015,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Pike of Warning": {
		"price": 60005,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Trident of Warning": {
		"price": 60005,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"War Pick of Warning": {
		"price": 60005,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Warhammer of Warning": {
		"price": 60015,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Whip of Warning": {
		"price": 60002,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Blowgun of Warning": {
		"price": 60010,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Crossbow, hand of Warning": {
		"price": 60075,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Crossbow, heavy of Warning": {
		"price": 60050,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Longbow of Warning": {
		"price": 60050,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Net of Warning": {
		"price": 60001,
		"rarity": "uncommon",
		"priceTier": 5
	},
	"Battleaxe": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Greataxe": {
		"price": 30,
		"rarity": "common",
		"priceTier": 0
	},
	"Handaxe": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Greatsword": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Longsword": {
		"price": 15,
		"rarity": "common",
		"priceTier": 0
	},
	"Scimitar": {
		"price": 25,
		"rarity": "common",
		"priceTier": 0
	},
	"Rapier": {
		"price": 25,
		"rarity": "common",
		"priceTier": 0
	},
	"Shortsword": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Club": {
		"price": 0.1,
		"rarity": "common",
		"priceTier": 0
	},
	"Dagger": {
		"price": 2,
		"rarity": "common",
		"priceTier": 0
	},
	"Greatclub": {
		"price": 0.2,
		"rarity": "common",
		"priceTier": 0
	},
	"Javelin": {
		"price": 0.5,
		"rarity": "common",
		"priceTier": 0
	},
	"Light Hammer": {
		"price": 0.2,
		"rarity": "common",
		"priceTier": 0
	},
	"Mace": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Quarterstaff": {
		"price": 0.2,
		"rarity": "common",
		"priceTier": 0
	},
	"Sickle": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Spear": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Yklwa": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Crossbow, light": {
		"price": 25,
		"rarity": "common",
		"priceTier": 0
	},
	"Dart": {
		"price": 0.05,
		"rarity": "common",
		"priceTier": 0
	},
	"Shortbow": {
		"price": 25,
		"rarity": "common",
		"priceTier": 0
	},
	"Sling": {
		"price": 0.1,
		"rarity": "common",
		"priceTier": 0
	},
	"Double-bladed Scimitar": {
		"price": 100,
		"rarity": "common",
		"priceTier": 0
	},
	"Flail": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Glaive": {
		"price": 20,
		"rarity": "common",
		"priceTier": 0
	},
	"Halberd": {
		"price": 20,
		"rarity": "common",
		"priceTier": 0
	},
	"Lance": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Maul": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Morningstar": {
		"price": 15,
		"rarity": "common",
		"priceTier": 0
	},
	"Pike": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Trident": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"War Pick": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Warhammer": {
		"price": 15,
		"rarity": "common",
		"priceTier": 0
	},
	"Whip": {
		"price": 2,
		"rarity": "common",
		"priceTier": 0
	},
	"Blowgun": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Crossbow, hand": {
		"price": 75,
		"rarity": "common",
		"priceTier": 0
	},
	"Crossbow, heavy": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Longbow": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Net": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Padded Armor": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Leather Armor": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Studded Leather Armor": {
		"price": 45,
		"rarity": "common",
		"priceTier": 0
	},
	"Hide Armor": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Chain shirt Armor": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Scale mail Armor": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Breastplate Armor": {
		"price": 400,
		"rarity": "common",
		"priceTier": 0
	},
	"Half plate Armor": {
		"price": 750,
		"rarity": "common",
		"priceTier": 1
	},
	"Ring mail Armor": {
		"price": 30,
		"rarity": "common",
		"priceTier": 0
	},
	"Chain mail Armor": {
		"price": 75,
		"rarity": "common",
		"priceTier": 0
	},
	"Splint Armor": {
		"price": 200,
		"rarity": "common",
		"priceTier": 0
	},
	"Plate Armor": {
		"price": 1500,
		"rarity": "common",
		"priceTier": 2
	},
	"Shield": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},

  // common items / adventuring gear

  "Abacus": {
		"price": 2,
		"rarity": "common",
		"priceTier": 0
	},
	"Acid (vial)": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Airship": {
		"price": 20000,
		"rarity": "common",
		"priceTier": 5
	},
	"Alchemist's Fire (flask)": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Alchemist's Supplies": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Alexandrite": {
		"price": 500,
		"rarity": "common",
		"priceTier": 1
	},
	"Amber": {
		"price": 100,
		"rarity": "common",
		"priceTier": 0
	},
	"Amethyst": {
		"price": 100,
		"rarity": "common",
		"priceTier": 0
	},
	"Amulet": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Antitoxin": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Aquamarine": {
		"price": 500,
		"rarity": "common",
		"priceTier": 1
	},
	"Arrows (each)": {
		"price": 0.05,
		"rarity": "common",
		"priceTier": 0
	},
	"Assassin's Blood (Ingested)": {
		"price": 150,
		"rarity": "common",
		"priceTier": 0
	},
	"Azurite": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Backpack": {
		"price": 2,
		"rarity": "common",
		"priceTier": 0
	},
	"Bagpipes": {
		"price": 30,
		"rarity": "common",
		"priceTier": 0
	},
	"Ball Bearings (bag of 1000)": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Banded Agate": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Barrel": {
		"price": 2,
		"rarity": "common",
		"priceTier": 0
	},
	"Basket": {
		"price": 0.4,
		"rarity": "common",
		"priceTier": 0
	},
	"Bedroll": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Bell": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Bit and Bridle": {
		"price": 2,
		"rarity": "common",
		"priceTier": 0
	},
	"Black Opal": {
		"price": 1000,
		"rarity": "common",
		"priceTier": 1
	},
	"Black Pearl": {
		"price": 500,
		"rarity": "common",
		"priceTier": 1
	},
	"Black Sapphire": {
		"price": 5000,
		"rarity": "common",
		"priceTier": 3
	},
	"Blanket": {
		"price": 0.5,
		"rarity": "common",
		"priceTier": 0
	},
	"Block and Tackle": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Bloodstone": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Blowgun Needles": {
		"price": 0.02,
		"rarity": "common",
		"priceTier": 0
	},
	"Blue Sapphire": {
		"price": 1000,
		"rarity": "common",
		"priceTier": 1
	},
	"Blue quartz": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Blue spinel": {
		"price": 500,
		"rarity": "common",
		"priceTier": 1
	},
	"Bomb": {
		"price": 150,
		"rarity": "common",
		"priceTier": 0
	},
	"Book": {
		"price": 25,
		"rarity": "common",
		"priceTier": 0
	},
	"Bottle, Glass": {
		"price": 2,
		"rarity": "common",
		"priceTier": 0
	},
	"Brewer's Supplies": {
		"price": 20,
		"rarity": "common",
		"priceTier": 0
	},
	"Bucket": {
		"price": 0.05,
		"rarity": "common",
		"priceTier": 0
	},
	"Burglar's Pack": {
		"price": 16,
		"rarity": "common",
		"priceTier": 0
	},
	"Burnt Othur Fumes (Inhaled)": {
		"price": 500,
		"rarity": "common",
		"priceTier": 1
	},
	"Calligrapher's Supplies": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Caltrops (bag of 20)": {
		"price": 0.05,
		"rarity": "common",
		"priceTier": 0
	},
	"Camel": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Candle": {
		"price": 0.01,
		"rarity": "common",
		"priceTier": 0
	},
	"Carnelian": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Carpenter's Tools": {
		"price": 8,
		"rarity": "common",
		"priceTier": 0
	},
	"Carriage": {
		"price": 100,
		"rarity": "common",
		"priceTier": 0
	},
	"Cart": {
		"price": 15,
		"rarity": "common",
		"priceTier": 0
	},
	"Cartographer's Tools": {
		"price": 15,
		"rarity": "common",
		"priceTier": 0
	},
	"Case, Crossbow Bolt": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Case, Map or Scroll": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Chain (10 feet)": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Chalcedony": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Chalk (1 piece)": {
		"price": 0.01,
		"rarity": "common",
		"priceTier": 0
	},
	"Chariot": {
		"price": 250,
		"rarity": "common",
		"priceTier": 0
	},
	"Chest": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Chrysoberyl": {
		"price": 100,
		"rarity": "common",
		"priceTier": 0
	},
	"Chrysoprase": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Citrine": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Climber's Kit": {
		"price": 25,
		"rarity": "common",
		"priceTier": 0
	},
	"Clothes, Common": {
		"price": 0.5,
		"rarity": "common",
		"priceTier": 0
	},
	"Clothes, Costume": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Clothes, Fine": {
		"price": 15,
		"rarity": "common",
		"priceTier": 0
	},
	"Clothes, Traveler's": {
		"price": 2,
		"rarity": "common",
		"priceTier": 0
	},
	"Cobbler's Tools": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Component Pouch": {
		"price": 25,
		"rarity": "common",
		"priceTier": 0
	},
	"Cook's Utensils": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Coral": {
		"price": 100,
		"rarity": "common",
		"priceTier": 0
	},
	"Crawler Mucus (Contact)": {
		"price": 200,
		"rarity": "common",
		"priceTier": 0
	},
	"Crossbow Bolts": {
		"price": 0.05,
		"rarity": "common",
		"priceTier": 0
	},
	"Crowbar": {
		"price": 2,
		"rarity": "common",
		"priceTier": 0
	},
	"Crystal": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Diamond": {
		"price": 5000,
		"rarity": "common",
		"priceTier": 3
	},
	"Diamond (Revivify)": {
		"price": 300,
		"rarity": "common",
		"priceTier": 0
	},
	"Diamond (Raise Dead)": {
		"price": 500,
		"rarity": "common",
		"priceTier": 1
	},
	"Diamond (Resurrection)": {
		"price": 1000,
		"rarity": "common",
		"priceTier": 1
	},
	"Diamond (True Resurrection)": {
		"price": 25000,
		"rarity": "common",
		"priceTier": 5
	},
	"Dice Set": {
		"price": 0.1,
		"rarity": "common",
		"priceTier": 0
	},
	"Diplomat's Pack": {
		"price": 39,
		"rarity": "common",
		"priceTier": 0
	},
	"Disguise Kit": {
		"price": 25,
		"rarity": "common",
		"priceTier": 0
	},
	"Donkey (or Mule)": {
		"price": 8,
		"rarity": "common",
		"priceTier": 0
	},
	"Draft Horse": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Dragonchess Set": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Drow Poison (Injury)": {
		"price": 200,
		"rarity": "common",
		"priceTier": 0
	},
	"Drum": {
		"price": 6,
		"rarity": "common",
		"priceTier": 0
	},
	"Dulcimer": {
		"price": 25,
		"rarity": "common",
		"priceTier": 0
	},
	"Dungeoneer's Pack": {
		"price": 12,
		"rarity": "common",
		"priceTier": 0
	},
	"Elephant": {
		"price": 200,
		"rarity": "common",
		"priceTier": 0
	},
	"Emblem": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Emerald": {
		"price": 1000,
		"rarity": "common",
		"priceTier": 1
	},
	"Entertainer's Pack": {
		"price": 40,
		"rarity": "common",
		"priceTier": 0
	},
	"Essence of Ether (Inhaled)": {
		"price": 300,
		"rarity": "common",
		"priceTier": 0
	},
	"Explorer's Pack": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Eye agate": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Feed (per day)": {
		"price": 0.05,
		"rarity": "common",
		"priceTier": 0
	},
	"Fire Opal": {
		"price": 1000,
		"rarity": "common",
		"priceTier": 1
	},
	"Fishing Tackle": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Flask or Tankard": {
		"price": 0.02,
		"rarity": "common",
		"priceTier": 0
	},
	"Flute": {
		"price": 2,
		"rarity": "common",
		"priceTier": 0
	},
	"Forgery Kit": {
		"price": 15,
		"rarity": "common",
		"priceTier": 0
	},
	"Galley": {
		"price": 30000,
		"rarity": "common",
		"priceTier": 5
	},
	"Garnet": {
		"price": 100,
		"rarity": "common",
		"priceTier": 0
	},
	"Glassblower's Tools": {
		"price": 30,
		"rarity": "common",
		"priceTier": 0
	},
	"Grappling Hook": {
		"price": 2,
		"rarity": "common",
		"priceTier": 0
	},
	"Gunpowder, Keg": {
		"price": 250,
		"rarity": "common",
		"priceTier": 0
	},
	"Gunpowder, Powder Horn": {
		"price": 35,
		"rarity": "common",
		"priceTier": 0
	},
	"Hammer": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Hammer, Sledge": {
		"price": 2,
		"rarity": "common",
		"priceTier": 0
	},
	"Healer's Kit": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Hematite": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Herbalism Kit": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Holy Water (flask)": {
		"price": 25,
		"rarity": "common",
		"priceTier": 0
	},
	"Horn": {
		"price": 3,
		"rarity": "common",
		"priceTier": 0
	},
	"Hourglass": {
		"price": 25,
		"rarity": "common",
		"priceTier": 0
	},
	"Hunting Trap": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Ink (1 ounce bottle)": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Ink Pen": {
		"price": 0.02,
		"rarity": "common",
		"priceTier": 0
	},
	"Jacinth": {
		"price": 5000,
		"rarity": "common",
		"priceTier": 3
	},
	"Jade": {
		"price": 100,
		"rarity": "common",
		"priceTier": 0
	},
	"Jasper": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Jet": {
		"price": 100,
		"rarity": "common",
		"priceTier": 0
	},
	"Jeweler's Tools": {
		"price": 25,
		"rarity": "common",
		"priceTier": 0
	},
	"Jug or Pitcher": {
		"price": 0.02,
		"rarity": "common",
		"priceTier": 0
	},
	"Keelboat": {
		"price": 3000,
		"rarity": "common",
		"priceTier": 2
	},
	"Ladder (10 foot)": {
		"price": 0.1,
		"rarity": "common",
		"priceTier": 0
	},
	"Lamp": {
		"price": 0.5,
		"rarity": "common",
		"priceTier": 0
	},
	"Lantern, Bullseye": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Lantern, Hooded": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Lapis Lazuli": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Leatherworker's Tools": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Lock": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Longship": {
		"price": 10000,
		"rarity": "common",
		"priceTier": 4
	},
	"Lute": {
		"price": 35,
		"rarity": "common",
		"priceTier": 0
	},
	"Lyre": {
		"price": 30,
		"rarity": "common",
		"priceTier": 0
	},
	"Magnifying Glass": {
		"price": 100,
		"rarity": "common",
		"priceTier": 0
	},
	"Malachite": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Malice (Inhaled)": {
		"price": 250,
		"rarity": "common",
		"priceTier": 0
	},
	"Manacles": {
		"price": 2,
		"rarity": "common",
		"priceTier": 0
	},
	"Mason's Tools": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Mastiff": {
		"price": 25,
		"rarity": "common",
		"priceTier": 0
	},
	"Mess Kit": {
		"price": 0.2,
		"rarity": "common",
		"priceTier": 0
	},
	"Midnight Tears (Ingested)": {
		"price": 1500,
		"rarity": "common",
		"priceTier": 2
	},
	"Mirror, Steel": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Monster Hunter's Pack": {
		"price": 33,
		"rarity": "common",
		"priceTier": 0
	},
	"Moonstone": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Moss agate": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Navigator's Tools": {
		"price": 25,
		"rarity": "common",
		"priceTier": 0
	},
	"Obsidian": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Oil (flask)": {
		"price": 0.1,
		"rarity": "common",
		"priceTier": 0
	},
	"Oil of Taggit (Contact)": {
		"price": 400,
		"rarity": "common",
		"priceTier": 0
	},
	"Onyx": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Opal": {
		"price": 1000,
		"rarity": "common",
		"priceTier": 1
	},
	"Orb": {
		"price": 20,
		"rarity": "common",
		"priceTier": 0
	},
	"Painter's Supplies": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Pale Tincture (Ingested)": {
		"price": 250,
		"rarity": "common",
		"priceTier": 0
	},
	"Pan Flute": {
		"price": 12,
		"rarity": "common",
		"priceTier": 0
	},
	"Paper (one sheet)": {
		"price": 0.2,
		"rarity": "common",
		"priceTier": 0
	},
	"Parchment (one sheet)": {
		"price": 0.1,
		"rarity": "common",
		"priceTier": 0
	},
	"Pearl": {
		"price": 100,
		"rarity": "common",
		"priceTier": 0
	},
	"Perfume (vial)": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Peridot": {
		"price": 500,
		"rarity": "common",
		"priceTier": 1
	},
	"Pick, Miner's": {
		"price": 2,
		"rarity": "common",
		"priceTier": 0
	},
	"Piton": {
		"price": 0.05,
		"rarity": "common",
		"priceTier": 0
	},
	"Playing Card Set": {
		"price": 0.5,
		"rarity": "common",
		"priceTier": 0
	},
	"Poison, Basic (vial)": {
		"price": 100,
		"rarity": "common",
		"priceTier": 0
	},
	"Poisoner's Kit": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Pole (10-foot)": {
		"price": 0.05,
		"rarity": "common",
		"priceTier": 0
	},
	"Pony": {
		"price": 30,
		"rarity": "common",
		"priceTier": 0
	},
	"Pot, Iron": {
		"price": 2,
		"rarity": "common",
		"priceTier": 0
	},
	"Potter's Tools": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Pouch": {
		"price": 0.5,
		"rarity": "common",
		"priceTier": 0
	},
	"Priest's Pack": {
		"price": 19,
		"rarity": "common",
		"priceTier": 0
	},
	"Purple Worm Poison (Injury)": {
		"price": 2000,
		"rarity": "common",
		"priceTier": 2
	},
	"Quartz": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Quiver": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Ram, Portable": {
		"price": 4,
		"rarity": "common",
		"priceTier": 0
	},
	"Rations (1 day)": {
		"price": 0.5,
		"rarity": "common",
		"priceTier": 0
	},
	"Reliquary": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Rhodochrosite": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Riding Horse": {
		"price": 75,
		"rarity": "common",
		"priceTier": 0
	},
	"Robes": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Rod": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Rope, Hempen (50 feet)": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Rope, Silk (50 feet)": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Rowboat": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Ruby": {
		"price": 5000,
		"rarity": "common",
		"priceTier": 3
	},
	"Sack": {
		"price": 0.01,
		"rarity": "common",
		"priceTier": 0
	},
	"Saddle, Exotic": {
		"price": 60,
		"rarity": "common",
		"priceTier": 0
	},
	"Saddle, Military": {
		"price": 20,
		"rarity": "common",
		"priceTier": 0
	},
	"Saddle, Pack": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Saddle, Riding": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Saddlebags": {
		"price": 4,
		"rarity": "common",
		"priceTier": 0
	},
	"Sailing Ship": {
		"price": 10000,
		"rarity": "common",
		"priceTier": 4
	},
	"Sardonyx": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Scale, Merchant's": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Scholar's Pack": {
		"price": 40,
		"rarity": "common",
		"priceTier": 0
	},
	"Sealing Wax": {
		"price": 0.5,
		"rarity": "common",
		"priceTier": 0
	},
	"Serpent Venom (Injury)": {
		"price": 200,
		"rarity": "common",
		"priceTier": 0
	},
	"Shawm": {
		"price": 2,
		"rarity": "common",
		"priceTier": 0
	},
	"Shovel": {
		"price": 2,
		"rarity": "common",
		"priceTier": 0
	},
	"Signal Whistle": {
		"price": 0.05,
		"rarity": "common",
		"priceTier": 0
	},
	"Signet Ring": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Sled": {
		"price": 20,
		"rarity": "common",
		"priceTier": 0
	},
	"Smith's Tools": {
		"price": 20,
		"rarity": "common",
		"priceTier": 0
	},
	"Soap": {
		"price": 0.02,
		"rarity": "common",
		"priceTier": 0
	},
	"Spellbook": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Spikes, Iron (10)": {
		"price": 0.1,
		"rarity": "common",
		"priceTier": 0
	},
	"Spinel": {
		"price": 100,
		"rarity": "common",
		"priceTier": 0
	},
	"Sprig of Mistletoe": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Spyglass": {
		"price": 1000,
		"rarity": "common",
		"priceTier": 1
	},
	"Staff": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Star Rose Quartz": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Star Ruby": {
		"price": 1000,
		"rarity": "common",
		"priceTier": 1
	},
	"Star Sapphire": {
		"price": 1000,
		"rarity": "common",
		"priceTier": 1
	},
	"Tent, Two-Person": {
		"price": 2,
		"rarity": "common",
		"priceTier": 0
	},
	"Thieves' Tools": {
		"price": 25,
		"rarity": "common",
		"priceTier": 0
	},
	"Three-Dragon Ante Set": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Tiger Eye": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Tinderbox": {
		"price": 0.5,
		"rarity": "common",
		"priceTier": 0
	},
	"Tinker's Tools": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	},
	"Topaz": {
		"price": 500,
		"rarity": "common",
		"priceTier": 1
	},
	"Torch": {
		"price": 0.01,
		"rarity": "common",
		"priceTier": 0
	},
	"Torpor (Ingested)": {
		"price": 600,
		"rarity": "common",
		"priceTier": 1
	},
	"Totem": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Tourmaline": {
		"price": 100,
		"rarity": "common",
		"priceTier": 0
	},
	"Truth Serum (Ingested)": {
		"price": 150,
		"rarity": "common",
		"priceTier": 0
	},
	"Turquoise": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Vial": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Viol": {
		"price": 30,
		"rarity": "common",
		"priceTier": 0
	},
	"Wagon": {
		"price": 35,
		"rarity": "common",
		"priceTier": 0
	},
	"Wand": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Warhorse": {
		"price": 400,
		"rarity": "common",
		"priceTier": 0
	},
	"Warship": {
		"price": 25000,
		"rarity": "common",
		"priceTier": 5
	},
	"Waterskin": {
		"price": 0.2,
		"rarity": "common",
		"priceTier": 0
	},
	"Weaver's Tools": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Whetstone": {
		"price": 0.01,
		"rarity": "common",
		"priceTier": 0
	},
	"Woodcarver's Tools": {
		"price": 1,
		"rarity": "common",
		"priceTier": 0
	},
	"Wooden Staff": {
		"price": 5,
		"rarity": "common",
		"priceTier": 0
	},
	"Wyvern Poison (Injury)": {
		"price": 1200,
		"rarity": "common",
		"priceTier": 2
	},
	"Yellow sapphire": {
		"price": 1000,
		"rarity": "common",
		"priceTier": 1
	},
	"Yew Wand": {
		"price": 10,
		"rarity": "common",
		"priceTier": 0
	},
	"Zircon": {
		"price": 50,
		"rarity": "common",
		"priceTier": 0
	}
};

/**
 * @returns {[string, ...item][]}
 */
function getSanesItemPrices() {
  return Object.entries(sanesItemPrices);
}

/**
 * @return {string[]}
 */
function getSanesItemNameIndex() {
  return Object.keys(sanesItemPrices);
}

import { readDataFile, writeDataFileRequest } from "./data/dataIO.js";
//import { tierToCostLimits } from "./utils.js";

/**
 * Adds new attributes to each item, may store in js and sql file
 * @param {boolean} store 
 */
function createUpdatedData(store) {
  /** @type {[string, ...item[]][]} */
  const items = getSanesItemPrices();

  /** @type {Object} */
  const newItems = {};

  /** @type {Map<string, number>} */
  const conType = new Map();
  const lines = readDataFile("./insertItems.sql").split("\n");
  for(let line of lines) {
    if(!line.startsWith("INSERT")) continue;
    const things = line.split('"');
    const itemName = things[1];
    const consumableType = parseInt(things[4].replace(", ", "").replace(");", ""));
  
    conType.set(itemName, consumableType)
  }

  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    const itemData = item[1];
    const consumableType = conType.get(item[0]);
    if(consumableType === undefined) {
//      console.error(item[0] + " has no counterpart with consumable");
      itemData.consumable = -1; // <---- CHANGE HERE
    } else {
      itemData.consumable = consumableType;
    }
    
    newItems[items[index][0]] = itemData;
  }

  sanesItemPrices = newItems;
  
  if(!store) 
    return;

  const definitionText = 
		"DROP TABLE item_cost;\n" +
		"-- Create the table;\n" +
		"CREATE TABLE item_cost (" +
			"item_name TEXT, " +
	    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
			"price INTEGER, " +
			"rarity TEXT, " +
			"consumable INTEGER);\n" +
		"-- Insert the data;\n";

  try {
    writeDataFileRequest("./data/itemsList2.js", "export const updatedItems = " + JSON.stringify(newItems, null, "\t"));
    let outputSQL = definitionText;
    for(let item of items){
      const entryString = 'INSERT INTO item_cost (item_name, price, rarity, consumable) VALUES ("' +
      item[0] + '", ' +
      item[1].price + ', "' +
      item[1].rarity + '", ' +
      item[1].consumable + ");\n";
      outputSQL += entryString;
    }
    writeDataFileRequest("./data/insertItems2.sql", outputSQL);
    
  } catch (err) {
    console.error(err);
  }
}

createUpdatedData(false);