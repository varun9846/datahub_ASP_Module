DROP TABLE IF EXISTS outbox;
DROP TABLE IF EXISTS unsent;
DROP TABLE IF EXISTS antlabs_log;

CREATE TABLE antlabs_log (
  msg_id VARCHAR(50) PRIMARY KEY,
  client_ip TEXT,
  client_mac TEXT,
  vlan_id TEXT,
  created_dtm DATETIME(6)
);

CREATE TABLE outbox (
  msgid VARCHAR(50) PRIMARY KEY,
  msg_type CHAR(1),
  created_dtm DATETIME(6),
  process_dtm DATETIME(6),
  completed_dtm DATETIME(6),
  modem_imei TEXT,
  smsc TEXT,
  mobile_numb VARCHAR(20),
  msg_from VARCHAR(500),
  webapp_user VARCHAR(20),
  raw_message VARCHAR(1000),
  priority INT,
  delivery_dtm DATETIME(6),
  delivery_status CHAR(1)
);

CREATE TABLE unsent (
  msgid VARCHAR(50) PRIMARY KEY,
  msg_type CHAR(1),
  created_dtm DATETIME(6),
  process_dtm DATETIME(6),
  completed_dtm DATETIME(6),
  modem_imei TEXT,
  smsc TEXT,
  mobile_numb VARCHAR(20),
  msg_from VARCHAR(500),
  webapp_user VARCHAR(20),
  msg_content VARCHAR(1000),
  remark TEXT
);

CREATE INDEX idx_antlabs_log_msg_id ON antlabs_log(msg_id);
CREATE INDEX idx_antlabs_log_created_dtm ON antlabs_log(created_dtm);
CREATE INDEX idx_outbox_created_dtm ON outbox(created_dtm);
CREATE INDEX idx_unsent_created_dtm ON unsent(created_dtm);

INSERT INTO antlabs_log (msg_id, client_ip, client_mac, vlan_id, created_dtm) VALUES
('MSG001', '10.10.1.11', 'AA:BB:CC:00:00:01', '101', '2026-06-17 08:00:00.000000'),
('MSG002', '10.10.1.12', 'AA:BB:CC:00:00:02', '102', '2026-06-17 08:01:00.000000'),
('MSG003', '10.10.1.13', 'AA:BB:CC:00:00:03', '103', '2026-06-17 08:02:00.000000'),
('MSG004', '10.10.1.14', 'AA:BB:CC:00:00:04', '104', '2026-06-17 08:03:00.000000'),
('MSG005', '10.10.1.15', 'AA:BB:CC:00:00:05', '105', '2026-06-17 08:04:00.000000'),
('MSG006', '10.10.1.16', 'AA:BB:CC:00:00:06', '106', '2026-06-17 08:05:00.000000'),
('MSG007', '10.10.1.17', 'AA:BB:CC:00:00:07', '107', '2026-06-17 08:06:00.000000'),
('MSG008', '10.10.1.18', 'AA:BB:CC:00:00:08', '108', '2026-06-17 08:07:00.000000'),
('MSG009', '10.10.1.19', 'AA:BB:CC:00:00:09', '109', '2026-06-17 08:08:00.000000'),
('MSG010', '10.10.1.20', 'AA:BB:CC:00:00:10', '110', '2026-06-17 08:09:00.000000');

