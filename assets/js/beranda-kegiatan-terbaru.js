//<script type="text/javascript">
// Fungsi untuk mengambil dan menampilkan postingan dari kategori/label tertentu
function showLabelPosts(json) {
    var ul = document.getElementById('kegiatan-terbaru-beranda'); // ID UL yang akan diisi
    
    for (var i = 0; i < json.feed.entry.length; i++) {
        var entry = json.feed.entry[i];
        
        // 1. Ambil Tautan (Link)
        var postUrl = "";
        for (var k = 0; k < entry.link.length; k++) {
            if (entry.link[k].rel == 'alternate') {
                postUrl = entry.link[k].href;
                break;
            }
        }
        
        // 2. Ambil Judul
        var postTitle = entry.title.$t;
        
       // ... (Bagian sebelumnya dari fungsi JSON Feed)

// 3. Ambil Thumbnail (Gambar Pertama Post)

var thumbnail = "https://via.placeholder.com/320x200?text=No+Image"; // Gambar default jika tidak ada

// 1. Cek apakah ada media$thumbnail dari Blogger

if (entry.media$thumbnail) {

    thumbnail = entry.media$thumbnail.url;

    // Ubah ukuran gambar thumbnail Blogger menjadi medium (s320)

    thumbnail = thumbnail.replace(/\/s\d+(-c)?\/?/, "/s320/"); 

    

// 2. Jika tidak ada thumbnail, cari gambar pertama di konten

} else if (entry.content && entry.content.$t) {

    // Cari tag <img> pertama dalam konten postingan

    var imgMatch = entry.content.$t.match(/<img[^>]+src="([^">]+)"/i);

    

    if (imgMatch && imgMatch[1]) {

        thumbnail = imgMatch[1];

        

        // Cek apakah ini gambar dari Blogger, lalu ubah ukurannya menjadi medium

        if (thumbnail.includes('.blogspot.com') || thumbnail.includes('.googleusercontent.com')) {

           // Ubah ukuran menjadi /s320/

           thumbnail = thumbnail.replace(/\/s\d+\/?/, '/s320/');

           

           // Khusus jika menggunakan format wXX-hYY-c/ (format baru Blogger)

           thumbnail = thumbnail.replace(/\/w\d+-h\d+-c\/?/, '/s320/');

        }

        // Jika gambarnya adalah eksternal (bukan Blogger), gunakan URL asli.

        // Anda bisa tambahkan pengecekan ukuran di sini jika diperlukan.

    }

}

        // 4. Ambil Ringkasan Konten (Snippet) <--- BARU
        var postContent = ('content' in entry) ? entry.content.$t : ('summary' in entry) ? entry.summary.$t : "";
        // Hapus tag HTML
        var strippedContent = postContent.replace(/<.*?>/g, ""); 
        // Batasi hingga 20 kata
        var snippet = strippedContent.split(/\s+/).slice(0, 20).join(" ") + "..."; 

        // 5. Ambil Tanggal
        var date = new Date(entry.published.$t);
        var postDate = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        
        // Buat elemen LI baru
        var li = document.createElement('li');
        li.className = 'post-list-by-label-item';
        
        // Tambahkan elemen ringkasan/snippet ke HTML
        li.innerHTML = `
            
                    <a href="${postUrl}" title="${postTitle}"><img src="${thumbnail}" alt="${postTitle}" loading="lazy"/></a>
                
            <div class="post-list-content-wrapper">
                <h4><a href="${postUrl}" title="${postTitle}">${postTitle}</a></h4>
                <p class="post-list-snippet">${snippet}</p>
                <a class="read-more" href="${postUrl}" title="${postTitle}">Selengkapnya</a>
            </div>
        `;
        
        ul.appendChild(li);
    }
}
//</script>
/*
<section class='post-list-section'>
<h2>Kegiatan</h2>
    
    <ul id="kegiatan-terbaru-beranda" class="post-list">
        </ul>
    
    <script type="text/javascript" 
        src="/feeds/posts/default/-/Kegiatan?alt=json-in-script&amp;max-results=5&amp;callback=showLabelPosts">
    </script>
    
    <p style="text-align: center; margin-top: 20px;">
        <a href="/search/label/Kegiatan" class="cta-button">Lihat Semua Kegiatan »</a>
    </p>
</section>
*/