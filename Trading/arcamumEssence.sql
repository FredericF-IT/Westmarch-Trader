-- SQLite
-- Create the table
CREATE TABLE rarity_costs (
    rarity TEXT PRIMARY KEY,
    item_enchant INTEGER,
    item_service_cost INTEGER,
    item_disenchant INTEGER,
    item_service_cost2 INTEGER,
    consumable_enchant INTEGER,
    consumable_service_cost INTEGER,
    consumable_disenchant INTEGER,
    consumable_service_cost2 INTEGER
);

-- Insert the data into the table
INSERT INTO rarity_costs (rarity, item_enchant, item_service_cost, item_disenchant, item_service_cost2, consumable_enchant, consumable_service_cost, consumable_disenchant, consumable_service_cost2) VALUES 
('common', 30, 100, 15, 20, 10, 25, 5, 5),
('uncommon', 90, 500, 45, 100, 30, 125, 15, 25),
('rare', 180, 1000, 90, 200, 60, 250, 30, 50),
('very rare', 240, 2000, 120, 400, 80, 500, 40, 100),
('legendary', 360, 4000, 180, 800, 120, 1000, 60, 200);


-- Create the table
CREATE TABLE degraded_costs (
    rarity TEXT PRIMARY KEY,
    item_enchant INTEGER,
    item_service_cost INTEGER,
    item_disenchant INTEGER,
    item_service_cost2 INTEGER,
    consumable_enchant INTEGER,
    consumable_service_cost INTEGER,
    consumable_disenchant INTEGER,
    consumable_service_cost2 INTEGER
);

-- Insert the data into the table
INSERT INTO degraded_costs (rarity, item_enchant, item_service_cost, item_disenchant, item_service_cost2, consumable_enchant, consumable_service_cost, consumable_disenchant, consumable_service_cost2) VALUES 
('common', 15, 50, 7, 10, 5, 12, 2, 2),
('uncommon', 45, 250, 22, 50, 15, 62, 7, 12),
('rare', 90, 500, 45, 100, 30, 125, 15, 25),
('very rare', 120, 1000, 60, 200, 40, 250, 20, 50),
('legendary', 180, 2000, 90, 400, 60, 500, 30, 100);


-- Create the table
CREATE TABLE quest_rewards (
    tier INTEGER PRIMARY KEY,
    essence_avg INTEGER,
    essence_max INTEGER,
    gold_avg INTEGER,
    gold_max INTEGER
);

-- Insert the data into the table
INSERT INTO quest_rewards (tier, essence_avg, essence_max, gold_avg, gold_max) VALUES 
(1, 45, 60, 250, 340),
(2, 90, 120, 500, 670),
(3, 120, 160, 1000, 1340),
(4, 180, 240, 2000, 2670);


-- Create the table
CREATE TABLE merchants_xgte (
    rarity TEXT PRIMARY KEY,
    min_xgte_sell TEXT,
    xgte_buy TEXT
);

-- Insert the data into the table
INSERT INTO merchants_xgte (rarity, min_xgte_sell, xgte_buy) VALUES 
('common', '(1d10)', '(1d6+1) x 10'),
('uncommon', '(10d2) x 5', '(1d6) x 100'),
('rare', '(10d2)x100', '(2d10) x 1000'),
('very rare', '(10d2)x1000', '(1d4+1) x 10000'),
('legendary', '(1d6+4)x5000', '(2d6) x 25000');

-- Create the table
CREATE TABLE magic_item_limits (
    level INTEGER PRIMARY KEY,
    uncommon TEXT,
    rare TEXT,
    very_rare TEXT,
    legendary TEXT
);

-- Insert the data into the table
INSERT INTO magic_item_limits (level, uncommon, rare, very_rare, legendary) VALUES 
(2, '2', '0', '0', '0'),
(3, '3', '0', '0', '0'),
(4, '4', '0', '0', '0'),
(5, '∞', '1', '0', '0'),
(6, '∞', '2', '0', '0'),
(7, '∞', '3', '0', '0'),
(8, '∞', '4', '0', '0'),
(9, '∞', '5', '0', '0'),
(10, '∞', '6', '0', '0'),
(11, '∞', '∞', '1', '0'),
(12, '∞', '∞', '2', '0'),
(13, '∞', '∞', '3', '0'),
(14, '∞', '∞', '4', '0'),
(15, '∞', '∞', '5', '0'),
(16, '∞', '∞', '6', '0'),
(17, '∞', '∞', '∞', '1'),
(18, '∞', '∞', '∞', '2'),
(19, '∞', '∞', '∞', '3'),
(20, '∞', '∞', '∞', '∞');
