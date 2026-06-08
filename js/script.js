// ===================================================
// DOORSMEER BERSIH JAYA - Main JavaScript
// ===================================================

// ===== 1. NAVBAR: Scroll effect & Hamburger =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    console.log('Menu toggled:', navLinks.classList.contains('open') ? 'Dibuka' : 'Ditutup');
  });
}

// Tutup menu saat link diklik
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger && hamburger.classList.remove('open');
    navLinks && navLinks.classList.remove('open');
  });
});


// ===== 2. SCROLL REVEAL ANIMATION =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});


// ===== 3. SET MIN DATE for Booking Form =====
const tanggalInput = document.getElementById('tanggal');
if (tanggalInput) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  tanggalInput.min = `${yyyy}-${mm}-${dd}`;
}


// ===== 4. BOOKING SUMMARY PREVIEW =====
const bookingFields = ['nama', 'kendaraan', 'layanan', 'tanggal', 'waktu'];
function updateSummary() {
  const summary = document.getElementById('bookingSummary');
  const content = document.getElementById('summaryContent');
  if (!summary || !content) return;

  const nama = document.getElementById('nama')?.value;
  const kendaraan = document.getElementById('kendaraan')?.value;
  const layanan = document.getElementById('layanan')?.value;
  const tanggal = document.getElementById('tanggal')?.value;
  const waktu = document.getElementById('waktu')?.value;
  const plat = document.getElementById('plat')?.value;

  if (nama || kendaraan || layanan) {
    summary.style.display = 'block';
    const kendaraanLabels = {
      'motor': '🏍️ Motor',
      'mobil-kecil': '🚗 Mobil (City Car/Sedan)',
      'mobil-suv': '🚙 Mobil SUV/MPV',
      'mobil-pickup': '🚐 Pickup/Van'
    };
    const layananSelect = document.getElementById('layanan');
    const layananLabel = layananSelect?.options[layananSelect.selectedIndex]?.text || '-';
    let html = '';
    if (nama) html += `👤 <strong>Nama:</strong> ${nama}<br/>`;
    if (kendaraan) html += `🚗 <strong>Kendaraan:</strong> ${kendaraanLabels[kendaraan] || kendaraan}<br/>`;
    if (layanan) html += `🛁 <strong>Layanan:</strong> ${layananLabel}<br/>`;
    if (tanggal) html += `📅 <strong>Tanggal:</strong> ${formatDate(tanggal)}<br/>`;
    if (waktu) html += `⏰ <strong>Jam:</strong> ${waktu} WIB<br/>`;
    if (plat) html += `🔢 <strong>Plat:</strong> ${plat.toUpperCase()}<br/>`;
    content.innerHTML = html;
  } else {
    summary.style.display = 'none';
  }
}

bookingFields.forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', updateSummary);
  if (el) el.addEventListener('change', updateSummary);
});
const platInput = document.getElementById('plat');
if (platInput) platInput.addEventListener('input', updateSummary);

function formatDate(str) {
  if (!str) return '-';
  const [y, m, d] = str.split('-');
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return `${d} ${months[parseInt(m)-1]} ${y}`;
}


// ===== 5. BOOKING FORM VALIDATION =====
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const fields = [
      { id: 'nama',      errId: 'errNama',     check: v => v.trim().length >= 3 },
      { id: 'telepon',   errId: 'errTelepon',  check: v => /^[0-9+\-\s]{9,15}$/.test(v.trim()) },
      { id: 'kendaraan', errId: 'errKendaraan',check: v => v !== '' },
      { id: 'layanan',   errId: 'errLayanan',  check: v => v !== '' },
      { id: 'tanggal',   errId: 'errTanggal',  check: v => v !== '' },
      { id: 'waktu',     errId: 'errWaktu',    check: v => v !== '' },
    ];

    let valid = true;

    // Reset semua error
    fields.forEach(f => {
      const el = document.getElementById(f.id);
      const err = document.getElementById(f.errId);
      if (el) el.classList.remove('error');
      if (err) err.classList.remove('show');
    });

    // Validasi
    fields.forEach(f => {
      const el = document.getElementById(f.id);
      const err = document.getElementById(f.errId);
      if (el && !f.check(el.value)) {
        el.classList.add('error');
        if (err) err.classList.add('show');
        valid = false;
        console.warn(`Validasi gagal: field "${f.id}"`);
      }
    });

    if (valid) {
      const nama = document.getElementById('nama').value;
      const layananEl = document.getElementById('layanan');
      const layananLabel = layananEl.options[layananEl.selectedIndex].text;
      const tanggal = formatDate(document.getElementById('tanggal').value);
      const waktu = document.getElementById('waktu').value;

      console.log(`✅ Booking berhasil: ${nama} - ${layananLabel} - ${tanggal} ${waktu}`);
      showToast(`✅ Booking berhasil, ${nama}! Kami akan konfirmasi via WhatsApp.`, 'success');

      // Simulasi redirect ke WA
      setTimeout(() => {
        const noHP = document.getElementById('telepon').value.trim().replace(/[^0-9]/g, '');
        const msg = encodeURIComponent(
          `Halo Bersih Jaya, saya ${nama} ingin booking:\n` +
          `Layanan: ${layananLabel}\n` +
          `Tanggal: ${tanggal} pukul ${waktu} WIB`
        );
        window.open(`https://wa.me/6281234567890?text=${msg}`, '_blank');
      }, 1500);

      bookingForm.reset();
      document.getElementById('bookingSummary').style.display = 'none';
    } else {
      showToast('⚠️ Mohon lengkapi semua data yang wajib diisi.', '');
    }
  });
}


// ===== 6. TOAST NOTIFICATION =====
function showToast(msg, type) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'toast show ' + (type || '');
  setTimeout(() => toast.classList.remove('show'), 4500);
}


// ===== 7. ACTIVE NAV HIGHLIGHT =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});


// ===== 8. GREETING (Console) =====
console.log('%c🚗 Doorsmeer Bersih Jaya', 'color:#00c6ff; font-size:18px; font-weight:bold;');
console.log('%cWebsite aktif. Halaman: ' + currentPage, 'color:#8899bb; font-size:12px;');
