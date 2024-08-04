import os
import traceback
from enum import Enum
class Rarity(Enum):
    c = "common"
    uc = "uncommon"
    r = "rare"
    vr = "very rare"
    l = "legendary"

leather = {"Padded": 5,"Leather": 10,"Studded Leather": 45,"Hide": 10}
mediumMetalArmor = {"Chain shirt": 50,"Scale mail": 50,"Breastplate": 400,"Half plate": 750}
heavyArmor = {"Ring mail": 30,"Chain mail": 75,"Splint": 200,"Plate": 1500}

allMetalArmor = mediumMetalArmor | heavyArmor

allArmors = leather | allMetalArmor

shield = {"Shield": 10}

allArmorsAndShield = allArmors | shield


slashingSword = {"Greatsword": 50, "Longsword": 15, "Scimitar": 25}

sword = slashingSword | {"Rapier": 25, "Shortsword": 10}
 
axe = {"Battleaxe": 10, "Greataxe": 30, "Handaxe": 5}
  
axeOrSword = axe | sword

weapon = axeOrSword | {
            "Club": 0.1, "Dagger": 2, "Greatclub": 0.2, "Javelin": 0.5, "Light Hammer": 0.2, "Mace": 5, 
            "Quarterstaff": 0.2, "Sickle": 1, "Spear": 1, "Yklwa": 1, "Crossbow, light": 25, "Dart": 0.05, 
            "Shortbow": 25, "Sling": 0.1, "Double-bladed Scimitar": 100, "Flail": 10, "Glaive": 20, "Halberd": 20, 
            "Lance": 10, "Maul": 10, "Morningstar": 15, "Pike": 5, "Trident": 5, "War Pick": 5, 
            "Warhammer": 15, "Whip": 2, "Blowgun": 10, "Crossbow, hand": 75, "Crossbow, heavy": 50, "Longbow": 50, "Net": 1 
        } 

 
armorWithVariants = {
                        "+1": {"price": 1500, "rarity": Rarity.uc}, "+2": {"price": 6000, "rarity": Rarity.r}, "+3": {"price": 24000, "rarity": Rarity.vr}, 
                        "Adamantine Armor": {"price": 500, "rarity": Rarity.uc}, "Mithral Armor": {"price": 800, "rarity": Rarity.uc}, "Armor of Resistance": {"price": 6000, "rarity": Rarity.r},
                        "Mariner's Armor": {"price": 1500, "rarity": Rarity.uc},  "Plate Armor of Etherealness": {"price": 48000, "rarity": Rarity.l},
                        "Armor of Invulnerability": {"price": 18000, "rarity": Rarity.l}
                    }

weaponsWithVariants = {
                        "+1 weapon": {"price": 1000, "rarity": Rarity.uc}, "+2 weapon": {"price": 4000, "rarity": Rarity.r}, "+3 weapon": {"price": 16000, "rarity": Rarity.vr}, 
                        "Nine Lives Stealer sword (Fully Charged)": {"price": 8000, "rarity": Rarity.l}, "Dancing sword": {"price": 2000, "rarity": Rarity.vr}, "Defender sword": {"price": 24000, "rarity": Rarity.l}, 
                        "Dragon Slayer sword": {"price": 8000, "rarity": Rarity.vr}, "Flame Tongue sword": {"price": 5000, "rarity": Rarity.r}, "Frost Brand sword": {"price": 2200, "rarity": Rarity.vr}, 
                        "Giant Slayer axeOrSword": {"price": 7000, "rarity": Rarity.r}, "Holy Avenger sword": {"price": 165000, "rarity": Rarity.l}, "sword of Life-Stealing": {"price": 1000, "rarity": Rarity.r}, 
                        "slashingSword of Sharpness": {"price": 1700, "rarity": Rarity.vr}, "sword of Wounding": {"price": 2000, "rarity": Rarity.r}, "Vicious weapon": {"price": 350, "rarity": Rarity.r}, 
                        "Vorpal slashingSword": {"price": 24000, "rarity": Rarity.l}, "weapon of Warning": {"price": 60000, "rarity": Rarity.uc}
                    }

