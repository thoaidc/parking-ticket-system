
CREATE TABLE ticket (
    id INTEGER PRIMARY KEY,
    uid TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_by TEXT NOT NULL DEFAULT 'SYSTEM',
    created_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT DEFAULT 'SYSTEM',
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ticket_scan_log (
    id INTEGER PRIMARY KEY,
    uid TEXT NOT NULL,
    type TEXT NOT NULL,
    result TEXT NOT NULL,
    message TEXT,
    scan_time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
