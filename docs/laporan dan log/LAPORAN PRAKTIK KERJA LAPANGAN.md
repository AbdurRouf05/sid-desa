**LAPORAN KERJA PRAKTIK**

**“KERJA PRAKTEK DI KANTOR DESA SUMBERANYAR **

**KECAMATAN ROWOKANGKUNG”**



Dosen Pembimbing Lapangan :** **

**Maysas Yafi Urrochman,**** ****S.M.,**** ****M.Kom.**

Diusulkan Oleh:



**1.** **Abdur Rouf****	****	****	****	(222140028)**

**2.** **Ahmad Firman Abdul Nasir****	****	(222140058)**

**3. Aldi januar saputra****	****	****	(222140064)**

**4. Abdul Muntolib Fajarkhan****	****	(222140011)**

**5. Dani Ahmad Kafabih****	 ****	****	(222140053)**

**6. Ahmad Rafi Hidayatullah****	****	(222140077)**

**7. Akmal Isyroqun Najah****	 ****	(222140072)**

**8. Adam paundra ****mahmud****	****	(222140061)**

**9. Firnanda Ibrahim****	****	****	(223140140)**

**10. Akhmad Nurhidayat M****	****	(223140129)**





**PROGRAM STUDI INFORMATIKA**

**INSTITUT TEKNOLOGI DAN BISNIS WIDYA GAMA LUMAJANG**

**2026**

# 

# LEMBAR PENGESAHAN



**“KERJA PRAKTIK DI KANTOR DESA SUMBERANYAR KECAMATAN ROWOKANGKUNG”**

Disusun Oleh :

Firnanda Ibrahim 			(223140140)

Abdur Rouf 				(223140118)

Adam Paundra Mahmud		(223140110)

Ahmad Firman Abdul Nasir		(222140075)

Aldi Januar Saputra 			(223140152)

Abdul Muntolib Fajarkhan 		(223140120)

Ahmad Rafi Hidayatullah 		(223140143)

Akmal Isyroqun Najah 		(223140101)

Dani Ahmad Kafabih 			(223140145)

Akhmad Nurhidayat M 		(223140129)

Dibuat sebagai pertanggung jawaban penulis selama mengikuti Kerja Praktik (KP) berbasis proyek di Balai Desa Sumberanyar, Kecamatan Rawakangkung, Kabupaten Lumajang.

Telah diterima dan disahkan guna memenuhi salah satu syarat untuk menyelesaikan Mata Kuliah Kerja Praktik (3 SKS) pada Program Studi Informatika Institut Teknologi dan Bisnis Widya Gama Lumajang.



Telah diperiksa dan disetujui oleh :

Lumajang, ...-...-2026



# ABSTRAK


Praktikum Kerja Lapangan (PKL) ini dilaksanakan di Kantor Desa Sumberanyar, Kecamatan Rowokangkung, sebuah instansi pemerintahan yang berfokus pada pelayanan publik dan pemberdaya masyarakat tingkat desa. Tujuan utama dari kegiatan ini adalah untuk mengembangkan dan mengimplementasikan proses administrasi manual yang rentan terhadap kesalahan, keterlambatan pelayanan, dan fragmentasi data kependudukan. Pengembangan sistem ini bertujuan untuk meningkatkan efisiensi operasional, akurasi pencatatan pelaksanaan, dan transparansi pengelolaan keuangan desa. Metode pelaksanaan yang diterapkan dalam proyek ini ,menggunakan pendekatan Agile (Scrum) secara iteratif dengan sistem kerja remote, yang meliputi observasi lapangan, analisis kebutuhan, perancangan prototipe antarmuka, hingga tahapan pembangunan dan pengujian sistem. Pembangunan perangkat lunak ini memanfaatkan teknologi Next.js untuk sisi frontend maupun backen dan PocketBase sebagai sistem manajemen basis data. Hasil utama dari proyek ini adalah terwujudnya aplikasi administrasi desa terintegrasi yang mencakup enam modul esensial: portal berita publik, layanan pengaduan warga, manajemen data kependudukan terpusat, layanan pembuatan surat otomatis (surat pintar), pencatatan Buku Kas Umum (BKU) dengan kalkulasi pajak, serta inventaris aset desa. Sistem yang telah dikembangkan berhasil diimplementasikan dan telah melewati tahapan User Acceptance Tes (UAT) bersama perangkat desa. Melalui digitalisasi ini, diharapkan kinerja tata kelola Kantor Desa Sumberanyar menjadi lebih efesien, transparan, dan mampu memberikan pelayanan administrasi yang cepat dan optimal bagi seluruh lapisan masyarakat.

