-- SQLite;
DROP TABLE IF EXISTS crime_rewards_events;
CREATE TABLE crime_rewards_events (eventID int NOT NULL, description TEXT NOT NULL);

-- Insert the data;
INSERT INTO crime_rewards_events (eventID, description) VALUES (0, "You got caught and have to pay up for your misdeads. Your sentence is a large fine.");
INSERT INTO crime_rewards_events (eventID, description) VALUES (1, "You got caught and have to pay up for your misdeads. Your sentence is a medium fine.");
INSERT INTO crime_rewards_events (eventID, description) VALUES (2, "You got caught and have to pay up for your misdeads. Your sentence is a small fine.");
INSERT INTO crime_rewards_events (eventID, description) VALUES (3, "You managed to escape the guards, but couldn't take the loot with you.");
INSERT INTO crime_rewards_events (eventID, description) VALUES (4, "You managed to get away with some valuable stuff.");
INSERT INTO crime_rewards_events (eventID, description) VALUES (5, "You managed to get away with some valuable stuff.");
INSERT INTO crime_rewards_events (eventID, description) VALUES (6, "You managed to get away with some valuable stuff.");
INSERT INTO crime_rewards_events (eventID, description) VALUES (7, "You pulled off a remarkable heist!");
INSERT INTO crime_rewards_events (eventID, description) VALUES (8, "You pulled off a remarkable heist!");
INSERT INTO crime_rewards_events (eventID, description) VALUES (9, "You pulled off a remarkable heist!");
