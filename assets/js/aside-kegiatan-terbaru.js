//<script type="text/javascript">
// Fungsi untuk mengambil dan menampilkan postingan dari kategori/label tertentu
function showLabelPosts(json) {
    var ul = document.getElementById('kegiatan-terbaru-aside'); // ID UL yang akan diisi
    
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
        
        // Buat elemen LI baru
        var li = document.createElement('li');
        li.className = 'post-list-by-label-item';
        
        // Tambahkan elemen ringkasan/snippet ke HTML
        li.innerHTML = `
                <a href="${postUrl}" title="${postTitle}">${postTitle}</a>
        `;
        
        ul.appendChild(li);
    }
}
//</script>
/*
<h3>Kegiatan</h3>
    
    <ul id="kegiatan-terbaru-aside">
        </ul>
    
    <script type="text/javascript" 
        src="/feeds/posts/default/-/Kegiatan?alt=json-in-script&amp;max-results=5&amp;callback=showLabelPosts">
    </script>
*/