****

# KATA PENGANTAR


	Puji syukur kehadirat Allah SWT atas segala rahmat dan hidayah-Nya, sehingga penyusun dapat menyelesaikan laporan Praktik Kerja Lapangan (PKL) yang dilaksanakan di Kantor Desa Sumberanyar dengan judul “Pengembangan Sistem Informasi Desa (SID) Terintegrasi di Kantor Desa Sumberanyar” dengan baik dan tepat pada waktunya.

	Laporan ini disusun sebagai salah satu syarat untuk menyelesaikan mata kuliah Praktik Kerja Lapangan pada Program Studi Informatika, Institut Teknologi dan Bisnis Widya Gama Lumajang.

	Dalam proses pelaksanaan Praktik Kerja Lapangan hingga penyusunan laporaan ini, kelancaran kegiatan tidak lepas dari dukungan, bimbingan, serta bantuan dari berbagai pihak. Oleh karena itu, menyampaikan ucapan terima kasih yang sebesar-besarnya kepada Ibu Dr. Ratna Wijayanti Daniar Paramita, S.E., M.M. selaku Rektor Institut Teknologi dan Bisnis Widya Gama Lumajang, Serta Bapak Ir. Achmad Firman Choiri, S.Kom., M.Kom. selaku Ketua Program Studi Informatika. Ucapan terima kasih juga kepada Bapak Maysas Yafi Urrochman, S.E., M.Kom. selaku Dosen Pembimbing Lapangan (DPL) yang senantiasa meluangkan waktu untuk memberikan arahan dan evaluasi, serta kepada Bapak Nanang Budiono selaku Kepala Desa Sumberanyar berserta selulur jajarannya yang telah memberikan izin, memfasilitasi, dan membimbing tim kami selama pelaksanaan Praktik Kerja Lapangan.

	Akhir kata, semoga laporan ini dapat memberikan manfaat serta wawasan yang berguna bagi para pembaca, khususnya bagi mahasiswa Program Studi Informatika dan bagi pengembang teknologi di tingkat pemerintahan desa.



Lumajang, 18 April 2026







Tim Penulis

****

# DAFTAR ISI

****

# DAFTAR GAMBAR



Tabel 1. Portal Informasi Desa	9 

Tabel 2. Layanan Pengaduan	9

Tabel 3. Data Kependudukan	9

Tabel 4. Surat Pintar	10

Tabel 5. Buku Kas Umum (BKU)	10

Tabel 6. Inventaris Aset	10 ****

# DAFTAR TABEL



Tabel 1. Jadwal dan Perencaan Kerja	3****

# DAFTAR LAMPIRAN



Lampiran 1. Legalitas Perusahaan/Instansi

Lampiran 2. Form Penilaian KP oleh DPL

Lampiran 3. Form Penilaian KP oleh Instansi – Perusahaan

Lampiran 4. Penilaian Manfaat dan Dampak KP Oleh Instansi – Perusahaan

Lampiran 5. Logbook Kegiatan Mahasiswa di Instansi

Lampiran 6. Logbook Kegiatan Kerja Praktik Mingguan Mahasiswa



# 

# BAB I 

# PENDAHULUAN



