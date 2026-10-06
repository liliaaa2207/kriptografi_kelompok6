from pathlib import Path
from collections import Counter
import re


# ============================================================
# KONFIGURASI
# ============================================================

FOLDER = Path(__file__).resolve().parent
FILE_CIPHER = FOLDER / "Cipher2.txt"


# ============================================================
# MEMBACA FILE
# ============================================================

def baca_file(path):
    """
    Membaca Cipher2.txt.
    """

    if not path.exists():
        raise FileNotFoundError(
            f"\nFile tidak ditemukan:\n{path}\n\n"
            "Pastikan Cipher2.txt berada satu folder "
            "dengan analisis.py."
        )

    encoding_list = [
        "utf-8-sig",
        "utf-8",
        "cp1252"
    ]

    for encoding in encoding_list:
        try:
            return path.read_text(encoding=encoding)
        except UnicodeDecodeError:
            pass

    raise ValueError(
        "Encoding Cipher2.txt tidak dapat dikenali."
    )


# ============================================================
# MEMISAHKAN PARAGRAF
# ============================================================

def pisahkan_paragraf(teks):
    """
    Memisahkan ciphertext berdasarkan baris kosong.
    """

    bagian = re.split(
        r"\n\s*\n",
        teks.strip()
    )

    paragraf = []

    for item in bagian:

        item = re.sub(
            r"\s+",
            " ",
            item
        ).strip()

        if item:
            paragraf.append(item)

    return paragraf


# ============================================================
# MENGAMBIL HURUF
# ============================================================

def ambil_huruf(teks):
    """
    Mengambil karakter a-z saja.
    """

    return re.findall(
        r"[a-z]",
        teks.lower()
    )


# ============================================================
# ANALISIS FREKUENSI HURUF
# ============================================================

def analisis_frekuensi(teks):

    huruf = ambil_huruf(teks)

    jumlah = len(huruf)

    frekuensi = Counter(huruf)

    print(f"Jumlah huruf: {jumlah}")

    if jumlah == 0:
        print("Tidak ada huruf.")
        return

    print("\nFrekuensi huruf:")

    for huruf, jumlah_huruf in frekuensi.most_common():

        persentase = (
            jumlah_huruf /
            jumlah *
            100
        )

        print(
            f"{huruf} : "
            f"{jumlah_huruf:4d} "
            f"({persentase:6.2f}%)"
        )


# ============================================================
# ANALISIS KATA
# ============================================================

def analisis_kata(teks, batas=15):

    kata = re.findall(
        r"[a-z]+",
        teks.lower()
    )

    frekuensi = Counter(kata)

    print(
        f"\n{batas} kata paling sering muncul:"
    )

    if not frekuensi:
        print("Tidak ditemukan kata.")
        return

    for kata, jumlah in frekuensi.most_common(batas):

        print(
            f"{kata:<20} : {jumlah}"
        )


# ============================================================
# POLA KATA
# ============================================================

def pola_kata(kata):

    mapping = {}

    pola = []

    nomor = 0

    for huruf in kata:

        if huruf not in mapping:

            mapping[huruf] = str(nomor)

            nomor += 1

        pola.append(
            mapping[huruf]
        )

    return "".join(pola)


def analisis_pola(teks, batas=20):

    kata = re.findall(
        r"[a-z]+",
        teks.lower()
    )

    frekuensi = Counter(kata)

    print(
        f"\n{batas} kata berdasarkan pola:"
    )

    if not frekuensi:

        print("Tidak ditemukan kata.")

        return

    for kata, jumlah in frekuensi.most_common(batas):

        print(
            f"Kata: {kata:<15} "
            f"Pola: {pola_kata(kata):<15} "
            f"Jumlah: {jumlah}"
        )


# ============================================================
# ANALISIS N-GRAM
# ============================================================

