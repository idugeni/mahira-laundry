create extension if not exists "hypopg" with schema "extensions";

create extension if not exists "index_advisor" with schema "extensions";

drop extension if exists "pg_net";

create type "public"."deposit_type" as enum ('topup', 'payment', 'refund', 'adjustment');

create type "public"."expense_category" as enum ('utilities', 'supplies', 'rent', 'salary', 'marketing', 'maintenance', 'other');

create type "public"."jenis_layanan" as enum ('PB', 'CB', 'CMB');

create type "public"."status_wbp" as enum ('aktif', 'selesai', 'ditolak');

create type "public"."tahap_proses" as enum ('verifikasi_rutan', 'upload_sdp', 'verifikasi_kanwil', 'proses_ditjen_pas', 'sk_terbit');

drop trigger if exists "trg_referral_bonus" on "public"."orders";

drop policy "audit_logs_combo_delete_policy" on "public"."audit_logs";

drop policy "audit_logs_combo_insert_policy" on "public"."audit_logs";

drop policy "audit_logs_combo_update_policy" on "public"."audit_logs";

drop policy "audit_logs_select_policy_v2" on "public"."audit_logs";

drop policy "business_packages_delete_superadmin" on "public"."business_packages";

drop policy "business_packages_insert_superadmin" on "public"."business_packages";

drop policy "business_packages_select_anon" on "public"."business_packages";

drop policy "business_packages_select_authenticated" on "public"."business_packages";

drop policy "business_packages_update_superadmin" on "public"."business_packages";

drop policy "delivery_combo_delete_policy" on "public"."delivery";

drop policy "delivery_role_select_policy" on "public"."delivery";

drop policy "delivery_role_update_policy" on "public"."delivery";

drop policy "Unified deposit transactions access" on "public"."deposit_transactions";

drop policy "Managers can manage their outlet expenses" on "public"."expenses";

drop policy "Admins can manage gallery" on "public"."gallery";

drop policy "Public can read active gallery" on "public"."gallery";

drop policy "inventory_unified_policy" on "public"."inventory";

drop policy "loyalty_combo_delete_policy" on "public"."loyalty";

drop policy "loyalty_combo_insert_policy" on "public"."loyalty";

drop policy "loyalty_combo_update_policy" on "public"."loyalty";

drop policy "loyalty_personal_select" on "public"."loyalty";

drop policy "notifications_combo_delete_policy" on "public"."notifications";

drop policy "notifications_combo_insert_policy" on "public"."notifications";

drop policy "notifications_personal_select" on "public"."notifications";

drop policy "notifications_personal_update" on "public"."notifications";

drop policy "orders_ultimate_all_policy" on "public"."orders";

drop policy "outlets_combo_delete_policy" on "public"."outlets";

drop policy "outlets_combo_insert_policy" on "public"."outlets";

drop policy "outlets_combo_update_policy" on "public"."outlets";

drop policy "outlets_public_select" on "public"."outlets";

drop policy "Profiles: anon can view limited info" on "public"."profiles";

drop policy "Profiles: public can view limited info" on "public"."profiles";

drop policy "Profiles: staff can view same outlet" on "public"."profiles";

drop policy "profiles_role_select_policy" on "public"."profiles";

drop policy "profiles_role_update_policy" on "public"."profiles";

drop policy "vouchers_combo_delete_policy" on "public"."vouchers";

drop policy "vouchers_combo_insert_policy" on "public"."vouchers";

drop policy "vouchers_combo_select_policy" on "public"."vouchers";

drop policy "vouchers_combo_update_policy" on "public"."vouchers";

drop policy "Staff can view logs" on "public"."inventory_logs";

drop policy "machines_delete" on "public"."machines";

drop policy "machines_insert" on "public"."machines";

drop policy "machines_select" on "public"."machines";

drop policy "machines_update" on "public"."machines";

drop policy "order_items_role_insert_policy" on "public"."order_items";

drop policy "payments_role_insert_policy" on "public"."payments";

drop policy "Public can view published testimonials" on "public"."testimonials";

alter table "public"."inventory_logs" drop constraint "inventory_logs_inventory_id_fkey";

alter table "public"."inventory_logs" drop constraint "inventory_logs_user_id_fkey";