## 1.1 Latar Belakang

	Perkembangan teknologi infromasi yang semakin pesat menuntut instansi pemerintahan, termasuk pemerintahan desa,untuk mampu beradaptasi dalam memberikan pelayanan yang efektif, efisien, dan transparan kepada masyarakat. Pemanfaatan teknologi informasi menjadi salah satu faktor penting dalam meningkatkan kualitas administrasi desa, pengelolaan data, serta pelayanan publik berbasis digital.

	Mahasiswa Proram Studi Informatika dilabeli dengan pengetahuan dan keterampilan di bidang teknologi informasi, seperti pengolahan data, sistem informasi, aplikasi komputer, dan pemanfaatan teknologi digital. Melalui kegiatan kerja praktik, mahasiswa memiliki kesempatan untuk menerapkan ilmu yang telah diperoleh selama perkuliahan ke dalam lingkungan kerja nyata, khususnya di bidang pemerintahan desa.

	Kantor Desa sebagai pusat pelayanan masyarakat memiliki kebutuhan dalam pengelolaan data kependudukan, administrasi surat-menurat, dokumentasi kegiatan, serta pemanfaatan sistem informasi desa. Oleh karena itu, kerja praktik tim mahasiswa Informatika Institut Teknologi dan Bisnis Widya Gama Lumajang diharapkan dapat membantu mendukung proses digitalisasi administrasi desa, sekaligus memberikan pengalaman praktis bagi mahasiswa dalam memahami permasalahan dan kebutuhan permasalahn dan kebutuhan teknologi di lingkungan pemerintahan.

	Selain itu, program kerja praktik ini diharapkan dapat menjadi sarana pembelajaran yang efektif bagi mahasiswa untuk meningkatkan kompetensi teknis, kemampuan analisis, serta keterampilan kerja sama dan komunikasi. Hasil akhir dari kegiatan kerja praktik ini adalah terwujudnya Sistem Informasi desa (SID) terintegrasi yang dapat memberikan kontribusi positif bagi Kantor Desa Sumberanyar dalam upaya meningkatkan kualitas tata kelola pemerintahan dan pelayanan kepada masyarakat.

## 1.2 Lingkup Penugasan

	Kerja praktikum ini dilaksanakan di Kantor Desa Sumberanyar, Kecamatan Rowokangkung, Kabupaten Lumajang, Jawa Timur 67359

 	Durasi waktu pelaksanaan selama 2 bulan (18 Februari 2026 – 18 April 2026). Dengan menggunakan motode kerja remote yang dilaksanakan oleh tim beranggotakan 10 orang, tim melakukan observasi lapangan ke balai desa, kemudian dilanjutkan dengan sinkronasi dan evaluasi rutin mingguan secara daring atau luring setiap hari Rabu. Kunjungan langsunng juga dilakukan secara periodik untuk testing User Acceptance Test (UAT).

## 1.3 Target Pemecahan Masalah

	Target pemecahan masalah dalam proyek ini adalah menciptakan Sistem Informasi Desa (SID) digital terpadu yang mampu menggantikan proses administrasi manual di kantor Desa Sumberanyar. Sistem dirancang diharapkan dapat mengintegrasikan pengelolaan data pendudduk, pencetakan Surat Pintar, pembukuan keuangan, hingga portal publik dalam satu ekosistem yang saling terhubung.

	Dengan perancangan antarmuka visual baru (deal teal) yang responsid, target ini juga berfokus untuk meninimalkan human error, mempercepat ekspor laporan, dan memastikan pelayanan desa yang jauh lebih efesien, transparan, serta optimal.

## 1.4 Metode Pelaksanaan Tugas

Metode pelaksanaan tugas yang digunakan adalah pendekatan Agile (Scrum) dengan langkah-langkah pelaksanaannya sebagai berikut:

Observasi dan analisis kebutuhan dengan melakukan wawancara teknis (front-desk tiap unti) di balai desa untuk menetapkan alur birokrasi nyata.

Merancang struktur data ERD dan membuat desain visual antarmuka (UI/UX) berbasis identitas “Desa Teal” menggunakan Tailwind CSS

Pengembangan sistem coding (Frontend dan Backend) menggunakan framwork Next.js, yang dihubungkan dengan PoketBase sebgai sistem manajemen database dan API.

Melakukan pengujian sistem (stress test, security testing, dan uji kompabilitas browser), untuk mengatasi errer, serta mengatur ratte limit untuk mencegah spam.

Mendemonstrasikan kelayakan software langsung kepada aparatur desa, hingga tahap serah terima dokumen Manual Book.

## 1.5 Rencana dan Penjadwalan Kerja

