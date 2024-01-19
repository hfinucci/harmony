alter table "public"."members" drop constraint "members_org_fkey";

alter table "public"."members" drop constraint "members_user_fkey";

alter table "public"."members" drop constraint "members_pkey";

drop index if exists "public"."members_pkey";

alter table "public"."members" drop column "org";

alter table "public"."members" drop column "user";

alter table "public"."members" add column "org_id" bigint not null;

alter table "public"."members" add column "user_id" bigint not null;

CREATE UNIQUE INDEX members_pkey ON public.members USING btree (user_id, org_id);

alter table "public"."members" add constraint "members_pkey" PRIMARY KEY using index "members_pkey";

alter table "public"."members" add constraint "members_org_id_fkey" FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."members" validate constraint "members_org_id_fkey";

alter table "public"."members" add constraint "members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."members" validate constraint "members_user_id_fkey";


