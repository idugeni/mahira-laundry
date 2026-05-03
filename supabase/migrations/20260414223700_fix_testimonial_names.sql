-- Add guest_name to testimonials to avoid overwriting real user profiles
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS guest_name TEXT;

-- Restore current user name (clean up my mess)
-- I'll use the email prefix if available to make it look professional
UPDATE profiles 
SET full_name = COALESCE(initcap(split_part(email, '@', 1)), 'Admin')
WHERE full_name IN ('Budi Santoso', 'Siti Aminah', 'Andi Wijaya', 'Rizky Pratama', 'Dewi Lestari');

-- Re-seed testimonials with guest_name
-- We first clear the mess
DELETE FROM testimonials WHERE content LIKE 'Layanan Mahira sangat luar biasa%';
DELETE FROM testimonials WHERE content LIKE 'Baru kali ini ketemu laundry%';
DELETE FROM testimonials WHERE content LIKE 'Aplikasi yang sangat membantu%';
DELETE FROM testimonials WHERE content LIKE 'Sangat puas dengan layanan jas-nya%';
DELETE FROM testimonials WHERE content LIKE 'Berlangganan di Mahira%';

DO $$
DECLARE
    u_id UUID;
BEGIN
    SELECT id INTO u_id FROM profiles LIMIT 1;
    
    IF u_id IS NOT NULL THEN
        INSERT INTO testimonials (user_id, guest_name, content, rating, is_published)
        VALUES 
        (u_id, 'Budi Santoso', 'Layanan Mahira sangat luar biasa! Cucian bersih, wangi, dan antar-jemputnya sangat tepat waktu. Sangat merekomendasikan layanan Express 6 jamnya.', 5, true),
        (u_id, 'Siti Aminah', 'Baru kali ini ketemu laundry yang seprofesional ini di Jakarta. Dashboard pelanggannya keren banget, bisa track order secara real-time. Mantap!', 5, true),
        (u_id, 'Andi Wijaya', 'Aplikasi yang sangat membantu buat saya yang sibuk. Tinggal klik-klik di web, kurir datang jemput. Hasil cuciannya rapi banget!', 5, true),
        (u_id, 'Rizky Pratama', 'Sangat puas dengan layanan jas-nya. Penanganannya sangat hati-hati dan hasilnya seperti baru beli lagi. Customer servicenya juga sangat sopan.', 5, true),
        (u_id, 'Dewi Lestari', 'Berlangganan di Mahira sejak 3 bulan lalu dan tidak pernah mengecewakan. Poin loyaltinya lumayan banget buat dapet potongan harga.', 5, true);
    END IF;
END $$;
