    /* --- CONFIG ---
    const APPS_URL_ABSENSI = '';
    const SHEET_MURID = 'DataMurid';
    const SHEET_KELAS = 'DataKelas';
    const SHEET_ABSENSI = 'DataAbsen';
    const TARGET_SPREADSHEET_ID = '';
	*/

    let allMuridData = [];
    let absensiBuffer = [];
    let myChart = null;
    let currentRecapData = [];

    // --- NAVIGATION UI ---
    function toggleMenu() {
        document.getElementById('sidebar').classList.toggle('active');
        document.getElementById('navOverlay').classList.toggle('active');
    }

    function toggleSection(sectionId) {
        const isLocked = !localStorage.getItem('userPin');

        // 1. Update UI (Active Class)
        ['input', 'verifikasi', 'rekap'].forEach(id => {
            const section = document.getElementById(id + 'Section');
            const btn = document.getElementById('toggle' + id.charAt(0).toUpperCase() + id.slice(1) + 'Btn');

            if (id === sectionId) {
                section.classList.remove('hidden');
                if (btn) btn.classList.add('active');
            } else {
                section.classList.add('hidden');
                if (btn) btn.classList.remove('active');
            }
        });

        window.location.hash = sectionId;

        // 2. Trigger Data Loading (Hanya jika PIN valid)
        const urlParamsPin = new URLSearchParams(window.location.search).get('pin');
        if (!isLocked) {
            if (sectionId === 'verifikasi') loadAllClasses();
            if (sectionId === 'rekap') loadMonthlyRecap();
        } else {
            if (!urlParamsPin) {
                displayMessage('error', 'Silakan masukkan PIN terlebih dahulu.');
            }
        }

        if (document.getElementById('sidebar').classList.contains('active')) {
            toggleMenu();
        }
    }

    function getTodayDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function getTodayMonth() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    }

    function displayMessage(type, message) {
        const msgDiv = document.getElementById('statusMessage');
        msgDiv.className = `status-msg active ${type}`;
        msgDiv.textContent = message;
        setTimeout(() => msgDiv.classList.remove('active'), 5000);
    }

    async function checkPin() {
        const pinInput = document.getElementById('pinInput');
        const btn = document.getElementById('checkPinBtn');
        const pin = pinInput.value;
        if (pin.length !== 4) return displayMessage('error', 'PIN harus 4 digit.');

        btn.disabled = true;
        try {
            const res = await fetch(`${APPS_URL_ABSENSI}?action=checkPin&PIN=${pin}`);
            const result = await res.json();
            if (result.success) {
                localStorage.setItem('userPin', pin);
                enableAppAccess(pin);
                displayMessage('success', 'Akses dibuka.');
                loadInitialData();
                loadAllClasses(true);
                loadMonthlyRecap();
            } else {
                displayMessage('error', 'PIN Salah!');
            }
        } catch (e) {
            displayMessage('error', 'Gagal verifikasi.');
        } finally {
            btn.disabled = false;
        }
    }

    function enableAppAccess(pin) {
        document.getElementById('pinInput').value = pin;
        document.getElementById('pinInput').disabled = true;

        document.getElementById('absensiForm').classList.remove('input-disabled');
        document.getElementById('dataKelasSubSection').classList.remove('input-disabled');
        document.querySelector('#rekapSection .grid-layout').classList.remove('input-disabled');
    }

    async function loadInitialData() {
        try {
            const [resK, resM] = await Promise.all([
                fetch(`${APPS_URL_ABSENSI}?action=vars&sheetName=${SHEET_KELAS}`),
                fetch(`${APPS_URL_ABSENSI}?action=vars&sheetName=${SHEET_MURID}`)
            ]);
            const dataKelas = await resK.json();
            allMuridData = await resM.json();

            const ks = document.getElementById('kelasSelect');
            ks.innerHTML = '<option value="">-- Pilih Kelas --</option>';
            dataKelas.forEach(k => {
                let o = document.createElement('option');
                o.value = k.Kelas;
                o.textContent = k.Kelas;
                ks.appendChild(o);
            });
        } catch (e) {
            displayMessage('error', 'Gagal muat data.');
        }
    }

    function filterMurid() {
        const k = document.getElementById('kelasSelect').value;
        const ms = document.getElementById('muridSelect');
        ms.innerHTML = '<option value="">-- Pilih Murid --</option>';
        if (!k) return;
        allMuridData.filter(m => m.Kelas === k).forEach(m => {
            let o = document.createElement('option');
            o.value = m.Nama;
            o.textContent = m.Nama;
            ms.appendChild(o);
        });
        let ex = document.createElement('option');
        ex.value = "NEW_MURID";
        ex.textContent = "+ Tambah Murid Baru";
        ms.appendChild(ex);
    }

    function toggleNewMuridInput() {
        document.getElementById('newMuridInput').classList.toggle('hidden', document.getElementById('muridSelect').value !== 'NEW_MURID');
    }

    async function addAbsensiToBuffer() {
        const k = document.getElementById('kelasSelect').value;
        const mv = document.getElementById('muridSelect').value;
        const ket = document.getElementById('keteranganSelect').value;
        const namaInput = document.getElementById('newMuridName').value.trim();
        const n = mv === 'NEW_MURID' ? namaInput : mv;

        const timestamp_options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        const unformatted_timestamp = new Date().toLocaleString('en-GB', timestamp_options);
        const timestamp = unformatted_timestamp.replace(',', '');

        if (!k || !n || !ket) return displayMessage('error', 'Lengkapi form!');

        if (absensiBuffer.some(item => item.Nama.toLowerCase() === n.toLowerCase())) {
            return displayMessage('error', `Murid ${n} sudah ada di antrean.`);
        }

        absensiBuffer.push({
            Nama: n,
            Kelas: k,
            KeteranganAbsen: ket,
            Tanggal: getTodayDate(),
            Timestamp: timestamp,
            isNew: mv === 'NEW_MURID'
        });

        renderBuffer();
        document.getElementById('muridSelect').value = '';
        document.getElementById('newMuridInput').classList.add('hidden');
    }

    function renderBuffer() {
        const b = document.getElementById('absensiBody');
        const c = document.getElementById('bufferCount');
        const s = document.getElementById('submitButton');
        b.innerHTML = '';
        c.textContent = absensiBuffer.length;
        s.disabled = absensiBuffer.length === 0;

        if (absensiBuffer.length === 0) {
            b.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:3rem; color:var(--text-muted); font-style: italic;">Antrean kosong.</td></tr>';
            return;
        }
        absensiBuffer.forEach((i, idx) => {
            const r = b.insertRow();
            r.innerHTML = `<td>${i.isNew ? '<span class="badge-warning">BARU</span> ' : ''}${i.Nama}</td>
                           <td>${i.Kelas}</td>
                           <td>${i.KeteranganAbsen}</td>
                           <td style="text-align:center">
                               <button class="btn btn-danger" onclick="removeFromBuffer(${idx})">Hapus</button>
                           </td>`;
        });
    }

    function removeFromBuffer(idx) {
        absensiBuffer.splice(idx, 1);
        renderBuffer();
    }

    async function submitBatchAbsensi() {
        const s = document.getElementById('submitButton');
        const pin = document.getElementById('pinInput').value;
        const newMuridBuffer = absensiBuffer.filter(i => i.isNew);

        s.disabled = true;
        s.textContent = 'Memproses...';

        try {
            if (newMuridBuffer.length > 0) {
                displayMessage('info', 'Mendaftarkan murid baru...');
                const resMurid = await fetch(`${APPS_URL_ABSENSI}?action=batchSubmit&sheetName=${SHEET_MURID}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        PIN: pin,
                        items: newMuridBuffer.map(m => ({ Nama: m.Nama, Kelas: m.Kelas })),
                        duplicateKeys: ["Nama", "Kelas"]
                    })
                });
                const rM = await resMurid.json();
                if (!rM.success) throw new Error("Gagal mendaftarkan murid: " + rM.message);
            }

            displayMessage('info', 'Mengirim data absensi...');
            const resAbsen = await fetch(`${APPS_URL_ABSENSI}?action=batchSubmit&sheetName=${SHEET_ABSENSI}&spreadsheetId=${TARGET_SPREADSHEET_ID}`, {
                method: 'POST',
                body: JSON.stringify({
                    PIN: pin,
                    items: absensiBuffer,
                    duplicateKeys: ["Nama", "Tanggal"],
                    updateKeyOnDuplicate: "KeteranganAbsen"
                })
            });

            const rA = await resAbsen.json();
            if (rA.success) {
                displayMessage('success', 'Data berhasil dikirim!');
                absensiBuffer = [];
                renderBuffer();
                if (typeof loadInitialData === 'function') await loadInitialData();
            } else {
                throw new Error(rA.message);
            }
        } catch (e) {
            displayMessage('error', e.message || 'Terjadi kesalahan sistem.');
        } finally {
            s.disabled = false;
            s.textContent = 'Kirim Semua';
        }
    }

    async function loadAllClasses(skipReset = false) {
        const b = document.getElementById('dataKelasBody');
        b.innerHTML = '<tr><td colspan="5" style="text-align:center">Memuat...</td></tr>';
        try {
            const t = getTodayDate();
            const [rk, ra] = await Promise.all([
                fetch(`${APPS_URL_ABSENSI}?action=vars&sheetName=${SHEET_KELAS}`),
                fetch(`${APPS_URL_ABSENSI}?action=vars&sheetName=${SHEET_ABSENSI}&spreadsheetId=${TARGET_SPREADSHEET_ID}&filterKey=Tanggal&filterValue=${t}`)
            ]);
            const dk = await rk.json();
            const da = await ra.json();

            if (!skipReset) {
                await checkAndResetKelasStatus(dk);
            }

            b.innerHTML = '';
            dk.forEach((k, index) => {
                const muridTidakHadir = Array.isArray(da) ? da.filter(a => a.Kelas === k.Kelas) : [];
                const ab = muridTidakHadir.length;
                const detailId = `det-${index}`;

                const r = b.insertRow();
                r.className = 'recap-row';
                r.onclick = () => {
                    const el = document.getElementById(detailId);
                    el.style.display = el.style.display === 'table-row' ? 'none' : 'table-row';
                };
                r.innerHTML = `<td style="text-align:center">
                                    <input type="checkbox" ${String(k.StatusCek).toUpperCase() === 'TRUE' ? 'checked' : ''} onclick="event.stopPropagation()" onchange="updateStatusKelas('${k.Kelas}', this.checked)">
                               </td>
                               <td>${k.Kelas}</td>
                               <td>${k.TotalMurid - ab}</td>
                               <td>${ab}</td>
                               <td>${k.TotalMurid}</td>`;

                const dr = b.insertRow();
                dr.id = detailId;
                dr.className = 'detail-row';
                if (muridTidakHadir.length === 0) {
                    dr.innerHTML = `<td colspan="5" style="text-align:center; font-weight:bold;">Hadir Semua</td>`;
                } else {
                    dr.innerHTML = `<td colspan="5">
                        ${muridTidakHadir.map(m => `
                            <span class="detail-badge" style="display:inline-flex; align-items:center; gap:5px;">
                                ${m.Nama} (${m.KeteranganAbsen})
                                <span style="color:red; cursor:pointer; font-weight:bold;" 
                                      onclick="hapusAbsen('${m.Nama}', '${m.Kelas}', '${m.Tanggal}', '${m.KeteranganAbsen}')">[HAPUS]</span>
                            </span>`).join('')}
                    </td>`;
                }
            });
        } catch (e) {
            b.innerHTML = '<tr><td colspan="5">Gagal muat.</td></tr>';
        }
    }

    async function checkAndResetKelasStatus(dataKelas) {
        const today = getTodayDate();
        const updatePromises = [];

        dataKelas.forEach(item => {
            const itemTgl = String(item.TglVerifikasi || '1970-01-01').split('T')[0];
            if (itemTgl !== today && String(item.StatusCek).toUpperCase() === 'TRUE') {
                updatePromises.push(updateStatusKelas(item.Kelas, false));
            }
        });

        if (updatePromises.length > 0) {
            await Promise.all(updatePromises);
            displayMessage('info', `Status ${updatePromises.length} kelas direset untuk hari ini.`);
            loadAllClasses(true);
        }
    }

    async function updateStatusKelas(k, c) {
		displayMessage('info', 'Mohon tunggu! Memproses...');
		document.getElementById('dataKelasBody').innerHTML = '<tr><td colspan="5" style="text-align:center">Memuat data...</td></tr>';
        try {
            const res = await fetch(`${APPS_URL_ABSENSI}?action=batchSubmit&sheetName=${SHEET_KELAS}`, {
                method: 'POST',
                body: JSON.stringify({
                    PIN: document.getElementById('pinInput').value,
                    duplicateKeys: ["Kelas"],
                    updateKeyOnDuplicate: ["StatusCek", "TglVerifikasi"],
                    items: [{ Kelas: k, StatusCek: c ? "TRUE" : "FALSE", TglVerifikasi: getTodayDate() }]
                })
            });
            const r = await res.json();
            if (!r.success) throw new Error(r.message);
            displayMessage('success', 'Status updated.');
			loadAllClasses();
        } catch (e) {
            displayMessage('error', 'Gagal update: ' + e.message);
            const checkbox = document.querySelector(`input[onchange*="${k}"]`);
            if (checkbox) checkbox.checked = !c;
        }
    }

    async function hapusAbsen(nama, kelas, tanggal, keterangan) {
        if (!confirm('Apakah Anda yakin ingin menghapus data absensi ini?')) return;
        const pin = document.getElementById('pinInput').value;

        try {
            const res = await fetch(`${APPS_URL_ABSENSI}?action=deleteData&spreadsheetId=${TARGET_SPREADSHEET_ID}`, {
                method: 'POST',
                body: JSON.stringify({
                    PIN: pin,
                    sheetName: SHEET_ABSENSI,
                    keys: { "Nama": nama, "Kelas": kelas, "Tanggal": tanggal, "KeteranganAbsen": keterangan }
                })
            });
            const result = await res.json();
            if (result.success) {
                displayMessage('success', 'Data berhasil dihapus.');
                loadAllClasses();
            } else {
                displayMessage('error', result.message || 'Gagal menghapus data.');
            }
        } catch (e) {
            displayMessage('error', 'Terjadi kesalahan koneksi ke server.');
        }
    }

    async function loadMonthlyRecap() {
        if (!localStorage.getItem('userPin')) return;
        const m = document.getElementById('monthFilter').value;
        const b = document.getElementById('monthlyRecapBody');
        if (!m) return;
        b.innerHTML = '<tr><td colspan="7" style="text-align:center">Memproses...</td></tr>';
        try {
            const r = await fetch(`${APPS_URL_ABSENSI}?action=vars&sheetName=${SHEET_ABSENSI}&spreadsheetId=${TARGET_SPREADSHEET_ID}&filterKey=Tanggal&filterValue=${m}`);
            const d = await r.json();
            const pr = processRecap(d);
            currentRecapData = pr;
            document.getElementById('downloadBtn').style.display = 'block';
            renderRecapTable(pr);
            renderChart(pr);
        } catch (e) {
            b.innerHTML = '<tr><td colspan="7">Gagal rekap.</td></tr>';
        }
    }

    function processRecap(d) {
        const r = {};
        if (Array.isArray(d)) {
            d.forEach(i => {
                if (!r[i.Nama]) r[i.Nama] = { Nama: i.Nama, Kelas: i.Kelas, Ijin: 0, Sakit: 0, Alfa: 0, Bolos: 0, Total: 0, Details: [] };
                const k = i.KeteranganAbsen === "Tanpa Keterangan" ? "Alfa" : i.KeteranganAbsen;
                if (r[i.Nama][k] !== undefined) r[i.Nama][k]++;
                r[i.Nama].Total++;
                r[i.Nama].Details.push({ tgl: i.Tanggal, ket: i.KeteranganAbsen });
            });
        }
        return Object.values(r).sort((a, b) => a.Kelas.localeCompare(b.Kelas) || a.Nama.localeCompare(b.Nama));
    }

    function renderRecapTable(data) {
        const b = document.getElementById('monthlyRecapBody');
        b.innerHTML = '';
        if (!data.length) return b.innerHTML = '<tr><td colspan="7" style="text-align:center">Kosong.</td></tr>';
        data.forEach((i, idx) => {
            const r = b.insertRow();
            r.className = 'recap-row';
            const dId = `det-${idx}`;
            r.onclick = () => {
                const el = document.getElementById(dId);
                el.style.display = el.style.display === 'table-row' ? 'none' : 'table-row';
            };
            r.innerHTML = `<td><strong>${i.Nama}</strong></td>
                           <td>${i.Kelas}</td><td>${i.Ijin}</td><td>${i.Sakit}</td>
                           <td>${i.Alfa}</td><td>${i.Bolos}</td><td>${i.Total}</td>`;
            const dr = b.insertRow();
            dr.id = dId;
            dr.className = 'detail-row';
            dr.innerHTML = `<td colspan="7">${i.Details.map(d => `<span class="detail-badge"><b>${d.tgl}:</b> ${d.ket}</span>`).join('')}</td>`;
        });
    }

    function renderChart(data) {
        const ctx = document.getElementById('absensiChart').getContext('2d');
        const classData = {};
        const categories = ['Ijin', 'Sakit', 'Alfa', 'Bolos'];

        data.forEach(d => {
            if (!classData[d.Kelas]) classData[d.Kelas] = { Ijin: 0, Sakit: 0, Alfa: 0, Bolos: 0 };
            categories.forEach(cat => {
                if (d[cat]) classData[d.Kelas][cat] += parseInt(d[cat]);
            });
        });

        const labels = Object.keys(classData);
        const datasets = categories.map((cat, index) => ({
            label: cat,
            data: labels.map(label => classData[label][cat]),
            backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][index]
        }));

        if (myChart) myChart.destroy();
        myChart = new Chart(ctx, {
            type: 'bar',
            data: { labels: labels, datasets: datasets },
            options: {
                responsive: true,
                scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }

    function downloadCSV() {
        if (currentRecapData.length === 0) return alert("Tidak ada data untuk diunduh");
        const headers = ["Nama Murid", "Kelas", "Ijin", "Sakit", "Alfa", "Bolos", "Total"];
        const rows = currentRecapData.map(d => [`"${d.Nama}"`, `"${d.Kelas}"`, d.Ijin, d.Sakit, d.Alfa, d.Bolos, d.Total]);
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        const monthVal = document.getElementById('monthFilter').value || "rekap";
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Rekap_Absen_${monthVal}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (['input', 'verifikasi', 'rekap'].includes(hash)) toggleSection(hash);
    });

    window.onload = async () => {
        document.getElementById('monthFilter').value = getTodayMonth();
        const urlParams = new URLSearchParams(window.location.search);
        const pinFromUrl = urlParams.get('pin');
        const savedPin = localStorage.getItem('userPin');
        const pinToVerify = pinFromUrl || savedPin;

        if (pinToVerify) {
            try {
                displayMessage('success', 'Memverifikasi PIN...');
                document.getElementById('pinInput').value = pinToVerify;
                const res = await fetch(`${APPS_URL_ABSENSI}?action=checkPin&PIN=${pinToVerify}`);
                const result = await res.json();
                if (result.success) {
                    localStorage.setItem('userPin', pinToVerify);
                    enableAppAccess(pinToVerify);
                    loadInitialData();
                    if (pinFromUrl) window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
                } else {
                    localStorage.removeItem('userPin');
                    displayMessage('error', 'PIN tidak valid.');
                }
            } catch (e) {
                displayMessage('error', 'Gagal verifikasi PIN.');
            }
        }

        const initialHash = window.location.hash.substring(1);
        if (initialHash) toggleSection(initialHash);
    };