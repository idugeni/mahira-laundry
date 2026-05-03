drop trigger if exists "update_shifts_updated_at" on "public"."shifts";

drop policy "shifts_combo_delete_policy" on "public"."shifts";

drop policy "shifts_combo_insert_policy" on "public"."shifts";

drop policy "shifts_role_select_policy" on "public"."shifts";

drop policy "shifts_role_update_policy" on "public"."shifts";

revoke delete on table "public"."shifts" from "anon";

revoke insert on table "public"."shifts" from "anon";

revoke references on table "public"."shifts" from "anon";

revoke select on table "public"."shifts" from "anon";

revoke trigger on table "public"."shifts" from "anon";

revoke truncate on table "public"."shifts" from "anon";

revoke update on table "public"."shifts" from "anon";

revoke delete on table "public"."shifts" from "authenticated";

revoke insert on table "public"."shifts" from "authenticated";

revoke references on table "public"."shifts" from "authenticated";

revoke select on table "public"."shifts" from "authenticated";

revoke trigger on table "public"."shifts" from "authenticated";

revoke truncate on table "public"."shifts" from "authenticated";

revoke update on table "public"."shifts" from "authenticated";

revoke delete on table "public"."shifts" from "service_role";

revoke insert on table "public"."shifts" from "service_role";

revoke references on table "public"."shifts" from "service_role";

revoke select on table "public"."shifts" from "service_role";

revoke trigger on table "public"."shifts" from "service_role";

revoke truncate on table "public"."shifts" from "service_role";

revoke update on table "public"."shifts" from "service_role";

alter table "public"."shifts" drop constraint "shifts_outlet_id_fkey";

alter table "public"."shifts" drop constraint "shifts_staff_id_fkey";

alter table "public"."shifts" drop constraint "shifts_staff_id_shift_date_shift_type_key";

alter table "public"."shifts" drop constraint "shifts_pkey";

drop index if exists "public"."idx_shifts_outlet_id";

drop index if exists "public"."shifts_pkey";

drop index if exists "public"."shifts_staff_id_shift_date_shift_type_key";

drop table "public"."shifts";


