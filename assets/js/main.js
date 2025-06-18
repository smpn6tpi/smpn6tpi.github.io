document.addEventListener('DOMContentLoaded', function() {
// 1. Definisikan CSS sebagai string
const MAIN_CSS = `
/* --- CSS Global & Reset --- */
 :root {
     --primary-color: #00448A;
    /* Biru gelap (Warna utama dari logo sekolah) */
     --secondary-color: #28a745;
    /* Hijau (Warna untuk tombol CTA/Aksen kedua) */
     --background-light: #f8f9fa;
    /* Warna latar belakang ringan (Putih keabu-abuan) */
     --text-dark: #343a40;
    /* Warna teks gelap (Hitam gelap) */
     --text-light: #ffffff;
    /* Warna teks terang */
     --accent-color: #ffc107;
    /* Kuning Aksen (Digunakan untuk highlight/garis pemisah) */
}
 * {
    /* Reset margin dan padding bawaan browser */
     margin: 0;
     padding: 0;
    /* Penting untuk layout responsif */
     box-sizing: border-box;
     font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
 body {
     line-height: 1.6;
     color: var(--text-dark);
     background-color: var(--background-light);
    /* Padding atas body: Memberi ruang agar konten tidak tertutup oleh Header (80px) */
     padding-top: 80px;
}
 a {
     text-decoration: none;
     color: var(--primary-color);
}
/* --- Header & Navigasi --- */
 header {
     background-color: var(--primary-color);
     color: var(--text-light);
     padding: 10px 20px;
     display: flex;
     justify-content: space-between;
     align-items: center;
     position: fixed;
     width: 100%;
     top: 0;
     left: 0;
    /* Pastikan Header selalu di atas elemen lain */
     z-index: 1000;
     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* Tinggi Header Desktop standar */
     height: 80px;
}
 .logo {
     display: flex;
     align-items: center;
}
 .logo img {
    /* Ukuran Logo Desktop */
     height: 70px;
     margin-right: 10px;
    /* Gaya tambahan agar logo PNG terlihat jelas */
    /*background-color: white;
    */
     padding: 2px;
     background-image: radial-gradient(circle, white 25%, transparent 75%);
    /*border-radius: 35%;
    */
}
 .logo h1 {
    /* Ukuran Font Logo Desktop */
     font-size: 1.6em;
     margin: 0;
     color: var(--text-light);
}
 nav ul {
     list-style: none;
     display: flex;
}
 nav ul li {
     position: relative;
}
 nav ul li a {
     color: var(--text-light);
    /* Padding vertikal disesuaikan dengan tinggi header (80px) */
     padding: 25px 20px;
     display: block;
     transition: background-color 0.3s;
}
 nav ul li a:hover {
     background-color: rgba(255, 255, 255, 0.2);
}
/* Dropdown */
 .dropdown-content {
     display: none;
     position: absolute;
     background-color: var(--text-light);
     min-width: 180px;
     box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
     z-index: 1;
    /* Garis batas di atas dropdown */
     border-top: 3px solid var(--secondary-color);
     border-radius: 0 0 5px 5px;
     overflow: hidden;
}
 .dropdown-content a {
     color: var(--text-dark);
     padding: 12px 16px;
     display: block;
     text-align: left;
}
 .dropdown-content a:hover {
     background-color: var(--background-light);
}
 .dropdown:hover .dropdown-content {
     display: block;
}
/* Mobile Menu Toggle (Ikon ☰) */
 .menu-toggle {
     display: none;
     font-size: 24px;
     cursor: pointer;
     color: var(--text-light);
}
/* --- Konten Utama (Beranda & Post) --- */
 main {
     padding: 20px;
     max-width: 1200px;
    /* Posisikan di tengah layar */
     margin: auto;
}
/* CTA Button Style (Tombol Aksi) */
 .cta-button {
     display: inline-block;
     background-color: var(--secondary-color);
     color: var(--text-light);
     padding: 10px 25px;
     border-radius: 5px;
     font-weight: bold;
     transition: background-color 0.3s;
}
 .cta-button:hover {
     background-color: #1e7e34;
}
/* Image Slider (Carousel Beranda) */
 .slider-container {
     width: 100%;
     overflow: hidden;
     border-radius: 8px;
     margin-bottom: 30px;
     position: relative;
     box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
     height: 400px;
}
 .slider-wrapper {
     display: flex;
     transition: transform 0.5s ease-in-out;
     height: 100%;
}
 .slider-item {
     min-width: 100%;
     height: 100%;
     position: relative;
     display: flex;
     align-items: center;
     justify-content: center;
     background-size: cover;
     background-position: center;
     color: var(--text-light);
}
 .slider-item a {
    color: var(--text-light);
}
 .slider-item::before {
    /* Overlay gelap pada gambar */
     content: '';
     position: absolute;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     background: rgba(0, 0, 0, 0.4);
}
 .slider-caption {
     position: relative;
     z-index: 1;
     text-align: center;
     padding: 20px;
     max-width: 80%;
}
 .slider-caption h3 {
     font-size: 2.2em;
     margin-bottom: 10px;
     text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
}
 .slider-caption p {
     font-size: 1.1em;
     text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}
/* Tombol Navigasi Slider (Panah Kiri/Kanan) */
 .slider-nav-button {
     position: absolute;
     top: 50%;
     transform: translateY(-50%);
     background-color: rgba(0, 0, 0, 0.5);
     color: white;
     border: none;
     padding: 10px 15px;
     cursor: pointer;
     font-size: 1.5em;
     z-index: 10;
     border-radius: 5px;
     transition: background-color 0.3s;
}
 .slider-nav-button:hover {
     background-color: rgba(0, 0, 0, 0.7);
}
 .prev {
     left: 10px;
}
 .next {
     right: 10px;
}
/* --- CSS Galeri Baru (Aktifkan Dragging/Scrolling Horizontal) --- */
/* Aktifkan scrolling horizontal dan sembunyikan scrollbar di desktop */
 .galeri-carousel-wrapper {
     display: flex;
     margin-top:20px;
     overflow-x: scroll;
     overflow-y: hidden;
     scroll-behavior: smooth;
    /* Hentikan efek sentuh default browser */
     -webkit-overflow-scrolling: touch;
    /* Gaya untuk menyembunyikan scrollbar di Firefox, IE/Edge */
     scrollbar-width: none;
     -ms-overflow-style: none;
}
/* Sembunyikan scrollbar di Webkit (Chrome, Safari) */
 .galeri-carousel-wrapper::-webkit-scrollbar {
     display: none;
}
/* Kursor Tangan Saat Mouse Ditekan (Menandakan Bisa Digeser) */
 .galeri-carousel-wrapper.is-dragging {
     cursor: grabbing;
     scroll-snap-type: none;
}
 .galeri-carousel-wrapper:not(.is-dragging) {
     cursor: grab;
}
 .galeri-carousel-item {
    /* Mencegah item menciut */
     flex-shrink: 0;
     width: 250px;
     height: 180px;
     background-size: cover;
     background-position: center;
     border-radius: 8px;
     margin-right: 10px;
     box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
     transition: transform 0.2s;
}
 .galeri-carousel-item:hover {
     transform: scale(1.02);
}
/* Info Blocks (Grid 3 Kolom di Beranda) */
 .info-grid {
     display: grid;
    /* Otomatis membuat kolom minimal 300px */
     grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
     gap: 20px;
     margin-bottom: 30px;
}
 .info-block {
     background-color: var(--text-light);
     padding: 20px;
     border-radius: 8px;
     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
     transition: transform 0.3s;
    /* Garis vertikal sebagai highlight */
     border-left: 5px solid var(--accent-color);
}
 .info-block:hover {
     transform: translateY(-5px);
}
 .info-block h3 {
     color: var(--primary-color);
     margin-bottom: 10px;
}
/* Berita & Pengumuman (List Post di Beranda) */
 .post-list-section {
     background-color: #e9ecef;
     padding: 30px;
     border-radius: 8px;
     margin-bottom: 30px;
}
 .post-list-section h2 {
     color: var(--primary-color);
     text-align: center;
     margin-bottom: 20px;
}
 .post-list {
     list-style: none;
     padding: 0;
     margin-top: 20px;
}
 .post-list li {
     background-color: var(--text-light);
     padding: 15px;
    /* Garis highlight hijau */
     border-left: 4px solid var(--secondary-color);
     border-radius: 8px;
     font-size: 0.95em;
     box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    /* Flexbox untuk layout thumbnail + konten */
     display: flex;
     align-items: flex-start;
     gap: 15px;
     margin-bottom: 20px;
     overflow: hidden;
     transition: box-shadow 0.3s;
}
 .post-list li:hover {
     box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
 .post-list li img {
    /* Ukuran Thumbnail */
     width: 150px;
     height: 100px;
     flex-shrink: 0;
    /* Memastikan gambar terpotong rapi */
     object-fit: cover;
     border-radius: 5px;
     margin-bottom: 0;
}
 .post-list-content-wrapper {
     display: flex;
     flex-direction: column;
     flex-grow: 1;
}
 .post-list li h4 {
     font-size: 1.1em;
     margin-bottom: 5px;
     color: var(--primary-color);
}
 .post-list li span {
    /* Meta data: tanggal/author */
     font-size: 0.85em;
     color: #6c757d;
     margin-bottom: 5px;
     display: block;
}
 .post-list li p {
    /* Cuplikan teks post */
     margin-bottom: 10px;
     flex-grow: 1;
}
 .post-list li .read-more {
     font-size: 0.9em;
     font-weight: bold;
     color: var(--secondary-color);
    /* Selalu berada di kiri bawah konten */
     align-self: flex-start;
     margin-top: auto;
}
/* Sambutan Kepala Sekolah */
 .sambutan-container {
     display: flex;
     align-items: flex-start;
     gap: 30px;
     background-color: var(--text-light);
     padding: 20px;
     border-radius: 8px;
     box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
 .kepsek-photo {
     flex-shrink: 0;
     text-align: center;
}
 .kepsek-photo img {
     width: 150px;
     height: 180px;
     object-fit: cover;
     border-radius: 5px;
     border: 3px solid var(--secondary-color);
}
 .kepsek-name {
     margin-top: 5px;
     font-weight: bold;
     color: var(--secondary-color);
}
 .sambutan-text p {
     margin-bottom: 10px;
     text-align: justify;
}
/* --- Blok Pesan Khusus (Auto-Rotating Messages) --- */
 .special-message {
     padding: 0;
     margin: 0;
     margin-bottom: 20px;
    /* Penting: Menyembunyikan pesan yang tidak aktif/berada di luar viewport */
     overflow: hidden;
     position: relative;
     border-radius: 8px;
     box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}
 .message-wrapper {
     display: flex;
     transition: transform 0.8s ease-in-out;
     width: 100%;
}
/* Item Pesan */
 .message-item {
    /* Mencegah item menciut */
     flex-shrink: 0;
     width: 100%;
     background-color: var(--accent-color);
     border: 3px solid #e0ad00;
     color: var(--text-dark);
     padding: 20px;
     text-align: center;
     min-height: 100px;
}
 .message-item h3 {
     color: var(--primary-color);
     margin-bottom: 10px;
}
 .message-item .cta-button {
     margin-top: 10px;
    /* Tombol CTA di pesan khusus menggunakan warna sekunder */
     background-color: var(--secondary-color);
}
/* Tombol Navigasi Pesan Khusus (Panah) */
 .message-nav-button {
     display: flex;
     position: absolute;
     top: 50%;
     transform: translateY(-50%);
     background: rgba(0, 0, 0, 0.5);
     color: white;
     border: none;
     cursor: pointer;
     z-index: 20;
     font-size: 1.2em;
     border-radius: 50%;
     width: 35px;
     height: 35px;
     align-items: center;
     justify-content: center;
     transition: background 0.2s;
     opacity: 0.8;
}
 .message-nav-button:hover {
     background: var(--primary-color);
     opacity: 1;
}
 .message-nav-button.prev-message {
     left: 10px;
}
 .message-nav-button.next-message {
     right: 10px;
}
/* --- CSS Khusus Single Post (Halaman Postingan) --- */
/* Layout Utama Post: Flex (Konten Utama + Sidebar) */
 .single-post-layout {
     display: flex;
     gap: 30px;
     align-items: flex-start;
}
 .post-main-content {
    /* Ambil 3/4 lebar di desktop */
     flex: 3;
     background-color: var(--text-light);
     padding: 30px;
     border-radius: 8px;
     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
 .post-sidebar {
    /* Ambil 1/4 lebar di desktop */
     flex: 1;
     background-color: #f0f0f0;
     padding: 20px;
     border-radius: 8px;
     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    /* Sidebar tetap di tempat saat scrolling */
     position: sticky;
    /* Jarak dari header 80px + margin 10px */
     top: 90px;
}
/* Breadcrumb (Navigasi remah roti) */
 .breadcrumb {
     margin-bottom: 10px;
     font-size: 0.9em;
     color: #6c757d;
}
 .breadcrumb a {
     color: var(--primary-color);
}
 .breadcrumb span {
     margin: 0 5px;
}
/* Judul Postingan Utama (H2) */
 h2.post-title {
     font-size: 2.2em;
     line-height: 1.2;
     color: var(--primary-color);
     font-weight: 800;
     text-align: left;
     margin-top: 0;
     margin-bottom: 20px;
     padding-bottom: 15px;
     width:100%;
    /* Garis Pemisah tebal dengan warna aksen */
     border-bottom: 4px solid var(--accent-color);
    /* Agar border hanya selebar teks judul */
     display: inline-block;
     max-width: 100%;
}
 .post-body img {
     max-width: 100%;
     height: auto;
     border-radius: 8px;
     display:block;
     margin:15px auto;
    /* Tinggi gambar post default: 350px */
     max-height: 600px;
     object-fit: cover;
}
 .post-body p {
     margin-bottom: 1.5em;
     text-align: left;
}
/* KOREKSI: Mengembalikan indentasi (padding) pada daftar */
 .post-body ul, .post-body ol {
    /* Ini mengembalikan spasi di sisi kiri agar butir daftar tidak terlalu ke kiri */
     padding-left: 1em;
    /* Opsional: Menambahkan sedikit margin bawah agar daftar tidak menempel pada elemen berikutnya */
     margin-bottom: 1em;
}
 .post-body .post-list{
    padding-left:0;
}
/* Post Meta (Tanggal, Author, dll.) */
 .post-meta {
     margin-bottom: 30px;
     padding-bottom: 15px;
     border-bottom: 1px solid #ddd;
     font-size: 0.9em;
     color: #6c757d;
     display:block;
}
/* Sidebar Styles */
 .post-sidebar h3 {
     color: var(--primary-color);
     margin-bottom: 15px;
     border-bottom: 2px solid var(--accent-color);
     padding-bottom: 5px;
}
 .post-sidebar ul {
     list-style: none;
     padding: 0;
}
 .post-sidebar li {
     margin-bottom: 10px;
}
 .post-sidebar a {
     display: block;
     color: var(--text-dark);
     font-size: 0.95em;
     transition: color 0.3s;
}
 .post-sidebar a:hover {
     color: var(--secondary-color);
     text-decoration: underline;
}
/* --- Kontak, Peta & Footer --- */
/* Peta & Sosial Media */
 .map-container {
     width: 100%;
     margin: 20px auto;
     max-width: 800px;
}
 .social-links {
     margin-top: 15px;
     display: flex;
     justify-content: center;
     gap: 20px;
}
 .social-links a {
     font-size: 24px;
     color: var(--primary-color);
     transition: color 0.3s;
}
 .social-links a:hover {
     color: var(--secondary-color);
}
 footer {
     background-color: var(--text-dark);
     color: var(--text-light);
     text-align: center;
     padding: 20px;
     font-size: 0.9em;
     margin-top: 30px;
}
 table{
     border-collapse:collapse;
}
 th, td {
     border:1px solid #333;
     font-size:inherit;
     padding: 5px;
     word-break: normal;
}
 .noborder th, .noborder td {
     border: none;
}
 .frame-container {
     height: 0;
     overflow: hidden;
     padding-bottom: 56.25%;
     padding-top: 30px;
     position: relative;
}
 .frame-container iframe, .frame-container object, .frame-container embed {
     height: 100%;
     left: 0;
     position: absolute;
     top: 0;
     width: 100%;
}
/* ------------------------------------------------ */
/* --- Media Queries (Responsiveness) --- */
/* ------------------------------------------------ */
/* Tablet/Layar Sedang (Max 992px) */
 @media (max-width: 992px) {
    /* Tinggi Header Mobile */
     header {
         height: 60px;
         padding: 5px 20px;
    }
    /* Jarak Main/Body Mobile (Disinkronkan dengan tinggi header 60px) */
     body {
         padding-top: 60px;
    }
    /* PERUBAHAN FONT SIZE LOGO MOBILE */
     .logo h1 {
        /* Diperkecil agar muat di layar mobile */
         font-size: 1.2em;
    }
     .logo img {
        /* Ukuran Logo Mobile */
         height: 50px;
         margin-right: 8px;
    }
    /* Navigasi Mobile (Disembunyikan secara default) */
     nav ul {
         display: none;
         flex-direction: column;
         position: absolute;
        /* Menu Mulai Tepat di bawah Header 60px */
         top: 60px;
         right: 0;
         background-color: var(--primary-color);
         box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
         z-index:1;
         height: 100vh;
         max-height: calc(100vh - 60px);
         overflow-y: auto;
         -webkit-overflow-scrolling: touch;
    }
     nav ul li a {
        /* Padding vertikal menu mobile */
         padding: 12px 20px;
         border-top:1px dotted white;
    }
     nav ul li:last-child{
        border-bottom:1px dotted white;
    }
    /* Tampilkan menu saat class .active ditambahkan JS */
     nav ul.active {
         display: flex;
    }
    /* Tampilkan ikon Menu Toggle */
     .menu-toggle {
         display: block;
    }
    /* --- GAYA UNTUK MOBILE MENU OVERLAY (Click Outside) --- */
     .mobile-overlay {
        /* Penting: Menutupi seluruh sisa viewport */
         position: fixed;
         top: 60px;
         left: 0;
         width: 100%;
        /* Tinggi = 100% viewport - Tinggi Header 60px */
         height: calc(100% - 60px);
        /* Warna latar belakang semi-transparan hitam */
         background: rgba(0, 0, 0, 0.5);
        /* Sembunyikan secara default */
         display: none;
         opacity: 0;
         transition: opacity 0.3s ease;
    }
    /* Tampilkan overlay HANYA saat menu aktif */
    /* Menggunakan selector sibling general (~) */
     #navMenu.active ~ .mobile-overlay {
         display: block;
         opacity: 1;
    }
    /* Single Post Layout: Tumpuk Vertikal */
     .single-post-layout {
         flex-direction: column;
    }
     .post-main-content, .post-sidebar {
         flex: none;
         width: 100%;
    }
     .post-main-content {
         margin-bottom: 30px;
    }
     .post-sidebar {
        /* Hapus Sticky position di mobile */
         position: static;
         top: auto;
    }
    /* Dropdown Mobile: Menggunakan Flex untuk panah */
     .dropdown-link {
         display: flex !important;
         justify-content: space-between;
         align-items: center;
    }
    /* Dropdown: Pastikan konten tersembunyi/ditampilkan saat di mobile, bukan saat hover (desktop) */
     .dropdown:hover .dropdown-content, .dropdown-content.active {
         position: static;
         display: none;
         width: 100%;
         border-top: none;
         border-radius: 0;
    }
    /* Ketika class .open ditambahkan JS */
     .dropdown.open .dropdown-content {
         display: block;
         position: static;
    }
     .dropdown-content a {
        /* Beri warna latar belakang berbeda */
         background-color: rgba(0, 0, 0, 0.1);
    }
    /* Tanda Panah Mobile (Panah bawah/atas) */
     .dropdown > a::after {
         content: '\u25BC';
         font-size: 10px;
         margin-left: 5px;
         transition: transform 0.3s;
    }
     .dropdown.open > a::after {
        /* Ganti panah saat dibuka */
         content: '\u25B2';
    }
    /* Penyesuaian Komponen Lain di Tablet */
     .slider-container {
         height: 250px;
    }
     .slider-caption h3 {
         font-size: 1.5em;
    }
     .slider-caption p {
         font-size: 0.9em;
    }
     .info-grid {
        /* Grid menjadi satu kolom penuh */
         grid-template-columns: 1fr;
    }
     .sambutan-container {
        /* Tumpuk foto dan teks sambutan */
         flex-direction: column;
         align-items: center;
         text-align: center;
    }
     .sambutan-text {
         text-align: center;
    }
     .sambutan-text p {
        /* Kembalikan justifikasi teks pada paragraf */
         text-align: left;
    }
     .map-container {
         margin-left: auto;
         margin-right: auto;
    }
}
/* Mobile Phone (Max 768px) */
 @media (max-width: 768px) {
    /* Post List: Tumpuk vertikal (Gambar di atas teks) */
     .post-list li {
         flex-direction: column;
         align-items: stretch;
    }
     .post-list li img {
         width: 100%;
         height: 180px;
    }
    /* Sembunyikan cuplikan teks di HP agar ringkas */
     .post-list-snippet{
         display:none;
    }
    /* Judul Postingan di Mobile */
     h2.post-title {
         font-size: 1.6em;
         text-align: center;
         padding-bottom: 10px;
         margin-bottom: 15px;
         border-bottom: 3px solid var(--accent-color);
    }
    /* Meta data di tengah */
     .post-meta {
         text-align:center;
    }
    /* Tinggi gambar post dikurangi lagi */
     .post-body img {
         max-height: 450px;
    }
}
`;

/**
 * Menyuntikkan CSS ke dalam dokumen sebagai elemen <style>
 */
    const MAIN_STYLE_ID = 'smpn6-main-css';
    const mainStyleElement = document.getElementById(MAIN_STYLE_ID);
    
    if (mainStyleElement) {
      mainStyleElement.textContent = MAIN_CSS;
      console.log(`CSS berhasil disisipkan ke elemen <style id='${MAIN_STYLE_ID}'>.`);
    } else {
      console.warn(`Elemen <style id='${MAIN_STYLE_ID}'> tidak ditemukan! Membuat elemen <style> baru.`);
      const newMainStyleElement = document.createElement('style');
      newMainStyleElement.id = MAIN_STYLE_ID;
      newMainStyleElement.textContent = mainStyleElement;
      document.head.appendChild(newMainStyleElement);
    }

  // Tampilkan konten setelah style diterapkan
  document.getElementById('header').style.display = 'block';
  document.getElementById('main').style.display = 'block';
  document.getElementById('footer').style.display = 'block';
});

