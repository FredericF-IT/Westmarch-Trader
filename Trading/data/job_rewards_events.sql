-- SQLite;
DROP TABLE IF EXISTS job_rewards_events;
CREATE TABLE job_rewards_events (eventID int NOT NULL, description TEXT NOT NULL);

-- Insert the data;
INSERT INTO job_rewards_events (eventID, description) VALUES (0, "You were unable to complete the job, losing spent gold without getting paid.");
INSERT INTO job_rewards_events (eventID, description) VALUES (1, "You were unable to complete the job, losing spent gold without getting paid.");
INSERT INTO job_rewards_events (eventID, description) VALUES (2, "You managed to recoup your losses for a net 0 workday.");
INSERT INTO job_rewards_events (eventID, description) VALUES (3, "You do a pretty decent job. Your costumers are happy with your work.");
INSERT INTO job_rewards_events (eventID, description) VALUES (4, "You do a pretty decent job. Your costumers are happy with your work.");
INSERT INTO job_rewards_events (eventID, description) VALUES (5, "You do a pretty decent job. Your costumers are happy with your work.");
INSERT INTO job_rewards_events (eventID, description) VALUES (6, "You do a pretty decent job. Your costumers are happy with your work.");
INSERT INTO job_rewards_events (eventID, description) VALUES (7, "Your work is outstanding. People pay extra to get *your* services, specifically.");
INSERT INTO job_rewards_events (eventID, description) VALUES (8, "Your work is outstanding. People pay extra to get *your* services, specifically.");
INSERT INTO job_rewards_events (eventID, description) VALUES (9, "Your work is outstanding. People pay extra to get *your* services, specifically.");