itemCount = 0
for (enchantment_name, enchantment) in armorWithVariants.items():
    ((_, enchantment_price), (_, rarity)) = enchantment.items()
    #for line in file:
        #line = line.strip()
        #words = line.split(" ")

        #item_name = ""
        #item_price = 0

        #i = 0
        #for word in words:
        #    if(word.isdigit()):
        #        item_price = int(word)
        #        break
        #    item_name += word + " "
        
        #item_name = item_name.strip()

        # add leather armor if enchantment is +x
    allArmorsNeeded = allMetalArmor.copy()
    if enchantment_name.startswith("+"):
        allArmorsNeeded = allArmorsAndShield.copy()

    for (base_item, price) in allArmorsNeeded.items():
        itemCount += 1
        sourroundingString = "'"
        if sourroundingString in enchantment_name: sourroundingString = '"'
        print(sourroundingString+enchantment_name + " " + base_item + sourroundingString
                + ": {\n\tprice: "+ str(price + enchantment_price)
                + ',\n\trarity: "'+ rarity.value
                +'",\n},')
        
print(str(itemCount) + " items")
input("Press Enter to continue...")

for (enchantment_name, enchantment) in weaponsWithVariants.items():
    ((_, enchantment_price), (_, rarity)) = enchantment.items()
    # add leather armor if enchantment is +x
    allWeaponsNeeded = {}
    replaceWord = ""
    if "weapon" in enchantment_name:
        replaceWord = "weapon"
        allWeaponsNeeded = weapon.copy()
    elif "slashingSword" in enchantment_name:
        replaceWord = "slashingSword"
        allWeaponsNeeded = slashingSword.copy()
    elif "axeOrSword" in enchantment_name:
        replaceWord = "axeOrSword"
        allWeaponsNeeded = axeOrSword.copy()
    elif "sword" in enchantment_name:
        replaceWord = "sword"
        allWeaponsNeeded = sword.copy()

    for (base_item, price) in allWeaponsNeeded.items():
        itemCount += 1
        sourroundingString = "'"
        if sourroundingString in enchantment_name: sourroundingString = '"'
        print(sourroundingString+enchantment_name.replace(replaceWord, base_item) + sourroundingString +
                ": {\n\tprice: "+ str(price + enchantment_price) 
                + ',\n\trarity: "'+ rarity.value
                +'",\n},')

print(str(itemCount) + " items")
input("Press Enter to continue...")

for (base_item, price) in (weapon).items():
    itemCount += 1
    sourroundingString = "'"
    if sourroundingString in enchantment_name: sourroundingString = '"'
    print(sourroundingString+ base_item + sourroundingString +": {\n\tprice: "+ str(price) +",\n},")

for (base_item, price) in (allArmors).items():
    itemCount += 1
    sourroundingString = "'"
    if sourroundingString in enchantment_name: sourroundingString = '"'
    print(sourroundingString+ base_item + " Armor" + sourroundingString +": {\n\tprice: "+ str(price) +",\n},")

for (base_item, price) in (shield).items():
    itemCount += 1
    sourroundingString = "'"
    if sourroundingString in enchantment_name: sourroundingString = '"'
    print(sourroundingString+ base_item + sourroundingString +": {\n\tprice: "+ str(price) +",\n},")

print(str(itemCount) + " items")
input("Press Enter to continue...")

filename = "C:\\Users\\Frederic\\Desktop\\DnD Campaign\\asdfbndfbs.txt"
with open(filename) as file:
#for (enchantment_name, enchantment_price) in armorWithVariants.items():
    for line in file:
        line = line.strip()
        if line == "": break

        words = line.split(" ")

        item_name = " ".join(words[:-1])
        item_price = words[-1]

        sourroundingString = "'"
        if sourroundingString in item_name: sourroundingString = '"'
        print(sourroundingString + item_name + sourroundingString + ": {\n\tprice: "+ str(item_price) +",\n},")
        itemCount += 1
            
print(str(itemCount) + " items")
input("Press Enter to continue...")