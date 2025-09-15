// ==================== DATA AWAL ====================
let stokAwal = JSON.parse(localStorage.getItem("stokAwal")) || {
  "Rak A": [
    { nama: "KinderJoy", stok: 19 },
    { nama: "Gmp", stok: 20 },
    { nama: "Sunco", stok: 8 }
  ],
  "Rak B": [
    { nama: "Indomie", stok: 100 },
    { nama: "Kopi", stok: 40 },
    { nama: "Teh", stok: 25 }
  ],
  "Rak C": [
    { nama: "KinderJoy", stok: 19 },
    { nama: "Gmp", stok: 20 },
    { nama: "Sunco", stok: 8 }
  ]
};

function saveStokAwal() {
  localStorage.setItem("stokAwal", JSON.stringify(stokAwal));
}

// ==================== RENDER RAK ====================
function renderRakOptions() {
  const rakOptions = Object.keys(stokAwal);

  const rakSelect = document.getElementById("rakSelect");
  const rakEditSelect = document.getElementById("rakEditSelect");
  const rakChecklist = document.getElementById("rakChecklist");

  if (rakSelect) {
    rakSelect.innerHTML = `<option value="">-- Pilih Rak --</option>`;
    rakOptions.forEach(r => rakSelect.innerHTML += `<option value="${r}">${r}</option>`);
  }

  if (rakEditSelect) {
    rakEditSelect.innerHTML = `<option value="">-- Pilih Rak --</option>`;
    rakOptions.forEach(r => rakEditSelect.innerHTML += `<option value="${r}">${r}</option>`);
  }

  if (rakChecklist) {
    rakChecklist.innerHTML = "";
    rakOptions.forEach(r => {
      rakChecklist.innerHTML += `<label class="checkbox mr-3"><input type="checkbox" class="rakCheck" value="${r}"> ${r}</label>`;
    });
  }
}
renderRakOptions();

// ==================== INPUT ====================
function loadBarang() {
  const rak = document.getElementById("rakSelect")?.value;
  const form = document.getElementById("barangForm");
  const table = document.getElementById("barangTable");
  if (!form || !table) return;

  table.innerHTML = "";
  if (!rak) {
    form.classList.add("is-hidden");
    return;
  }

  stokAwal[rak].forEach((item, i) => {
    table.innerHTML += `
      <tr>
        <td>${item.nama}</td>
        <td>${item.stok}</td>
        <td><input type="number" class="input" name="qty-${i}" min="0"></td>
      </tr>`;
  });

  form.classList.remove("is-hidden");
}

function simpanData(e) {
  e.preventDefault();
  const rak = document.getElementById("rakSelect").value;
  const inputs = document.querySelectorAll("#barangTable input");
  const tgl = document.getElementById("tanggalLaporanInput")?.value || new Date().toISOString().slice(0,10);

  if (!tgl) { alert("Pilih tanggal!"); return; }

  let data = [];
  inputs.forEach((inp, i) => {
    data.push({
      nama: stokAwal[rak][i].nama,
      stok: stokAwal[rak][i].stok,
      fisik: parseInt(inp.value) || 0
    });
  });

  localStorage.setItem(rak, JSON.stringify(data));

  // Simpan juga per tanggal
  let hasilSO = JSON.parse(localStorage.getItem("hasilSO_" + tgl)) || {};
  hasilSO[rak] = data;
  localStorage.setItem("hasilSO_" + tgl, JSON.stringify(hasilSO));

  alert("Data berhasil disimpan!");
}