**	**Untuk memastikan pelaksanaan kerja prakik remote dan sinkronasi berjalan sesuai target selama dua bulan (9 Minggu), jadwal direalisasikan sebagai berikut:

Tabel 1. Rencana dan Penjadwalan Kerja****

# BAB II 

# PROFIL INSTANSI



Kantor Desa Sumberanyar merupakan instansi pemerintahan desa yang berada di wilayah Kecamatan Rowokangkung, Kabupaten Lumajang. Kantor desa ini berfungsi sebagai pusat pelayanan publik dan administrasi pemerintahan desa bagi masyarakat Desa Sumberanyar.

Dalam menjalankan tugasnya, Kantor Desa Sumberanyar melaksanakan berbagai pelayanan administrasi, seperti pengelolaan data kependudukan, pelayanan surat-menyurat, administrasi pemerintahan desa, serta pelaksanaan program pembangunan dan pemberdayaan masyarakat desa. Kantor desa juga berperan sebagai penghubung antara pemerintah kecamatan dengan masyarakat desa dalam penyampaian kebijakan dan informasi.

**2.1 Struktur Organisasi**

Struktur organisasi Kantor Desa Sumberanyar terdiri dari:

**Kepala Desa**** (Nanang Budiono)**

Bertanggung jawab atas penyelenggaraan pemerintahan desa, pembangunan desa, pembinaan kemasyarakatan, dan pemberdayaan masyarakat.

**Sekretaris Desa (****Moh.Muzakki)**

Membantu Kepala Desa dalam bidang administrasi pemerintahan serta mengoordinasikan kegiatan kesekretariatan desa.

**Kepala Urusan (Kaur)**

**Kaur Tata Usaha dan Umum**** (Supandi)**
Mengelola administrasi umum, surat-menyurat, kearsipan, dan pelayanan umum.

**Kaur Keuangan**** (Ahmad Khairuddin)**
Mengelola administrasi keuangan desa, anggaran, dan pelaporan keuangan desa.

**Kaur Perencanaan**** (Firnanda Ibrahim)**
Menyusun perencanaan pembangunan desa dan pengelolaan data perencanaan.

**Kepala Seksi (Kasi)**

**Kasi Pemerintahan**** (Kasih)**
Mengelola administrasi kependudukan dan pemerintahan desa.

**Kasi Kesejahteraan**** (Sofyan Tsauri)**
Menangani pembangunan desa dan pemberdayaan masyarakat.

**Kasi Pelayanan**** (Imron Hasan Sudirman)**
Melaksanakan pelayanan kepada masyarakat, khususnya pelayanan administrasi desa.

**Kepala Dusun (Kasu****n Sadeng:Bambang Sumbiko,Kasun Srambaan: Abdur Rohim, Kasun Krajan: Imam Taufiq****)**

Bertugas membantu penyelenggaraan pemerintahan desa di wilayah dusun masing-masing serta menjadi penghubung antara pemerintah desa dan masyarakat.

**Visi dan Misi Instansi**

**Visi:**
Terwujudnya Masyarakat Desa Sumberanyar Yang Religius, Mandiri, Maju dan Bermartabat.

**Misi:**

Meningkatkan Kualitas dan Profesionalisme Aparatur dalma tata Kelola Pemerintahan, Pemabngunan dan Pelayanan Pada Masyarakat;

Meningkatkan Kualitas Pendidikan, Kesehatan dan Sumberdaya Manusia;

Meningkatkan Pembangunan Ekonomi Pedesaan dan Kesejahteraan Masyarakat;

Meningkatkan Kualitas Kehidupan Beragama, Sosial Budaya dan Ketentraman Masyarakat.

**2.2 Waktu dan Tempat Pelaksanaan**

Jangka Waktu : 4 (empat) Bulan

Hari/Tanggal : 18 Februari – 23 Juni 2026

Tempat : Kantor Desa Sumberanyar Kecamatan Rowokangkung

Jl. Pahlawan Tujuh No.01 Desa Sumberanyar  Kec. Rowokangkung Kabupaten Lumajang, Jawa Timur 67359

**2.3 Jadwal Pelaksanaan Kerja Praktik**

Minggu 1-3: Penjajakan tempat KP, penyusunan proposal, dan persetujuan proyek.

