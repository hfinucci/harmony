alter table "public"."songs" drop constraint "songs_album_fkey";

alter table "public"."songs" add constraint "songs_album_fkey" FOREIGN KEY (album) REFERENCES albums(id) ON DELETE SET NULL not valid;

alter table "public"."songs" validate constraint "songs_album_fkey";


