alter table "public"."employees" drop constraint "employees_pkey";

alter table "public"."users" drop constraint "users_pkey";

drop index if exists "public"."users_pkey";

drop index if exists "public"."employees_pkey";

drop table "public"."employees";

alter table "public"."users" add column "email" text;

alter table "public"."users" add column "name" text;

alter table "public"."users" alter column "created_at" drop not null;

alter table "public"."users" alter column "id" set generated always;

alter table "public"."users" disable row level security;

CREATE UNIQUE INDEX employees_pkey ON public.users USING btree (id);

alter table "public"."users" add constraint "employees_pkey" PRIMARY KEY using index "employees_pkey";