Minggu 4-14: Pelaksanaan proyek dan koordinasi dengan pembimbing.

Minggu 15: Penyusunan laporan akhir dan penyelesaian proyek.

Minggu 16: Presentasi hasil kerja praktik.

****

# BAB III 

# KEGIATAN DAN PEMBAHASAN



**3.1 Pelaksanaan Kegiatan Kerja Praktik**

Pelaksanaan Kerja Praktik (KP) di Kantor Desa Sumberanyar dilakukan selama kurang lebih dua bulan dengan metode kerja hybrid (remote dan kunjungan langsung). Kegiatan dilaksanakan secara bertahap menggunakan pendekatan Agile (Scrum), yang memungkinkan pengembangan sistem dilakukan secara iteratif dan terstruktur.

Adapun rincian kegiatan yang dilakukan selama kerja praktik adalah sebagai berikut:

**1. Tahap Observasi dan Identifikasi Masalah**

Pada tahap awal, tim melakukan observasi langsung ke Kantor Desa Sumberanyar untuk memahami alur kerja administrasi yang berjalan. Kegiatan ini meliputi:

Wawancara dengan perangkat desa (front desk tiap unit) 

Analisis sistem administrasi manual 

Identifikasi permasalahan seperti: 

Lambatnya proses pelayanan 

Tingginya risiko kesalahan pencatatan 

Data yang tidak terintegrasi 

**2. Tahap Analisis Kebutuhan Sistem**

Setelah observasi, dilakukan analisis kebutuhan sistem yang akan dikembangkan, meliputi:

Kebutuhan fungsional (fitur sistem) 

Kebutuhan non-fungsional (keamanan, performa, usability) 

Penyusunan use case dan alur sistem** **

**3. Tahap Perancangan Sistem**

Pada tahap ini dilakukan desain sistem, antara lain:

Perancangan database menggunakan ERD 

Desain antarmuka (UI/UX) berbasis konsep “Desa Teal” 

Pembuatan prototype sistem menggunakan tools desain 

**4. Tahap Pengembangan Sistem**

Pengembangan sistem dilakukan dengan teknologi:

Frontend & Backend: Next.js 

Database: PocketBase 

Fitur yang dikembangkan meliputi:

Portal berita desa 

Layanan pengaduan masyarakat 

Manajemen data kependudukan 

Sistem pembuatan surat otomatis (Surat Pintar) 

Buku Kas Umum (BKU) 

Manajemen inventaris aset desa 

**5. Tahap Pengujian Sistem**

Pengujian dilakukan untuk memastikan sistem berjalan dengan baik, meliputi:

Testing fungsionalitas 

Uji kompatibilitas browser 

Uji performa dan keamanan 

Perbaikan bug (debugging) 

**6. Tahap Implementasi dan UAT**

Sistem yang telah selesai diuji kemudian:

Diimplementasikan di lingkungan desa 

Dilakukan User Acceptance Test (UAT) bersama perangkat desa 

Dilakukan evaluasi dan perbaikan akhir 

**7. Dokumentasi dan Pelaporan**

Tahap akhir meliputi:

Penyusunan laporan kerja praktik 

Pembuatan manual book sistem 

Dokumentasi kegiatan (foto, logbook, dll) 

**3.2 Hasil dan Luaran Kerja Praktik**

Hasil utama dari kegiatan kerja praktik ini adalah terbentuknya Sistem Informasi Desa (SID) Terintegrasi yang mampu meningkatkan efisiensi pelayanan administrasi desa.

Adapun hasil yang diperoleh antara lain:

**1. Aplikasi Sistem Informasi Desa**

Sistem yang dikembangkan memiliki beberapa modul utama:

Portal Informasi Desa → menampilkan berita dan pengumuman



Gambar 1. Portal Informasi Desa

Layanan Pengaduan → masyarakat dapat mengirim keluhan 



Gambar 2. Layanan Pengaduan

Data Kependudukan → pengelolaan data warga secara terpusat



Gambar 3. Data Kependudukan

Surat Pintar → pembuatan surat otomatis 



Gambar 4. Surat Pintar

Buku Kas Umum (BKU) → pencatatan keuangan desa 