alter table "public"."machines" drop constraint "machines_outlet_id_fkey";

drop function if exists "public"."award_referral_bonus"();

drop function if exists "public"."check_order_access_for_courier"(o_id uuid, u_id uuid);

drop function if exists "public"."get_order_outlet_id"(o_id uuid);

drop function if exists "public"."get_order_owner_id"(o_id uuid);

drop function if exists "public"."redeem_reward"(p_user_id uuid, p_reward_id uuid);

alter type "public"."inventory_log_type" rename to "inventory_log_type__old_version_to_be_dropped";

create type "public"."inventory_log_type" as enum ('in', 'out', 'adjustment', 'damage', 'return');

alter table "public"."inventory_logs" alter column type type "public"."inventory_log_type" using type::text::"public"."inventory_log_type";

drop type "public"."inventory_log_type__old_version_to_be_dropped";

alter table "public"."inventory_logs" alter column "new_quantity" set data type numeric(10,2) using "new_quantity"::numeric(10,2);

alter table "public"."inventory_logs" alter column "previous_quantity" set data type numeric(10,2) using "previous_quantity"::numeric(10,2);

alter table "public"."inventory_logs" alter column "quantity" set data type numeric(10,2) using "quantity"::numeric(10,2);

alter table "public"."orders" alter column "service_fee" set data type numeric(12,2) using "service_fee"::numeric(12,2);

alter table "public"."orders" alter column "tax_amount" set data type numeric(12,2) using "tax_amount"::numeric(12,2);

CREATE INDEX idx_inventory_logs_inventory_id ON public.inventory_logs USING btree (inventory_id);

CREATE INDEX idx_inventory_logs_user_id ON public.inventory_logs USING btree (user_id);

CREATE INDEX idx_machines_outlet_id ON public.machines USING btree (outlet_id);

alter table "public"."expenses" add constraint "expenses_outlet_id_outlets_id_fk" FOREIGN KEY (outlet_id) REFERENCES public.outlets(id) ON DELETE CASCADE not valid;

alter table "public"."expenses" validate constraint "expenses_outlet_id_outlets_id_fk";

alter table "public"."inventory_logs" add constraint "inventory_logs_inventory_id_inventory_id_fk" FOREIGN KEY (inventory_id) REFERENCES public.inventory(id) ON DELETE CASCADE not valid;

alter table "public"."inventory_logs" validate constraint "inventory_logs_inventory_id_inventory_id_fk";

alter table "public"."inventory_logs" add constraint "inventory_logs_user_id_profiles_id_fk" FOREIGN KEY (user_id) REFERENCES public.profiles(id) not valid;

alter table "public"."inventory_logs" validate constraint "inventory_logs_user_id_profiles_id_fk";

alter table "public"."machines" add constraint "machines_outlet_id_outlets_id_fk" FOREIGN KEY (outlet_id) REFERENCES public.outlets(id) ON DELETE CASCADE not valid;

alter table "public"."machines" validate constraint "machines_outlet_id_outlets_id_fk";

alter table "public"."orders" add constraint "orders_ironer_id_profiles_id_fk" FOREIGN KEY (ironer_id) REFERENCES public.profiles(id) not valid;

alter table "public"."orders" validate constraint "orders_ironer_id_profiles_id_fk";

alter table "public"."orders" add constraint "orders_qc_id_profiles_id_fk" FOREIGN KEY (qc_id) REFERENCES public.profiles(id) not valid;

alter table "public"."orders" validate constraint "orders_qc_id_profiles_id_fk";

alter table "public"."orders" add constraint "orders_washer_id_profiles_id_fk" FOREIGN KEY (washer_id) REFERENCES public.profiles(id) not valid;

