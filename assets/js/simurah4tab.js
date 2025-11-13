// =========================================================
    // KONFIGURASI GLOBAL
    // =========================================================
    // GANTI DENGAN URL APPS SCRIPT ANDA
    const SCRIPT_URL_SIMURAH = 'https://script.google.com/macros/s/AKfycbx6y5crSV_pD8jR8m0up9883T0R-2sT7hK5A114SazK_a26TzySVZ0Zsifki9bm5j-MrA/exec';
    const PIN_KEY = 'dailyAbsensiPin'; // Kunci localStorage untuk PIN
    const today = new Date(); 
    let googleChartLoaded = false; // Flag status Google Charts
    let currentDataBulanan = null; // Data sementara untuk grafik bulanan

    // STATE GLOBAL PIN
    let isPinValid = false; 

    // Variabel Global untuk Halaman 1 (Input Absensi)
    const kelasSelect = document.getElementById('kelas');
    const namaSelect = document.getElementById('nama');
    const keteranganSelect = document.getElementById('keterangan');
    const namaManualInput = document.getElementById('namaManual');
    const addButton = document.getElementById('addButton'); 
    const queueContainer = document.getElementById('queue-container'); 
    const absensiQueueUL = document.getElementById('absensiQueue'); 
    const sendQueueBtn = document.getElementById('sendQueueBtn'); 

    let absensiQueue = [];

// Tampilkan CSS
document.addEventListener('DOMContentLoaded', function() {
    // 1. String CSS Lengkap
    // Menggunakan template literal (backticks `) untuk menyimpan seluruh blok CSS Anda.
    const simurahGlobalStyles = `
/* Container Utama */
        #app-container {
            max-width: 800px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #e0e0e0;
        }

        /* Header Menu (Mobile) */
        #menu-header {
            display: none; /* Default hidden on desktop */
            background-color: #00448A;
            color: white;
            padding: 10px;
        }
        #menu-toggle-btn {
            background: none;
            border: none;
            color: white;
            font-size: 1.5em;
            cursor: pointer;
            padding: 0 10px;
        }

        /* Wrapper Menu Navigasi */
        #menu-wrapper {
            background-color: #00448A;
            color: white;
            border-bottom: 3px solid #FFC107;
            padding: 0;
        }
        #toggle-buttons {
            display: flex;
            width: 100%;
        }
        .toggle-tab {
            flex-grow: 1;
            text-align: center;
            padding: 15px 10px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            font-size: 0.9em;
        }
        .tab-active {
            background-color: #FFC107;
            color: #333;
            box-shadow: inset 0 3px 0 #FF9800;
        }
        .tab-inactive {
            background-color: #004d9a;
            color: #c9e6ff;
        }
        .tab-inactive:hover {
            background-color: #005aa9;
        }

        /* Kontrol PIN Sentral */
        #central-pin-container {
            padding: 15px;
            background-color: #eef4f8;
            border-bottom: 1px solid #dcdcdc;
        }
        #centralPinInput {
            border: 1px solid #ccc;
            padding: 10px;
            border-radius: 6px;
            transition: border-color 0.3s;
        }
        #centralPinInput:focus {
            border-color: #00448A;
            outline: none;
        }
        #checkPinBtn {
            background-color: #008000;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        #checkPinBtn:hover:not(:disabled) {
            background-color: #006400;
        }
        #centralPinInput:disabled, #checkPinBtn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }

        /* Status Messages */
        .status-message {
            margin-top: 10px;
            padding: 8px 15px;
            border-radius: 4px;
            font-size: 0.9em;
            text-align: center;
        }
        .status-error-2 {
            background-color: #ffebeb;
            border: 1px solid #f99;
            color: #d9534f;
        }
        .status-success-2 {
            background-color: #e6ffe6;
            border: 1px solid #9f9;
            color: #008000;
        }
        .status-loading-2 {
            background-color: #f0f8ff;
            border: 1px solid #cce5ff;
            color: #00448A;
        }
        .status-unverified {
             color: #dc3545;
             font-weight: bold;
        }


        /* Section Content */
        .tab-content-section {
            padding: 20px 0px;
            display: none;
        }
        .tab-content-section h2 {
            margin-top: 0;
            color: #00448A;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }

        /* Form Styling (Input Absensi) */
        .input-absen-form-container {
            max-width: 440px;
            margin: 0 auto;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #00448A;
        }
        .form-group select, .form-group input[type="text"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            box-sizing: border-box;
            background-color: #fff;
        }

        /* Tombol Aksi */
        button:not(#checkPinBtn):not(.delete-btn) {
            transition: background-color 0.3s, opacity 0.3s;
            border-radius: 6px;
            font-size: 1em;
        }
        button:hover:not(:disabled) {
            filter: brightness(1.1);
        }
        button:disabled {
            background-color: #cccccc !important;
            cursor: not-allowed;
            color: #777;
        }
        #addButton {
            background-color: #28a745;
        }
        #sendQueueBtn {
            background-color: #00448A;
        }
        #refreshButton, #goToVerifikasiBtn, #refreshVerifikasiBtn, #goToInputBtn, #applyFilter {
            background-color: #FFC107 !important;
            color: #333 !important;
            border: 1px solid #FFC107;
            padding: 8px 12px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
        }
        table.noborder td, table.noborder th {
            border: none;
            padding: 5px;
        }

        /* Queue Container */
        #queue-container {
            background-color: #f9f9f9;
            border: 1px solid #e0e0e0 !important;
            border-radius: 8px !important;
            margin-top: 20px;
        }
        #absensiQueue li {
            padding: 8px 0;
            border-bottom: 1px dashed #ddd;
            font-size: 0.9em;
        }
        #absensiQueue li:last-child {
            border-bottom: none;
        }

        /* Tabel Umum */
        .data-table, .rekap-table-harian, .rekap-table-bulanan {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            font-size: 0.9em;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        .data-table th, .rekap-table-harian th, .rekap-table-bulanan th {
            background-color: #00448A;
            color: white;
            padding: 12px 8px;
            text-align: center;
            border: 1px solid #003366;
            font-weight: 600;
        }
        .data-table td, .rekap-table-harian td, .rekap-table-bulanan td {
            padding: 10px 8px;
            border: 1px solid #e9ecef;
            text-align: center;
        }
        .data-table tbody tr:nth-child(even), .rekap-table-harian tbody tr:nth-child(even), .rekap-table-bulanan tbody tr:nth-child(even) {
            background-color: #f7f9fb;
        }
        .data-table tbody tr:hover, .rekap-table-harian tbody tr:hover, .rekap-table-bulanan tbody tr:hover {
            background-color: #eaf0f5;
        }
        .total-row {
            font-weight: bold;
            background-color: #fff3cd !important;
            color: #856404;
        }
        .row-header td {
            background-color: #e6f7ff !important;
            font-weight: bold;
            text-align: left !important;
            color: #00448A;
        }
        .absen-count, .absen-count-bulanan {
            font-weight: bold;
        }
        
        /* Checkbox untuk Verifikasi */
        .data-table input[type="checkbox"] {
            transform: scale(1.2);
            cursor: pointer;
        }

        /* Filter Controls Bulanan */
        .filter-controls select, .filter-controls button {
            padding: 8px;
            border-radius: 6px;
            margin: 5px;
        }

        /* Responsiveness (Penting untuk Blogger) */
        @media (max-width: 600px) {
            #app-container {
                margin: 0;
                border-radius: 0;
                box-shadow: none;
                border: none;
            }
            
            /* Sembunyikan Navigasi Desktop, Tampilkan Tombol Mobile */
            #menu-header {
                display: flex;
                justify-content: flex-start;
                align-items: center;
            }
            #menu-wrapper {
                 /* Sembunyikan menu wrapper secara default di mobile */
                display: none;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            #menu-wrapper.menu-open {
                display: block;
            }
            #toggle-buttons {
                flex-direction: column;
            }
            .toggle-tab {
                padding: 12px;
                border-bottom: 1px solid #005aa9;
            }
            
            .tab-content-section {
                padding: 15px 0px;
            }

            /* Tabel lebih adaptif di mobile */
            .table-responsive {
                overflow-x: auto;
            }
            .data-table, .rekap-table-harian, .rekap-table-bulanan {
                min-width: 500px; /* Minimal width agar tabel tidak terlalu sempit */
            }
            
            /* Kontrol PIN */
            #central-pin-container .form-group > div {
                flex-direction: column;
            }
            #checkPinBtn {
                width: 100%;
                margin-top: 5px;
            }
        }
`; 

    // 2. Logika Penyisipan CSS ke Elemen yang Sudah Ada
    const STYLE_ID_SIMURAH = 'css-style-simurah';
    const styleElement = document.getElementById(STYLE_ID_SIMURAH);
    
    if (styleElement) {
        // Menyisipkan string CSS ke dalam elemen <style id="...">
        styleElement.textContent = simurahGlobalStyles;
        console.log(`CSS berhasil disisipkan ke elemen <style id='${STYLE_ID_SIMURAH}'>.`);
    } else {
        // Fallback: Jika elemen <style> dengan ID tersebut tidak ditemukan,
        // buat elemen baru dan sisipkan ke <head>.
        console.warn(`Elemen <style id='${STYLE_ID_SIMURAH}'> tidak ditemukan! Membuat elemen <style> baru.`);
        const newStyleElement = document.createElement('style');
        newStyleElement.id = STYLE_ID_SIMURAH;
        newStyleElement.textContent = simurahGlobalStyles;
        document.head.appendChild(newStyleElement);
    }
    
    // Tampilkan konten setelah style diterapkan
    document.getElementById('app-container').style.display = 'block';
});