INSERT INTO outbox (
  msgid, msg_type, created_dtm, process_dtm, completed_dtm, modem_imei, smsc,
  mobile_numb, msg_from, webapp_user, raw_message, priority, delivery_dtm, delivery_status
) VALUES
('MSG001', 'S', '2026-06-17 08:10:00.000000', '2026-06-17 08:10:05.000000', '2026-06-17 08:10:20.000000', 'IMEI000001', 'SMSC-A', '96890000001', 'ANTLABS', 'admin', 'Your WiFi OTP is 100001', 1, '2026-06-17 08:10:30.000000', 'D'),
('MSG002', 'S', '2026-06-17 08:11:00.000000', '2026-06-17 08:11:05.000000', '2026-06-17 08:11:20.000000', 'IMEI000002', 'SMSC-A', '96890000002', 'ANTLABS', 'admin', 'Your WiFi OTP is 100002', 1, '2026-06-17 08:11:30.000000', 'D'),
('MSG003', 'S', '2026-06-17 08:12:00.000000', '2026-06-17 08:12:05.000000', '2026-06-17 08:12:20.000000', 'IMEI000003', 'SMSC-A', '96890000003', 'ANTLABS', 'admin', 'Your WiFi OTP is 100003', 1, '2026-06-17 08:12:30.000000', 'D'),
('MSG004', 'S', '2026-06-17 08:13:00.000000', '2026-06-17 08:13:05.000000', '2026-06-17 08:13:20.000000', 'IMEI000004', 'SMSC-A', '96890000004', 'ANTLABS', 'admin', 'Your WiFi OTP is 100004', 1, '2026-06-17 08:13:30.000000', 'D'),
('MSG005', 'S', '2026-06-17 08:14:00.000000', '2026-06-17 08:14:05.000000', '2026-06-17 08:14:20.000000', 'IMEI000005', 'SMSC-A', '96890000005', 'ANTLABS', 'admin', 'Your WiFi OTP is 100005', 1, '2026-06-17 08:14:30.000000', 'D'),
('OUTONLY006', 'S', '2026-06-17 08:15:00.000000', '2026-06-17 08:15:05.000000', '2026-06-17 08:15:20.000000', 'IMEI000006', 'SMSC-B', '96890000006', 'ANTLABS', 'admin', 'No matching antlabs log row', 2, '2026-06-17 08:15:30.000000', 'D'),
('OUTONLY007', 'S', '2026-06-17 08:16:00.000000', '2026-06-17 08:16:05.000000', '2026-06-17 08:16:20.000000', 'IMEI000007', 'SMSC-B', '96890000007', 'ANTLABS', 'admin', 'No matching antlabs log row', 2, '2026-06-17 08:16:30.000000', 'D'),
('OUTONLY008', 'S', '2026-06-17 08:17:00.000000', '2026-06-17 08:17:05.000000', '2026-06-17 08:17:20.000000', 'IMEI000008', 'SMSC-B', '96890000008', 'ANTLABS', 'admin', 'No matching antlabs log row', 2, '2026-06-17 08:17:30.000000', 'D'),
('OUTONLY009', 'S', '2026-06-17 08:18:00.000000', '2026-06-17 08:18:05.000000', '2026-06-17 08:18:20.000000', 'IMEI000009', 'SMSC-B', '96890000009', 'ANTLABS', 'admin', 'No matching antlabs log row', 2, '2026-06-17 08:18:30.000000', 'D'),
('OUTONLY010', 'S', '2026-06-17 08:19:00.000000', '2026-06-17 08:19:05.000000', '2026-06-17 08:19:20.000000', 'IMEI000010', 'SMSC-B', '96890000010', 'ANTLABS', 'admin', 'No matching antlabs log row', 2, '2026-06-17 08:19:30.000000', 'D');

INSERT INTO unsent (
  msgid, msg_type, created_dtm, process_dtm, completed_dtm, modem_imei, smsc,
  mobile_numb, msg_from, webapp_user, msg_content, remark
) VALUES
('MSG006', 'U', '2026-06-17 08:20:00.000000', '2026-06-17 08:20:05.000000', NULL, 'IMEI000011', 'SMSC-C', '96890000011', 'ANTLABS', 'admin', 'Your WiFi OTP is 100006', 'Gateway timeout'),
('MSG007', 'U', '2026-06-17 08:21:00.000000', '2026-06-17 08:21:05.000000', NULL, 'IMEI000012', 'SMSC-C', '96890000012', 'ANTLABS', 'admin', 'Your WiFi OTP is 100007', 'Invalid mobile number'),
('MSG008', 'U', '2026-06-17 08:22:00.000000', '2026-06-17 08:22:05.000000', NULL, 'IMEI000013', 'SMSC-C', '96890000013', 'ANTLABS', 'admin', 'Your WiFi OTP is 100008', 'Modem unavailable'),
('MSG009', 'U', '2026-06-17 08:23:00.000000', '2026-06-17 08:23:05.000000', NULL, 'IMEI000014', 'SMSC-C', '96890000014', 'ANTLABS', 'admin', 'Your WiFi OTP is 100009', 'SMS provider rejected message'),
('MSG010', 'U', '2026-06-17 08:24:00.000000', '2026-06-17 08:24:05.000000', NULL, 'IMEI000015', 'SMSC-C', '96890000015', 'ANTLABS', 'admin', 'Your WiFi OTP is 100010', 'Daily send limit exceeded'),
('UNSONLY001', 'S', '2026-06-17 08:25:00.000000', '2026-06-17 08:25:05.000000', NULL, 'IMEI000016', 'SMSC-D', '96890000016', 'ANTLABS', 'admin', 'No matching antlabs log row', 'No matching antlabs log row'),
('UNSONLY002', 'S', '2026-06-17 08:26:00.000000', '2026-06-17 08:26:05.000000', NULL, 'IMEI000017', 'SMSC-D', '96890000017', 'ANTLABS', 'admin', 'No matching antlabs log row', 'No matching antlabs log row'),
('UNSONLY003', 'S', '2026-06-17 08:27:00.000000', '2026-06-17 08:27:05.000000', NULL, 'IMEI000018', 'SMSC-D', '96890000018', 'ANTLABS', 'admin', 'No matching antlabs log row', 'No matching antlabs log row'),
('UNSONLY004', 'S', '2026-06-17 08:28:00.000000', '2026-06-17 08:28:05.000000', NULL, 'IMEI000019', 'SMSC-D', '96890000019', 'ANTLABS', 'admin', 'No matching antlabs log row', 'No matching antlabs log row'),
('UNSONLY005', 'S', '2026-06-17 08:29:00.000000', '2026-06-17 08:29:05.000000', NULL, 'IMEI000020', 'SMSC-D', '96890000020', 'ANTLABS', 'admin', 'No matching antlabs log row', 'No matching antlabs log row');

SELECT 'MySQL SQ SMS test tables created successfully' AS status;