// ==================== CETAK SELISIH ====================
function previewSelisih() {
  const tbody = document.querySelector("#selisihTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  const rakDipilih = Array.from(document.querySelectorAll(".rakCheck:checked")).map(c => c.value);
  if (rakDipilih.length === 0) {
    alert("Pilih rak dulu!");
    return;
  }

  rakDipilih.forEach(rak => {
    let data = JSON.parse(localStorage.getItem(rak)) || [];
    data.forEach(item => {
      const selisih = (item.fisik || 0) - (item.stok || 0);
      let cls = selisih === 0 ? "has-text-success" : "has-text-danger";
      tbody.innerHTML += `
        <tr>
          <td>${rak}</td>
          <td>${item.nama}</td>
          <td>${item.stok}</td>
          <td>${item.fisik || 0}</td>
          <td class="${cls}"><b>${selisih}</b></td>
        </tr>`;
    });
  });
}

// ==================== EDIT ====================
function loadEditBarang() {
  const rak = document.getElementById("rakEditSelect")?.value;
  const form = document.getElementById("editForm");
  const table = document.getElementById("editBarangTable");
  if (!form || !table) return;

  table.innerHTML = "";
  if (!rak) { form.classList.add("is-hidden"); return; }

  let data = JSON.parse(localStorage.getItem(rak)) || stokAwal[rak] || [];
  data.forEach((item, i) => {
    table.innerHTML += `
      <tr>
        <td>${item.nama}</td>
        <td>${item.stok}</td>
        <td><input type="number" class="input" name="edit-${i}" value="${item.fisik || 0}" min="0"></td>
      </tr>`;
  });

  form.classList.remove("is-hidden");
}

function simpanEdit(e) {
  e.preventDefault();
  const rak = document.getElementById("rakEditSelect").value;
  let data = JSON.parse(localStorage.getItem(rak)) || stokAwal[rak] || [];
  const inputs = document.querySelectorAll("#editBarangTable input");

  inputs.forEach((inp, i) => {
    if (data[i]) data[i].fisik = parseInt(inp.value) || 0;
  });

  stokAwal[rak] = data;
  saveStokAwal();
  localStorage.setItem(rak, JSON.stringify(data));

  // Update hasilSO per tanggal (gunakan hari ini)
  const tgl = new Date().toISOString().slice(0,10);
  let hasilSO = JSON.parse(localStorage.getItem("hasilSO_" + tgl)) || {};
  hasilSO[rak] = data;
  localStorage.setItem("hasilSO_" + tgl, JSON.stringify(hasilSO));

  alert("Perubahan disimpan!");
}

function tambahItem() {
  const rak = document.getElementById("rakEditSelect").value;
  if (!rak) { alert("Pilih rak!"); return; }

  let nama = document.getElementById("newItemName").value.trim();
  let stok = parseInt(document.getElementById("newItemStok").value) || 0;
  let fisik = parseInt(document.getElementById("newItemFisik").value) || 0;
  if (!nama) { alert("Nama kosong!"); return; }

  let data = JSON.parse(localStorage.getItem(rak)) || stokAwal[rak] || [];
  data.push({ nama, stok, fisik });

  stokAwal[rak] = data;
  saveStokAwal();
  localStorage.setItem(rak, JSON.stringify(data));

  // Update hasilSO per tanggal
  const tgl = new Date().toISOString().slice(0,10);
  let hasilSO = JSON.parse(localStorage.getItem("hasilSO_" + tgl)) || {};
  hasilSO[rak] = data;
  localStorage.setItem("hasilSO_" + tgl, JSON.stringify(hasilSO));

  alert("Item ditambahkan!");
  loadEditBarang();
}

// ==================== LAPORAN ====================
function tampilkanLaporan() {
  const tgl = document.getElementById("tanggalLaporan")?.value;
  const cont = document.getElementById("laporanContainer");
  if (!tgl || !cont) return;

  cont.innerHTML = "";

  let data = JSON.parse(localStorage.getItem("hasilSO_" + tgl)) || {};
  if (Object.keys(data).length === 0) {
    cont.innerHTML = `<div class="notification is-danger">❌ Tidak ada data untuk tanggal ini.</div>`;
    return;
  }

  for (let rak in data) {
    let html = `
      <h2 class="title is-5">Rak: ${rak}</h2>
      <table class="table is-fullwidth is-bordered">
        <thead>
          <tr><th>Barang</th><th>Stok</th><th>Fisik</th><th>Selisih</th></tr>
        </thead>
        <tbody>`;

    data[rak].forEach(item => {
      const selisih = (item.fisik || 0) - (item.stok || 0);
      let cls = selisih === 0 ? "has-text-success" : "has-text-danger";
      html += `
        <tr>
          <td>${item.nama}</td>
          <td>${item.stok}</td>
          <td>${item.fisik || 0}</td>
          <td class="${cls}"><b>${selisih}</b></td>
        </tr>`;
    });

    html += "</tbody></table><hr>";
    cont.innerHTML += html;
  }
}
