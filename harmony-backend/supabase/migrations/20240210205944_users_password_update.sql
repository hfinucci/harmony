alter table "public"."members" drop constraint "members_org_id_fkey";

alter table "public"."members" drop constraint "members_user_id_fkey";

alter table "public"."members" drop constraint "members_pkey";

drop index if exists "public"."members_pkey";

alter table "public"."members" drop column "org_id";

alter table "public"."songs" alter column "org" drop not null;

alter table "public"."users" add column "password" character varying(80);

alter table "public"."members" add constraint "members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE NOT VALID not valid;

alter table "public"."members" validate constraint "members_user_id_fkey";


