-- Adds the optional phone number, the "What would you like help with?"
-- answer, and the time you marked a message as replied.
ALTER TABLE messages ADD COLUMN phone TEXT;
ALTER TABLE messages ADD COLUMN topic TEXT;
ALTER TABLE messages ADD COLUMN replied_at TEXT;
