-- Drop tables if they already exist (safe for testing)
DROP TABLE IF EXISTS vlan;
DROP TABLE IF EXISTS sent_sms;

-- Create sent_sms table
CREATE TABLE sent_sms (
    ID VARCHAR(50) PRIMARY KEY,
    phone_number VARCHAR(20),
    message TEXT,
    createdAt DATETIME(3),
    updatedAt DATETIME(3)
);

-- Create vlan table with foreign key reference
CREATE TABLE vlan (
    ID VARCHAR(50) PRIMARY KEY,
    vlan_id INT,
    message_id VARCHAR(50),
    createdAt DATETIME(3),
    updatedAt DATETIME(3),
    FOREIGN KEY (message_id) REFERENCES sent_sms(ID)
);

SELECT '✅ Tables created successfully!' as status;

-- RUN THIS AFTER THE TABLES ARE CREATED
CREATE INDEX idx_sent_sms_createdat ON sent_sms(createdAt);