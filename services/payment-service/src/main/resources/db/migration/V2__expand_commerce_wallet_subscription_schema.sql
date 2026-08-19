ALTER TABLE wallets ADD COLUMN IF NOT EXISTS deposited_balance NUMERIC(19,4) NOT NULL DEFAULT 0;
ALTER TABLE wallets ADD COLUMN IF NOT EXISTS earning_pending_balance NUMERIC(19,4) NOT NULL DEFAULT 0;
ALTER TABLE wallets ADD COLUMN IF NOT EXISTS earning_available_balance NUMERIC(19,4) NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS revenue_policies (
    id BIGSERIAL PRIMARY KEY,
    author_percent NUMERIC(5,2) NOT NULL,
    platform_percent NUMERIC(5,2) NOT NULL,
    effective_from TIMESTAMPTZ NOT NULL,
    effective_to TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (author_percent + platform_percent = 100)
);
CREATE TABLE IF NOT EXISTS purchases (
    id BIGSERIAL PRIMARY KEY,
    buyer_id BIGINT NOT NULL,
    chapter_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    chapter_price NUMERIC(19,4) NOT NULL,
    transaction_fee NUMERIC(19,4) NOT NULL DEFAULT 0,
    total_paid NUMERIC(19,4) NOT NULL,
    author_share_percent NUMERIC(5,2) NOT NULL,
    platform_share_percent NUMERIC(5,2) NOT NULL,
    author_amount NUMERIC(19,4) NOT NULL,
    platform_amount NUMERIC(19,4) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED',
    purchased_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_purchases_buyer ON purchases(buyer_id, purchased_at);
CREATE INDEX IF NOT EXISTS idx_purchases_chapter ON purchases(chapter_id);
CREATE INDEX IF NOT EXISTS idx_purchases_author ON purchases(author_id, purchased_at);
CREATE TABLE IF NOT EXISTS refunds (
    id BIGSERIAL PRIMARY KEY,
    purchase_id BIGINT NOT NULL REFERENCES purchases(id),
    user_id BIGINT NOT NULL,
    amount NUMERIC(19,4) NOT NULL,
    reason VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    requested_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    UNIQUE (purchase_id)
);
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id BIGSERIAL PRIMARY KEY,
    wallet_id BIGINT NOT NULL REFERENCES wallets(id),
    type VARCHAR(50) NOT NULL,
    direction VARCHAR(10) NOT NULL,
    amount NUMERIC(19,4) NOT NULL,
    balance_type VARCHAR(20) NOT NULL,
    reference_type VARCHAR(50),
    reference_id BIGINT,
    status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED',
    description VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS deposits (
    id BIGSERIAL PRIMARY KEY,
    wallet_id BIGINT NOT NULL REFERENCES wallets(id),
    amount NUMERIC(19,4) NOT NULL,
    payment_provider VARCHAR(50) NOT NULL,
    provider_transaction_id VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (payment_provider, provider_transaction_id)
);
CREATE TABLE IF NOT EXISTS payout_accounts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_account_id VARCHAR(255),
    account_name VARCHAR(150),
    account_number_masked VARCHAR(100),
    bank_code VARCHAR(50),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS withdrawals (
    id BIGSERIAL PRIMARY KEY,
    wallet_id BIGINT NOT NULL REFERENCES wallets(id),
    payout_account_id BIGINT NOT NULL REFERENCES payout_accounts(id),
    amount NUMERIC(19,4) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    requested_at TIMESTAMPTZ NOT NULL,
    available_at TIMESTAMPTZ NOT NULL,
    processed_at TIMESTAMPTZ,
    provider_transaction_id VARCHAR(255),
    failure_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS premium_plans (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    billing_period VARCHAR(20) NOT NULL,
    price NUMERIC(19,4) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    benefits JSONB,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL REFERENCES premium_plans(id),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    started_at TIMESTAMPTZ NOT NULL,
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS subscription_renewals (
    id BIGSERIAL PRIMARY KEY,
    subscription_id BIGINT NOT NULL REFERENCES subscriptions(id),
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    amount NUMERIC(19,4) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    renewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS subscription_renewal_notifications (
    id BIGSERIAL PRIMARY KEY,
    subscription_id BIGINT NOT NULL REFERENCES subscriptions(id),
    renewal_id BIGINT REFERENCES subscription_renewals(id),
    notification_type VARCHAR(20) NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (subscription_id, renewal_id, notification_type)
);

CREATE TABLE IF NOT EXISTS user_purchases_projection (
    user_id BIGINT NOT NULL,
    purchase_id BIGINT NOT NULL,
    chapter_id BIGINT NOT NULL,
    story_id BIGINT NOT NULL,
    story_title VARCHAR(255),
    chapter_title VARCHAR(255),
    purchased_at TIMESTAMPTZ NOT NULL,
    access_status VARCHAR(30),
    PRIMARY KEY (user_id, purchase_id)
);
CREATE TABLE IF NOT EXISTS wallet_transactions_projection (
    transaction_id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    amount NUMERIC(19,4) NOT NULL,
    direction VARCHAR(10) NOT NULL,
    balance_type VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL,
    description VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS author_revenue_projection (
    author_id BIGINT PRIMARY KEY,
    total_sales NUMERIC(19,4) DEFAULT 0,
    total_refunds NUMERIC(19,4) DEFAULT 0,
    pending_earning NUMERIC(19,4) DEFAULT 0,
    available_earning NUMERIC(19,4) DEFAULT 0,
    total_withdrawn NUMERIC(19,4) DEFAULT 0,
    current_period_revenue NUMERIC(19,4) DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS platform_revenue_projection (
    revenue_date DATE PRIMARY KEY,
    gross_sales NUMERIC(19,4) DEFAULT 0,
    refund_amount NUMERIC(19,4) DEFAULT 0,
    net_sales NUMERIC(19,4) DEFAULT 0,
    author_revenue NUMERIC(19,4) DEFAULT 0,
    platform_revenue NUMERIC(19,4) DEFAULT 0,
    transaction_fee NUMERIC(19,4) DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS user_subscription_projection (
    user_id BIGINT PRIMARY KEY,
    subscription_id BIGINT,
    plan_id BIGINT,
    plan_name VARCHAR(100),
    status VARCHAR(30),
    auto_renew BOOLEAN,
    current_period_end TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL
);