// =========================================================
    // FUNGSI UTILITY GLOBAL 
    // =========================================================

    /**
     * Fungsi untuk memperbarui status pesan di UI
     * @param {string} elementId ID elemen status
     * @param {string} message Pesan yang ditampilkan
     * @param {'blue'|'success'|'error'|'warning'} type Jenis pesan
     */
    function updateStatus(elementId, message, type = 'blue') {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let className = 'status-loading-2'; // Default ke loading/blue
        switch(type) {
            case 'error': className = 'status-error-2'; break;
            case 'success': className = 'status-success-2'; break;
            case 'warning': className = 'status-loading-2'; break; // Peringatan pakai loading style
            default: className = 'status-loading-2'; break;
        }

        element.textContent = message;
        element.className = className;
        element.style.display = 'block';
        
        // Atur warna teks manual untuk status PIN sentral (untuk konsistensi)
        if (elementId === 'central-pin-status') {
             element.style.color = type === 'error' ? '#d9534f' : type === 'success' ? '#008000' : '#00448A';
        }
        
        // Sembunyikan pesan loading jika status sukses pada Rekap Harian/Bulanan
        if(elementId.startsWith('loading-status') && type === 'success') {
             element.style.display = 'none';
        }
    }


    // --- FUNGSI INPUT ABSENSI (GLOBAL SCOPE) ---

    /**
     * Memperbarui tampilan daftar tunggu (queue) di UI.
     */
    function updateQueueDisplay() {
        absensiQueueUL.innerHTML = '';
        if (absensiQueue.length === 0) {
            queueContainer.style.display = 'none';
            sendQueueBtn.disabled = true;
            sendQueueBtn.textContent = 'Kirim Semua Absensi (0 entri)';
            return;
        }

        queueContainer.style.display = 'block';
        sendQueueBtn.disabled = false;
        sendQueueBtn.textContent = `Kirim Semua Absensi (${absensiQueue.length} entri)`;

        absensiQueue.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `${item.kelas} - ${item.nama}<br/>
            <strong>${item.keterangan}</strong> <button style="float: right; color: #dc3545; border: none; background: none; cursor: pointer; font-size: 0.8em; font-weight: bold;" data-index="${index}">[Batal]</button>`;
            absensiQueueUL.appendChild(listItem);
        });
        
        absensiQueueUL.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', function() {
                const indexToRemove = parseInt(this.getAttribute('data-index'));
                absensiQueue.splice(indexToRemove, 1);
                updateQueueDisplay();
                updateStatus('input-status', 'Satu entri dibatalkan dari daftar tunggu.', 'warning');
            });
        });
    }

    /**
     * Memuat daftar kelas dari Apps Script.
     */
    function loadClasses() {
        if (!isPinValid) {
            kelasSelect.innerHTML = '<option value="">-- PIN Belum Valid --</option>';
            kelasSelect.disabled = true;
            return;
        }
        
        updateStatus('input-status', "Memuat daftar kelas...", 'blue');
        kelasSelect.disabled = true;
        fetch(`${SCRIPT_URL_SIMURAH}?mode=dataMurid`)
            .then(res => res.json())
            .then(data => {
                kelasSelect.innerHTML = '<option value="">-- Pilih Kelas --</option>';
                if (data.status === 'success' && data.kelas && data.kelas.length > 0) {
                    data.kelas.forEach(kelas => {
                        kelasSelect.innerHTML += `<option value="${kelas}">${kelas}</option>`;
                    });
                    updateStatus('input-status', "Kelas siap. Silakan pilih kelas.", 'success');
                } else {
                    updateStatus('input-status', "Gagal memuat daftar kelas atau daftar kosong.", 'error');
                }
            })
            .catch(() => updateStatus('input-status', "Koneksi gagal saat memuat kelas. Cek URL Apps Script.", 'error'))
            .finally(() => {
                kelasSelect.disabled = false;
            });
    }

    /**
     * Memuat daftar nama murid berdasarkan kelas yang dipilih.
     */
    function loadNames(kelas) {
        namaSelect.innerHTML = '<option value="">-- Memuat Nama --</option>';
        namaSelect.disabled = true;
        keteranganSelect.disabled = true;
        namaManualInput.style.display = 'none';

        updateStatus('input-status', `Memuat nama untuk Kelas ${kelas}...`, 'blue');

        fetch(`${SCRIPT_URL_SIMURAH}?mode=dataMurid&kelas=${encodeURIComponent(kelas)}`)
            .then(res => res.json())
            .then(data => {
                namaSelect.innerHTML = '<option value="">-- Pilih Nama --</option>';
                if (data.status === 'success' && data.nama && data.nama.length > 0) {
                    data.nama.forEach(nama => {
                        namaSelect.innerHTML += `<option value="${nama}">${nama}</option>`;
                    });
                }
                namaSelect.innerHTML += '<option value="Lainnya">Lainnya (Input Manual)</option>';

                namaSelect.disabled = false;
                keteranganSelect.disabled = false;
                updateStatus('input-status', `Daftar nama Kelas ${kelas} berhasil dimuat.`, 'success');
                
                const optionsKeterangan = [
                    '<option value="">-- Pilih Keterangan --</option>',
                    '<option value="Ijin">Ijin</option>',
                    '<option value="Sakit">Sakit</option>',
                    '<option value="Tanpa Keterangan">Tanpa Keterangan (A)</option>',
                    '<option value="Bolos">Bolos</option>',
                    '<option value="Tambah Murid">Hanya Tambah Murid</option>'
                ];
                keteranganSelect.innerHTML = optionsKeterangan.join('');
                checkFormStatus();
            })
            .catch(() => {
                updateStatus('input-status', "Gagal memuat nama. Coba lagi.", 'error');
            });
    }

    /**
     * Mengirim semua data dalam antrian ke Apps Script.
     */
    async function sendQueueData() {
        if (!isPinValid) {
            updateStatus('input-status', "PIN Harian tidak valid. Silakan verifikasi PIN di atas.", 'error');
            return;
        }
        
        if (absensiQueue.length === 0) {
            updateStatus('input-status', "Daftar tunggu kosong.", 'warning');
            return;
        }

        sendQueueBtn.disabled = true;
        
        let successCount = 0;
        let updateCount = 0;
        let errorCount = 0;
        let warningCount = 0;
        const totalItems = absensiQueue.length;
        let errorMessages = []; 
        let tempQueue = [...absensiQueue]; // Salin antrian
        absensiQueue = []; // Kosongkan antrian utama di awal

        for (let i = 0; i < totalItems; i++) {
            const item = tempQueue[i];
            
            updateStatus('input-status', `Mengirim ${i + 1} dari ${totalItems} (${item.nama})...`, 'blue');
            sendQueueBtn.textContent = `Mengirim... (${i + 1}/${totalItems})`;

            const pin = document.getElementById('centralPinInput').value; 
            
            const urlParams = new URLSearchParams();
            urlParams.append('kelas', item.kelas);
            urlParams.append('nama', item.nama);
            urlParams.append('keterangan', item.keterangan);
            urlParams.append('todayDate', item.todayDate);
            urlParams.append('pin', pin); 

            try {
                const response = await fetch(SCRIPT_URL_SIMURAH, {
                    method: 'POST',
                    body: urlParams
                });
                const data = await response.json();
                
                if (data.result === 'success') {
                    if (data.message.includes('DIPERBARUI')) {
                        updateCount++;
                    } else {
                        successCount++;
                    }
                } else if (data.result === 'warning') {
                    warningCount++;
                } else {
                    errorCount++;
                    // Jika PIN salah, hapus PIN tersimpan dan panggil loadPin()
                    if (data.message && data.message.includes("PIN salah")) {
                        localStorage.removeItem(PIN_KEY);
                        loadPin(); 
                    }
                    if (data.message) {
                        errorMessages.push(`Gagal mengirim ${item.nama}: ${data.message}`);
                    } else {
                        errorMessages.push(`Gagal mengirim ${item.nama}: Kesalahan tak terduga.`);
                    }
                    absensiQueue.push(item);
                    console.error(`Gagal mengirim ${item.nama}:`, data.message);
                }
            } catch (error) {
                errorCount++;
                errorMessages.push(`Koneksi Gagal mengirim ${item.nama}.`); 
                absensiQueue.push(item);
                console.error(`Koneksi Gagal mengirim ${item.nama}:`, error);
            }
        }
        
        updateQueueDisplay();
        
        let finalMessage = `Selesai: ${successCount} Dicatat, ${updateCount} Diperbarui.`;
        
        if (errorCount > 0) {
            finalMessage += ` ${errorCount} Gagal. (${absensiQueue.length} dikembalikan ke antrian).`;
        }
        
        if (warningCount > 0) {
            finalMessage += ` ${warningCount} Peringatan.`;
        }

        updateStatus('input-status', finalMessage, errorCount > 0 ? 'error' : 'success');
        
        sendQueueBtn.disabled = false;
        // Setelah mengirim data, muat ulang rekap harian
        if (document.getElementById('rekap-absen').style.display !== 'none') {
             loadDataHarian();
        }
    }


    // Fungsi untuk mengecek status form input
    function checkFormStatus() {
        const isKelasSelected = kelasSelect.value !== '';
        const isNameSelected = namaSelect.value !== '' && (namaSelect.value !== 'Lainnya' || namaManualInput.value.trim() !== '');
        const isKeteranganSelected = keteranganSelect.value !== '';
        
        // Tombol hanya aktif jika PIN valid dan semua input terisi
        addButton.disabled = !(isKelasSelected && isNameSelected && isKeteranganSelected && isPinValid);
    }


    // =========================================================
    // LOGIKA PIN SENTRAL DAN DISABLED APP
    // =========================================================

    /**
     * Fungsi untuk mengaktifkan/menonaktifkan seluruh aplikasi (kecuali PIN controls)
     * @param {boolean} enable true untuk mengaktifkan, false untuk menonaktifkan
     */
    function toggleAppDisabledState(enable) {
        isPinValid = enable;
        
        // Nonaktifkan/Aktifkan semua elemen interaktif
        const interactiveElements = document.querySelectorAll(
            'button, select, input, .toggle-tab'
        );
        
        interactiveElements.forEach(el => {
            // Toggle tabs (Hanya atur style, karena tombol harus tetap bisa di-click untuk trigger PIN check)
            if (el.classList.contains('toggle-tab')) {
                 if (!enable) {
                     el.style.pointerEvents = 'none'; // Menonaktifkan klik untuk menghindari load data
                     el.style.backgroundColor = '#ccc';
                     el.style.color = '#777';
                 } else {
                     el.style.pointerEvents = 'auto'; // Mengaktifkan klik
                     // HILANGKAN PENETAPAN STYLE INLINE SAAT ENABLE, BIARKAN CLASS CSS YANG MENGATUR
                     el.style.backgroundColor = ''; 
                     el.style.color = '';
                // Khusus untuk elemen input/select/button lainnya (kecuali PIN sentral)
                }
            } else {
                 if (el.id !== 'centralPinInput' && el.id !== 'checkPinBtn') {
                    el.disabled = !enable;
                }
            }
        });
        
        // Atur tombol PIN dan statusnya
        const pinInput = document.getElementById('centralPinInput');
        const checkBtn = document.getElementById('checkPinBtn');
        
        pinInput.disabled = enable; // Nonaktifkan saat PIN berhasil
        checkBtn.disabled = enable; // Nonaktifkan saat PIN berhasil
        document.getElementById('central-pin-container').style.display = 'none';
        
        // Jika PIN tidak valid, kembalikan kontrol ke PIN sentral
        if (!enable) {
            pinInput.disabled = false; 
            checkBtn.disabled = false;
            document.getElementById('central-pin-container').style.display = 'block';
            checkFormStatus(); // Pastikan tombol Input juga dinonaktifkan
        }
        
        // Muat ulang daftar kelas jika baru diaktifkan
        if (enable) {
            loadClasses(); // Memuat daftar kelas
            checkFormStatus(); // Aktifkan tombol Input jika form sudah terisi
            
            // Muat data untuk tab yang sedang aktif
            const activeTab = document.querySelector('.toggle-tab.tab-active');
            if (activeTab) {
                 const targetId = activeTab.getAttribute('data-target');
                 // Panggil fungsi pemuatan data spesifik
                 if (targetId === 'rekap-absen') { 
                     loadDataHarian();
                 } else if (targetId === 'rekap-kehadiran') { 
                     fetchDataVerifikasi(); 
                 } else if (targetId === 'rekap-bulanan') {
                     loadDataBulanan();
                 }
            }
        }
    }

    /**
     * Fungsi untuk memuat PIN dari localStorage dan memverifikasinya otomatis
     */
    function loadPin() {
        const pinInput = document.getElementById('centralPinInput');
        const savedPin = localStorage.getItem(PIN_KEY);
        
        updateStatus('central-pin-status', "Silakan masukkan PIN Harian (4 digit)", 'blue');
        toggleAppDisabledState(false); // Pastikan semua dinonaktifkan
        
        if (savedPin && savedPin.length === 4) {
            pinInput.value = savedPin;
            // Panggil verifikasi otomatis
            checkCentralPin(savedPin, true); 
        } else {
             pinInput.value = '';
        }
    }

    /**
     * Fungsi untuk memverifikasi PIN sentral
     * @param {string} pin PIN yang akan diverifikasi
     * @param {boolean} isAutoLoad true jika dipanggil otomatis dari localStorage
     */
    async function checkCentralPin(pin, isAutoLoad = false) {
        const pinInput = document.getElementById('centralPinInput');
        const checkBtn = document.getElementById('checkPinBtn');
        
        // Gunakan nilai dari input jika tidak disediakan (klik tombol)
        const currentPin = pin || pinInput.value.trim(); 

        if (currentPin.length !== 4) {
            updateStatus('central-pin-status', "PIN harus 4 digit.", 'error');
            toggleAppDisabledState(false);
            return;
        }

        if (!isAutoLoad) {
            checkBtn.disabled = true;
            checkBtn.textContent = 'Memverifikasi...';
        }
        updateStatus('central-pin-status', "Memverifikasi PIN...", 'blue');

        const verifyParams = new URLSearchParams();
        verifyParams.append('mode', 'verifyPin');
        verifyParams.append('pin', currentPin);

        try {
            const response = await fetch(SCRIPT_URL_SIMURAH, {
                method: 'POST',
                body: verifyParams
            });
            const result = await response.json();

            if (result.result === 'success') {
                localStorage.setItem(PIN_KEY, currentPin);
                updateStatus('central-pin-status', `PIN Valid! Aplikasi diaktifkan.`, 'success');
                toggleAppDisabledState(true);
            } else {
                localStorage.removeItem(PIN_KEY);
                pinInput.value = ''; 
                updateStatus('central-pin-status', `Verifikasi Gagal: ${result.message}`, 'error');
                toggleAppDisabledState(false);
            }
        } catch (error) {
            updateStatus('central-pin-status', "Koneksi gagal. Cek jaringan Anda.", 'error');
            toggleAppDisabledState(false);
            console.error('Verify PIN Error:', error);
        } finally {
            if (!isAutoLoad) {
                checkBtn.disabled = false;
                checkBtn.textContent = 'Cek PIN';
            }
        }
    }

    /**
     * Fungsi yang dipanggil saat checkbox verifikasi diubah
     */
    window.updateCheckStatusVerif = function(checkbox) {
        if (!isPinValid) {
             checkbox.checked = !checkbox.checked; // Batalkan perubahan
             updateStatus('status-verif', 'PIN Harian tidak valid. Silakan verifikasi PIN di atas.', 'error');
             return;
        }
        
        const statusDivVerif = document.getElementById('status-verif');
        const pin = document.getElementById('centralPinInput').value; // Ambil PIN sentral
        
        // Status awal checkbox saat diubah (sebelum request)
        const currentStatus = checkbox.checked; 
        
        const kelas = checkbox.getAttribute('data-kelas');
        const status = currentStatus; // Nilai boolean yang dikirim ke server

        // Tampilkan pesan loading
        statusDivVerif.className = 'status-loading-2';
        statusDivVerif.innerHTML = `Memperbarui status verifikasi untuk ${kelas}...`;
        
        const urlParams = new URLSearchParams();
        urlParams.append('mode', 'updateVerifikasi');
        urlParams.append('kelas', kelas);
        urlParams.append('status', status.toString());
        urlParams.append('pin', pin); 
        
        fetch(SCRIPT_URL_SIMURAH, {
            method: 'POST',
            body: urlParams
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Gagal terhubung ke server (Status: ${response.status}).`);
            }
            return response.json();
        })
        .then(data => {
            if (data.result === 'success') {
                 statusDivVerif.className = 'status-success-2'; 
                 statusDivVerif.innerHTML = `Verifikasi ${kelas} berhasil diperbarui!`;
                 
                 if (data.allVerified !== undefined) {
                     updateStatusToDate(data.allVerified); 
                 }
                 
                 fetchDataVerifikasi(); 
            } else {
                 // JIKA GAGAL DARI SERVER (misal PIN salah)
                 if (data.message && data.message.includes("PIN salah")) {
                     localStorage.removeItem(PIN_KEY); 
                     loadPin(); // Akan memanggil toggleAppDisabledState(false)
                 }
                 
                 checkbox.checked = !status; // Kembalikan status checkbox
                 statusDivVerif.className = 'status-error-2'; 
                 statusDivVerif.innerHTML = `Gagal: ${data.message}`;
                 fetchDataVerifikasi();
            }
        })
        .catch(error => {
            console.error('Error saat komunikasi dengan server:', error);
            
            // Kembalikan status checkbox ke kondisi sebelum diklik
            checkbox.checked = !status; 
            
            statusDivVerif.className = 'status-error-2'; 
            statusDivVerif.innerHTML = `Error Koneksi/Timeout: ${error.message}. Silakan coba lagi.`;
            
        });
    }


    // =========================================================
    // FUNGSI KHUSUS HALAMAN 1 & 2 (Dideklarasikan di luar DOMContentLoaded)
    // =========================================================

    // --- FUNGSI HALAMAN 1 (REKAP HARIAN) ---
    function loadDataHarian() {
        const refreshButton = document.getElementById('refreshButton');
        const loadingStatusId = 'loading-status-rekap-absen'; 
        const tableContainer = document.getElementById('rekap-table-container-rekap-absen'); 
        const currentModeText = document.getElementById('current-mode-rekap-absen'); 

        if (!isPinValid) {
            updateStatus(loadingStatusId, "PIN tidak valid. Silakan verifikasi PIN untuk memuat data.", 'error');
            return;
        }

        refreshButton.disabled = true;
        refreshButton.textContent = 'MEMUAT...';

        tableContainer.innerHTML = '';
        updateStatus(loadingStatusId, "Memuat data harian...");
        
        fetch(`${SCRIPT_URL_SIMURAH}?mode=rekapHarian`)
            .then(res => res.json())
            .then(data => {
                displayDataHarian(data);
            })
            .catch(error => {
                updateStatus(loadingStatusId, "Gagal memuat data. Periksa jaringan dan URL Apps Script.", 'error');
                console.error('Fetch Error:', error);
            })
            .finally(() => {
                refreshButton.disabled = false;
                refreshButton.addEventListener("click", function() { loadDataHarian(); });
                refreshButton.innerHTML = 'UPDATE';
            });

        function displayDataHarian(data) {
            tableContainer.innerHTML = '';
            
            if (data.status !== 'success') {
                updateStatus(loadingStatusId, `Gagal memuat data: ${data.message}`, 'error');
                return;
            }
            
            currentModeText.textContent = `${today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`;
            updateStatus(loadingStatusId, 'Data berhasil dimuat', 'success');
            
            if (data.data.length === 0) {
                tableContainer.innerHTML = '<p style="text-align: center; margin-top: 20px;">Belum ada absensi tercatat hari ini.</p>';
                return;
            }
            
            let tableHTML = `<table class="rekap-table-harian"><thead><tr><th>Kelas</th><th>Nama Murid</th><th>Keterangan Absen</th><th>Aksi</th></tr></thead><tbody>`;
            data.data.forEach(item => {
                tableHTML += `<tr>
                    <td>${item.kelas}</td>
                    <td style="text-align: left;">${item.nama}</td>
                    <td class="absen-count">${item.keterangan}</td>
                    <td>
                        <button class="delete-btn" data-nama="${item.nama}" data-kelas="${item.kelas}" 
                                style="background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.85em;">Hapus</button>
                    </td>
                </tr>`;
            });
            tableHTML += `</tbody></table>`;
            const responsiveWrapper = `<div class="table-responsive">${tableHTML}</div>`;
            tableContainer.innerHTML = responsiveWrapper;

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', handleDeleteAbsen);
            });
        }

        function handleDeleteAbsen(event) {
            const button = event.target;
            const nama = button.getAttribute('data-nama');
            const kelas = button.getAttribute('data-kelas');
            const loadingStatusId = 'loading-status-rekap-absen'; 
            const pin = document.getElementById('centralPinInput').value; // Ambil PIN sentral
            
            if (!isPinValid) {
                updateStatus(loadingStatusId, "PIN tidak valid. Silakan verifikasi PIN sentral.", 'error');
                return;
            }
            
            // NOTE: Penggunaan confirm() disarankan diganti custom modal di aplikasi riil
            if (!window.confirm(`Yakin ingin menghapus absensi ${nama} dari kelas ${kelas} hari ini?`)) {
                 return;
            }
            
            button.disabled = true;
            button.textContent = 'Menghapus...';
            updateStatus(loadingStatusId, `Mengirim permintaan penghapusan untuk ${nama}...`);

            const urlParams = new URLSearchParams();
            urlParams.append('mode', 'deleteAbsen'); 
            urlParams.append('nama', nama);
            urlParams.append('kelas', kelas);
            urlParams.append('pin', pin); 

            fetch(SCRIPT_URL_SIMURAH, {
                method: 'POST',
                body: urlParams
            })
            .then(res => res.json())
            .then(data => {
                if (data.result === 'success') {
                    updateStatus(loadingStatusId, data.message, 'success');
                    loadDataHarian();
                } else {
                    updateStatus(loadingStatusId, `Gagal menghapus: ${data.message}`, 'error');
                    if (data.message.includes("PIN salah")) {
                        localStorage.removeItem(PIN_KEY); 
                        loadPin(); 
                    }
                    button.disabled = false;
                    button.textContent = 'Hapus';
                }
            })
            .catch(error => {
                updateStatus(loadingStatusId, "Koneksi gagal. Cek jaringan Anda.", 'error');
                button.disabled = false;
                button.textContent = 'Hapus';
                console.error('Delete Error:', error);
            });
        }
    }

    // --- FUNGSI HALAMAN 2 (VERIFIKASI) ---

    function fetchDataVerifikasi() {
        const refreshVerifikasiBtn = document.getElementById('refreshVerifikasiBtn');
        const statusDivVerif = document.getElementById('status-verif');
        const tableElVerif = document.getElementById('rekapKehadiranTable');
        const tableBodyVerif = document.getElementById('rekapKehadiranBody');

        if (!isPinValid) {
            updateStatus('status-verif', "PIN tidak valid. Silakan verifikasi PIN untuk memuat data.", 'error');
            tableElVerif.style.display = 'none';
            return;
        }

        refreshVerifikasiBtn.disabled = true;
        refreshVerifikasiBtn.textContent = 'MEMUAT...';
        
        statusDivVerif.className = 'status-loading-2';
        statusDivVerif.innerText = 'Memuat data kehadiran...';
        tableElVerif.style.display = 'none';
        tableBodyVerif.innerHTML = '';
        
        const url = `${SCRIPT_URL_SIMURAH}?mode=rekapKehadiran`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Jaringan bermasalah atau Apps Script tidak merespon.');
                }
                return response.json();
            })
            .then(data => {
                tableElVerif.style.display = 'table';
                
                if (data.status === 'success' && data.data) {
                    renderTableVerifikasi(data.data);
                    updateStatusToDate(data.allVerified);
                } else {
                    statusDivVerif.className = 'status-error-2';
                    statusDivVerif.innerText = data.message || 'Gagal memuat data dari Apps Script.';
                }
            })
            .catch(error => {
                statusDivVerif.className = 'status-error-2';
                statusDivVerif.innerText = 'Error: ' + error.message + '. Pastikan URL GAS benar dan deployed dengan akses publik.';
            })
            .finally(() => {
                refreshVerifikasiBtn.disabled = false;
                refreshVerifikasiBtn.addEventListener("click", function() { fetchDataVerifikasi(); });
                refreshVerifikasiBtn.innerHTML = 'UPDATE';
            });
    }

    function renderTableVerifikasi(data) {
        const tableBodyVerif = document.getElementById('rekapKehadiranBody');
        tableBodyVerif.innerHTML = ''; 

        if (data.length === 0) {
            tableBodyVerif.innerHTML = '<tr><td colspan="9">Belum ada data murid yang tercatat di database.</td></tr>';
            return;
        }
        
        let totalHadir = 0;
        let totalIzin = 0;
        let totalSakit = 0;
        let totalTK = 0;
        let totalBolos = 0;
        let totalMuridKeseluruhan = 0;

        data.forEach(item => {
            const row = document.createElement('tr');
            // Checkbox status disabled jika PIN tidak valid.
            const disabledAttr = isPinValid ? '' : 'disabled';
            const isChecked = item.verified ? 'checked' : ''; 
            
            row.innerHTML = `
                <td><input type="checkbox" data-kelas="${item.kelas}" onchange="updateCheckStatusVerif(this)" ${isChecked} ${disabledAttr}></td> 
                <td>${item.kelas}</td>
                <td>${item.totalMurid}</td>
                <td style="color: green; font-weight: bold;">${item.hadir}</td>
                <td style="color: orange; font-weight: bold;">${item.ijin}</td>
                <td style="color: red; font-weight: bold;">${item.sakit}</td>
                <td style="color: darkred; font-weight: bold;">${item.tk}</td>
                <td style="color: purple; font-weight: bold;">${item.bolos}</td>
                <td>${item.persentase}</td>
            `;
            tableBodyVerif.appendChild(row);
            
            totalHadir += item.hadir;
            totalIzin += item.ijin;
            totalSakit += item.sakit;
            totalTK += item.tk;
            totalBolos += item.bolos;
            totalMuridKeseluruhan += item.totalMurid;
        });
        
        const persentaseTotal = totalMuridKeseluruhan > 0 
            ? ((totalHadir / totalMuridKeseluruhan) * 100).toFixed(1) + '%'
            : '0.0%';
            
        const totalRow = document.createElement('tr');
        totalRow.className = 'total-row';
        totalRow.innerHTML = `
            <td></td> 
            <td>TOTAL</td>
            <td>${totalMuridKeseluruhan}</td>
            <td>${totalIzin}</td>
            <td>${totalSakit}</td>
            <td>${totalTK}</td>
            <td>${totalBolos}</td>
            <td>${persentaseTotal}</td>
        `;
        tableBodyVerif.appendChild(totalRow);
    }

    function updateStatusToDate(allVerified) {
        const statusDivVerif = document.getElementById('status-verif');
        const now = new Date();
        
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = now.toLocaleDateString('id-ID', options); 

        let verificationMessage;
        if (allVerified) {
            verificationMessage = `(Semua Kelas Sudah Diverifikasi)`;
            statusDivVerif.className = 'status-success-2';
        } else {
            verificationMessage = `(ADA Kelas Belum Diverifikasi)<br>Tandai pada kolom Cek jika data sudah sesuai. Jika belum, harap isi di tab Input Absensi.`;
            statusDivVerif.className = 'status-loading-2';
        }

        statusDivVerif.innerHTML = `${formattedDate}<br>${verificationMessage}`;
    }

    // =========================================================
    // FUNGSI KHUSUS HALAMAN 3 (REKAP BULANAN)
    // =========================================================

    // --- CHART GOOGLE CHARTS ---
    function drawChart(chartData) {
        const chartArea = document.getElementById('chart-area');

        if (!googleChartLoaded) {
            chartArea.innerHTML = '<p style="text-align: center;">Library chart belum dimuat.</p>';
            return;
        }

        let dataArray = [['Kelas', 'Ijin (I)', 'Sakit (S)', 'Tanpa Ket. (A)', 'Bolos (B)']];
        
        for (const kelas in chartData) {
            const counts = chartData[kelas];
            dataArray.push([kelas, counts.I, counts.S, counts.TK, counts.B]);
        }
        
        const data = google.visualization.arrayToDataTable(dataArray);

        const options = {
            title: 'Rekap Absensi Bulanan per Kelas (Jumlah Kasus)',
            isStacked: true,
            hAxis: { title: 'Jumlah Kasus Absen' },
            vAxis: { title: 'Kelas' },
            legend: { position: 'top' },
            colors: ['orange', 'red', 'darkred', 'purple'] 
        };

        // Buat BarChart di lingkungan Blogger
        chartArea.innerHTML = ''; // Kosongkan dulu
        const chart = new google.visualization.BarChart(chartArea);
        chart.draw(data, options);
    }

    // --- DISPLAY DATA BULANAN ---
    function displayDataBulanan(data) {
        const tableContainer = document.getElementById('rekap-table-container-rekap-bulanan');
        const currentModeText = document.getElementById('current-mode-rekap-bulanan');
        const chartArea = document.getElementById('chart-area');
        const filterMonthSelect = document.getElementById('filterMonth');
        const filterYearSelect = document.getElementById('filterYear');
        const loadingStatusId = 'loading-status-rekap-bulanan';

        tableContainer.innerHTML = '';
        chartArea.innerHTML = '';
        
        currentDataBulanan = data; // Simpan data untuk di-render ulang jika chart selesai dimuat

        if (data.status !== 'success') {
            updateStatus(loadingStatusId, `Gagal memuat data: ${data.message || 'Respons tidak valid.'}`, 'error');
            chartArea.innerHTML = '<p style="text-align: center;">Grafik tidak dapat dimuat.</p>';
            return;
        }
        
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const monthName = monthNames[parseInt(filterMonthSelect.value) - 1];
        
        currentModeText.innerHTML = `REKAP ${monthName.toUpperCase()} ${filterYearSelect.value}`;
        
        updateStatus(loadingStatusId, `${data.message || 'Data berhasil dimuat.'}`, 'success'); 
        
        if (!data.data || data.data.length === 0) {
            tableContainer.innerHTML = '<p style="text-align: center; margin-top: 20px;">Tidak ada data absensi tercatat untuk bulan yang dipilih.</p>';
            chartArea.innerHTML = '<p style="text-align: center;">Tidak ada data untuk grafik.</p>';
            return;
        }
        
        // Gambar Chart: Akan dipanggil segera jika chart sudah siap, atau di callback jika belum
        if (googleChartLoaded && data.chartData) {
            drawChart(data.chartData);
        } else {
            chartArea.innerHTML = '<p style="text-align: center;">Memuat Library Google Charts...</p>';
        }
        
        // Tampilan Tabel
        let tableHTML = `
            <table class="rekap-table-bulanan">
                <thead>
                    <tr>
                        <th rowspan="2">Kelas</th>
                        <th rowspan="2">Nama Murid</th>
                        <th colspan="4">Detail Absensi (Frekuensi)</th>
                        <th rowspan="2">Total Absen</th>
                    </tr>
                    <tr>
                        <th>Ijin (I)</th>
                        <th>Sakit (S)</th>
                        <th>Tanpa Ket. (A)</th>
                        <th>Bolos (B)</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        let currentClass = '';
        data.data.forEach(item => {
            if (item.kelas !== currentClass) {
                tableHTML += `<tr class="row-header"><td colspan="7">Kelas: ${item.kelas}</td></tr>`;
                currentClass = item.kelas;
            }
            
            tableHTML += `
                <tr>
                    <td>${item.kelas}</td>
                    <td style="text-align: left;">${item.nama}</td>
                    <td>${item.I}</td>
                    <td>${item.S}</td>
                    <td>${item.TK}</td>
                    <td>${item.B}</td>
                    <td class="absen-count-bulanan">${item.totalAbsen}</td>
                </tr>
            `;
        });
        tableHTML += `</tbody></table>`;
        tableContainer.innerHTML = `<div class="table-responsive">${tableHTML}</div>`;
    }

    // --- LOAD HANDLERS BULANAN ---
    function loadDataBulanan() {
        const tableContainer = document.getElementById('rekap-table-container-rekap-bulanan');
        const chartArea = document.getElementById('chart-area');
        const filterMonthSelect = document.getElementById('filterMonth');
        const filterYearSelect = document.getElementById('filterYear');
        const loadingStatusId = 'loading-status-rekap-bulanan';

        if (!isPinValid) {
            updateStatus(loadingStatusId, "PIN tidak valid. Silakan verifikasi PIN untuk memuat data.", 'error');
            return;
        }

        updateStatus(loadingStatusId, "Memuat data bulanan...", 'blue');
        tableContainer.innerHTML = '';
        chartArea.innerHTML = '';
        
        const month = filterMonthSelect.value;
        const year = filterYearSelect.value;
        
        const fetchUrl = `${SCRIPT_URL_SIMURAH}?mode=rekapBulanan&bulan=${month}&tahun=${year}`;
        
        fetch(fetchUrl)
            .then(res => res.json())
            .then(data => {
                displayDataBulanan(data);
            })
            .catch(error => {
                updateStatus(loadingStatusId, "Gagal memuat data. Periksa jaringan dan URL Apps Script.", 'error');
                console.error('Fetch Error:', error);
            });
    }

    document.addEventListener('DOMContentLoaded', function() {
        
        // ===========================================
        // I. SETUP KONTROL & TOGGLE
        // ===========================================
        const toggleButtons = document.querySelectorAll('.toggle-tab');
        
        function toggleView(targetId) {
            
            // 1. Sembunyikan semua section
            document.querySelectorAll('.tab-content-section').forEach(section => {
                section.style.display = 'none';
            });

            // 2. Tampilkan target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
            }

            // 3. Toggle class tombol
            toggleButtons.forEach(button => {
                 // ** Perbaikan Bug: Reset style inline agar CSS Class dapat berfungsi penuh **
                button.style.backgroundColor = '';
                button.style.color = '';
                button.style.pointerEvents = 'auto'; // Default ke aktif
                
                if (button.getAttribute('data-target') === targetId) {
                    button.classList.add('tab-active');
                    button.classList.remove('tab-inactive');
                } else {
                    button.classList.remove('tab-active');
                    button.classList.add('tab-inactive');
                    
                    // Menonaktifkan tab inactive saat PIN belum valid
                    if (!isPinValid) {
                        button.style.pointerEvents = 'none'; 
                        button.style.backgroundColor = '#ccc'; // Apply disabled style inline
                        button.style.color = '#777'; // Apply disabled style inline
                    }
                }
            });

            // 4. Panggil fungsi pemuatan data spesifik HANYA JIKA PIN VALID
            if (isPinValid) {
                if (targetId === 'rekap-absen') { 
                    loadDataHarian();
                } else if (targetId === 'rekap-kehadiran') { 
                    fetchDataVerifikasi(); 
                } else if (targetId === 'rekap-bulanan') {
                    loadDataBulanan();
                }
            } else {
                let statusId;
                if (targetId === 'rekap-absen') {
                    statusId = 'loading-status-rekap-absen';
                } else if (targetId === 'rekap-kehadiran') {
                    statusId = 'status-verif';
                } else if (targetId === 'rekap-bulanan') {
                    statusId = 'loading-status-rekap-bulanan';
                }
                
                if (statusId) {
                    updateStatus(statusId, "PIN tidak valid. Silakan verifikasi PIN untuk memuat data.", 'error');
                }
                
                if (targetId === 'rekap-kehadiran') {
                    const tableEl = document.getElementById('rekapKehadiranTable');
                    if (tableEl) {
                        tableEl.style.display = 'none'; // Sembunyikan seluruh tabel
                    }
                }
            }
            
            // 5. Setelah mengklik tombol navigasi di dalam menu wrapper, 
            // pastikan menu wrapper disembunyikan lagi di mobile.
            const menuWrapper = document.getElementById('menu-wrapper');
            if (window.innerWidth <= 600) {
                 menuWrapper.style.display = 'none';
                 menuWrapper.classList.remove('menu-open');
            }
        }

        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
        
        // Dapatkan hash yang sesuai
        const newHash = Object.keys(hashToTabMap).find(key => hashToTabMap[key] === targetId);

        // Perbarui URL hash. Ini akan memicu event 'hashchange' 
        // yang kemudian memanggil toggleView() jika sudah diimplementasikan
        if (newHash) {
             window.location.hash = newHash;
        } else {
             // Jika Anda tidak ingin memicu hashchange, panggil langsung toggleView
             toggleView(targetId);
        }
            });
        });
        
        // --- PENAMBAHAN FUNGSI MOBILE MENU TOGGLE ---
        const menuToggleBtn = document.getElementById('menu-toggle-btn');
        const menuWrapper = document.getElementById('menu-wrapper');

        if (menuToggleBtn && menuWrapper) {
            // Tampilkan tombol menu di mobile
             if (window.innerWidth <= 600) {
                 document.getElementById('menu-header').style.display = 'flex';
                 menuWrapper.style.display = 'none';
             } else {
                 document.getElementById('menu-header').style.display = 'none';
                 menuWrapper.style.display = 'block';
             }
             
            window.addEventListener('resize', () => {
                 if (window.innerWidth <= 600) {
                    document.getElementById('menu-header').style.display = 'flex';
                    if (!menuWrapper.classList.contains('menu-open')) menuWrapper.style.display = 'none';
                 } else {
                    document.getElementById('menu-header').style.display = 'none';
                    menuWrapper.style.display = 'block';
                 }
            });
            
            menuToggleBtn.addEventListener('click', function() {
                const isMenuHidden = menuWrapper.style.display === 'none';

                if (isMenuHidden) {
                    menuWrapper.style.display = 'block'; 
                    menuWrapper.classList.add('menu-open');
                } else {
                    menuWrapper.style.display = 'none';
                    menuWrapper.classList.remove('menu-open');
                }
            });
        }
        // --------------------------------------------
        
        // ===========================================
        // II. SCRIPT HALAMAN 1 (INPUT)
        // ===========================================
        
        // Event Listeners Input
        kelasSelect.addEventListener('change', function() {
            if (this.value) {
                loadNames(this.value);
            } else {
                namaSelect.innerHTML = '<option value="">-- Pilih Kelas Dahulu --</option>';
                namaSelect.disabled = true;
                keteranganSelect.disabled = true;
                namaManualInput.style.display = 'none';
            }
            checkFormStatus();
        });
        namaSelect.addEventListener('change', function() {
            namaManualInput.style.display = this.value === 'Lainnya' ? 'block' : 'none';
            checkFormStatus();
        });
        namaManualInput.addEventListener('input', checkFormStatus);
        keteranganSelect.addEventListener('change', checkFormStatus);
        
        // Event Listener Tambah Absensi ke Queue
        addButton.addEventListener('click', function() {
            if (!isPinValid) {
                 updateStatus('input-status', "PIN Harian tidak valid. Silakan verifikasi PIN di atas.", 'error');
                 return;
            }
            
            const kelas = kelasSelect.value;
            let nama = namaSelect.value;
            const keterangan = keteranganSelect.value;
            
            function getTodayDate() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
            }

            const todayDate = getTodayDate();
            
            if (nama === 'Lainnya') {
                nama = namaManualInput.value.trim();
            }

            if (!kelas || !nama || !keterangan) {
                updateStatus('input-status', "Pastikan semua kolom terisi.", 'error');
                return;
            }

            // Cek duplikasi di queue sebelum menambah
            const isDuplicate = absensiQueue.some(item => item.nama === nama && item.kelas === kelas);
            if (isDuplicate) {
                 updateStatus('input-status', `Murid ${nama} sudah ada di daftar tunggu.`, 'warning');
                 return;
            }

            // PIN di kirim saat tombol Kirim ditekan, tidak disimpan di queue
            absensiQueue.push({ kelas, nama, keterangan, todayDate });
            updateQueueDisplay();
            
            // Reset pilihan murid dan keterangan
            namaSelect.selectedIndex = 0;
            keteranganSelect.selectedIndex = 0;
            namaManualInput.value = '';
            namaManualInput.style.display = 'none';
            checkFormStatus();

            updateStatus('input-status', `Murid ${nama} ditambahkan ke daftar tunggu.`, 'success');
        });

        // Event Listener Kirim Absensi (Queue)
        sendQueueBtn.addEventListener('click', sendQueueData);
        
        
        // ===========================================
        // III. SETUP HALAMAN 3 (REKAP BULANAN)
        // ===========================================

        const filterMonthSelect = document.getElementById('filterMonth');
        const filterYearSelect = document.getElementById('filterYear');
        const applyFilterBtn = document.getElementById('applyFilter');

        function setupFilterControls() {
            const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            filterMonthSelect.innerHTML = monthNames.map((name, i) => 
                `<option value="${i + 1}" ${i + 1 === (today.getMonth() + 1) ? 'selected' : ''}>${name}</option>`
            ).join('');
            
            const currentYear = today.getFullYear();
            filterYearSelect.innerHTML = '';
            for (let y = currentYear; y >= currentYear - 2; y--) {
                filterYearSelect.innerHTML += `<option value="${y}" ${y === currentYear ? 'selected' : ''}>${y}</option>`;
            }
        }
        
        // Load Google Charts dan tandai flag siap
        if (typeof google !== 'undefined' && google.charts) {
            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(() => { 
                googleChartLoaded = true; 
                // Cek jika tab bulanan aktif saat chart selesai dimuat
                if (document.getElementById('rekap-bulanan').style.display === 'block' && isPinValid && currentDataBulanan && currentDataBulanan.chartData) {
                    drawChart(currentDataBulanan.chartData);
                }
            });
        }

        // Event Listener Filter Bulanan
        applyFilterBtn.addEventListener('click', loadDataBulanan);
        
        // Event Listener Cek PIN Sentral
        const centralPinInput = document.getElementById('centralPinInput');
        const checkPinBtn = document.getElementById('checkPinBtn');
        checkPinBtn.addEventListener('click', function() {
            checkCentralPin(centralPinInput.value);
        });
        
        centralPinInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Mencegah form submit
                checkCentralPin(centralPinInput.value);
            }
        });


        // ===========================================
        // V. SETUP KONTROL NAVIGASI TAMBAHAN
        // ===========================================

        const goToVerifikasiBtn = document.getElementById('goToVerifikasiBtn');
        const goToInputBtn = document.getElementById('goToInputBtn');

        if (goToVerifikasiBtn) {
            goToVerifikasiBtn.addEventListener('click', function() {
                document.getElementById('showRekapVerifikasiBtn').click(); 
            });
        }

        if (goToInputBtn) {
            goToInputBtn.addEventListener('click', function() {
                document.getElementById('showInputBtn').click(); 
            });
        }
        
        // Listener untuk menangani perubahan URL Hash
