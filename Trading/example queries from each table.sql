-- SQLite examples!
SELECT ic.item_name, ic.rarity, rc.item_enchant, rc.item_disenchant 
FROM item_cost ic
JOIN rarity_costs rc ON ic.rarity = rc.rarity
JOIN magic_item_limits mil ON mil.level = 2
WHERE (
    (ic.rarity = 'uncommon' AND mil.uncommon > 0) OR
    (ic.rarity = 'rare' AND mil.rare > 0) OR
    (ic.rarity = 'very_rare' AND mil.very_rare > 0) OR
    (ic.rarity = 'legendary' AND mil.legendary > 0)
)
ORDER BY RANDOM()
LIMIT 1;

SELECT ic.item_name, ic.rarity, rc.item_enchant, rc.item_disenchant 
FROM item_cost ic
JOIN rarity_costs rc ON ic.rarity = rc.rarity
JOIN magic_item_limits mil ON mil.level = 6
WHERE (
    (ic.rarity = 'uncommon' AND mil.uncommon > 0) OR
    (ic.rarity = 'rare' AND mil.rare > 0) OR
    (ic.rarity = 'very_rare' AND mil.very_rare > 0) OR
    (ic.rarity = 'legendary' AND mil.legendary > 0)
)
ORDER BY RANDOM()
LIMIT 1;

SELECT ic.item_name, ic.rarity, rc.item_enchant, rc.item_disenchant 
FROM item_cost ic
JOIN rarity_costs rc ON ic.rarity = rc.rarity
JOIN magic_item_limits mil ON mil.level = 12
WHERE (
    (ic.rarity = 'uncommon' AND mil.uncommon > 0) OR
    (ic.rarity = 'rare' AND mil.rare > 0) OR
    (ic.rarity = 'very_rare' AND mil.very_rare > 0) OR
    (ic.rarity = 'legendary' AND mil.legendary > 0)
)
ORDER BY RANDOM()
LIMIT 1;

SELECT ic.item_name, ic.rarity, rc.item_enchant, rc.item_disenchant 
FROM item_cost ic
JOIN rarity_costs rc ON ic.rarity = rc.rarity
JOIN magic_item_limits mil ON mil.level = 19
WHERE (
    (ic.rarity = 'uncommon' AND mil.uncommon > 0) OR
    (ic.rarity = 'rare' AND mil.rare > 0) OR
    (ic.rarity = 'very_rare' AND mil.very_rare > 0) OR
    (ic.rarity = 'legendary' AND mil.legendary > 0)
)
ORDER BY RANDOM()
LIMIT 1;

SELECT ic.item_name, ic.rarity, rc.item_enchant, rc.item_disenchant 
FROM item_cost ic
JOIN rarity_costs rc ON ic.rarity = rc.rarity
JOIN magic_item_limits mil ON mil.level = 20
WHERE (
    (ic.rarity = 'uncommon' AND mil.uncommon > 0) OR
    (ic.rarity = 'rare' AND mil.rare > 0) OR
    (ic.rarity = 'very_rare' AND mil.very_rare > 0) OR
    (ic.rarity = 'legendary' AND mil.legendary > 0)
)
ORDER BY RANDOM()
LIMIT 1;

SELECT level, roll_result, outcome
FROM xp_rewards
WHERE (level = 2 AND roll_result = 18);

SELECT level, roll_result, result
FROM job_rewards
WHERE (level = 2 AND roll_result = 18);

SELECT level, roll_result, outcome
FROM crime_downtime
WHERE (level = 2 AND roll_result = 18);