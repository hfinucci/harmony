create sequence "public"."songs_id_seq";

create table "public"."songs" (
    "id" integer not null default nextval('songs_id_seq'::regclass),
    "name" character varying(100),
    "author" character varying(100),
    "createdat" timestamp without time zone,
    "lastmodifiedat" timestamp without time zone
);


alter sequence "public"."songs_id_seq" owned by "public"."songs"."id";

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";


