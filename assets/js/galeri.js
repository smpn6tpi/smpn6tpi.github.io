//<script type="text/javascript">
// Fungsi untuk mengacak array (Fisher-Yates Shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Fungsi callback untuk memproses JSON Feed Blogger
function showGaleri(json) {
    const wrapper = document.getElementById('galeri-carousel-wrapper');
    if (!wrapper) return;

    let allImages = [];

    // 1. Kumpulkan semua gambar dari semua postingan
    json.feed.entry.forEach(entry => {
        let imageUrl = null;
        
        // Coba ambil dari media$thumbnail
        if (entry.media$thumbnail) {
            imageUrl = entry.media$thumbnail.url;
            // Ubah ukuran menjadi 500x350px untuk thumbnail, simpan URL asli untuk zoom
            imageUrl = imageUrl.replace("/s72-c/", "/w500-h350-c/"); 
            originalUrl = entry.media$thumbnail.url.replace("/s72-c/", "/s1600/"); // Ambil ukuran besar
        } 
        // Jika tidak ada thumbnail, coba cari di konten
        else if (entry.content && entry.content.$t) {
            const imgMatch = entry.content.$t.match(/<img[^>]+src="([^">]+)"/i);
            if (imgMatch && imgMatch[1]) {
                imageUrl = imgMatch[1];
                originalUrl = imageUrl;
                
                if (imageUrl.includes('.blogspot.com')) {
                   imageUrl = imageUrl.replace(/\/s\d+\/?/, '/w500-h350-c/');
                   imageUrl = imageUrl.replace(/\/w\d+-h\d+-c\/?/, '/w500-h350-c/');
                   originalUrl = originalUrl.replace(/\/s\d+\/?/, '/s1600/');
                   originalUrl = originalUrl.replace(/\/w\d+-h\d+-c\/?/, '/s1600/');
                }
            }
        }
        
        if (imageUrl) {
            allImages.push({ thumb: imageUrl, full: originalUrl });
        }
    });

    // 2. Acak array gambar dan ambil 10 teratas
    const randomImages = shuffleArray(allImages).slice(0, 10);
    
    // 3. Bangun HTML
    let htmlContent = '';
    randomImages.forEach(img => {
        htmlContent += `
            <div class="carousel-item galeri-carousel-item" 
                 style="background-image: url('${img.thumb}');"
                 data-full-url="${img.full}"
                 title="Klik untuk Zoom">
            </div>
        `;
    });

    wrapper.innerHTML = htmlContent;
    
    // 4. Inisialisasi Dragging dan Click Zoom
    initializeDragging(wrapper.id);
    initializeClickZoom(wrapper); // Panggil fungsi zoom baru
}

// FUNGSI BARU: INTI DRAG-TO-SCROLL (GESER HORIZONTAL SAJA)
function initializeDragging(wrapperId) {
    const slider = document.getElementById(wrapperId);
    if (!slider) return;

    let isDown = false;
    let startX;
    let startY; // Untuk melacak posisi vertikal
    let scrollLeft;
    const DRAG_THRESHOLD = 5; // Geser minimal 5px baru dianggap drag

    const handleStart = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.pageX;
        const clientY = e.touches ? e.touches[0].clientY : e.pageY;

        isDown = true;
        slider.classList.add('is-dragging');
        startX = clientX - slider.offsetLeft;
        startY = clientY;
        scrollLeft = slider.scrollLeft;
        
        // Set properti untuk mendeteksi apakah terjadi drag atau klik
        slider.dataset.moved = 'false'; 
    };
    
    const handleMove = (e) => {
        if (!isDown) return;
        
        const clientX = e.touches ? e.touches[0].clientX : e.pageX;
        const clientY = e.touches ? e.touches[0].clientY : e.pageY;
        
        const currentX = clientX - slider.offsetLeft;
        
        // Jarak yang ditempuh horizontal & vertikal
        const dx = Math.abs(currentX - startX);
        const dy = Math.abs(clientY - startY);
        
        // Cek apakah pergerakan sudah melewati threshold
        if (dx > DRAG_THRESHOLD) {
            // Ini adalah pergerakan horizontal, aktifkan drag
            e.preventDefault(); // Mencegah scrolling vertikal standar
            slider.dataset.moved = 'true'; // Set status drag
            
            const walk = (currentX - startX) * 1.5; 
            slider.scrollLeft = scrollLeft - walk;
        } 
        
        // Jika pergerakan vertikal lebih dominan, biarkan e.preventDefault() tidak aktif
        // sehingga browser bisa melakukan scroll vertikal
    };

    const handleEnd = (e) => {
        isDown = false;
        slider.classList.remove('is-dragging');
    };
    
    // Desktop Events
    slider.addEventListener('mousedown', handleStart);
    slider.addEventListener('mouseleave', handleEnd);
    slider.addEventListener('mouseup', handleEnd);
    slider.addEventListener('mousemove', handleMove);
    
    // Mobile/Touch Events
    slider.addEventListener('touchstart', handleStart);
    slider.addEventListener('touchend', handleEnd);
    slider.addEventListener('touchmove', handleMove);
}

// FUNGSI BARU: INTI CLICK ZOOM (LIGHTBOX SEDERHANA)
function initializeClickZoom(wrapper) {
    const items = wrapper.querySelectorAll('.galeri-carousel-item');

    // Buat elemen lightbox (hanya sekali)
    if (!document.getElementById('simpleLightbox')) {
        const lightboxHTML = `
            <div id="simpleLightbox" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 9999; display: none; justify-content: center; align-items: center; cursor: zoom-out;">
                <img id="lightboxImage" src="" style="max-width: 90%; max-height: 90%; object-fit: contain; cursor: pointer;">
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }
    
    const lightbox = document.getElementById('simpleLightbox');
    const lightboxImage = document.getElementById('lightboxImage');

    // Logika menutup lightbox
    if (lightbox) {
        lightbox.onclick = () => {
            lightbox.style.display = 'none';
        };
    }
    
    // Logika membuka lightbox saat item diklik
    items.forEach(item => {
        item.addEventListener('click', (e) => {
             // Cek apakah terjadi drag atau hanya klik
             if (wrapper.dataset.moved === 'true') {
                 // Jika terdeteksi drag (moved), jangan zoom, dan reset status
                 wrapper.dataset.moved = 'false'; 
                 return;
             }
             
             e.stopPropagation(); // Mencegah event menyebar
             
             const fullUrl = item.getAttribute('data-full-url');
             if (fullUrl && lightbox) {
                 lightboxImage.src = fullUrl;
                 lightbox.style.display = 'flex';
             }
        });
    });
}
//</script>
/*
<section id="galeri" class="content-section" style="text-align: center; padding: 20px; margin-bottom:30px; background-color: #dee2e6; border-radius: 8px;">
    <h2>Galeri</h2>
    
    <div class="carousel-wrapper galeri-carousel-wrapper" id="galeri-carousel-wrapper">
        <p style="padding: 20px; text-align: center;">Memuat gambar galeri...</p>
    </div>
    
    <script type="text/javascript" 
        src="/feeds/posts/default/-/_galeri?alt=json-in-script&amp;max-results=10&amp;callback=showGaleri">
    </script>
</section>
*/