def analisis_ngram(
    teks,
    ukuran=2,
    batas=15
):

    huruf = "".join(
        ambil_huruf(teks)
    )

    if len(huruf) < ukuran:

        print(
            "Teks terlalu pendek."
        )

        return

    ngram = []

    for i in range(
        len(huruf) - ukuran + 1
    ):

        ngram.append(
            huruf[
                i:i + ukuran
            ]
        )

    frekuensi = Counter(ngram)

    print(
        f"\n{batas} n-gram "
        f"paling sering muncul "
        f"(ukuran {ukuran}):"
    )

    for rangkaian, jumlah in frekuensi.most_common(batas):

        print(
            f"{rangkaian:<10} : {jumlah}"
        )


# ============================================================
# ANALISIS SATU PARAGRAF
# ============================================================

def analisis_paragraf(
    nomor,
    teks
):

    print("\n")
    print("=" * 60)

    print(
        f"ANALISIS PARAGRAF {nomor}"
    )

    print("=" * 60)

    print(
        f"Jumlah karakter : "
        f"{len(teks)}"
    )

    print(
        f"Jumlah huruf    : "
        f"{len(ambil_huruf(teks))}"
    )

    print("\n--- FREKUENSI HURUF ---")

    analisis_frekuensi(teks)

    print("\n--- FREKUENSI KATA ---")

    analisis_kata(
        teks,
        batas=15
    )

    print("\n--- POLA KATA ---")

    analisis_pola(
        teks,
        batas=20
    )

    print("\n--- BIGRAM ---")

    analisis_ngram(
        teks,
        ukuran=2,
        batas=15
    )

    print("\n--- TRIGRAM ---")

    analisis_ngram(
        teks,
        ukuran=3,
        batas=15
    )


# ============================================================
# PROGRAM UTAMA
# ============================================================

def main():

    print("=" * 60)

    print(
        "ANALISIS KRIPTOGRAFI CIPHER2"
    )

    print("=" * 60)

    # --------------------------------------------------------
    # BACA FILE
    # --------------------------------------------------------

    try:

        teks = baca_file(
            FILE_CIPHER
        )

    except Exception as error:

        print(
            f"\nERROR:\n{error}"
        )

        return

    if not teks.strip():

        print(
            "\nERROR: Cipher2.txt kosong."
        )

        return

    # --------------------------------------------------------
    # PEMISAHAN PARAGRAF
    # --------------------------------------------------------

    paragraf = pisahkan_paragraf(
        teks
    )

    print(
        f"\nFile berhasil dibaca: "
        f"{FILE_CIPHER.name}"
    )

    print(
        f"Jumlah paragraf terdeteksi: "
        f"{len(paragraf)}"
    )

    # --------------------------------------------------------
    # ANALISIS KESELURUHAN
    # --------------------------------------------------------

    print("\n")
    print("=" * 60)

    print(
        "ANALISIS KESELURUHAN"
    )

    print("=" * 60)

    print("\n--- FREKUENSI HURUF ---")

    analisis_frekuensi(
        teks
    )

    print("\n--- FREKUENSI KATA ---")

    analisis_kata(
        teks
    )

    print("\n--- POLA KATA ---")

    analisis_pola(
        teks
    )

    print("\n--- BIGRAM ---")

    analisis_ngram(
        teks,
        ukuran=2
    )

    print("\n--- TRIGRAM ---")

    analisis_ngram(
        teks,
        ukuran=3
    )

    # --------------------------------------------------------
    # ANALISIS PER PARAGRAF
    # --------------------------------------------------------

    for nomor, isi in enumerate(
        paragraf,
        start=1
    ):

        analisis_paragraf(
            nomor,
            isi
        )

    # --------------------------------------------------------
    # SELESAI
    # --------------------------------------------------------

    print("\n")
    print("=" * 60)

    print(
        "ANALISIS AWAL SELESAI"
    )

    print("=" * 60)

    print(
        "\nData di atas akan digunakan "
        "untuk melakukan kriptanalisis "
        "substitusi pada setiap paragraf."
    )


# ============================================================
# EKSEKUSI PROGRAM
# ============================================================

if __name__ == "__main__":

    main()