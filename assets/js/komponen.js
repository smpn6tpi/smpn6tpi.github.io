const APP_URL_KOMPONEN = 'https://script.google.com/macros/s/AKfycbyN03_o4teLqfQQ1GbkCJ6KmmJdLzYr0mmOaCvF_7rO__bjGmIo4b7xjjZe010fPV6Ajg/exec';
document.addEventListener('DOMContentLoaded', function() {
        // Hanya dijalankan jika APP_URL_KOMPONEN sudah didefinisikan
        if (typeof APP_URL_KOMPONEN === 'undefined') return;

        fetch(APP_URL_KOMPONEN + "?action=vars") 
            .then(res => res.json())
            .then(variables => {
                for (const id in variables) {
                    const element = document.getElementById(id);
                    if (element) {
                        element.innerHTML = variables[id];
                    }
                }
            })
            .catch(error => console.error('Gagal memuat komponen:', error));
    });
