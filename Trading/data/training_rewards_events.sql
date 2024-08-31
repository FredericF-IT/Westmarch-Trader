-- SQLite;
DROP TABLE IF EXISTS training_rewards_events;
CREATE TABLE training_rewards_events (eventID int NOT NULL, description TEXT NOT NULL);

-- Insert the data;
INSERT INTO training_rewards_events (eventID, description) VALUES (0, "Due to a serious misfortune, you damage your weapon *and* hurt yourself.");
INSERT INTO training_rewards_events (eventID, description) VALUES (1, "You damaged your weapon, and it will need repairs.");
INSERT INTO training_rewards_events (eventID, description) VALUES (2, "You had an accident and wounded yourself.");
INSERT INTO training_rewards_events (eventID, description) VALUES (3, "You've had a good training session, feeling exhausted but well prepared for future battles.");
INSERT INTO training_rewards_events (eventID, description) VALUES (4, "You've had a good training session, feeling exhausted but well prepared for future battles.");
INSERT INTO training_rewards_events (eventID, description) VALUES (5, "You've had a good training session, feeling exhausted but well prepared for future battles.");
INSERT INTO training_rewards_events (eventID, description) VALUES (6, "You've had a good training session, feeling exhausted but well prepared for future battles.");
INSERT INTO training_rewards_events (eventID, description) VALUES (7, "People watching you train will think of you as a master in your art. You'll need a long rest after this one...");
INSERT INTO training_rewards_events (eventID, description) VALUES (8, "People watching you train will think of you as a master in your art. You'll need a long rest after this one...");
INSERT INTO training_rewards_events (eventID, description) VALUES (9, "People watching you train will think of you as a master in your art. You'll need a long rest after this one...");
