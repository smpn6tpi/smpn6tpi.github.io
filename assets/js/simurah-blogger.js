(function() {
	/*
    window.app = {
        config: {
            url: '',
            sheetMurid: 'DataMurid',
            sheetKelas: 'DataKelas',
            sheetAbsensi: 'DataAbsen',
            targetId: ''
        },
        data: { allMurid: [], buffer: [], chart: null }
    };
    */

    // --- HELPER FUNCTIONS ---
    const getTodayDate = () => new Date().toLocaleDateString('en-CA'); 
    const getTodayMonth = () => new Date().toISOString().substring(0, 7);
    const getFormattedTimestamp = () => {
        return new Date().toLocaleString('en-GB', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        }).replace(',', '');
    };

    window.app.displayMessage = (type, msg) => {
        const d = document.getElementById('statusMessage');
        d.className = `status-msg active ${type}`;
        d.textContent = msg;
        setTimeout(() => d.classList.remove('active'), 5000);
    };

    // --- NAVIGATION ---
    window.app.toggleSection = (sectionId) => {
        const isLocked = !localStorage.getItem('userPin');

        ['input', 'verifikasi', 'rekap'].forEach(id => {
            const section = document.getElementById(id + 'Section');
            const btn = document.getElementById('toggle' + id.charAt(0).toUpperCase() + id.slice(1) + 'Btn');
            section.classList.toggle('hidden', id !== sectionId);
            if (btn) btn.classList.toggle('active', id === sectionId);
        });

        document.getElementById('navList').classList.remove('show');
        window.location.hash = sectionId;

        const urlParamsPin = new URLSearchParams(window.location.search).get('pin');

        if (!isLocked) {
            if (sectionId === 'verifikasi') window.app.loadAllClasses();
            if (sectionId === 'rekap') window.app.loadMonthlyRecap();
        } else {
            if(!urlParamsPin) {
                window.app.displayMessage('info', 'Silahkan masukkan PIN terlebih dahulu.');
            } else {
                window.app.displayMessage('info', 'Mengecek PIN...');
            }
        }
    };

    // --- AUTH ---
    window.app.checkPin = async (pinOverride) => {
        const pin = pinOverride || document.getElementById('pinInput').value;
        const btn = document.getElementById('checkPinBtn');
        if (pin.length !== 4) return window.app.displayMessage('error', 'PIN harus 4 digit.');
        
        btn.disabled = true;
        try {
            const res = await fetch(`${window.app.config.url}?action=checkPin&PIN=${pin}`);
            const result = await res.json();
            if (result.success) {
                localStorage.setItem('userPin', pin);
                document.getElementById('pinInput').value = pin;
                document.getElementById('pinInput').disabled = true;
                
                document.getElementById('absensiForm').classList.remove('input-disabled');
                document.getElementById('verifikasiContent').classList.remove('input-disabled');
                document.getElementById('rekapContent').classList.remove('input-disabled');
                
                window.app.displayMessage('success', 'Akses dibuka.');
                document.getElementById('pinForm').style.display = "none";
                window.app.loadInitialData(); 
                window.app.loadAllClasses(true); 
                window.app.loadMonthlyRecap();
            } else {
                localStorage.removeItem('userPin');
                window.app.displayMessage('error', 'PIN Salah!');
            }
        } catch(e) { 
            window.app.displayMessage('error', 'Gagal verifikasi.'); 
        } finally { 
            btn.disabled = false;
        }
    };

    // --- DATA HANDLING ---
    window.app.loadInitialData = async () => {
        try {
            const [rk, rm] = await Promise.all([
                fetch(`${window.app.config.url}?action=vars&sheetName=${window.app.config.sheetKelas}`),
                fetch(`${window.app.config.url}?action=vars&sheetName=${window.app.config.sheetMurid}`)
            ]);
            const dk = await rk.json();
            window.app.data.allMurid = await rm.json();
            
            const ks = document.getElementById('kelasSelect');
            ks.innerHTML = '<option value="">-- Pilih Kelas --</option>';
            dk.forEach(k => ks.innerHTML += `<option value="${k.Kelas}">${k.Kelas}</option>`);
        } catch(e) { 
            window.app.displayMessage('error', 'Gagal muat data awal.'); 
        }
    };

    window.app.filterMurid = () => {
        const k = document.getElementById('kelasSelect').value;
        const ms = document.getElementById('muridSelect');
        ms.innerHTML = '<option value="">-- Pilih Murid --</option>';
        if(!k) return;
        window.app.data.allMurid.filter(m => m.Kelas === k).forEach(m => {
            ms.innerHTML += `<option value="${m.Nama}">${m.Nama}</option>`;
        });
        ms.innerHTML += '<option value="NEW_MURID">+ Tambah Murid Baru</option>';
    };

    window.app.toggleNewMuridInput = () => {
        document.getElementById('newMuridInput').classList.toggle('hidden', document.getElementById('muridSelect').value !== 'NEW_MURID');
    };

    // --- BUFFER LOGIC ---
    window.app.addAbsensiToBuffer = () => {
        const k = document.getElementById('kelasSelect').value;
        const mv = document.getElementById('muridSelect').value;
        const ket = document.getElementById('keteranganSelect').value;
        const nInput = document.getElementById('newMuridName').value.trim();
        const n = mv === 'NEW_MURID' ? nInput : mv;

        if (!k || !n) return window.app.displayMessage('error', 'Lengkapi form!');
        if (window.app.data.buffer.some(b => b.Nama.toLowerCase() === n.toLowerCase())) {
            return window.app.displayMessage('error', 'Murid sudah ada di antrean.');
        }

        window.app.data.buffer.push({ 
            Nama: n, Kelas: k, KeteranganAbsen: ket, 
            Tanggal: getTodayDate(), Timestamp: getFormattedTimestamp(),
            isNew: mv === 'NEW_MURID' 
        });
        
        window.app.renderBuffer();
        document.getElementById('muridSelect').value = '';
        document.getElementById('newMuridInput').classList.add('hidden');
    };

    window.app.renderBuffer = () => {
        const b = document.getElementById('absensiBody');
        const count = window.app.data.buffer.length;
        b.innerHTML = count === 0 ? '<tr><td colspan="4" style="text-align:center; padding:3rem; color:#94a3b8; font-style: italic;">Antrean kosong.</td></tr>' : '';
        
        window.app.data.buffer.forEach((item, idx) => {
            b.innerHTML += `<tr>
                <td>${item.isNew ? '<span class="badge-warning">BARU</span> ' : ''}${item.Nama}</td>
                <td>${item.Kelas}</td><td>${item.KeteranganAbsen}</td>
                <td style="text-align:center"><button class="btn btn-danger" onclick="window.app.removeFromBuffer(${idx})">Hapus</button></td>
            </tr>`;
        });
        document.getElementById('bufferCount').textContent = count;
        document.getElementById('submitButton').disabled = count === 0;
    };

    window.app.removeFromBuffer = (idx) => {
        window.app.data.buffer.splice(idx, 1);
        window.app.renderBuffer();
    };

    // --- SUBMISSION ---
    window.app.submitBatchAbsensi = async () => {
        const s = document.getElementById('submitButton');
        const pin = document.getElementById('pinInput').value;
        const newMurids = window.app.data.buffer.filter(b => b.isNew);
        
        s.disabled = true; s.textContent = 'Memproses...';

        try {
            if (newMurids.length > 0) {
                window.app.displayMessage('info', 'Mendaftarkan murid baru...');
                await fetch(`${window.app.config.url}?action=batchSubmit&sheetName=${window.app.config.sheetMurid}`, {
                    method: 'POST',
                    body: JSON.stringify({ PIN: pin, items: newMurids.map(m => ({ Nama: m.Nama, Kelas: m.Kelas })), duplicateKeys: ["Nama", "Kelas"] })
                });
            }

            window.app.displayMessage('info', 'Mengirim data absensi...');
            const res = await fetch(`${window.app.config.url}?action=batchSubmit&sheetName=${window.app.config.sheetAbsensi}&spreadsheetId=${window.app.config.targetId}`, {
                method: 'POST',
                body: JSON.stringify({ 
                    PIN: pin, items: window.app.data.buffer, 
                    duplicateKeys: ["Nama", "Tanggal"], updateKeyOnDuplicate: "KeteranganAbsen" 
                })
            });

            if ((await res.json()).success) {
                window.app.data.buffer = [];
                window.app.renderBuffer();
                window.app.displayMessage('success', 'Berhasil terkirim!');
                await window.app.loadInitialData();
            }
        } catch(e) { 
            window.app.displayMessage('error', 'Terjadi kesalahan sistem.'); 
        } finally { 
            s.disabled = false; s.textContent = 'Kirim Semua ke Database'; 
        }
    };

    // --- VERIFIKASI ---
    const openedDetails = new Set();
	window.app.loadAllClasses = async (skipReset = false) => {
        const b = document.getElementById('dataKelasBody');
    	b.innerHTML = '<tr><td colspan="5" style="text-align:center">Memuat data...</td></tr>';
    
        try {
            const t = getTodayDate();
            const [rk, ra] = await Promise.all([
                fetch(`${window.app.config.url}?action=vars&sheetName=${window.app.config.sheetKelas}`),
                fetch(`${window.app.config.url}?action=vars&sheetName=${window.app.config.sheetAbsensi}&spreadsheetId=${window.app.config.targetId}&filterKey=Tanggal&filterValue=${t}`)
            ]);
            const dk = await rk.json();
            const da = await ra.json();

            if (!skipReset) {
                await window.app.checkAndResetKelasStatus(dk);
            }

            b.innerHTML = '';
            dk.forEach((k, index) => {
                const muridTidakHadir = Array.isArray(da) ? da.filter(a => a.Kelas === k.Kelas) : [];
                const ab = muridTidakHadir.length;
                const detailId = `det-${index}`;

                const r = b.insertRow();
                r.className = 'recap-row';

                r.innerHTML = `<td>
                                    <input type="checkbox" ${String(k.StatusCek).toUpperCase() === 'TRUE' ? 'checked' : ''} onclick="event.stopPropagation()" onchange="window.app.updateStatusKelas('${k.Kelas}', this.checked)">
                               </td>
                               <td>${k.Kelas}
                               <span style="display: block; cursor: pointer; text-decoration: underline;">Tampilkan Detail</span></td>
                               <td>${k.TotalMurid - ab}</td>
                               <td>${ab}</td>
                               <td>${k.TotalMurid}</td>`;
            	
            	r.cells[1].onclick = () => {
                	const el = document.getElementById(detailId);
                	const isVisible = el.style.display === 'table-row';
                    
                    if (isVisible) {
                        el.style.display = 'none';
                        openedDetails.delete(k.Kelas);
                    } else {
                        el.style.display = 'table-row';
                        openedDetails.add(k.Kelas);
                    }
                };

                const dr = b.insertRow();
                dr.id = detailId;
                dr.className = 'detail-row';
            
            	dr.style.display = openedDetails.has(k.Kelas) ? 'table-row' : 'none';
            
                if (muridTidakHadir.length === 0) {
                    dr.innerHTML = `<td colspan="5" style="text-align:center; font-weight:bold;">Hadir Semua</td>`;
                } else {
                    dr.innerHTML = `<td colspan="5">
                        ${muridTidakHadir.map(m => `
                            <span class="detail-badge" style="display:inline-flex; align-items:center; gap:5px;">
                                ${m.Nama} (${m.KeteranganAbsen})
                                <span style="color:red; cursor:pointer; font-weight:bold;" 
                                      onclick="window.app.hapusAbsen('${m.Nama}', '${m.Kelas}', '${m.Tanggal}', '${m.KeteranganAbsen}')">[HAPUS]</span>
                            </span>`).join('')}
                    </td>`;
                }
            });
        } catch (e) {
            b.innerHTML = '<tr><td colspan="5">Gagal muat.</td></tr>';
        }
    };

    window.app.checkAndResetKelasStatus = async (dataKelas) => {
        const today = getTodayDate();
        const updatePromises = [];

        dataKelas.forEach(item => {
            const itemTgl = String(item.TglVerifikasi || '1970-01-01').split('T')[0];
            if (itemTgl !== today && String(item.StatusCek).toUpperCase() === 'TRUE') {
                updatePromises.push(window.app.updateStatusKelas(item.Kelas, false));
            }
        });

        if (updatePromises.length > 0) {
            await Promise.all(updatePromises);
            window.app.displayMessage('info', `Status ${updatePromises.length} kelas direset untuk hari ini.`);
            window.app.loadAllClasses(true);
        }
    };

    window.app.updateStatusKelas = async (k, c) => {
		window.app.displayMessage('info', 'Mohon tunggu! Memproses...');
        try {
            const res = await fetch(`${window.app.config.url}?action=batchSubmit&sheetName=${window.app.config.sheetKelas}`, {
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
            window.app.displayMessage('success', 'Status updated.');
			window.app.loadAllClasses();
        } catch(e) { 
            window.app.displayMessage('error', 'Gagal update: ' + e.message);
            const checkbox = document.querySelector(`input[onchange*="${k}"]`);
            if (checkbox) checkbox.checked = !c;
        }
    };

    window.app.hapusAbsen = async (nama, kelas, tanggal, keterangan) => {
        if (!confirm(`Hapus data ${nama}?`)) return;
    	window.app.displayMessage('info', 'Mohon tunggu! Memproses...');
        try {
            const res = await fetch(`${window.app.config.url}?action=deleteData&spreadsheetId=${window.app.config.targetId}`, {
                method: 'POST',
                body: JSON.stringify({ PIN: document.getElementById('pinInput').value, sheetName: window.app.config.sheetAbsensi, keys: { "Nama": nama, "Kelas": kelas, "Tanggal": tanggal, "KeteranganAbsen": keterangan } })
            });
            if ((await res.json()).success) {
                window.app.displayMessage('success', 'Data dihapus.');
                window.app.loadAllClasses();
            }
        } catch(e) { 
            window.app.displayMessage('error', 'Gagal menghapus.'); 
        }
    };

    // --- REKAP ---
    window.app.loadMonthlyRecap = async () => {
        const m = document.getElementById('monthFilter').value;
        const b = document.getElementById('monthlyRecapBody');
        if (!m) return;
        b.innerHTML = '<tr><td colspan="7" style="text-align:center">Memproses...</td></tr>';
        try {
            const res = await fetch(`${window.app.config.url}?action=vars&sheetName=${window.app.config.sheetAbsensi}&spreadsheetId=${window.app.config.targetId}&filterKey=Tanggal&filterValue=${m}`);
            const raw = await res.json();
            
            const summary = {};
            raw.forEach(i => {
                if(!summary[i.Nama]) summary[i.Nama] = { Nama: i.Nama, Kelas: i.Kelas, Sakit:0, Ijin:0, Alfa:0, Bolos:0, Total:0, Details: [] };
                const k = i.KeteranganAbsen === "Tanpa Keterangan" ? "Alfa" : i.KeteranganAbsen;
                if(summary[i.Nama][k] !== undefined) summary[i.Nama][k]++;
                summary[i.Nama].Total++;
                summary[i.Nama].Details.push({ tgl: i.Tanggal, ket: i.KeteranganAbsen });
            });

            const sorted = Object.values(summary).sort((a,b) => a.Kelas.localeCompare(b.Kelas) || a.Nama.localeCompare(b.Nama));
            b.innerHTML = sorted.length === 0 ? '<tr><td colspan="7" style="text-align:center">Kosong.</td></tr>' : '';
            
            sorted.forEach((s, idx) => {
                const dId = `det-rekap-${idx}`;
                b.innerHTML += `
                    <tr class="recap-row" onclick="const el = document.getElementById('${dId}'); el.style.display = el.style.display === 'table-row' ? 'none' : 'table-row'">
                        <td><b>${s.Nama}</b></td><td>${s.Kelas}</td><td>${s.Ijin}</td><td>${s.Sakit}</td><td>${s.Alfa}</td><td>${s.Bolos}</td><td>${s.Total}</td>
                    </tr>
                    <tr id="${dId}" class="detail-row">
                        <td colspan="7">${s.Details.map(d => `<span class="detail-badge"><b>${d.tgl}:</b> ${d.ket}</span>`).join('')}</td>
                    </tr>`;
            });
            window.app.renderChart(sorted);
        } catch(e) { 
            b.innerHTML = '<tr><td colspan="7">Gagal rekap.</td></tr>'; 
        }
    };

    window.app.renderChart = (data) => {
        const ctx = document.getElementById('absensiChart').getContext('2d');
        const classData = {};
        const cats = ['Ijin', 'Sakit', 'Alfa', 'Bolos'];
        
        data.forEach(d => {
            if (!classData[d.Kelas]) classData[d.Kelas] = { Ijin: 0, Sakit: 0, Alfa: 0, Bolos: 0 };
            cats.forEach(c => classData[d.Kelas][c] += d[c]);
        });

        const labels = Object.keys(classData);
        const datasets = cats.map((cat, i) => ({
            label: cat, data: labels.map(l => classData[l][cat]),
            backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][i]
        }));

        if (window.app.data.chart) window.app.data.chart.destroy();
        window.app.data.chart = new Chart(ctx, {
            type: 'bar', data: { labels, datasets },
            options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }
        });
    };

    window.app.exportToCsv = () => {
        const table = document.querySelector("#rekapSection table");
        const rows = table.querySelectorAll("tr");
        const month = document.getElementById('monthFilter').value;
        
        let csvContent = "data:text/csv;charset=utf-8,";
        
        rows.forEach((row) => {
            if (row.classList.contains('detail-row')) return;
            const cols = row.querySelectorAll("td, th");
            const rowData = Array.from(cols)
                .map(col => `"${col.innerText.replace(/"/g, '""')}"`)
                .join(",");
            csvContent += rowData + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Rekap_Absensi_${month}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- INIT ---
    window.addEventListener('hashchange', () => {
        const h = window.location.hash.substring(1);
        if (['input', 'verifikasi', 'rekap'].includes(h)) window.app.toggleSection(h);
    });

    window.addEventListener('click', (e) => {
        if (!e.target.closest('.menu-nav')) document.getElementById('navList').classList.remove('show');
    });

    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('monthFilter').value = getTodayMonth();
        const urlParams = new URLSearchParams(window.location.search);
        const pin = urlParams.get('pin') || localStorage.getItem('userPin');
        if (pin) {
            document.getElementById('pinInput').value = pin;
            setTimeout(() => {window.app.checkPin(pin)}, 100);
        }
        
        const h = window.location.hash.substring(1) || 'input';
        window.app.toggleSection(h);
    });
})();