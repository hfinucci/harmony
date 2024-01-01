alter table "public"."users" add column "auth_id" uuid;

alter table "public"."users" add column "image" text;

CREATE UNIQUE INDEX users_auth_id_key ON public.users USING btree (auth_id);

alter table "public"."users" add constraint "users_auth_id_key" UNIQUE using index "users_auth_id_key";


