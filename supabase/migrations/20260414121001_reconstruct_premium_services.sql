-- Migration Phase 2: Premium Schema & Seed Data
-- Description: Creates new types, adds service columns, and seeds real premium data.

-- 1. Create New Types
DO $$ BEGIN
    CREATE TYPE public.service_category_enum AS ENUM (
        'kiloan', 
        'satuan', 
        'specialist', 
        'bedding', 
        'express', 
        'luxury'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.item_condition_enum AS ENUM (
        'fine', 
        'stained', 
        'torn', 
        'color_faded', 
        'button_missing',
        'delicate'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.packaging_type_enum AS ENUM (
        'folded', 
        'hanging', 
        'vacuum', 
        'premium_box'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Expand Services Table
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS category_new public.service_category_enum DEFAULT 'kiloan',
ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Migrate existing category data if any, then drop old text column and rename new one
-- (Using a temp approach to avoid conflicts)
UPDATE public.services SET category_new = 'kiloan' WHERE category_new IS NULL;
ALTER TABLE public.services DROP COLUMN IF EXISTS category;
ALTER TABLE public.services RENAME COLUMN category_new TO category;

-- 3. Expand Order Items Table
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS initial_condition public.item_condition_enum DEFAULT 'fine',
ADD COLUMN IF NOT EXISTS packaging_preference public.packaging_type_enum DEFAULT 'folded';

-- 4. Seed Real Premium Services
-- Get Jatiwaringin Outlet ID first
DO $$
DECLARE
    target_outlet_id UUID;
BEGIN
    SELECT id INTO target_outlet_id FROM public.outlets WHERE slug = 'jatiwaringin' LIMIT 1;
    IF target_outlet_id IS NULL THEN
        SELECT id INTO target_outlet_id FROM public.outlets LIMIT 1;
    END IF;

    IF target_outlet_id IS NOT NULL THEN
        -- Delete any mock services for this outlet to start fresh
        DELETE FROM public.services WHERE outlet_id = target_outlet_id;

        INSERT INTO public.services (outlet_id, name, slug, description, category, unit, price, estimated_duration_hours, icon, features, is_active, is_express, is_featured, sort_order)
        VALUES 
        (target_outlet_id, 'Cuci Lipat Premium', 'cuci-lipat-premium', 'Layanan cuci bersih higienis dengan teknik pelipatan rapi ala hotel bintang 5. Sudah termasuk parfum signature Mahira.', 'kiloan', 'kg', 8000.00, 48, '🧺', ARRAY['Cuci Detergen Premium', 'Parfum Signature Mahira', 'Lipat Rapi Presisi', 'Kemasan Reusable'], true, false, true, 1),
        
        (target_outlet_id, 'Cuci Setrika Executive', 'cuci-setrika-executive', 'Paket lengkap cuci dan setrika uap untuk hasil pakaian yang halus, lembut, dan bebas kuman. Siap pakai langsung.', 'kiloan', 'kg', 12000.00, 48, '👕', ARRAY['Setrika Uap Profesional', 'Anti Kusut & Lembut', 'Hygienic Washing', 'Premium Finish'], true, false, true, 2),
        
        (target_outlet_id, 'Deep Clean Sepatu', 'deep-clean-sepatu', 'Perawatan menyeluruh untuk berbagai jenis sepatu (Canvas, Leather, Suede). Menggunakan cairan pembersih khusus material.', 'specialist', 'pasang', 35000.00, 72, '👟', ARRAY['Deep Material Cleaning', 'Unyellowing / Whitening', 'Anti-Bacteria Treatment', 'Pewangi Khusus Sepatu'], true, false, true, 3),
        
        (target_outlet_id, 'Luxury Bag Treatment', 'luxury-bag-treatment', 'Special treatment untuk tas kesayangan Anda. Membersihkan noda eksterior dan interior dengan kehati-hatian tinggi.', 'specialist', 'item', 75000.00, 120, '👜', ARRAY['Leather Care & Polish', 'Interior Deep Clean', 'Metal Hardware Polish', 'Dustbag Protected'], true, false, false, 4),
        
        (target_outlet_id, 'Express 6 Jam (Cuci Lipat)', 'express-6-jam', 'Layanan super kilat bagi Anda yang memiliki jadwal padat. Harap drop-off sebelum jam 10 pagi.', 'express', 'kg', 15000.00, 6, '⚡', ARRAY['Selesai dalam 6 Jam', 'Prioritas Utama', 'Packing Kilat', 'Layanan Paling Cepat'], true, true, true, 5),
        
        (target_outlet_id, 'Bed Cover Luxury', 'bed-cover-luxury', 'Pencucian khusus untuk bed cover agar tetap lembut, wangi, dan bebas kutu debu. Menggunakan mesin berkapasitas besar.', 'bedding', 'item', 45000.00, 72, '🛏️', ARRAY['Mesin Kapasitas Besar', 'Anti Dust-Mite', 'Double Rinse (Bebas Deterjen)', 'Standard Packaging Besar'], true, false, false, 6);
    END IF;
END $$;
