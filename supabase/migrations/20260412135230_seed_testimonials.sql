-- Seed Testimonials using existing users
DO $$
DECLARE
    user1_id UUID;
    user2_id UUID;
    user3_id UUID;
BEGIN
    -- Get some existing user IDs
    SELECT id INTO user1_id FROM profiles LIMIT 1 OFFSET 0;
    SELECT id INTO user2_id FROM profiles LIMIT 1 OFFSET 1;
    SELECT id INTO user3_id FROM profiles LIMIT 1 OFFSET 2;

    -- Insert seed data if users exist
    IF user1_id IS NOT NULL THEN
        INSERT INTO testimonials (user_id, content, rating, is_published)
        VALUES (user1_id, 'Layanan Mahira sangat luar biasa! Cucian bersih, wangi, dan antar-jemputnya sangat tepat waktu. Sangat merekomendasikan layanan Express 6 jamnya.', 5, true);
    END IF;

    IF user2_id IS NOT NULL THEN
        INSERT INTO testimonials (user_id, content, rating, is_published)
        VALUES (user2_id, 'Baru kali ini ketemu laundry yang seprofesional ini di Jakarta. Dashboard pelanggannya keren banget, bisa track order secara real-time. Mantap!', 5, true);
    END IF;

    IF user3_id IS NOT NULL THEN
        INSERT INTO testimonials (user_id, content, rating, is_published)
        VALUES (user3_id, 'Aplikasi yang sangat membantu buat saya yang sibuk. Tinggal klik-klik di web, kurir datang jemput. Hasil cuciannya rapi banget!', 5, true);
    END IF;
END $$;
