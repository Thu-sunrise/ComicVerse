-- ============================================================
-- Payment Service — V1: Wallets & Transactions
-- ============================================================

CREATE TABLE wallets (
    id          BIGSERIAL      PRIMARY KEY,
    user_id     BIGINT         NOT NULL UNIQUE,
    balance     NUMERIC(18, 4) NOT NULL DEFAULT 0.0000,
    currency    VARCHAR(10)    NOT NULL DEFAULT 'VND',
    created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wallets_user_id ON wallets (user_id);

CREATE TABLE payment_transactions (
    id              BIGSERIAL      PRIMARY KEY,
    wallet_id       BIGINT         NOT NULL REFERENCES wallets(id),
    transaction_ref VARCHAR(100)   NOT NULL UNIQUE,
    amount          NUMERIC(18, 4) NOT NULL,
    type            VARCHAR(30)    NOT NULL, -- TOPUP, PURCHASE, REFUND
    status          VARCHAR(30)    NOT NULL DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED, REFUNDED
    description     VARCHAR(255),
    created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_wallet_id ON payment_transactions (wallet_id);
CREATE INDEX idx_transactions_status    ON payment_transactions (status);

-- Idempotency
CREATE TABLE processed_event_ids (
    event_id     VARCHAR(36) PRIMARY KEY,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