alter table "public"."orders" validate constraint "orders_washer_id_profiles_id_fk";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION api.get_order_by_number_v1(p_order_number text)
 RETURNS TABLE(order_number text, status public.order_status, payment_status public.payment_status, created_at timestamp with time zone, outlets jsonb, items jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        o.order_number,
        o.status,
        o.payment_status,
        o.created_at,
        jsonb_build_object(
            'name', out.name,
            'address', out.address,
            'phone', out.phone
        ),
        (
            SELECT jsonb_agg(jsonb_build_object(
                'service_name', oi.service_name,
                'quantity', oi.quantity,
                'unit', oi.unit
            ))
            FROM order_items oi
            WHERE oi.order_id = o.id
        )
    FROM orders o
    JOIN outlets out ON o.outlet_id = out.id
    WHERE o.order_number = UPPER(p_order_number);
END;
$function$
;

CREATE OR REPLACE FUNCTION api.get_order_details_v1(p_identifier text)
 RETURNS TABLE(id uuid, order_number text, status public.order_status, payment_status public.payment_status, created_at timestamp with time zone, outlet_name text, items jsonb, status_logs jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_is_uuid boolean;
BEGIN
    v_is_uuid := p_identifier ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

    RETURN QUERY
    SELECT 
        o.id,
        o.order_number,
        o.status,
        o.payment_status,
        o.created_at,
        out.name as outlet_name,
        (
            SELECT jsonb_agg(jsonb_build_object(
                'service_name', oi.service_name,
                'quantity', oi.quantity,
                'unit', oi.unit,
                'subtotal', oi.subtotal,
                'is_express', oi.is_express
            ))
            FROM order_items oi
            WHERE oi.order_id = o.id
        ) as items,
        (
            SELECT jsonb_agg(jsonb_build_object(
                'status', osl.status,
                'notes', osl.notes,
                'created_at', osl.created_at
            ) ORDER BY osl.created_at DESC)
            FROM order_status_logs osl
            WHERE osl.order_id = o.id
        ) as status_logs
    FROM orders o
    JOIN outlets out ON o.outlet_id = out.id
    WHERE 
        (v_is_uuid AND o.id = p_identifier::uuid)
        OR 
        (NOT v_is_uuid AND o.order_number = UPPER(p_identifier));
END;
$function$
;

CREATE OR REPLACE FUNCTION api.get_public_stats()
 RETURNS TABLE(completed_orders_count bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    RETURN QUERY
    SELECT count(*)
    FROM orders
    WHERE status = 'completed';
END;
$function$
;

CREATE OR REPLACE FUNCTION api.submit_business_inquiry_v1(p_full_name text, p_phone text, p_email text, p_city text, p_package_id uuid, p_package_name text, p_budget_range text, p_message text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_inquiry_id uuid;
    v_superadmin_id uuid;
BEGIN
    -- Check duplicate (same phone + package within 24h)
    IF EXISTS (
        SELECT 1 FROM business_package_inquiries
        WHERE phone = p_phone 
        AND package_id = p_package_id
        AND created_at > now() - interval '24 hours'
    ) THEN
        RAISE EXCEPTION 'Duplicate inquiry';
    END IF;

    -- Insert inquiry
    INSERT INTO business_package_inquiries (
        full_name, phone, email, city, package_id, package_name, budget_range, message, status
    ) VALUES (
        p_full_name, p_phone, p_email, p_city, p_package_id, p_package_name, p_budget_range, p_message, 'new'
    ) RETURNING id INTO v_inquiry_id;

    -- Notify superadmins
    FOR v_superadmin_id IN (SELECT id FROM profiles WHERE role = 'superadmin') LOOP
        INSERT INTO notifications (user_id, type, title, body)
        VALUES (
            v_superadmin_id, 
            'system', 
            'Lead Baru: ' || p_package_name, 
            p_full_name || ' — ' || p_phone
        );
    END LOOP;

    RETURN v_inquiry_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION internal.award_referral_bonus()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  referrer_id UUID;
  order_count INTEGER;
BEGIN
  -- Cek apakah ini order pertama dan bernilai >= 500rb
  SELECT COUNT(*) INTO order_count FROM orders WHERE customer_id = NEW.customer_id AND status = 'completed';
  
  IF order_count = 1 AND NEW.total >= 500000 THEN
    -- Cari siapa yang mereferensikan user ini
    SELECT referred_by INTO referrer_id FROM profiles WHERE id = NEW.customer_id;
    
    IF referrer_id IS NOT NULL THEN
      -- Berikan 25 poin ke referrer
      INSERT INTO loyalty (user_id, order_id, points, type, description, balance_after)
      SELECT referrer_id, NEW.id, 25, 'referral', 'Bonus referral dari teman Sultan: ' || NEW.order_number, (loyalty_points + 25)
      FROM profiles WHERE id = referrer_id;

      UPDATE profiles SET loyalty_points = loyalty_points + 25 WHERE id = referrer_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION internal.check_order_access_for_courier(o_id uuid, u_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM delivery 
    WHERE order_id = o_id AND courier_id = u_id
  );
$function$
;

CREATE OR REPLACE FUNCTION internal.get_order_outlet_id(o_id uuid)
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT outlet_id FROM orders WHERE id = o_id;
$function$
;

CREATE OR REPLACE FUNCTION internal.get_order_owner_id(o_id uuid)
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT customer_id FROM orders WHERE id = o_id;
$function$
;

CREATE OR REPLACE FUNCTION internal.redeem_reward(p_user_id uuid, p_reward_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_points_cost INTEGER;
  v_current_points INTEGER;
  v_reward_name TEXT;
  v_redemption_id UUID;
BEGIN
  -- Ambil info hadiah
  SELECT name, points_cost INTO v_reward_name, v_points_cost 
  FROM rewards WHERE id = p_reward_id AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Hadiah tidak ditemukan atau tidak tersedia.');
  END IF;

  -- Cek saldo poin user
  SELECT loyalty_points INTO v_current_points FROM profiles WHERE id = p_user_id;
  
  IF v_current_points < v_points_cost THEN
    RETURN jsonb_build_object('error', 'Poin tidak cukup. Butuh ' || v_points_cost || ' poin.');
  END IF;

  -- 1. Potong Poin Profile
  UPDATE profiles SET loyalty_points = loyalty_points - v_points_cost WHERE id = p_user_id;

  -- 2. Catat di Riwayat Loyalty
  INSERT INTO loyalty (user_id, points, type, description, balance_after)
  VALUES (p_user_id, -v_points_cost, 'redeem', 'Penukaran hadiah: ' || v_reward_name, v_current_points - v_points_cost);

  -- 3. Catat Transaksi Penukaran
  INSERT INTO redemptions (user_id, reward_id, status)
  VALUES (p_user_id, p_reward_id, 'pending')
  RETURNING id INTO v_redemption_id;

  RETURN jsonb_build_object('success', true, 'redemption_id', v_redemption_id);
END;
$function$
;

CREATE OR REPLACE FUNCTION internal.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION internal.is_manager_or_above()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT role IN ('manager', 'superadmin')
  FROM profiles WHERE id = auth.uid();
$function$
;

CREATE OR REPLACE FUNCTION internal.log_audit()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (auth.uid(), 'create', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data, new_data)
    VALUES (auth.uid(), 'update', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data)
    VALUES (auth.uid(), 'delete', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$function$
;


  create policy "audit_logs_delete"
  on "public"."audit_logs"
  as permissive
  for delete
  to public
using (false);



  create policy "audit_logs_insert_v3"
  on "public"."audit_logs"
  as permissive
  for insert
  to public
with check (((( SELECT auth.uid() AS uid) IS NOT NULL) OR (( SELECT CURRENT_USER AS "current_user") = 'service_role'::name)));



  create policy "audit_logs_select"
  on "public"."audit_logs"
  as permissive
  for select
  to public
using ((internal.get_user_role() = 'superadmin'::public.user_role));



  create policy "audit_logs_update"
  on "public"."audit_logs"
  as permissive
  for update
  to public
using (false);



  create policy "business_packages_delete"
  on "public"."business_packages"
  as permissive
  for delete
  to public
using ((internal.get_user_role() = 'superadmin'::public.user_role));



  create policy "business_packages_insert"
  on "public"."business_packages"
  as permissive
  for insert
  to public
with check ((internal.get_user_role() = 'superadmin'::public.user_role));



  create policy "business_packages_select"
  on "public"."business_packages"
  as permissive
  for select
  to public
using (true);



  create policy "business_packages_update"
  on "public"."business_packages"
  as permissive
  for update
  to public
using ((internal.get_user_role() = 'superadmin'::public.user_role));



  create policy "delivery_delete"
  on "public"."delivery"
  as permissive
  for delete
  to public
using ((internal.get_user_role() = 'superadmin'::public.user_role));



  create policy "delivery_insert"
  on "public"."delivery"
  as permissive
  for insert
  to public
with check (internal.is_staff_or_above());



  create policy "delivery_select"
  on "public"."delivery"
  as permissive
  for select
  to public
using (internal.is_staff_or_above());



  create policy "delivery_update"
  on "public"."delivery"
  as permissive
  for update
  to public
using (internal.is_staff_or_above());



  create policy "deposit_delete"
  on "public"."deposit_transactions"
  as permissive
  for delete
  to public
using ((internal.get_user_role() = 'superadmin'::public.user_role));



  create policy "deposit_insert_v2"
  on "public"."deposit_transactions"
  as permissive
  for insert
  to public
with check ((( SELECT internal.get_user_role() AS get_user_role) = 'superadmin'::public.user_role));



  create policy "deposit_select_v2"
  on "public"."deposit_transactions"
  as permissive
  for select
  to public
using (((profile_id = ( SELECT auth.uid() AS uid)) OR ( SELECT internal.is_staff_or_above() AS is_staff_or_above)));



  create policy "deposit_update_v2"
  on "public"."deposit_transactions"
  as permissive
  for update
  to public
using ((( SELECT internal.get_user_role() AS get_user_role) = 'superadmin'::public.user_role));



  create policy "expenses_delete"
  on "public"."expenses"
  as permissive
  for delete
  to public
using ((internal.get_user_role() = ANY (ARRAY['manager'::public.user_role, 'superadmin'::public.user_role])));



  create policy "expenses_insert"
  on "public"."expenses"
  as permissive
  for insert
  to public
with check ((internal.is_staff_or_above() AND (outlet_id = internal.get_user_outlet())));



  create policy "expenses_select"
  on "public"."expenses"
  as permissive
  for select
  to public
using ((internal.is_staff_or_above() AND (outlet_id = internal.get_user_outlet())));



  create policy "expenses_update"
  on "public"."expenses"
  as permissive
  for update
  to public
using ((internal.is_staff_or_above() AND (outlet_id = internal.get_user_outlet())));



  create policy "Gallery admin delete"
  on "public"."gallery"
  as permissive
  for delete
  to authenticated
using ((( SELECT profiles.role
   FROM public.profiles
  WHERE (profiles.id = ( SELECT auth.uid() AS uid))) = 'superadmin'::public.user_role));



  create policy "Gallery admin insert"
  on "public"."gallery"
  as permissive
  for insert
  to authenticated
with check ((( SELECT profiles.role
   FROM public.profiles
  WHERE (profiles.id = ( SELECT auth.uid() AS uid))) = 'superadmin'::public.user_role));



  create policy "Gallery select policy"
  on "public"."gallery"
  as permissive
  for select
  to public
using (true);



  create policy "inventory_delete_v2"
  on "public"."inventory"
  as permissive
  for delete
  to public
using ((internal.get_user_role() = ANY (ARRAY['manager'::public.user_role, 'superadmin'::public.user_role])));



  create policy "inventory_insert_v3"
  on "public"."inventory"
  as permissive
  for insert
  to public
with check (( SELECT internal.is_staff_or_above() AS is_staff_or_above));



  create policy "inventory_select_v3"
  on "public"."inventory"
  as permissive
  for select
  to public
using ((( SELECT internal.is_staff_or_above() AS is_staff_or_above) AND (outlet_id = ( SELECT internal.get_user_outlet() AS get_user_outlet))));



  create policy "inventory_update_v3"
  on "public"."inventory"
  as permissive
  for update
  to public
using (( SELECT internal.is_staff_or_above() AS is_staff_or_above));



  create policy "loyalty_delete"
  on "public"."loyalty"
  as permissive
  for delete
  to public
using ((internal.get_user_role() = 'superadmin'::public.user_role));



  create policy "loyalty_insert"
  on "public"."loyalty"
  as permissive
  for insert
  to public
with check ((internal.get_user_role() = 'superadmin'::public.user_role));



  create policy "loyalty_select"
  on "public"."loyalty"
  as permissive
  for select
  to public
using (((user_id = ( SELECT auth.uid() AS uid)) OR internal.is_staff_or_above()));



  create policy "loyalty_update"
  on "public"."loyalty"
  as permissive
  for update
  to public
using ((internal.get_user_role() = 'superadmin'::public.user_role));



  create policy "notifications_delete"
  on "public"."notifications"
  as permissive
  for delete
  to public
using ((user_id = ( SELECT auth.uid() AS uid)));



  create policy "notifications_insert"
  on "public"."notifications"
  as permissive
  for insert
  to public
with check (internal.is_staff_or_above());



  create policy "notifications_select"
  on "public"."notifications"
  as permissive
  for select
  to public
using ((user_id = ( SELECT auth.uid() AS uid)));



  create policy "notifications_update"
  on "public"."notifications"
  as permissive
  for update
  to public
using ((user_id = ( SELECT auth.uid() AS uid)));



  create policy "orders_delete_v2"
  on "public"."orders"
  as permissive
  for delete
  to public
using ((internal.get_user_role() = 'superadmin'::public.user_role));



  create policy "orders_insert_v3"
  on "public"."orders"
  as permissive
  for insert
  to public
with check (((customer_id = ( SELECT auth.uid() AS uid)) OR (( SELECT internal.get_user_role() AS get_user_role) = ANY (ARRAY['kasir'::public.user_role, 'manager'::public.user_role, 'superadmin'::public.user_role]))));



  create policy "orders_select_v3"
  on "public"."orders"
  as permissive
  for select
  to public
using (((customer_id = ( SELECT auth.uid() AS uid)) OR (( SELECT internal.is_staff_or_above() AS is_staff_or_above) AND (outlet_id = ( SELECT internal.get_user_outlet() AS get_user_outlet))) OR (( SELECT internal.get_user_role() AS get_user_role) = 'superadmin'::public.user_role)));



  create policy "orders_update_v3"
  on "public"."orders"
  as permissive
  for update
  to public
using ((((customer_id = ( SELECT auth.uid() AS uid)) AND (status = 'pending'::public.order_status)) OR (( SELECT internal.is_staff_or_above() AS is_staff_or_above) AND (outlet_id = ( SELECT internal.get_user_outlet() AS get_user_outlet))) OR (( SELECT internal.get_user_role() AS get_user_role) = 'superadmin'::public.user_role)));



  create policy "outlets_delete"
  on "public"."outlets"
  as permissive
  for delete
  to public
using ((internal.get_user_role() = 'superadmin'::public.user_role));



  create policy "outlets_insert"
  on "public"."outlets"
  as permissive
  for insert
  to public
with check ((internal.get_user_role() = 'superadmin'::public.user_role));



  create policy "outlets_select"
  on "public"."outlets"
  as permissive
  for select
  to public
using (true);



  create policy "outlets_update"
  on "public"."outlets"
  as permissive
  for update
  to public
using ((internal.get_user_role() = ANY (ARRAY['manager'::public.user_role, 'superadmin'::public.user_role])));



  create policy "profiles_delete"
  on "public"."profiles"
  as permissive
  for delete
  to public
using ((internal.get_user_role() = 'superadmin'::public.user_role));



  create policy "profiles_insert_v2"
  on "public"."profiles"
  as permissive
  for insert
  to public
with check ((( SELECT internal.get_user_role() AS get_user_role) = 'superadmin'::public.user_role));



  create policy "profiles_select_v2"
  on "public"."profiles"
  as permissive
  for select
  to public
using (((id = ( SELECT auth.uid() AS uid)) OR ( SELECT internal.is_staff_or_above() AS is_staff_or_above) OR (( SELECT internal.get_user_role() AS get_user_role) = 'superadmin'::public.user_role)));



  create policy "profiles_update_v2"
  on "public"."profiles"
  as permissive
  for update
  to public
using (((id = ( SELECT auth.uid() AS uid)) OR (( SELECT internal.get_user_role() AS get_user_role) = ANY (ARRAY['manager'::public.user_role, 'superadmin'::public.user_role]))))
with check (((id = ( SELECT auth.uid() AS uid)) OR (( SELECT internal.get_user_role() AS get_user_role) = ANY (ARRAY['manager'::public.user_role, 'superadmin'::public.user_role]))));



  create policy "vouchers_delete"
  on "public"."vouchers"
  as permissive
  for delete
  to public
using ((internal.get_user_role() = 'superadmin'::public.user_role));



  create policy "vouchers_insert"
  on "public"."vouchers"
  as permissive
  for insert
  to public
with check ((internal.get_user_role() = ANY (ARRAY['manager'::public.user_role, 'superadmin'::public.user_role])));



  create policy "vouchers_select"
  on "public"."vouchers"
  as permissive
  for select
  to public
using (true);



  create policy "vouchers_update"
  on "public"."vouchers"
  as permissive
  for update
  to public
using ((internal.get_user_role() = ANY (ARRAY['manager'::public.user_role, 'superadmin'::public.user_role])));



  create policy "Staff can view logs"
  on "public"."inventory_logs"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = ANY (ARRAY['superadmin'::public.user_role, 'manager'::public.user_role, 'kasir'::public.user_role]))))));



  create policy "machines_delete"
  on "public"."machines"
  as permissive
  for delete
  to public
using ((internal.get_user_role() = 'superadmin'::public.user_role));



  create policy "machines_insert"
  on "public"."machines"
  as permissive
  for insert
  to public
with check ((internal.get_user_role() = ANY (ARRAY['manager'::public.user_role, 'superadmin'::public.user_role])));



  create policy "machines_select"
  on "public"."machines"
  as permissive
  for select
  to public
using (true);



  create policy "machines_update"
  on "public"."machines"
  as permissive
  for update
  to public
using ((internal.get_user_role() = ANY (ARRAY['manager'::public.user_role, 'superadmin'::public.user_role])));



  create policy "order_items_role_insert_policy"
  on "public"."order_items"
  as permissive
  for insert
  to authenticated
with check (((internal.get_order_owner_id(order_id) = ( SELECT auth.uid() AS uid)) OR (internal.get_user_role() = 'superadmin'::public.user_role) OR ((internal.get_user_role() = ANY (ARRAY['manager'::public.user_role, 'kasir'::public.user_role])) AND (internal.get_order_outlet_id(order_id) = internal.get_user_outlet()))));



  create policy "payments_role_insert_policy"
  on "public"."payments"
  as permissive
  for insert
  to authenticated
with check (((internal.get_order_owner_id(order_id) = ( SELECT auth.uid() AS uid)) OR (internal.get_user_role() = 'superadmin'::public.user_role) OR ((internal.get_user_role() = ANY (ARRAY['manager'::public.user_role, 'kasir'::public.user_role])) AND (internal.get_order_outlet_id(order_id) = internal.get_user_outlet()))));



  create policy "Public can view published testimonials"
  on "public"."testimonials"
  as permissive
  for select
  to anon
using ((is_published = true));


CREATE TRIGGER trg_referral_bonus AFTER UPDATE OF status ON public.orders FOR EACH ROW WHEN (((new.status = 'completed'::public.order_status) AND (old.status <> 'completed'::public.order_status))) EXECUTE FUNCTION internal.award_referral_bonus();

drop policy "Avatars: staff select" on "storage"."objects";


  create policy "Admin Delete Access"
  on "storage"."objects"
  as permissive
  for delete
  to public
using (((bucket_id = ANY (ARRAY['avatars'::text, 'gallery'::text, 'outlet-images'::text, 'receipts'::text])) AND (auth.role() = 'authenticated'::text)));



  create policy "Authenticated Selective Access"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = ANY (ARRAY['avatars'::text, 'gallery'::text, 'outlet-images'::text, 'receipts'::text])) AND ((owner = ( SELECT auth.uid() AS uid)) OR (( SELECT profiles.role
   FROM public.profiles
  WHERE (profiles.id = ( SELECT auth.uid() AS uid))) = 'superadmin'::public.user_role))));



  create policy "Authenticated Upload"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = ANY (ARRAY['avatars'::text, 'gallery'::text, 'outlet-images'::text, 'receipts'::text])) AND (( SELECT auth.role() AS role) = 'authenticated'::text)));



  create policy "avatars_staff_select"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'avatars'::text) AND internal.is_staff_or_above()));



