# LibraryReg — Website Perpustakaan Universitas

## Deskripsi

LibraryReg adalah website front-end sederhana untuk memperkenalkan perpustakaan universitas, menyampaikan informasi layanan, dan membantu pengunjung mendaftar sebagai anggota. Petugas memiliki dashboard simulasi untuk melihat dan mengelola data anggota.

Website dibuat menggunakan HTML, CSS, JavaScript, dan Bootstrap 5. Tidak ada framework JavaScript, backend, atau database server.

## Tujuan

Menyediakan informasi awal mengenai perpustakaan, layanan, fasilitas, dan jam operasional.
Memudahkan pengunjung menemukan informasi dan berpindah ke halaman yang dibutuhkan.
Mengganti proses pendaftaran anggota berbasis kertas dengan formulir digital.
Menyediakan antarmuka sederhana bagi petugas untuk mengelola data anggota.
Daftar pengguna

1. Pengguna umum / pengunjung : melihat informasi perpustakaan dan mendaftar sebagai anggota
2. Pengelola : Melihat dan Mencari Daftar anggota serta mengelola data anggota melalui antarmuka web.

## Ruang Lingkup Fungsional:

1. Informasi Perpustakaan
2. Menu Navigasi
3. Pendaftaran Anggota
4. Pengelolaan Anggota
5. Dashboard Petugas

**Link Website:** https://hazzmiuww.github.io/Library-Landing-Page/

## Fitur dan Layanan

- **Informasi perpustakaan:** landing page, profil singkat, layanan, fasilitas, kontak, dan jam operasional.
- **Grafik ilustratif:** grafik batang jumlah koleksi per kategori dan pie chart komposisi jenis anggota. Angka grafik merupakan data contoh, bukan statistik dari sistem perpustakaan nyata.
- **Navigasi responsif:** menu Beranda, Tentang, Layanan, Daftar Anggota, Pendaftaran, dan Login Petugas.
- **Pendaftaran anggota:** formulir nama, NIM/NIP, program studi, alamat, nomor telepon, email, dan jenis keanggotaan. Kolom wajib, format email, dan keunikan NIM/NIP divalidasi.
- **Daftar anggota publik:** pengunjung dapat mencari dan melihat nama, program studi, serta jenis anggota. Data pribadi dan kontrol pengelolaan tidak ditampilkan pada halaman publik.
- **Dashboard petugas:** petugas demo dapat mencari anggota, melihat detail, mengedit data, dan menghapus data dengan konfirmasi.
- **Penyimpanan browser:** data anggota disimpan di `localStorage` dan sesi demo menggunakan `sessionStorage`.

## Susunan Halaman

| Halaman                                        | Isi                                                                         |
| ---------------------------------------------- | --------------------------------------------------------------------------- |
| [`index.html`](index.html)                     | Beranda, informasi perpustakaan, layanan, fasilitas, statistik, dan grafik. |
| [`page/anggota.html`](page/anggota.html)       | Daftar anggota publik yang hanya menampilkan informasi terbatas.            |
| [`page/registrasi.html`](page/registrasi.html) | Formulir pendaftaran anggota baru.                                          |
| [`page/login.html`](page/login.html)           | Login petugas simulasi dan informasi akun demo.                             |
| [`page/dashboard.html`](page/dashboard.html)   | Pengelolaan data anggota untuk petugas demo.                                |

## Struktur Direktori

```text
ETS/
├── index.html  Halaman utama (GitHub Pages)
├── page/       Halaman HTML lainnya
├── css/        Stylesheet
├── js/         JavaScript aplikasi
├── img/        Aset gambar dan logo
└── README.md   Dokumentasi website
```

Website ini memiliki satu halaman utama di root dan empat halaman tambahan di direktori `page/`. Bagian Beranda, Tentang, dan Layanan berada pada halaman utama; halaman lainnya digunakan untuk daftar publik, pendaftaran, login petugas, dan dashboard.

Alur Pengguna:

1. Pengguna masuk ke website dan berada di landing page yang berisi informasi, fasilitas, dan layanan perpustakaan.
2. Pengguna bisa mengakses menu navigasi untuk melakukan pendaftaran yang akan diarahkan ke form pendaftaran.
3. Pengguna yang sekaligus bertugas sebagai pengelola bisa melakukan login dan masuk ke dashboard pengelola.
4. Petugas dapat melihat daftar anggota, mencari nama, dan melihat atau mengedit data pengguna.
5. Jika petugas ingin menghapus data, maka akan ada konfirmasi terlebih dahulu sebelum petugas menghapus data pengguna.

## Catatan Data dan Batasan

- Data contoh anggota dimasukkan saat penyimpanan lokal belum berisi data, agar daftar dan dashboard dapat langsung dicoba.
- Data formulir dan perubahan anggota disimpan hanya di browser/perangkat yang digunakan. Data tidak tersinkron dengan perangkat lain dan dapat hilang jika penyimpanan browser dihapus.
- Login dan pembatasan dashboard hanya simulasi front-end. Data dan aturan aplikasi dapat diakses atau diubah melalui browser, sehingga tidak cocok untuk menyimpan informasi pribadi atau digunakan sebagai sistem perpustakaan sungguhan.
- Alamat Gubeng dan nomor telepon pada footer merupakan data contoh. Email memakai domain `.example`; semuanya bukan kontak resmi.
- Statistik grafik, jumlah koleksi, dan komposisi anggota bersifat ilustratif.

## Contoh Tampilan Website

![alt text](img/example.png)
