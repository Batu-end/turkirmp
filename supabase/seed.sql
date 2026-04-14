-- ============================================
-- Seed Data for HocamıDeğerlendir
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ============================================

-- ============================================
-- Universities
-- ============================================
INSERT INTO universities (id, name, city, slug, website) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Boğaziçi Üniversitesi', 'İstanbul', 'bogazici-universitesi', 'https://www.boun.edu.tr'),
  ('a1000000-0000-0000-0000-000000000002', 'Orta Doğu Teknik Üniversitesi', 'Ankara', 'odtu', 'https://www.metu.edu.tr'),
  ('a1000000-0000-0000-0000-000000000003', 'İstanbul Teknik Üniversitesi', 'İstanbul', 'itu', 'https://www.itu.edu.tr'),
  ('a1000000-0000-0000-0000-000000000004', 'Hacettepe Üniversitesi', 'Ankara', 'hacettepe-universitesi', 'https://www.hacettepe.edu.tr'),
  ('a1000000-0000-0000-0000-000000000005', 'Ege Üniversitesi', 'İzmir', 'ege-universitesi', 'https://www.ege.edu.tr'),
  ('a1000000-0000-0000-0000-000000000006', 'Koç Üniversitesi', 'İstanbul', 'koc-universitesi', 'https://www.ku.edu.tr'),
  ('a1000000-0000-0000-0000-000000000007', 'Sabancı Üniversitesi', 'İstanbul', 'sabanci-universitesi', 'https://www.sabanciuniv.edu'),
  ('a1000000-0000-0000-0000-000000000008', 'Bilkent Üniversitesi', 'Ankara', 'bilkent-universitesi', 'https://www.bilkent.edu.tr');

-- ============================================
-- Professors
-- ============================================
INSERT INTO professors (id, university_id, first_name, last_name, slug, department, title, overall_rating, total_reviews, would_take_again_pct, average_difficulty) VALUES
  -- Boğaziçi
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Ahmet', 'Yılmaz', 'ahmet-yilmaz', 'Bilgisayar Mühendisliği', 'Prof. Dr.', 4.2, 5, 80, 3.5),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Elif', 'Kaya', 'elif-kaya', 'Matematik', 'Doç. Dr.', 3.8, 4, 75, 4.0),
  -- ODTÜ
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'Mehmet', 'Demir', 'mehmet-demir', 'Elektrik-Elektronik Mühendisliği', 'Prof. Dr.', 4.5, 6, 90, 3.0),
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'Zeynep', 'Çelik', 'zeynep-celik', 'Fizik', 'Dr. Öğr. Üyesi', 3.2, 3, 60, 4.5),
  -- İTÜ
  ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000003', 'Mustafa', 'Öztürk', 'mustafa-ozturk', 'İnşaat Mühendisliği', 'Prof. Dr.', 4.0, 5, 70, 3.8),
  ('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000003', 'Ayşe', 'Şahin', 'ayse-sahin', 'Mimarlık', 'Doç. Dr.', 4.7, 7, 95, 2.5),
  -- Hacettepe
  ('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000004', 'Fatma', 'Arslan', 'fatma-arslan', 'Tıp Fakültesi', 'Prof. Dr.', 3.5, 4, 50, 4.8),
  -- Ege
  ('b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000005', 'Hasan', 'Güneş', 'hasan-gunes', 'Kimya', 'Dr. Öğr. Üyesi', 4.3, 3, 85, 3.2),
  -- Koç
  ('b1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000006', 'Deniz', 'Aydın', 'deniz-aydin', 'İşletme', 'Prof. Dr.', 4.6, 8, 88, 2.8),
  -- Sabancı
  ('b1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000007', 'Emre', 'Koç', 'emre-koc', 'Bilgisayar Bilimi', 'Doç. Dr.', 3.9, 5, 72, 3.6);

