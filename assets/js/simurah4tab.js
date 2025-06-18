// =========================================================
// KONFIGURASI GLOBAL
// =========================================================
// ⚠️ GANTI DENGAN URL APPS SCRIPT ANDA
const SCRIPT_URL_SIMURAH = 'https://script.google.com/macros/s/AKfycbxuPqtKT0IK5xK1wq9D8Mhi-VFdUqHipQxA21DbepBFb0OBciosWtSkbhRTfIlm2OKoSw/exec';
const PIN_KEY = 'dailyAbsensiPin'; // Kunci localStorage untuk PIN
const today = new Date(); // Dideklarasikan global

// Tampilkan CSS
document.addEventListener('DOMContentLoaded', function() {
    // 1. String CSS Lengkap
    // Menggunakan template literal (backticks `) untuk menyimpan seluruh blok CSS Anda.
    const simurahGlobalStyles = `
/* ---------------------------------------------------- */
/* CSS GLOBAL & TOGGLE BUTTONS (MASTER) */
/* ---------------------------------------------------- */
#toggle-buttons {
    display: flex;
    justify-content: center; /* Default: Rata tengah di desktop */
    gap: 10px;
    margin: 20px auto;
    max-width: 95%; 
    overflow-x: hidden; /* Sembunyikan scroll di desktop */
}
#toggle-buttons .toggle-tab {
    flex-shrink: 0; /* Penting untuk mencegah penyusutan di desktop */ 
    padding: 10px 15px;
    border: none;
    cursor: pointer;
    font-weight: bold;
    border-radius: 5px;
    transition: background-color 0.3s;
    text-align: center;
    font-size: 0.9em;
}
.tab-active {
    background-color: #00448A;
    color: white;
}
.tab-inactive {
    background-color: #f0f0f0;
    color: #333;
}
/* Menyembunyikan semua konten tab secara default */
.tab-content-section {
    display: none;    
    font-family: Arial, sans-serif;
    max-width: 95%;    
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-sizing: border-box;    
}
/* Tampilkan tab pertama (Input) secara default */
/* KOREKSI: Mengganti #input-absen-wrapper menjadi #input-absen */
#input-absen {
    display: block;    
    max-width: 440px;    
}

/* --- PENAMBAHAN CSS UNTUK MOBILE TOGGLE MENU --- */
#menu-header {
    padding: 10px;
    background-color: #00448A;
    color: white;
    display: none; /* Sembunyikan tombol di desktop */
}
#menu-header button {
    width: 100%;
    padding: 10px;
    background-color: #00448A;
    color: white;
    border: 1px solid white;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}
/* ----------------------------------------------- */


/* ---------------------------------------------------- */
/* CSS KHUSUS INPUT ABSENSI (Halaman 1) */
/* ---------------------------------------------------- */
.input-absen-form-container {
    max-width: 400px;    
    margin: 0 auto;
    padding: 0;
}
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
.form-group select, .form-group input[type="text"] { 
    width: 100%; 
    padding: 10px; 
    border: 1px solid #ccc; 
    border-radius: 4px; 
    box-sizing: border-box; 
}
#submitBtn { 
    background-color: #00448A; 
    color: white; 
    padding: 10px 15px; 
    border: none; 
    border-radius: 4px; 
    cursor: pointer; 
    width: 100%; 
    font-weight: bold; 
}
/* --- CSS Khusus Queue --- */
#absensiQueue li {
    padding: 5px 0;
    border-bottom: 1px dotted #ccc;
    font-size: 0.9em;
}
#absensiQueue li:last-child {
    border-bottom: none;
}


/* ---------------------------------------------------- */
/* CSS REKAPITULASI HARIAN (Halaman 2) */
/* ---------------------------------------------------- */
/* KOREKSI: Mengganti #rekap-harian-wrapper menjadi #rekap-absen */
#rekap-absen { max-width: 800px; }
.rekap-table-harian { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 0.9em; }
.rekap-table-harian th, .rekap-table-harian td { border: 1px solid #ddd; padding: 8px; text-align: center; }
.rekap-table-harian th { background-color: #00448A; color: white; }
.absen-count { font-weight: bold; }


/* ---------------------------------------------------- */
/* CSS REKAP KEHADIRAN PER KELAS (Halaman 3 - Verifikasi) */
/* ---------------------------------------------------- */
/* KOREKSI: Mengganti #rekap-kehadiran-wrapper menjadi #rekap-kehadiran */
#rekap-kehadiran {    
    max-width: 900px;    
    padding: 10px 10px 20px;    
}
/* Status dan Responsive CSS */
.status-loading-2 {
    padding: 15px;
    text-align: center;
    font-size: 1.1em;
    color: #007bff;
    background-color: #e9f5ff;
    border: 1px solid #b3d9ff;
    border-radius: 4px;
}
.status-success-2 {
    padding: 15px;
    text-align: center;
    font-size: 1.1em;
    font-weight: bold;
    color: #008000;
    background-color: #e6ffe6;
    border: 1px solid #b3ffb3;
    border-radius: 4px;
}
.status-error-2 {
    color: red;
    padding: 15px;
    background-color: #ffeeee;
    border: 1px solid #ffb3b3;
    border-radius: 4px;
}
.status-unverified {
    color: #cc0000;
}
/* CSS Tabel Khusus Halaman 3 */
.data-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    font-size: 0.9em;
}
.data-table th, .data-table td {
    border: 1px solid #ddd;
    padding: 8px 5px;    
    text-align: center;
    vertical-align: middle;
}
.data-table th {
    background-color: #00448A;
    color: white;
    font-size: 0.95em;
    text-align: center;
}
.data-table td:nth-child(2) {
    text-align: left;
    font-weight: bold;
}
.data-table th:first-child, .data-table td:first-child {
    width: 30px;    
    padding: 5px;
}
.data-table tr:nth-child(even) {
    background-color: #f2f2f2;
}
.data-table .total-row td {
    background-color: #FFC107;
    color: #333;
    font-weight: bold;
    font-size: 1.0em;
}
.table-responsive {
    overflow-x: auto;
}
.refresh-row button {
    background-color:#FFC107;    
    color: #333;    
    border:1px solid #FFC107;    
    padding:8px 15px;    
    font-weight:bold;    
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    display: inline-flex;    
    align-items: center;
    gap: 5px;
}
.refresh-row button:hover {
    background-color: #ffda6a;
}

/* ---------------------------------------------------- */
/* CSS REKAP BULANAN (Halaman 4) */
/* ---------------------------------------------------- */
/* KOREKSI: Mengganti #rekap-bulanan-wrapper menjadi #rekap-bulanan */
#rekap-bulanan { max-width: 1000px; }

/* MODIFIKASI: Menggunakan Flexbox untuk tata letak desktop */
.filter-controls {
    text-align: center;      
    margin-bottom: 20px;
    /* Penambahan Flexbox untuk kontrol tata letak */
    display: flex;      
    justify-content: center;      
    gap: 10px; /* Jarak antar elemen */
    flex-wrap: wrap; /* Izinkan item turun ke baris baru jika ruang tidak cukup */
}
.filter-controls select, .filter-controls button {      
    padding: 8px;      
    margin-right: 0 !important; /* Hapus margin yang lama */
    border-radius: 4px;      
    border: 1px solid #ccc;      
    cursor: pointer;
    min-width: 100px; /* Lebar minimum untuk desktop */
    font-size: 0.9em;
}

/* --- MEDIA QUERY GLOBAL (MOBILE) --- */
@media (max-width: 600px) {
    
    /* 1. Tampilkan Tombol Menu Header & Sembunyikan Menu Wrapper */
    #menu-header {
        display: block; 
    }
    #menu-wrapper {
        display: none; /* Sembunyikan menu navigasi secara default di mobile */
    }
    
    /* 2. Style saat menu dibuka menggunakan JavaScript */
    /* Jika #menu-wrapper mendapatkan class 'menu-open' dari JS, tampilkan sebagai kolom */
    #menu-wrapper.menu-open { 
        display: block; 
    }

    /* 3. Toggle Buttons menjadi Vertikal */
    #toggle-buttons {
        flex-direction: column; /* Menyusun item dari horizontal menjadi vertikal */
        align-items: stretch; /* Membuat item anak (tombol) mengambil lebar penuh */
        max-width: 100%; /* Mengambil lebar penuh layar */
        padding: 0 10px; /* Jarak dari tepi layar */
        overflow-x: hidden; /* Tidak perlu scroll horizontal */
    }

    #toggle-buttons .toggle-tab {
        margin-bottom: 8px; /* Jarak antar tombol vertikal */
        flex-shrink: initial;    
    }

    /* 4. Filter Controls (Rekap Bulanan) menjadi Vertikal */
    .filter-controls {
        flex-direction: column; /* Susun item secara vertikal */
        align-items: stretch; /* Regangkan item memenuhi lebar kontainer */
        padding: 0 10px;          
    }
    .filter-controls select, .filter-controls button {
        width: 100%; /* Buat elemen filter selebar kontainer di mobile */
        margin-bottom: 10px; /* Tambah jarak bawah antar elemen di mobile */
    }
}
/* Akhir Media Query Global */


.rekap-table-bulanan {          
    width: 100%;          
    border-collapse: collapse;          
    margin-top: 20px;          
    font-size: 0.9em;          
}
.rekap-table-bulanan th, .rekap-table-bulanan td {          
    border: 1px solid #ddd;          
    padding: 8px;          
    text-align: center;          
}
.rekap-table-bulanan th {          
    background-color: #00448A;          
    color: white;          
}
.rekap-table-bulanan .row-header td {          
    background-color: #e0e0e0 !important;          
    font-weight: bold;          
    text-align: left;          
    font-size: 1.1em;
}
.absen-count-bulanan {          
    font-weight: bold;          
    color: #d9534f;          
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
// VARIABEL GLOBAL UNTUK HALAMAN 3 (REKAP BULANAN)
// =========================================================
let googleChartLoaded = false;
let currentDataBulanan = null; // Menyimpan data untuk chart

// --- UTILITY FUNGSI GLOBAL ---

function loadPin() {
    const pinInput = document.getElementById('pin');
        const savedPin = localStorage.getItem(PIN_KEY);
        if (savedPin) {
            pinInput.value = savedPin;
            pinInput.disabled = false;
            updateStatus('input-status', "PIN dimuat otomatis. Siap.", 'blue');
        } else {
            pinInput.value = '';
            pinInput.disabled = false;
            updateStatus('input-status', "Silakan masukkan PIN Harian.", 'blue');
        }
    }
    
// Dibuat global untuk onchange di HTML (Halaman 2)
// ASUMSI: loadPin() dan fetchDataVerifikasi() sudah didefinisikan secara global.
window.updateCheckStatusVerif = function(checkbox) {
    const statusDivVerif = document.getElementById('status-verif');
    const pinInput = document.getElementById('pin');
    
    // Status awal checkbox saat diubah (sebelum request)
    const currentStatus = checkbox.checked; 
    
    // 1. INPUT PIN MELALUI PROMPT
    const pin = prompt("Masukkan PIN Harian (4 digit) untuk memverifikasi data Kelas ini:");

    // 2. VALIDASI PIN
    if (!pin || pin.length !== 4) {
        // Kembalikan status checkbox ke kondisi sebelum diklik
        checkbox.checked = !currentStatus; 
        statusDivVerif.className = 'status-loading-2'; 
        statusDivVerif.innerHTML = 'Verifikasi dibatalkan atau PIN tidak dimasukkan/bukan 4 digit.';
        return;
    }
    
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
    
    // Logika menyimpan PIN di localStorage
    if (pin === pinInput.value) {
           localStorage.setItem(PIN_KEY, pin);
           loadPin();
    }

    fetch(SCRIPT_URL_SIMURAH, {
        method: 'POST',
        body: urlParams
    })
    .then(response => {
        // PERBAIKAN: Cek status HTTP untuk mengatasi timeout/server error
        if (!response.ok) {
            throw new Error(`Gagal terhubung ke server (Status: ${response.status}).`);
        }
        return response.json();
    })
    .then(data => {
        if (data.result === 'success') {
             // JIKA SUKSES
             localStorage.setItem(PIN_KEY, pin);
             loadPin(); 
             
             statusDivVerif.className = 'status-success-2'; 
             statusDivVerif.innerHTML = `Verifikasi ${kelas} berhasil diperbarui!`;
             
             // Gunakan data.allVerified dari respons Apps Script yang cepat
             if (data.allVerified !== undefined) {
                 updateStatusToDate(data.allVerified); 
             }
             
             // Muat ulang data verifikasi untuk merefresh tabel
             fetchDataVerifikasi(); 
        } else {
             // JIKA GAGAL DARI SERVER (misal PIN salah)
             alert(`Gagal memperbarui status: ${data.message}`);
             checkbox.checked = !status; // Kembalikan status checkbox
             
             if (data.message && data.message.includes("PIN salah")) {
                 localStorage.removeItem(PIN_KEY); 
                 loadPin(); 
             }
             statusDivVerif.className = 'status-error-2'; 
             statusDivVerif.innerHTML = `Gagal: ${data.message}`;
             fetchDataVerifikasi();
        }
    })
    .catch(error => {
        // ðŸš¨ BLOK CATCH PALING STABIL (loadPin dan fetchDataVerifikasi DILARANG dipanggil di sini)
        
        console.error('Error saat komunikasi dengan server:', error);
        
        // Tampilkan alert error koneksi
        alert('Error Koneksi/Timeout Server. Cek Log Apps Script Anda. Pesan: ' + error.message);
        
        // Kembalikan status checkbox ke kondisi sebelum diklik
        checkbox.checked = !status; 
        
        statusDivVerif.className = 'status-error-2'; 
        statusDivVerif.innerHTML = `Error Koneksi/Timeout: ${error.message}. Silakan coba lagi.`;
        
    });
}

function updateStatus(elementId, message, type = 'blue') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let className = '';
    switch(type) {
        case 'error': className = 'status-error-2'; break;
        case 'success': className = 'status-success-2'; break;
        case 'loading': 
        case 'blue': className = 'status-loading-2'; break;
        case 'warning': className = 'status-loading-2'; break; // Menggunakan loading style untuk warning
        default: className = 'status-loading-2'; break;
    }

    element.textContent = message;
    element.style.color = (type === 'error' ? 'red' : type === 'success' ? 'green' : type === 'warning' ? 'orange' : 'black');
    element.style.display = 'block';
    
    // Khusus untuk Verifikasi, gunakan class styling
    if(elementId === 'status-verif' || elementId === 'pin-bulanan-status') {
        element.className = className;
        // Atur warna teks manual agar konsisten untuk status PIN bulanan
        if (elementId === 'pin-bulanan-status') {
             element.style.color = type === 'error' ? 'red' : type === 'success' ? 'green' : 'orange';
             element.style.backgroundColor = type === 'error' ? '#ffeeee' : type === 'success' ? '#e6ffe6' : 'transparent';
             element.style.border = type === 'error' ? '1px solid #ffb3b3' : type === 'success' ? '1px solid #b3ffb3' : 'none';
             element.style.padding = '10px';
             element.style.borderRadius = '4px';
        }
    }
    // Khusus untuk Rekap Bulanan/Harian
    if(elementId.startsWith('loading-status')) {
        element.style.color = type === 'error' ? 'red' : '#555';
    }
}

// =========================================================
// FUNGSI KHUSUS HALAMAN 1 & 2 (Dideklarasikan di luar DOMContentLoaded)
// =========================================================

// --- FUNGSI HALAMAN 1 (REKAP HARIAN) ---
function loadDataHarian() {
    const refreshButton = document.getElementById('refreshButton');
    // Koreksi ID: 'loading-status-harian' tidak ada, harusnya 'loading-status-rekap-absen'
    const loadingStatusId = 'loading-status-rekap-absen'; 
    // Koreksi ID: 'rekap-table-container-harian' tidak ada, harusnya 'rekap-table-container-rekap-absen'
    const tableContainer = document.getElementById('rekap-table-container-rekap-absen'); 
    // Koreksi ID: 'current-mode-harian' tidak ada, harusnya 'current-mode-rekap-absen'
    const currentModeText = document.getElementById('current-mode-rekap-absen'); 

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
        document.getElementById(loadingStatusId).style.display = 'none';
        
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
                            style="background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Hapus</button>
                </td>
            </tr>`;
        });
        tableHTML += `</tbody></table>`;
        const responsiveWrapper = `<div style="overflow-x:auto;">${tableHTML}</div>`;
        tableContainer.innerHTML = responsiveWrapper;

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDeleteAbsen);
        });
    }

    function handleDeleteAbsen(event) {
        const button = event.target;
        const nama = button.getAttribute('data-nama');
        const kelas = button.getAttribute('data-kelas');
        
        if (!confirm(`Yakin ingin menghapus absensi ${nama} dari kelas ${kelas} hari ini?`)) {
            return;
        }

        const pin = prompt("Masukkan PIN Harian untuk konfirmasi penghapusan (4 digit):");
        if (!pin || pin.length !== 4) {
            alert("Penghapusan dibatalkan. PIN harus 4 digit.");
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
            alert("Koneksi gagal. Cek jaringan Anda.");
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
        const isChecked = item.verified ? 'checked' : ''; 
        
        row.innerHTML = `
            <td><input type="checkbox" data-kelas="${item.kelas}" onchange="updateCheckStatusVerif(this)" ${isChecked}></td> 
            <td>${item.kelas}</td>
            <td>${item.totalMurid}</td>
            <td style="color: green;">${item.hadir}</td>
            <td style="color: orange;">${item.ijin}</td>
            <td style="color: red;">${item.sakit}</td>
            <td style="color: darkred;">${item.tk}</td>
            <td>${item.bolos}</td>
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
        <td>${totalHadir}</td>
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
        verificationMessage = `<span style="color: #008000;">(Semua Kelas Sudah Diverifikasi)</span>`;
        statusDivVerif.className = 'status-success-2';
    } else {
        verificationMessage = `<span class="status-unverified">(ADA Kelas Belum Diverifikasi)</span><br>Tandai pada kolom Cek jika data sudah sesuai. Jika belum, harap isi di tab Input Absensi.`;
        statusDivVerif.className = 'status-loading-2';
    }

    statusDivVerif.innerHTML = `${formattedDate}<br>${verificationMessage}`;
}

// =========================================================
// FUNGSI KHUSUS HALAMAN 3 (REKAP BULANAN)
// =========================================================

// --- LOGIKA AKSES PIN BULANAN ---
function checkBulananAccess() {
    const pinGate = document.getElementById('rekap-bulanan-gate');
    const content = document.getElementById('rekap-bulanan-content');
    const pinInput = document.getElementById('pinBulanan');
    const status = document.getElementById('pin-bulanan-status');

    const savedPin = localStorage.getItem(PIN_KEY);

    // Cek apakah PIN tersimpan di localStorage
    if (savedPin && savedPin.length === 4) {
        // Jika ada PIN, lewati gate, tampilkan konten dan muat data
        pinGate.style.display = 'none';
        content.style.display = 'block';
        loadDataBulanan();
        updateStatus('pin-bulanan-status', '', 'blue'); // Clear status
    } else {
        // Jika tidak ada PIN, tampilkan gate, sembunyikan konten
        pinGate.style.display = 'block';
        content.style.display = 'none';
        pinInput.value = ''; // Kosongkan input
        updateStatus('pin-bulanan-status', 'Masukkan PIN valid untuk melanjutkan.', 'warning');
    }
}

async function verifyPinBulanan() {
    const pinInput = document.getElementById('pinBulanan');
    const pinGate = document.getElementById('rekap-bulanan-gate');
    const content = document.getElementById('rekap-bulanan-content');
    const verifyBtn = document.getElementById('verifyPinBulananBtn');
    
    const pin = pinInput.value.trim();

    if (pin.length !== 4) {
        updateStatus('pin-bulanan-status', "PIN harus 4 digit.", 'error');
        return;
    }

    verifyBtn.disabled = true;
    verifyBtn.textContent = 'Memverifikasi...';
    updateStatus('pin-bulanan-status', "Memverifikasi PIN...", 'blue');

    const verifyParams = new URLSearchParams();
    verifyParams.append('mode', 'verifyPin');
    verifyParams.append('pin', pin);

    try {
        const response = await fetch(SCRIPT_URL_SIMURAH, {
            method: 'POST',
            body: verifyParams
        });
        const result = await response.json();

        if (result.result === 'success') {
            localStorage.setItem(PIN_KEY, pin);
            updateStatus('pin-bulanan-status', `PIN Valid! Mengarahkan ke rekap...`, 'success');
            
            // Tampilkan konten dan muat data
            pinGate.style.display = 'none';
            content.style.display = 'block';
            loadDataBulanan();
            
        } else {
            updateStatus('pin-bulanan-status', `Verifikasi Gagal: ${result.message}. Coba lagi.`, 'error');
            pinInput.value = ''; // Kosongkan input
        }
    } catch (error) {
        updateStatus('pin-bulanan-status', "Koneksi gagal. Cek jaringan Anda.", 'error');
        console.error('Verify PIN Error:', error);
    } finally {
        verifyBtn.disabled = false;
        verifyBtn.textContent = 'Verifikasi PIN & Tampilkan Rekap';
    }
}


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
        legend: { position: 'top' }
    };

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
    
    currentDataBulanan = data; 

    if (data.status !== 'success') {
        updateStatus(loadingStatusId, `Gagal memuat data: ${data.message || 'Respons tidak valid.'}`, 'error');
        chartArea.innerHTML = '';
        return;
    }
    
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const monthName = monthNames[parseInt(filterMonthSelect.value) - 1];
    
    currentModeText.innerHTML = `REKAP ${monthName} ${filterYearSelect.value}`;
    
    updateStatus(loadingStatusId, `${data.message || 'Data berhasil dimuat.'}`, 'success'); 
    
    // Sembunyikan pesan loading
    document.getElementById(loadingStatusId).style.display = 'none';
    
    if (!data.data || data.data.length === 0) {
        tableContainer.innerHTML = '<p style="text-align: center; margin-top: 20px;">Tidak ada data absensi tercatat untuk bulan yang dipilih.</p>';
        chartArea.innerHTML = '<p style="text-align: center;">Tidak ada data untuk grafik.</p>';
        return;
    }
    
    // Gambar Chart: Akan dipanggil segera jika chart sudah siap, atau di callback jika belum
    if (googleChartLoaded && data.chartData) {
        drawChart(data.chartData);
    } else {
        chartArea.innerHTML = '<p style="text-align: center;">Chart sedang dimuat atau menunggu library Google Charts.</p>';
    }
    
    // Tampilan Tabel
    let tableHTML = `
        <div style="overflow-x:auto;">
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
    tableHTML += `</tbody></table></div>`;
    tableContainer.innerHTML = tableHTML;
}

// --- LOAD HANDLERS BULANAN ---
function loadDataBulanan() {
    const tableContainer = document.getElementById('rekap-table-container-rekap-bulanan');
    const chartArea = document.getElementById('chart-area');
    const filterMonthSelect = document.getElementById('filterMonth');
    const filterYearSelect = document.getElementById('filterYear');
    const loadingStatusId = 'loading-status-rekap-bulanan';

    updateStatus(loadingStatusId, "Memuat data bulanan...", 'blue');
    document.getElementById(loadingStatusId).style.display = 'block'; // Pastikan loading message terlihat
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
            if (button.getAttribute('data-target') === targetId) {
                button.classList.add('tab-active');
                button.classList.remove('tab-inactive');
            } else {
                button.classList.remove('tab-active');
                button.classList.add('tab-inactive');
            }
        });

        // 4. Panggil fungsi pemuatan data spesifik
        if (targetId === 'rekap-absen') { 
            loadDataHarian();
        } else if (targetId === 'rekap-kehadiran') { 
            fetchDataVerifikasi(); 
        } else if (targetId === 'rekap-bulanan') {
            // Panggil fungsi pemeriksaan akses PIN baru
            checkBulananAccess();
        }
        
        // 5. Setelah mengklik tombol navigasi di dalam menu wrapper, 
        // pastikan menu wrapper disembunyikan lagi di mobile.
        const menuWrapper = document.getElementById('menu-wrapper');
        const menuToggleBtn = document.getElementById('menu-toggle-btn');
        if (window.innerWidth <= 600 && menuWrapper.style.display !== 'none') {
             // Ini akan disembunyikan karena CSS di bagian media query: #menu-wrapper { display: none; }
             // Untuk memastikannya, gunakan class toggle yang lebih aman:
             menuWrapper.classList.remove('menu-open');
             menuWrapper.style.display = 'none';
        }
    }

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            toggleView(this.getAttribute('data-target'));
        });
    });
    
    // --- PENAMBAHAN FUNGSI MOBILE MENU TOGGLE UNTUK menu-toggle-btn ---
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const menuWrapper = document.getElementById('menu-wrapper');

    if (menuToggleBtn && menuWrapper) {
        menuToggleBtn.addEventListener('click', function() {
            // Periksa apakah menu sedang tersembunyi (default di mobile)
            const isMenuHidden = menuWrapper.style.display === 'none' || menuWrapper.style.display === '';

            if (isMenuHidden) {
                // Tampilkan menu
                menuWrapper.style.display = 'block'; // Gunakan 'block' karena #toggle-buttons di dalamnya akan diatur oleh CSS mobile
                menuWrapper.classList.add('menu-open');
            } else {
                // Sembunyikan menu
                menuWrapper.style.display = 'none';
                menuWrapper.classList.remove('menu-open');
            }
        });
    }
    // -------------------------------------------------------------------
    
    // ===========================================
    // II. SCRIPT HALAMAN 1 (INPUT)
    // ===========================================
    
    const kelasSelect = document.getElementById('kelas');
    const namaSelect = document.getElementById('nama');
    const keteranganSelect = document.getElementById('keterangan');
    const pinInput = document.getElementById('pin');
    const namaManualInput = document.getElementById('namaManual');

    const addButton = document.getElementById('addButton'); 
    const queueContainer = document.getElementById('queue-container'); 
    const absensiQueueUL = document.getElementById('absensiQueue'); 
    const sendQueueBtn = document.getElementById('sendQueueBtn'); 
    
    let absensiQueue = [];

    // Form Validation Logic
    function checkFormStatus() {
        const isKelasSelected = kelasSelect.value !== '';
        const isNameSelected = namaSelect.value !== '' && (namaSelect.value !== 'Lainnya' || namaManualInput.value.trim() !== '');
        const isKeteranganSelected = keteranganSelect.value !== '';
        
        addButton.disabled = !(isKelasSelected && isNameSelected && isKeteranganSelected);
    }

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
    
    
    // FUNGSI INPUT
    
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
            <strong>${item.keterangan}</strong> <button style="float: right; color: red; border: none; background: none; cursor: pointer; font-size: 0.8em;" data-index="${index}">[Batal]</button>`;
            absensiQueueUL.appendChild(listItem);
        });
        
        absensiQueueUL.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', function() {
                const indexToRemove = parseInt(this.getAttribute('data-index'));
                absensiQueue.splice(indexToRemove, 1);
                updateQueueDisplay();
            });
        });
    }

    function loadClasses() {
        updateStatus('input-status', "Memuat daftar kelas...", 'blue');
        kelasSelect.disabled = true;
        fetch(`${SCRIPT_URL_SIMURAH}?mode=dataMurid`)
            .then(res => res.json())
            .then(data => {
                kelasSelect.innerHTML = '<option value="">-- Pilih Kelas --</option>';
                if (data.status === 'success' && data.kelas.length > 0) {
                    data.kelas.forEach(kelas => {
                        kelasSelect.innerHTML += `<option value="${kelas}">${kelas}</option>`;
                    });
                    updateStatus('input-status', "Kelas siap. Silakan pilih kelas.", 'blue');
                } else {
                    updateStatus('input-status', "Gagal memuat daftar kelas.", 'error');
                }
            })
            .catch(() => updateStatus('input-status', "Koneksi gagal saat memuat kelas.", 'error'))
            .finally(() => {
                kelasSelect.disabled = false;
            });
    }

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
                if (data.status === 'success' && data.nama.length > 0) {
                    data.nama.forEach(nama => {
                        namaSelect.innerHTML += `<option value="${nama}">${nama}</option>`;
                    });
                }
                namaSelect.innerHTML += '<option value="Lainnya">Lainnya (Input Manual)</option>';

                namaSelect.disabled = false;
                keteranganSelect.disabled = false;
                updateStatus('input-status', `Daftar nama Kelas ${kelas} berhasil dimuat.`, 'blue');
                
                const optionsKeterangan = [
                    '<option value="">-- Pilih Keterangan --</option>',
                    '<option value="Ijin">Ijin</option>',
                    '<option value="Sakit">Sakit</option>',
                    '<option value="Tanpa Keterangan">Tanpa Ket. (A)</option>',
                    '<option value="Bolos">Bolos</option>'
                ];
                keteranganSelect.innerHTML = optionsKeterangan.join('');
                checkFormStatus();
            })
            .catch(() => {
                updateStatus('input-status', "Gagal memuat nama. Coba lagi.", 'error');
            });
    }

    // --- LOGIKA VERIFIKASI PIN BARU ---
    // Event Listener Verifikasi PIN Real-time (memanggil mode=verifyPin)
    pinInput.addEventListener('change', async function() {
        const pin = this.value.trim();

        if (pin.length !== 4) {
            updateStatus('input-status', "PIN harus 4 digit.", 'error');
            localStorage.removeItem(PIN_KEY);
            loadPin();
            return;
        }

        updateStatus('input-status', "Memverifikasi PIN...", 'blue');

        const verifyParams = new URLSearchParams();
        verifyParams.append('mode', 'verifyPin');
        verifyParams.append('pin', pin);

        try {
            const response = await fetch(SCRIPT_URL_SIMURAH, {
                method: 'POST',
                body: verifyParams
            });
            const result = await response.json();

            if (result.result === 'success') {
                localStorage.setItem(PIN_KEY, pin);
                updateStatus('input-status', `PIN ${pin} Valid! Siap digunakan.`, 'success');
            } else {
                localStorage.removeItem(PIN_KEY);
                this.value = ''; // Kosongkan input
                updateStatus('input-status', `âŒ Verifikasi Gagal: ${result.message}`, 'error');
            }
        } catch (error) {
            updateStatus('input-status', "Koneksi gagal. Cek jaringan Anda.", 'error');
            localStorage.removeItem(PIN_KEY);
            console.error('Verify PIN Error:', error);
        } finally {
            loadPin();
        }
    });
    // --- AKHIR LOGIKA VERIFIKASI PIN BARU ---

    // Event Listener Tambah Absensi ke Queue
    addButton.addEventListener('click', function() {
        const kelas = kelasSelect.value;
        let nama = namaSelect.value;
        const keterangan = keteranganSelect.value;
        const pin = pinInput.value;

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

        if (!kelas || !nama || !keterangan || pin.length !== 4) {
            updateStatus('input-status', "Pastikan semua kolom terisi dan PIN benar.", 'error');
            return;
        }

        // Cek duplikasi di queue sebelum menambah
        const isDuplicate = absensiQueue.some(item => item.nama === nama && item.kelas === kelas);
        if (isDuplicate) {
             updateStatus('input-status', `Murid ${nama} sudah ada di daftar tunggu.`, 'warning');
             return;
        }

        absensiQueue.push({ kelas, nama, keterangan, todayDate, pin });
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
    
    async function sendQueueData() {
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

            const urlParams = new URLSearchParams();
            urlParams.append('kelas', item.kelas);
            urlParams.append('nama', item.nama);
            urlParams.append('keterangan', item.keterangan);
            urlParams.append('todayDate', item.todayDate);
            urlParams.append('pin', item.pin); 
            
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
                    if (data.message.includes("PIN salah")) {
                        localStorage.removeItem(PIN_KEY);
                        loadPin(); 
                    }
                    if (data.message) {
                        errorMessages.push(`Gagal mengirim ${item.nama}: ${data.message}`);
                    } else {
                        errorMessages.push(`Gagal mengirim ${item.nama}: Kesalahan tak terduga.`);
                    }
                    // Jika gagal, kembalikan ke antrian untuk dilihat pengguna
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
        loadDataHarian();
    }
    
    // ===========================================
    // III. SETUP HALAMAN 3 (REKAP BULANAN)
    // ===========================================

    const filterMonthSelect = document.getElementById('filterMonth');
    const filterYearSelect = document.getElementById('filterYear');
    const applyFilterBtn = document.getElementById('applyFilter');
    const verifyPinBulananBtn = document.getElementById('verifyPinBulananBtn'); // Ambil elemen baru

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
            if (document.getElementById('rekap-bulanan').style.display === 'block' && currentDataBulanan && currentDataBulanan.chartData) {
                drawChart(currentDataBulanan.chartData);
            }
        });
    }

    // Event Listener Filter Bulanan
    applyFilterBtn.addEventListener('click', loadDataBulanan);
    // Event Listener Verifikasi PIN Bulanan
    verifyPinBulananBtn.addEventListener('click', verifyPinBulanan);

    // ===========================================
    // V. SETUP KONTROL NAVIGASI TAMBAHAN (KOREKSI: Mengganti onclick di HTML)
    // ===========================================

    // Ambil elemen tombol yang baru diberi ID di HTML
    const goToVerifikasiBtn = document.getElementById('goToVerifikasiBtn');
    const goToInputBtn = document.getElementById('goToInputBtn');

    // 1. Event Handler untuk tombol "VERIFIKASI" di tab Rekap Absen
    if (goToVerifikasiBtn) {
        goToVerifikasiBtn.addEventListener('click', function() {
            // Memanggil klik pada tombol tab yang memiliki data-target="rekap-kehadiran"
            document.getElementById('showRekapVerifikasiBtn').click(); 
        });
    }

    // 2. Event Handler untuk tombol "INPUT ABSEN" di tab Rekap Kehadiran
    if (goToInputBtn) {
        goToInputBtn.addEventListener('click', function() {
            // Memanggil klik pada tombol tab yang memiliki data-target="input-absen"
            document.getElementById('showInputBtn').click(); 
        });
    }

    // ===========================================
    // VI. INISIALISASI (Koreksi Logika Hash)
    // ===========================================
    
    loadPin();
    loadClasses();
    setupFilterControls();
    
    // INISIALISASI VIEW: Tampilkan tab berdasarkan URL Hash (#) atau default
    const initialView = window.location.hash.substring(1) || 'input-absen';
    // Gunakan querySelector untuk menemukan tombol tab yang sesuai dengan hash, lalu klik
    const targetTabBtn = document.querySelector(`.toggle-tab[data-target="${initialView}"]`);
    
    if (targetTabBtn) {
         targetTabBtn.click(); // Memanggil klik pada tab yang sesuai (menggunakan ID baru)
    } else {
        toggleView('input-absen'); // Fallback ke default jika hash tidak valid
    }

});
