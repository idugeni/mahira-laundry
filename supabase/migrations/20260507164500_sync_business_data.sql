-- Sync primary outlet data with official Google Maps information
UPDATE outlets 
SET address = 'Jl. Cempaka Baru No.109, RT.002/RW.05, Jaticempaka, Kec. Pd. Gede, Kota Bks, Jawa Barat 13620',
    operating_hours = '{"weekday": "08:00-19:00 (Sen 09:00-17:00)", "weekend": "Sab 08:00-19:00, Minggu Tutup"}'::jsonb
WHERE slug = 'mahira-laundry';

-- Sync testimonials with verified customer reviews from Google Maps
TRUNCATE testimonials;

INSERT INTO testimonials (guest_name, rating, content, is_published) VALUES
('Indrohchuak', 5, 'Laundry ny cepat dan wangi,, setrika ny rapih. Bs anter jemput tinggal duduk manis aj di rmh', true),
('Toto Sudarto', 5, 'Pelayanan ramah,, murah dn cepat', true),
('Riris Marito', 5, 'Service cepat, layanan bagus😍', true),
('Rudi Herwin', 5, 'Laundry ny cepat,, setrika rapih dan bersih. Bs langganan jg perbualan sisimu murah 350rb/bulan dpt kuota 50kg (udh skalian loundry bedcover sm spre)', true),
('rachel febriany', 5, 'first time coba laundry disini, pelayanannya ok bgt! cepat selesainya juga + wangiiii😍😍😍', true),
('Siti Deftiani', 5, 'Layanan cuciannya bersih dan cepat.', true),
('Ferri Wicaksono', 5, 'Respons cepat.', true),
('Gantari Intan', 5, 'Pelayanan di Mahira loundry bagus, cucian wangi, setrikaan rapi.. selesai tepat waktu.. responnya baik dan ramah.. laundry bisa diambil dan diantar ke alamat tujuan, 👍👍', true),
('Ayuditha Aprillia', 5, 'Selalu puas untuk laundry disini, wangi dan cepat sekaliii. Ada jasa pick up dan anternya jugaaa. Best banget Mahira Laundry.', true),
('Aulia Khoirunisa', 5, 'Laundry Karpet wangi, bersih, lokasi dekat, harga terjangkau, owner dan karyawannya ramah baik. 😊', true),
('rdncevylptaa', 5, 'Guyyysssss ini worth it bgt beneran!!!! Yang bikin repeat jasa laundry disini tuh krn wanginya beda dan wangi mahalnya berasa bgt.', true),
('Elia Antariksa', 5, 'Sangat memuaskan! Cucian bersih, wangi, dan harganya sangat bersahabat. Sukses terus Mahira Laundry!', true),
('Tarmiati', 5, 'Pelayanan anter jemputnya sangat membantu. Hasil setrikaan rapi banget. Recommended bgt!', true),
('tanti fajri', 5, 'Laundry langganan di Jaticempaka. Wanginya tahan lama dan pengerjaannya cepat.', true);
