# dekripsi.py

def decrypt_text(text, mapping):
    hasil = ""
    for char in text:
        if char.lower() in mapping:
            plain_char = mapping[char.lower()]
            hasil += plain_char.upper() if char.isupper() else plain_char
        else:
            hasil += char
    return hasil

with open("Cipher2.txt", "r", encoding="utf-8") as f:
    isi_file = f.read()
    paragraf_list = isi_file.split("\n\n")

# Kamus Kunci Paragraf 1
kunci_p1 = {
    'm': 's', 'j': 'u', 'z': 'i', 'u': 't', 'j': 'u', 'z': 'i', 'k': 'o', 'd': 'n',
    'w': 'c', 'n': 'p', 's': 'h', 'g': 'e', 'a': 'r', 'x': 'a', 'q': 'l', 'e': 'y',
    'r': 'v', 'b': 'm', 'c': 'f', 't': 'g', 'i': 'd', 'y': 'b', 'p': 'k', 'v': 'w'
}

# Kamus Kunci Paragraf 2
kunci_p2 = {
    'w': 'c', 'a': 'r', 'e': 'e', 'n': 'p', 'u': 't', 'k': 'o', 't': 'g', 'x': 'a',
    's': 'h', 'z': 'i', 'd': 'n', 'm': 's', 'g': 'e', 'y': 'b', 'q': 'l', 'i': 'd',
    'j': 'u', 'f': 'v', 'b': 'm', 'r': 'v', 'p': 'k', 'c': 'f', 'v': 'w', 'l': 'g',
    'o': 'f', 'y': 'b', 'h': 'w'
}

# Kamus Kunci Paragraf 3
kunci_p3 = {
    'w': 'c', 'k': 'o', 'i': 'd', 'x': 'a', 'g': 'e', 'y': 'b', 'q': 'l', 'j': 'u',
    'p': 'k', 'n': 'p', 't': 'g', 'a': 'r', 'z': 'i', 'd': 'n', 'u': 't', 's': 'h',
    'm': 's', 'b': 'm', 'r': 'v', 'e': 'y', 'f': 'f', 'c': 'f', 'o': 'o', 'v': 'w',
    'l': 'g', 'h': 'w', 'd': 'n'
}

# Kamus Kunci Paragraf 4
kunci_p4 = {
    'w': 'c', 'a': 'r', 'e': 'e', 'n': 'p', 'u': 't', 'x': 'a', 'd': 'n', 'z': 'i',
    'q': 'l', 'l': 'g', 't': 'g', 'g': 'e', 'k': 'o', 'm': 's', 's': 'h', 'j': 'u',
    'b': 'm', 'r': 'v', 'p': 'k', 'i': 'd', 'y': 'b', 'f': 'v', 'c': 'f', 'o': 'o'
}

daftar_kunci = [kunci_p1, kunci_p2, kunci_p3, kunci_p4]

for i, paragraf in enumerate(paragraf_list):
    print(f"\n==================== PARAGRAF {i+1} ====================")
    hasil = decrypt_text(paragraf, daftar_kunci[i])
    print(hasil)