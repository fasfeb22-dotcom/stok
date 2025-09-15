<!DOCTYPE html>  <html lang="id">  
<head>  
  <meta charset="UTF-8">  
  <meta name="viewport" content="width=device-width, initial-scale=1.0">  
  <title>Laporan SO - Stock Opname</title>  
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">  
  <style>  
    body {   
      background: #f5f5f5;   
      min-height: 100vh;   
    }  
    .container {   
      max-width: 900px;   
      margin-top: 30px;   
    }  
    h1.title {   
      font-size: 1.5rem;   
      margin-bottom: 1rem;   
      text-align: center;   
    }  
    .table-container {  
      overflow-x: auto;  
      margin-top: 1rem;  
    }  
    table {  
      min-width: 500px; /* Supaya tabel tidak pecah */  
    }  
  </style>  
</head>  
<body>  
  <nav class="navbar is-link">  
    <div class="navbar-brand">  
      <a class="navbar-item" href="index.html">📦 Stock Opname</a>  
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navMenu">  
        <span aria-hidden="true"></span>  
        <span aria-hidden="true"></span>  
        <span aria-hidden="true"></span>  
      </a>  
    </div>  
    <div id="navMenu" class="navbar-menu"></div>  
  </nav>    <section class="section">  
    <div class="container">  
      <h1 class="title is-size-5-mobile">Laporan Hasil SO</h1>  <div class="field">  
    <label class="label">Pilih Tanggal</label>  
    <input class="input" type="date" id="tanggalLaporan" onchange="tampilkanLaporan()">  
  </div>  

  <div id="laporanContainer" class="table-container"></div>  
</div>

  </section>    <script src="script.js"></script>    <script>  
    // Navbar burger untuk mobile  
    document.addEventListener('DOMContentLoaded', () => {  
      const burger = document.querySelector('.navbar-burger');  
      const menu = document.getElementById('navMenu');  
      burger.addEventListener('click', () => {  
        burger.classList.toggle('is-active');  
        menu.classList.toggle('is-active');  
      });  
    });  
  
    // Contoh fungsi tampilkanLaporan()  
    function tampilkanLaporan() {  
      const tanggal = document.getElementById('tanggalLaporan').value;  
      const container = document.getElementById('laporanContainer');  
      container.innerHTML = ''; // Reset sebelumnya  
  
      if(!tanggal) return;  
  
      // Ambil data dari localStorage (contoh)  
      const laporan = JSON.parse(localStorage.getItem('laporanSO_' + tanggal)) || [];  
  
      if(laporan.length === 0) {  
        container.innerHTML = "<p class='has-text-centered has-text-danger'>❌ Tidak ada data untuk tanggal ini.</p>";  
        return;  
      }  
  
      let html = '<table class="table is-striped is-fullwidth"><thead><tr><th>Rak</th><th>Barang</th><th>Stok Sistem</th><th>Qty Fisik</th><th>Selisih</th></tr></thead><tbody>';  
      laporan.forEach(item => {  
        html += `<tr>  
          <td>${item.rak}</td>  
          <td>${item.nama}</td>  
          <td>${item.stok}</td>  
          <td>${item.fisik}</td>  
          <td>${item.fisik - item.stok}</td>  
        </tr>`;  
      });  
      html += '</tbody></table>';  
  
      container.innerHTML = html;  
    }  
  </script>  </body>  
</html>