Gambar 5. Buku Kas Umum (BKU)

Inventaris Aset → pengelolaan aset desa



Gambar 6. Inventaris Desa





**2. Peningkatan Efisiensi Pelayanan**

Proses administrasi menjadi lebih cepat 

Mengurangi penggunaan kertas (paperless) 

Mengurangi kesalahan input data 

**4. Pengalaman dan Kompetensi Mahasiswa**

Mahasiswa memperoleh:

Pengalaman kerja nyata di instansi pemerintah 

Kemampuan analisis sistem 

Kemampuan pengembangan aplikasi berbasis web 

Kemampuan kerja tim dan komunikasi 



**3.3 Pembahasan dan Analisis Kritis**

**1. Analisis Pelaksanaan Kerja Praktik**

Pelaksanaan kerja praktik berjalan cukup baik, meskipun terdapat beberapa kendala seperti:

Koordinasi tim yang dilakukan secara remote 

Perbedaan pemahaman antara tim IT dan perangkat desa 

Keterbatasan waktu dalam pengembangan sistem** **

Namun kendala tersebut dapat diatasi dengan:

Rapat evaluasi rutin mingguan 

Komunikasi intensif dengan pihak desa 

Pembagian tugas yang jelas dalam tim 



**2. Perbandingan dengan Teori**

Dalam teori, pengembangan sistem menggunakan metode Agile menekankan:

Iterasi cepat 

Kolaborasi tim 

Adaptasi terhadap perubahan 

Pada implementasinya:

Metode Agile terbukti efektif dalam pengembangan sistem 

Perubahan kebutuhan dapat langsung diakomodasi 

Sistem dapat dikembangkan secara bertahap 

**3. Analisis Manfaat Sistem**

Sistem yang dikembangkan memberikan manfaat:

Meningkatkan transparansi administrasi desa 

Mempermudah pengelolaan data 

Mempercepat pelayanan kepada masyarakat 

**4. Kekurangan Sistem**

Meskipun sudah berjalan baik, sistem masih memiliki beberapa kekurangan:

Belum tersedia versi mobile (aplikasi Android) 

Ketergantungan pada koneksi internet 

**5. Rekomendasi Pengembangan**

Untuk pengembangan selanjutnya, disarankan:

Pengembangan aplikasi berbasis mobile 

Penambahan fitur notifikasi otomatis 

Integrasi dengan sistem pemerintah lainnya 

****

# BAB IV 

# KESIMPULAN DAN SARAN



4.1 Kesimpulan

Berdasarkan pelaksanaan kegiatan Kerja Praktik (KP) yang telah dilakukan di Kantor Desa Sumberanyar, Kecamatan Rowokangkung, Kabupaten Lumajang, dapat disimpulkan bahwa kegiatan ini memberikan pengalaman nyata dalam menerapkan ilmu yang telah diperoleh selama perkuliahan, khususnya dalam bidang pengembangan sistem informasi.

Melalui kegiatan kerja praktik ini, tim mahasiswa berhasil merancang dan mengembangkan Sistem Informasi Desa (SID) terintegrasi yang bertujuan untuk meningkatkan kualitas pelayanan administrasi desa. Sistem yang dibangun mampu mengatasi berbagai permasalahan yang sebelumnya terjadi, seperti proses administrasi yang masih manual, keterlambatan pelayanan, serta kurangnya integrasi data.

Penerapan metode Agile (Scrum) dalam pengembangan sistem terbukti efektif karena memungkinkan proses pengembangan dilakukan secara bertahap, fleksibel, dan sesuai dengan kebutuhan pengguna. Sistem yang dihasilkan memiliki beberapa fitur utama, seperti pengelolaan data kependudukan, pembuatan surat otomatis (Surat Pintar), layanan pengaduan masyarakat, pengelolaan keuangan desa melalui Buku Kas Umum (BKU), serta manajemen inventaris aset desa.

Dengan adanya sistem ini, proses administrasi di Kantor Desa Sumberanyar menjadi lebih cepat, efisien, dan terstruktur. Selain itu, sistem ini juga membantu meningkatkan transparansi dan akurasi dalam pengelolaan data serta pelayanan kepada masyarakat.

