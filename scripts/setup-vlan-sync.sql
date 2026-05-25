---POSTGRESQL SETUP SCRIPT FOR VLAN SESSION SYNC TABLE
DROP TABLE IF EXISTS vlan_session_sync;

CREATE TABLE vlan_session_sync (
    id BIGSERIAL PRIMARY KEY,

    site_token TEXT,

    session_id TEXT NOT NULL,
    local_id TEXT,
    nas_ip_address TEXT,

    vlan TEXT,

    duration INTEGER,
    download_bytes BIGINT,
    upload_bytes BIGINT,

    mac_address TEXT,
    ip_address TEXT,

    device TEXT,
    browser TEXT,
    os TEXT,

    terminate_cause TEXT,

    session_start TIMESTAMPTZ NOT NULL,
    session_stop TIMESTAMPTZ,
    session_updated TIMESTAMPTZ,

    raw_payload JSONB,

    synced_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT uq_vlan_session_sync UNIQUE (session_id, session_start)
);

CREATE INDEX idx_vlan_session_sync_session_updated
ON vlan_session_sync(session_updated);

CREATE INDEX idx_vlan_session_sync_session_start
ON vlan_session_sync(session_start);

CREATE INDEX idx_vlan_session_sync_session_stop
ON vlan_session_sync(session_stop);

CREATE INDEX idx_vlan_session_sync_vlan
ON vlan_session_sync(vlan);

CREATE INDEX idx_vlan_session_sync_synced_at
ON vlan_session_sync(synced_at);