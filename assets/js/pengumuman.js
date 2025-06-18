//<script type="text/javascript">
/**
 * showSpecialMessages: Mengambil postingan dari JSON Feed dan merender sebagai item pesan khusus.
 * @param {object} json - Objek JSON Feed dari Blogger.
 */
function showSpecialMessages(json) {
    const wrapper = document.getElementById('messageWrapper');
    if (!wrapper || !json.feed.entry) {
        // console.log('Message wrapper not found or no data.');
        return; 
    }

    let htmlContent = '';

    json.feed.entry.forEach(entry => {
        // 1. Ambil Tautan (Link)
        let postUrl = "#"; // Default ke '#' jika tidak ada link
        const link = entry.link.find(l => l.rel === 'alternate');
        if (link) {
            postUrl = link.href;
        }

        // 2. Ambil Judul (sebagai H3)
        const postTitle = entry.title.$t;

        // 3. Ambil Ringkasan/Snippet (sebagai <p>)
        let postContent = ('content' in entry) ? entry.content.$t : ('summary' in entry) ? entry.summary.$t : "";
        // Hapus tag HTML
        const strippedContent = postContent.replace(/<.*?>/g, ""); 
        // Batasi hingga 30 kata (atau sesuai kebutuhan untuk pesan singkat)
        const snippet = strippedContent.split(/\s+/).slice(0, 10).join(" ") + "..."; 

        // 4. Bangun HTML untuk Message Item
        // Note: Gunakan 'postUrl' sebagai link CTA
        htmlContent += `
            <div class="message-item">
                <h3>${postTitle}</h3>
                <p>${snippet}</p>
                <a href="${postUrl}" class="cta-button">Lihat Detail</a>
            </div>
        `;
    });

    // Masukkan HTML ke wrapper
    wrapper.innerHTML = htmlContent+`
<!--div class="message-item">
                <h3>Judul</h3>
                <p>ringkasan</p>
                <a href="#" class="cta-button">Lihat Detail</a>
            </div-->
`;

    // PENTING: Jika Anda memiliki fungsi JS untuk menginisialisasi carousel pesan, 
    // panggil di sini setelah data dimuat:
    // initializeMessageCarousel(); 
}
//</script>
/*
<section class="special-message" id="specialMessage">
    <div class="message-wrapper" id="messageWrapper">
        </div>
    
    <button class="message-nav-button prev-message" id="prevMessage">❮</button>
    <button class="message-nav-button next-message" id="nextMessage">❯</button>
    
</section>

<script type="text/javascript" 
    src="/feeds/posts/default/-/Pengumuman?alt=json-in-script&amp;max-results=3&amp;callback=showSpecialMessages">
</script>
*/