Secara keseluruhan, kegiatan kerja praktik ini tidak hanya memberikan manfaat bagi instansi, tetapi juga meningkatkan kemampuan mahasiswa dalam hal analisis sistem, pengembangan aplikasi, kerja sama tim, serta komunikasi dalam lingkungan kerja profesional.

**4.2 Saran**

Berdasarkan hasil pelaksanaan kerja praktik yang telah dilakukan, disarankan kepada pihak Kantor Desa Sumberanyar agar dapat mengimplementasikan serta memanfaatkan Sistem Informasi Desa (SID) yang telah dikembangkan secara konsisten dan berkelanjutan dalam mendukung seluruh kegiatan administrasi desa, disertai dengan upaya pemeliharaan (maintenance) sistem yang terencana dan berkala guna menjamin kinerja, stabilitas, serta keamanan program, melalui kegiatan seperti pembaruan sistem (update) sesuai kebutuhan, pencadangan (backup) data secara rutin untuk mengantisipasi kehilangan atau kerusakan data, serta pengawasan terhadap penggunaan sistem oleh pengguna, selain itu instansi juga diharapkan dapat meningkatkan kesiapan infrastruktur pendukung, termasuk ketersediaan jaringan internet yang stabil dan perangkat kerja yang memadai, sehingga sistem dapat dioperasikan secara optimal, serta mampu memberikan pelayanan administrasi yang lebih efektif, efisien, transparan, dan berkelanjutan kepada masyarakat.

****

# DAFTAR PUSTAKA



Kadir, A. (2014). Pengenalan sistem informasi. Andi.

Kementerian Desa, Pembangunan Daerah Tertinggal, dan Transmigrasi Republik Indonesia. (2020). Pedoman sistem informasi desa.

Nugroho, A. (2018). Rekayasa perangkat lunak berbasis objek dengan metode agile. Andi.

PocketBase Team. (2025). PocketBase documentation. 

Pressman, R. S. (2015). Software engineering: A practitioner’s approach (8th ed.). McGraw-Hill.

Schwaber, K., & Sutherland, J. (2020). The scrum guide. 

Sommerville, I. (2016). Software engineering (10th ed.). Pearson.

Sutabri, T. (2012). Analisis sistem informasi. Andi.

Undang-Undang Republik Indonesia Nomor 6 Tahun 2014 tentang Desa.

Vercel. (2025). Next.js documentation. 

****

# LAMPIRAN



Legalitas Perusahaan/Instansi

Form Penilaian KP oleh DPL

Form Penilaian KP oleh Instansi – Perusahaan

Penilaian Manfaat dan Dampak KP Oleh Instansi – Perusahaan

Logbook Kegiatan Mahasiswa di Instansi

Logbook Kegiatan Kerja Praktik Mingguan Mahasiswa

Dokumentasi Lainnya.





| INSTANSI      Nanang Budiono NIP 19690810 200701  1 | DOSEN PEMBIMBING      Maysas Yafi Urrochman, S.M., M.Kom. NIDN : 07020692 |
| --- | --- |




| Tahapan | Kegiatan Utama |
| --- | --- |
| Minggu 1-2 | Observasi balai desa, analisis system requirements, perancangan antarmuka (UI/UX) dan kerangka direktori data, hingga inisiasi repository Next.js dan PoketBase. |
| Minggu 3-4 | Pengembangan ekosistem portal publik (Berita dan Form pengaduan), pengelolaan state dan kependudukan, serta skema relasional registrasi surat otomatis. |
| Minggu 5-6 | Integrasi render cetak Surat Pintar (jsPDF), perancangan antarmuka Buku Kas Umum (BKU), kalkulasi Running Balance, dan integrasi grafik data (Recharts). |
| Minggu 7-8 | Penyempurnaan fitur Export Excel (XLSX), kalkulasi pajak otomatis PNN/PPh, integrasi logic inventaris Aset, serta penyusunan draft Manual Book. |
| Minggu 9 | Quality Assurance akhir, optimasi loading SEO, Deploy ke Varcel, pelaksanaan User Acceptance Tes (UAT), bersama aparat desa, dan serah terima dokumen/sistem final. |