-- ============================================
-- Reviews
-- ============================================
INSERT INTO reviews (professor_id, rating, difficulty, course_code, comment, would_take_again) VALUES
  -- Prof. Ahmet Yılmaz (Boğaziçi - CS)
  ('b1000000-0000-0000-0000-000000000001', 5, 3, 'CMPE250', 'Harika bir hoca. Anlatımı çok açık ve öğrencilere karşı çok ilgili.', true),
  ('b1000000-0000-0000-0000-000000000001', 4, 4, 'CMPE300', 'Zor ama çok şey öğretiyorsunuz. Projelere hazırlıklı gelin.', true),
  ('b1000000-0000-0000-0000-000000000001', 4, 3, 'CMPE250', 'Dersi sevdiren bir hoca. Sınavları adil.', true),
  ('b1000000-0000-0000-0000-000000000001', 3, 4, 'CMPE350', 'Konuları iyi biliyor ama bazen çok hızlı geçiyor.', false),
  ('b1000000-0000-0000-0000-000000000001', 5, 3, 'CMPE250', 'En iyi hocalardan biri. Kesinlikle tavsiye ederim.', true),

  -- Doç. Dr. Elif Kaya (Boğaziçi - Math)
  ('b1000000-0000-0000-0000-000000000002', 4, 4, 'MATH201', 'Matematik sevdiren nadir hocalardan. Ama sınavları zor.', true),
  ('b1000000-0000-0000-0000-000000000002', 3, 5, 'MATH301', 'Çok bilgili ama dersi takip etmek zor olabiliyor.', false),
  ('b1000000-0000-0000-0000-000000000002', 4, 3, 'MATH201', 'Ofis saatlerinde çok yardımcı oluyor.', true),
  ('b1000000-0000-0000-0000-000000000002', 4, 4, 'MATH202', 'Zorlayıcı ama öğretici. Çok çalışmanız gerekiyor.', true),

  -- Prof. Dr. Mehmet Demir (ODTÜ - EE)
  ('b1000000-0000-0000-0000-000000000003', 5, 3, 'EE361', 'ODTÜ''nün en iyi hocalarından. Dersi çok eğlenceli.', true),
  ('b1000000-0000-0000-0000-000000000003', 4, 3, 'EE230', 'Anlatımı mükemmel. Slaytları çok düzenli.', true),
  ('b1000000-0000-0000-0000-000000000003', 5, 2, 'EE361', 'Çok sabırlı ve anlayışlı bir hoca.', true),
  ('b1000000-0000-0000-0000-000000000003', 4, 4, 'EE430', 'İleri seviye dersleri de çok iyi anlatıyor.', true),
  ('b1000000-0000-0000-0000-000000000003', 5, 3, 'EE230', 'Kesinlikle alınması gereken bir hoca.', true),
  ('b1000000-0000-0000-0000-000000000003', 4, 3, 'EE361', 'Projeleri zorlu ama çok öğretici.', true),

  -- Dr. Zeynep Çelik (ODTÜ - Physics)
  ('b1000000-0000-0000-0000-000000000004', 4, 5, 'PHYS105', 'Çok zor ama iyi öğretiyor. Çalışmazsanız geçemezsiniz.', true),
  ('b1000000-0000-0000-0000-000000000004', 2, 5, 'PHYS106', 'Sınavları aşırı zor. Eğri ile geçiyorsunuz.', false),
  ('b1000000-0000-0000-0000-000000000004', 4, 4, 'PHYS105', 'Fiziği seviyorsanız iyi bir hoca. Sevmiyorsanız çok zorlanırsınız.', true),

  -- Prof. Dr. Ayşe Şahin (İTÜ - Architecture)
  ('b1000000-0000-0000-0000-000000000006', 5, 2, 'MIM201', 'İlham verici bir hoca. Tasarım derslerini çok güzel işliyor.', true),
  ('b1000000-0000-0000-0000-000000000006', 5, 3, 'MIM301', 'Öğrencilere çok değer veriyor. Eleştirileri yapıcı.', true),
  ('b1000000-0000-0000-0000-000000000006', 5, 2, 'MIM201', 'Mimarlık bölümünün yıldızı. Herkes onu seviyor.', true),
  ('b1000000-0000-0000-0000-000000000006', 4, 3, 'MIM401', 'Yüksek beklentileri var ama çalışırsanız çok şey kazanırsınız.', true),
  ('b1000000-0000-0000-0000-000000000006', 5, 2, 'MIM201', 'Kariyer tavsiyelerinde de çok yardımcı.', true),
  ('b1000000-0000-0000-0000-000000000006', 5, 3, 'MIM302', 'Dünya standartlarında eğitim veriyor.', true),
  ('b1000000-0000-0000-0000-000000000006', 4, 3, 'MIM201', 'Çok ilham verici, ama deadlinelar sıkı.', true),

  -- Prof. Dr. Deniz Aydın (Koç - Business)
  ('b1000000-0000-0000-0000-000000000009', 5, 2, 'MGMT301', 'İş dünyasından örneklerle anlatıyor. Çok keyifli.', true),
  ('b1000000-0000-0000-0000-000000000009', 5, 3, 'MGMT401', 'Case study''leri harika. Çok şey öğrendim.', true),
  ('b1000000-0000-0000-0000-000000000009', 4, 3, 'MGMT301', 'Grup projelerini çok iyi yönetiyor.', true),
  ('b1000000-0000-0000-0000-000000000009', 5, 3, 'MGMT301', 'Türkiye''nin en iyi işletme hocalarından.', true),
  ('b1000000-0000-0000-0000-000000000009', 4, 3, 'MGMT402', 'Dersleri interaktif ve eğlenceli.', true),
  ('b1000000-0000-0000-0000-000000000009', 5, 2, 'MGMT301', 'Networkünden faydalanabilirsiniz. Çok bağlantılı.', true),
  ('b1000000-0000-0000-0000-000000000009', 4, 4, 'MGMT501', 'MBA dersi çok zorlu ama ödüllendirici.', true),
  ('b1000000-0000-0000-0000-000000000009', 5, 3, 'MGMT301', 'Mezun olduktan sonra bile iletişimde kalıyor. Harika insan.', true);
