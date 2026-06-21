const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, 'src', 'locales');
const enPath = path.join(localesPath, 'en.json');
const idPath = path.join(localesPath, 'id.json');

const idData = JSON.parse(fs.readFileSync(idPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const idAdditions = {
  vendor_sidebar: {
    dashboard: "Dashboard",
    pesanan: "Pesanan",
    layanan: "Paket Layanan",
    portofolio: "Portofolio",
    ulasan: "Ulasan",
    keuangan: "Keuangan",
    pengaturan: "Pengaturan",
    navigasi: "NAVIGASI",
    keluar: "KELUAR",
    logout_title: "Keluar dari akun?",
    logout_desc: "Kamu yakin ingin keluar dari akun vendor sekarang?",
    logout_cancel: "Batal",
    logout_confirm: "Ya, Keluar"
  },
  admin_sidebar: {
    dashboard: "Dashboard",
    pengguna: "Kelola Pengguna",
    vendor: "Kelola Vendor",
    kategori: "Kategori Layanan",
    penarikan: "Permintaan Penarikan",
    pengaturan: "Pengaturan",
    navigasi: "NAVIGASI",
    keluar: "KELUAR",
    logout_title: "Keluar dari akun?",
    logout_desc: "Kamu yakin ingin keluar dari akun admin sekarang?",
    logout_cancel: "Batal",
    logout_confirm: "Ya, Keluar"
  },
  vendor_layout: {
    loading: "MEMUAT DASHBOARD VENDOR...",
    verification_title: "Akun Sedang Diverifikasi",
    verification_desc: "Mohon tunggu hingga Admin menyetujui akun Anda. Anda tidak bisa menambah layanan selama proses ini.",
    vendor: "Vendor"
  },
  admin_layout: {
    loading: "MEMUAT DASHBOARD ADMIN...",
    admin: "Admin"
  },
  vendor_dashboard: {
    welcome: "Ringkasan Bisnis",
    subtitle: "PANTAU PERFORMA DAN PESANAN TERBARU",
    total_earnings: "Total Pendapatan",
    completed_orders: "Pesanan Selesai",
    active_services: "Layanan Aktif",
    average_rating: "Rata-rata Rating",
    out_of: "dari",
    recent_orders: "Pesanan Terbaru",
    no_orders: "Belum ada pesanan terbaru",
    view_all: "Lihat Semua",
    status: {
      PENDING: "Menunggu",
      PAID: "Dibayar",
      CONFIRMED: "Dikonfirmasi",
      COMPLETED: "Selesai",
      CANCELLED: "Dibatalkan"
    }
  },
  admin_dashboard: {
    welcome: "Ringkasan Platform",
    subtitle: "PANTAU AKTIVITAS DAN PERTUMBUHAN PLANORA",
    total_users: "Total Pengguna",
    total_vendors: "Total Vendor",
    total_transactions: "Total Transaksi",
    total_revenue: "Total Pendapatan",
    recent_vendors: "Vendor Terbaru",
    view_all: "Lihat Semua",
    no_vendors: "Belum ada pendaftaran vendor baru"
  }
};

const enAdditions = {
  vendor_sidebar: {
    dashboard: "Dashboard",
    pesanan: "Orders",
    layanan: "Service Packages",
    portofolio: "Portfolio",
    ulasan: "Reviews",
    keuangan: "Finances",
    pengaturan: "Settings",
    navigasi: "NAVIGATION",
    keluar: "LOGOUT",
    logout_title: "Sign out of account?",
    logout_desc: "Are you sure you want to sign out of the vendor account now?",
    logout_cancel: "Cancel",
    logout_confirm: "Yes, Sign out"
  },
  admin_sidebar: {
    dashboard: "Dashboard",
    pengguna: "Manage Users",
    vendor: "Manage Vendors",
    kategori: "Service Categories",
    penarikan: "Withdrawal Requests",
    pengaturan: "Settings",
    navigasi: "NAVIGATION",
    keluar: "LOGOUT",
    logout_title: "Sign out of account?",
    logout_desc: "Are you sure you want to sign out of the admin account now?",
    logout_cancel: "Cancel",
    logout_confirm: "Yes, Sign out"
  },
  vendor_layout: {
    loading: "LOADING VENDOR DASHBOARD...",
    verification_title: "Account Under Verification",
    verification_desc: "Please wait until the Admin approves your account. You cannot add services during this process.",
    vendor: "Vendor"
  },
  admin_layout: {
    loading: "LOADING ADMIN DASHBOARD...",
    admin: "Admin"
  },
  vendor_dashboard: {
    welcome: "Business Summary",
    subtitle: "MONITOR PERFORMANCE AND RECENT ORDERS",
    total_earnings: "Total Earnings",
    completed_orders: "Completed Orders",
    active_services: "Active Services",
    average_rating: "Average Rating",
    out_of: "out of",
    recent_orders: "Recent Orders",
    no_orders: "No recent orders yet",
    view_all: "View All",
    status: {
      PENDING: "Pending",
      PAID: "Paid",
      CONFIRMED: "Confirmed",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled"
    }
  },
  admin_dashboard: {
    welcome: "Platform Overview",
    subtitle: "MONITOR ACTIVITY AND PLANORA GROWTH",
    total_users: "Total Users",
    total_vendors: "Total Vendors",
    total_transactions: "Total Transactions",
    total_revenue: "Total Revenue",
    recent_vendors: "Recent Vendors",
    view_all: "View All",
    no_vendors: "No new vendor registrations yet"
  }
};

Object.assign(idData, idAdditions);
Object.assign(enData, enAdditions);

fs.writeFileSync(idPath, JSON.stringify(idData, null, 2));
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));

console.log("Locales updated successfully.");
