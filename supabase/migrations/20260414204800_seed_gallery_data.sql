-- Seed file for Gallery Table with placeholder Unsplash images
-- Memasukkan 10 foto placeholder berkualitas tinggi terkait Laundry

INSERT INTO public.gallery (title, description, image_url, category, sort_order)
VALUES
  (
    'Fasilitas Mesin Modern', 
    'Kami menggunakan mesin cuci berkapasitas besar dan teknologi mutakhir untuk hasil cuci yang optimal.', 
    'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=800&q=80', 
    'Fasilitas', 
    1
  ),
  (
    'Baju Bersih & Rapi', 
    'Setiap pakaian dilipat dengan sangat teliti dan wangi sepanjang hari.', 
    'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80', 
    'Layanan', 
    2
  ),
  (
    'Hygienic Wash', 
    'Penggunaan deterjen ramah lingkungan yang aman untuk pakaian kulit sensitif dan bayi.', 
    'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80', 
    'Proses Cuci', 
    3
  ),
  (
    'Proses Setrika Premium', 
    'Menggunakan mesin setrika uap khusus agar serat kain tetap awet dan anti-kusut.', 
    'https://images.unsplash.com/photo-1626808642875-0aa545482dfb?auto=format&fit=crop&w=800&q=80', 
    'Layanan', 
    4
  ),
  (
    'Perawatan Pakaian Khusus', 
    'Pakaian digantung dengan benar untuk mempertahankan bentuk aslinya.', 
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80', 
    'Layanan', 
    5
  ),
  (
    'Garansi Hasil Sempurna', 
    'Kepuasan Anda adalah prioritas kami. Pakaian yang wangi bagaikan baru kembali.', 
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80', 
    'Hasil Cucian', 
    6
  ),
  (
    'Pemisahan Pakaian Ketat', 
    'Warna pakaian dipisah sebelum proses cuci agar tidak pernah terjadi kelunturan.', 
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80', 
    'Proses Cuci', 
    7
  ),
  (
    'Dry Cleaning Eksklusif', 
    'Perawatan khusus untuk jas, gaun, dan bahan sensitif dengan metode dry clean profesional.', 
    'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=800&q=80', 
    'Promo Khusus', 
    8
  ),
  (
    'Jas & Setelan Formal', 
    'Penyelesaian dan pengemasan premium untuk menjaga kehormatan setelan terbaik Anda.', 
    'https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?auto=format&fit=crop&w=800&q=80', 
    'Hasil Cucian', 
    9
  ),
  (
    'Layanan Antar-Jemput', 
    'Customer service & kurir kami siap menjemput cucian tepat di depan pintu rumah Anda.', 
    'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80',
    'Layanan', 
    10
  );
