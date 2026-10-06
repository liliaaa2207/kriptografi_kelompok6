# Tugas Besar Kriptografi - Kelompok 6

Repositori ini dibuat untuk memenuhi tugas kelompok mata kuliah Kriptografi. Proyek ini terbagi menjadi dua bagian utama: Implementasi Kriptosistem Berbasis Web dan Analisis Kriptografi (Kriptanalisis).

## Anggota Kelompok
* Risma Ramadhani (L0324030)
* Wizad Akmalia Zulfaa (L0324036)
* Zefanya Christian Natasha (L0324037)

---

## Struktur Proyek
- `web_kriptografi/` : Berisi source code aplikasi web GUI untuk 7 algoritma klasik.
- `analisis_cipher2/` : Berisi skrip Python dan file teks untuk analisis dekripsi *Cipher2.txt*.

---

## Bagian A: Web GUI 7 Kriptosistem Klasik
Aplikasi berbasis web ini mendukung enkripsi dan dekripsi menggunakan 7 algoritma cipher klasik:
1. **Shift Cipher**
2. **Substitution Cipher**
3. **Affine Cipher**
4. **Vigenere Cipher**
5. **Hill Cipher**
6. **Permutation (Transposition) Cipher**
7. **One-Time Pad (OTP)**

### Cara Menjalankan Program Web:
1. Pastikan memiliki browser modern (Chrome/Firefox/Edge).
2. Buka folder `web_kriptografi`.
3. Jalankan file utama (misalnya `index.html`) dengan membukanya langsung di browser atau menggunakan local server (seperti Live Server di VS Code).

---

## Bagian B: Kriptanalisis Cipher Abjad-Tunggal
Bagian ini berisi proses pemecahan teks tersandi (`Cipher2.txt`) menggunakan metode analisis frekuensi, bigram, dan terkaan pola kata bahasa Inggris hingga menghasilkan plainteks yang utuh.
