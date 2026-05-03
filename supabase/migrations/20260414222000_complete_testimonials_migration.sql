-- Complete migration of mock testimonials to database
DO $$
DECLARE
    u_id UUID;
    profile_count INTEGER;
BEGIN
    -- Count available profiles
    SELECT count(*) INTO profile_count FROM profiles;

    -- We need at least 1 profile to link testimonials to.
    -- If there are no profiles, we can't insert because of the NOT NULL user_id constraint.
    -- In a real app, testimonials are created by real users.
    -- For this migration, we'll use existing profiles.

    IF profile_count > 0 THEN
        -- 1. Budi Santoso
        SELECT id INTO u_id FROM profiles LIMIT 1 OFFSET 0;
        UPDATE profiles SET full_name = 'Budi Santoso' WHERE id = u_id;
        INSERT INTO testimonials (user_id, content, rating, is_published)
        VALUES (u_id, 'Layanan Mahira sangat luar biasa! Cucian bersih, wangi, dan antar-jemputnya sangat tepat waktu. Sangat merekomendasikan layanan Express 6 jamnya.', 5, true)
        ON CONFLICT DO NOTHING;

        -- 2. Siti Aminah
        IF profile_count > 1 THEN
            SELECT id INTO u_id FROM profiles LIMIT 1 OFFSET 1;
        ELSE
            SELECT id INTO u_id FROM profiles LIMIT 1 OFFSET 0;
        END IF;
        UPDATE profiles SET full_name = 'Siti Aminah' WHERE id = u_id;
        INSERT INTO testimonials (user_id, content, rating, is_published)
        VALUES (u_id, 'Baru kali ini ketemu laundry yang seprofesional ini di Jakarta. Dashboard pelanggannya keren banget, bisa track order secara real-time. Mantap!', 5, true)
        ON CONFLICT DO NOTHING;

        -- 3. Andi Wijaya
        IF profile_count > 2 THEN
            SELECT id INTO u_id FROM profiles LIMIT 1 OFFSET 2;
        ELSE
            SELECT id INTO u_id FROM profiles LIMIT 1 OFFSET 0;
        END IF;
        UPDATE profiles SET full_name = 'Andi Wijaya' WHERE id = u_id;
        INSERT INTO testimonials (user_id, content, rating, is_published)
        VALUES (u_id, 'Aplikasi yang sangat membantu buat saya yang sibuk. Tinggal klik-klik di web, kurir datang jemput. Hasil cuciannya rapi banget!', 5, true)
        ON CONFLICT DO NOTHING;

        -- 4. Rizky Pratama
        IF profile_count > 3 THEN
            SELECT id INTO u_id FROM profiles LIMIT 1 OFFSET 3;
        ELSE
            SELECT id INTO u_id FROM profiles LIMIT 1 OFFSET 0;
        END IF;
        UPDATE profiles SET full_name = 'Rizky Pratama' WHERE id = u_id;
        INSERT INTO testimonials (user_id, content, rating, is_published)
        VALUES (u_id, 'Sangat puas dengan layanan jas-nya. Penanganannya sangat hati-hati dan hasilnya seperti baru beli lagi. Customer servicenya juga sangat sopan.', 5, true)
        ON CONFLICT DO NOTHING;

        -- 5. Dewi Lestari
        IF profile_count > 4 THEN
            SELECT id INTO u_id FROM profiles LIMIT 1 OFFSET 4;
        ELSE
            SELECT id INTO u_id FROM profiles LIMIT 1 OFFSET 0;
        END IF;
        UPDATE profiles SET full_name = 'Dewi Lestari' WHERE id = u_id;
        INSERT INTO testimonials (user_id, content, rating, is_published)
        VALUES (u_id, 'Berlangganan di Mahira sejak 3 bulan lalu dan tidak pernah mengecewakan. Poin loyaltinya lumayan banget buat dapet potongan harga.', 5, true)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