window.addEventListener('hashchange', function() {
    const currentHash = window.location.hash.toLowerCase();
    const targetId = hashToTabMap[currentHash];
    
    // Hanya panggil toggleView jika hash yang dikenali
    if (targetId) {
        toggleView(targetId);
    }
});

        // ===========================================
// VI. INISIALISASI
// ===========================================

// 1. Definisikan pemetaan hash ke ID Tab
const hashToTabMap = {
    '#input': 'input-absen',
    '#absen': 'rekap-absen',
    '#kehadiran': 'rekap-kehadiran',
    '#rekap-bulanan': 'rekap-bulanan'
};

// 2. Tentukan ID tab awal berdasarkan URL Hash atau default
let initialTabId = 'input-absen'; // Default jika tidak ada hash
const currentHashAtLoad = window.location.hash.toLowerCase();

if (hashToTabMap[currentHashAtLoad]) {
    initialTabId = hashToTabMap[currentHashAtLoad];
}

// 3. Muat PIN dan kontrol filter
loadPin(); // Memuat PIN dari localStorage dan memverifikasi
setupFilterControls();

// 4. INISIALISASI VIEW: Tampilkan tab yang sesuai
toggleView(initialTabId); 

// 5. Nonaktifkan semua kontrol saat startup (akan diaktifkan oleh checkCentralPin jika sukses)
toggleAppDisabledState(false);

    });