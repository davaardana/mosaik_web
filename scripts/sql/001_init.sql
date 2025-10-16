/* Roles and Users */
create table if not exists roles (
  id serial primary key,
  code text unique not null check (code in ('SUPER_ADMIN','MANAGER','NOC')),
  name text not null
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  name text not null,
  role_id int not null references roles(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_users_role on users(role_id);

/* Customers */
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  pusat text not null,
  cabang text,
  daerah text,
  sid text,
  isp text,
  telp_pic text,
  call_center text,
  bandwidth text,
  id_pelanggan text,
  phone_whatsapp text,
  alamat text,
  created_at timestamptz not null default now()
);

create index if not exists idx_customers_pusat on customers(pusat);
create index if not exists idx_customers_sid on customers(sid);

/* Tickets */
create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  number text not null,
  customer_id uuid references customers(id),
  lokasi_trouble text,
  problem text,
  solusi text,
  status text not null default 'OPEN' check (status in ('OPEN','IN_PROGRESS','RESOLVED')),
  created_by uuid references users(id),
  created_by_role text not null check (created_by_role in ('SUPER_ADMIN','MANAGER','NOC')),
  gate_opened_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists idx_tickets_number on tickets(number);
create index if not exists idx_tickets_status on tickets(status);

/* Ticket Photos */
create table if not exists ticket_photos (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  url text not null,
  created_at timestamptz not null default now()
);

/* Events / Logs */
create table if not exists ticket_events (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  user_id uuid references users(id),
  action text not null, /* CREATE, UPDATE, RESOLVE */
  detail jsonb,
  created_at timestamptz not null default now()
);

/* Notifications to NOC */
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  to_role text not null check (to_role in ('NOC')),
  message text not null,
  unread boolean not null default true,
  created_at timestamptz not null default now()
);

/* Reports: downtime computed in query */
-- example:
-- select number, extract(epoch from (resolved_at - gate_opened_at))/60 as downtime_min from tickets;
