//<script type="text/javascript">
// Fungsi untuk mengacak array (Fisher-Yates Shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Fungsi callback untuk memproses JSON Feed Blogger dan mengisi slider secara acak
function showRandomSliderPosts(json) {
    const wrapper = document.getElementById('random-slider-wrapper');
    if (!wrapper || !json.feed.entry) return; // Pastikan elemen dan data ada

    let allPostsData = [];

    // 1. Kumpulkan data penting dari setiap postingan yang diambil
    json.feed.entry.forEach(entry => {
        // Ambil Tautan
        let postUrl = entry.link.find(l => l.rel === 'alternate').href;
        // Ambil Judul
        let postTitle = entry.title.$t;
        
        // Ambil Ringkasan Konten (Snippet)
        let postContent = ('content' in entry) ? entry.content.$t : ('summary' in entry) ? entry.summary.$t : "";
        let strippedContent = postContent.replace(/<.*?>/g, ""); 
        // Batasi hingga 20 kata
        let snippet = strippedContent.split(/\s+/).slice(0, 10).join(" ") + "...";
        
        // Ambil Gambar (Target: Ukuran Original/Terbesar - /s1600)
        let imageUrl = "https://via.placeholder.com/1200x600?text=No+Image"; // Placeholder default

        if (entry.media$thumbnail) {
            // Ambil URL thumbnail dan ubah ke ukuran terbesar (s1600)
            imageUrl = entry.media$thumbnail.url;
            imageUrl = imageUrl.replace(/\/s\d+(-c)?\/?/, "/s1600/"); 
        } else if (entry.content && entry.content.$t) {
            // Cari gambar pertama di konten
            const imgMatch = entry.content.$t.match(/<img[^>]+src="([^">]+)"/i);
            
            if (imgMatch && imgMatch[1]) {
                imageUrl = imgMatch[1];
                // Jika gambar adalah dari Blogger, ubah ke s1600
                if (imageUrl.includes('.blogspot.com') || imageUrl.includes('.googleusercontent.com')) {
                   imageUrl = imageUrl.replace(/\/s\d+\/?/, '/s1600/');
                   imageUrl = imageUrl.replace(/\/w\d+-h\d+-c\/?/, '/s1600/'); 
                }
            }
        }
        
        allPostsData.push({
            url: postUrl,
            title: postTitle,
            snippet: snippet,
            image: imageUrl
        });
    });

    // 2. Acak array postingan
    const randomPosts = shuffleArray(allPostsData);
    
    // 3. Bangun HTML untuk Slider
    let htmlContent = '';
    randomPosts.forEach(post => {
        htmlContent += `
            <div class="slider-item" style="background-image: url('${post.image}');">
                <div class="slider-caption">
                    <h3><a href="${post.url}" title="${post.title}">${post.title}</a></h3>
                </div>
            </div>
        `;
    });

    wrapper.innerHTML = htmlContent;
    
    // PENTING: Panggil fungsi inisialisasi slider Anda di sini 
    // jika diperlukan, misalnya:
    // if (typeof initializeSlider === 'function') {
    //     initializeSlider();
    // }
}
//</script>
/*
<section class="slider-container">
    <div class="slider-wrapper" id="random-slider-wrapper">
        </div>
    
    <button class="slider-nav-button prev">❮</button>
    <button class="slider-nav-button next">❯</button>
</section>

<script type="text/javascript" 
    src="/feeds/posts/default/-/_slider?alt=json-in-script&amp;max-results=5&amp;callback=showRandomSliderPosts">
</script>
*/