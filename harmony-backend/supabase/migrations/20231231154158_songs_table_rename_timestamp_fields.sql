alter table "public"."songs" drop column "createdat";

alter table "public"."songs" drop column "lastmodifiedat";

alter table "public"."songs" add column "created" timestamp without time zone;

alter table "public"."songs" add column "lastmodified" timestamp without time zone;


