-- Replace 404 image URLs with valid ones

UPDATE public.gallery 
SET image_url = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'
WHERE image_url = 'https://images.unsplash.com/photo-1583847268964-b28e51136b66?auto=format&fit=crop&w=800&q=80';

UPDATE public.gallery 
SET image_url = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80'
WHERE image_url = 'https://images.unsplash.com/photo-1489274495757-9a48bb95b28d?auto=format&fit=crop&w=800&q=80';

UPDATE public.gallery 
SET image_url = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80'
WHERE image_url = 'https://images.unsplash.com/photo-1521656693074-0af32947e8e5?auto=format&fit=crop&w=800&q=80';

UPDATE public.gallery 
SET image_url = 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80'
WHERE image_url = 'https://images.unsplash.com/photo-1585244319409-f831bea95924?auto=format&fit=crop&w=800&q=80';