document.addEventListener('DOMContentLoaded', function() {
    // --- Variabel Navigasi ---
    // Pastikan ID ini sesuai dengan HTML Anda: #navMenu, #menuToggle, #mobileOverlay
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu'); // Menggunakan navMenu
    const mobileOverlay = document.getElementById('mobileOverlay'); // Untuk Click Outside
    const dropdowns = document.querySelectorAll('.dropdown'); // Sesuaikan selector jika perlu

    // Fungsi utilitas untuk menutup menu
    function closeMenuAndDropdowns() {
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        dropdowns.forEach(d => {
            d.classList.remove('open');
            // Reset display style jika Anda menggunakan JS untuk toggle display
            const dropdownContent = d.querySelector('.dropdown-content');
            if (dropdownContent) {
                dropdownContent.style.display = 'none';
            }
        });
    }

    // --- 1. Navigasi dan Dropdown Logic (Mobile: < 992px) ---
    if (menuToggle && navMenu) {
        // Toggle Menu Navigasi (Mobile)
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Click Outside Logic
        if (mobileOverlay) {
             mobileOverlay.addEventListener('click', closeMenuAndDropdowns);
        }

        // Toggle Dropdown Menu (Mobile)
        dropdowns.forEach(dropdown => {
            const dropdownLink = dropdown.querySelector('.dropdown-link');

            if (dropdownLink) {
                dropdownLink.addEventListener('click', function(e) {
                    // Gunakan breakpoint 992px
                    if (window.innerWidth <= 992) {
                        e.preventDefault();

                        // Tutup dropdown lain
                        dropdowns.forEach(otherDropdown => {
                            if (otherDropdown !== dropdown) {
                                otherDropdown.classList.remove('open');
                                const otherDropdownContent = otherDropdown.querySelector('.dropdown-content');
                                if (otherDropdownContent) {
                                    otherDropdownContent.style.display = 'none';
                                }
                            }
                        });

                        // Buka/tutup dropdown saat ini
                        dropdown.classList.toggle('open');
                        const dropdownContent = dropdown.querySelector('.dropdown-content');
                        if (dropdownContent) {
                            dropdownContent.style.display = dropdown.classList.contains('open') ? 'block' : 'none';
                        }
                    }
                });
            }
        });

        // Menutup menu saat link non-dropdown diklik (untuk UX mobile)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 992 && !link.classList.contains('dropdown-link')) {
                    closeMenuAndDropdowns();
                }
            });
        });

        // Reset display dropdown saat resize ke desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992) {
                navMenu.classList.remove('active');
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('open');
                    const dropdownContent = dropdown.querySelector('.dropdown-content');
                    if (dropdownContent) {
                        // Kosongkan style display agar CSS desktop yang mengambil alih
                        dropdownContent.style.display = ''; 
                    }
                });
            }
        });
    }

    // --- 2. Image Slider Logic (Main Slider) ---
    const sliderWrapper = document.querySelector('.slider-wrapper');
    if (sliderWrapper) {
        const sliderItems = document.querySelectorAll('.slider-item');
        const prevButton = document.querySelector('.slider-container .prev');
        const nextButton = document.querySelector('.slider-container .next');
        let currentIndex = 0;
        const totalItems = sliderItems.length;

        function updateSliderPosition() {
            if (totalItems > 0) {
                 sliderWrapper.style.transform = `translateX(${-currentIndex * 100}%)`;
            }
        }

        if (totalItems > 1 && prevButton && nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalItems;
                updateSliderPosition();
            });

            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalItems) % totalItems;
                updateSliderPosition();
            });

            // Auto-slide
            let autoSlideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % totalItems;
                updateSliderPosition();
            }, 5000);

            // Hentikan auto-slide saat hover
            const sliderContainer = document.querySelector('.slider-container');
            if (sliderContainer) {
                const clearAndRestartInterval = () => {
                    clearInterval(autoSlideInterval);
                    autoSlideInterval = setInterval(() => {
                        currentIndex = (currentIndex + 1) % totalItems;
                        updateSliderPosition();
                    }, 5000);
                };

                sliderContainer.addEventListener('mouseenter', () => {
                    clearInterval(autoSlideInterval);
                });
                sliderContainer.addEventListener('mouseleave', clearAndRestartInterval);
            }

            // Update posisi slider saat resize
            window.addEventListener('resize', () => {
                updateSliderPosition();
            });
        }
    }

    // --- 3. FUNGSI PESAN OTOMATIS + MANUAL (Message Carousel) ---
    function initializeMessageCarousel() {
        const wrapper = document.getElementById('messageWrapper');
        const prevBtn = document.getElementById('prevMessage');
        const nextBtn = document.getElementById('nextMessage');

        if (!wrapper || !prevBtn || !nextBtn) return;

        const items = wrapper.querySelectorAll('.message-item');
        const totalItems = items.length;
        let currentIdx = 0;
        let autoSlideInterval; 

        if (totalItems <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            return;
        }

        function updateCarousel() {
            const offset = -currentIdx * 100;
            wrapper.style.transform = `translateX(${offset}%)`;
        }
        
        function startAutoSlide() {
            clearInterval(autoSlideInterval); 
            
            autoSlideInterval = setInterval(() => {
                currentIdx = (currentIdx + 1) % totalItems; 
                updateCarousel();
            }, 7000); // Putar otomatis setiap 7 detik
        }
        
        function manualAdvance(direction) {
            clearInterval(autoSlideInterval);
            
            if (direction === 'next') {
                currentIdx = (currentIdx + 1) % totalItems;
            } else { // 'prev'
                currentIdx = (currentIdx === 0) ? totalItems - 1 : currentIdx - 1; 
            }
            
            updateCarousel();
            
            // Lanjutkan auto-slide setelah jeda 15 detik
            setTimeout(startAutoSlide, 15000); 
        }

        prevBtn.onclick = () => manualAdvance('prev');
        nextBtn.onclick = () => manualAdvance('next');
        
        // Inisialisasi
        updateCarousel(); 
        startAutoSlide(); 
    }

    // Panggil fungsi inisialisasi tambahan
    initializeMessageCarousel();
    // Jika ada initializeLatestCarousel() atau initializePostListCarousel() yang sudah dibuat, 
    // pastikan juga dipanggil di sini.
});