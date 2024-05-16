alter table "public"."members" add column "org_id" bigint not null;

CREATE UNIQUE INDEX members_pkey ON public.members USING btree (org_id, user_id);

alter table "public"."members" add constraint "members_pkey" PRIMARY KEY using index "members_pkey";

alter table "public"."members" add constraint "members_org_id_fkey" FOREIGN KEY (org_id) REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."members" validate constraint "members_org_id_fkey";


