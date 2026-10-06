const cipherSelect = document.getElementById("cipherSelect");

const inputText = document.getElementById("inputText");
const resultText = document.getElementById("resultText");

const messageFile = document.getElementById("messageFile");
const otpFile = document.getElementById("otpFile");

const fileName = document.getElementById("fileName");
const statusBox = document.getElementById("status");

const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");
const clearBtn = document.getElementById("clearBtn");

const copyBtn = document.getElementById("copyBtn");
const saveBtn = document.getElementById("saveBtn");


// =====================================================
// UTILITAS
// =====================================================

function mod(n, m) {
    return ((n % m) + m) % m;
}

function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);

    while (b !== 0) {
        const temp = a % b;
        a = b;
        b = temp;
    }

    return a;
}

function modInverse(a, m) {
    a = mod(a, m);

    for (let x = 1; x < m; x++) {
        if (mod(a * x, m) === 1) {
            return x;
        }
    }

    return null;
}

function isLetter(char) {
    return /^[a-zA-Z]$/.test(char);
}

function letterToNumber(char) {
    return char.toLowerCase().charCodeAt(0) - 97;
}

function numberToLetter(number, uppercase = false) {
    const letter = String.fromCharCode(mod(number, 26) + 97);
    return uppercase ? letter.toUpperCase() : letter;
}

function cleanLetters(text) {
    return text.toLowerCase().replace(/[^a-z]/g, "");
}

function setStatus(message, type = "") {
    statusBox.textContent = message;
    statusBox.className = "status " + type;
}


// =====================================================
// TAMPILKAN PANEL KEY SESUAI CIPHER
// =====================================================

const panels = [
    "shiftPanel",
    "substitutionPanel",
    "affinePanel",
    "vigenerePanel",
    "hillPanel",
    "permutationPanel",
    "otpPanel"
];

function updateKeyPanel() {

    panels.forEach(panel => {
        document.getElementById(panel).classList.remove("active");
    });

    const selected = cipherSelect.value;

    document
        .getElementById(selected + "Panel")
        .classList.add("active");
}

cipherSelect.addEventListener("change", updateKeyPanel);


// =====================================================
// SHIFT CIPHER
// =====================================================

function shiftCipher(text, key, decrypt = false) {

    key = Number(key);

    if (decrypt) {
        key = -key;
    }

    return [...text].map(char => {

        if (!isLetter(char)) {
            return char;
        }

        const base = char === char.toUpperCase()
            ? 65
            : 97;

        return String.fromCharCode(
            mod(char.charCodeAt(0) - base + key, 26) + base
        );

    }).join("");
}


// =====================================================
// SUBSTITUTION CIPHER
// =====================================================

function validateSubstitutionKey(key) {

    key = key.toLowerCase();

    if (!/^[a-z]{26}$/.test(key)) {
        throw new Error(
            "Kunci Substitution harus tepat 26 huruf."
        );
    }

    const unique = new Set(key);

    if (unique.size !== 26) {
        throw new Error(
            "Kunci Substitution tidak boleh memiliki huruf yang sama."
        );
    }

    return key;
}

function substitutionCipher(text, key, decrypt = false) {

    key = validateSubstitutionKey(key);

    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    let reverseKey = "";

    for (let i = 0; i < 26; i++) {
        reverseKey += alphabet[key.indexOf(alphabet[i])];
    }

    const mapping = decrypt ? reverseKey : key;

    return [...text].map(char => {

        if (!isLetter(char)) {
            return char;
        }

        const upper = char === char.toUpperCase();

        const index = alphabet.indexOf(char.toLowerCase());

        const result = mapping[index];

        return upper
            ? result.toUpperCase()
            : result;

    }).join("");
}


// =====================================================
// AFFINE CIPHER
// =====================================================

function affineCipher(text, a, b, decrypt = false) {

    a = Number(a);
    b = Number(b);

    if (gcd(a, 26) !== 1) {
        throw new Error(
            "Nilai a harus relatif prima dengan 26."
        );
    }

    const inverseA = modInverse(a, 26);

    return [...text].map(char => {

        if (!isLetter(char)) {
            return char;
        }

        const upper = char === char.toUpperCase();
        const x = letterToNumber(char);

        let y;

        if (!decrypt) {
            y = mod(a * x + b, 26);
        } else {
            y = mod(inverseA * (x - b), 26);
        }

        return numberToLetter(y, upper);

    }).join("");
}


// =====================================================
// VIGENERE
// =====================================================

function vigenereCipher(text, key, decrypt = false) {

    key = cleanLetters(key);

    if (key.length === 0) {
        throw new Error(
            "Kunci Vigenere tidak boleh kosong."
        );
    }

    let result = "";
    let keyIndex = 0;

    for (const char of text) {

        if (!isLetter(char)) {
            continue;
        }

        const x = letterToNumber(char);
        const k = letterToNumber(
            key[keyIndex % key.length]
        );

        const y = decrypt
            ? x - k
            : x + k;

        result += numberToLetter(y);

        keyIndex++;
    }

    return result;
}


// =====================================================
// HILL CIPHER
// =====================================================

function getHillMatrix() {

    return [
        [
            Number(document.getElementById("hill00").value),
            Number(document.getElementById("hill01").value)
        ],
        [
            Number(document.getElementById("hill10").value),
            Number(document.getElementById("hill11").value)
        ]
    ];
}

function inverseHillMatrix(matrix) {

    const a = matrix[0][0];
    const b = matrix[0][1];
    const c = matrix[1][0];
    const d = matrix[1][1];

    const determinant = mod(
        a * d - b * c,
        26
    );

    const inverseDet = modInverse(
        determinant,
        26
    );

    if (inverseDet === null) {
        throw new Error(
            "Matriks Hill tidak mempunyai invers modulo 26."
        );
    }

    return [
        [
            mod(d * inverseDet, 26),
            mod(-b * inverseDet, 26)
        ],
        [
            mod(-c * inverseDet, 26),
            mod(a * inverseDet, 26)
        ]
    ];
}

function hillCipher(text, decrypt = false) {

    let clean = cleanLetters(text);

    if (clean.length === 0) {
        return "";
    }

    if (clean.length % 2 !== 0) {
        clean += "x";
    }

    let matrix = getHillMatrix();

    if (decrypt) {
        matrix = inverseHillMatrix(matrix);
    }

    let result = "";

    for (let i = 0; i < clean.length; i += 2) {

        const x1 = letterToNumber(clean[i]);
        const x2 = letterToNumber(clean[i + 1]);

        const y1 = mod(
            matrix[0][0] * x1 +
            matrix[0][1] * x2,
            26
        );

        const y2 = mod(
            matrix[1][0] * x1 +
            matrix[1][1] * x2,
            26
        );

        result += numberToLetter(y1);
        result += numberToLetter(y2);
    }

    return result;
}


// =====================================================
// PERMUTATION CIPHER
// =====================================================

function getPermutationKey() {

    const raw = document
        .getElementById("permutationKey")
        .value
        .trim();

    const key = raw
        .split(",")
        .map(x => Number(x.trim()));

    if (key.length === 0 || key.some(x => !Number.isInteger(x))) {
        throw new Error(
            "Format kunci Permutation tidak valid."
        );
    }

    const sorted = [...key].sort((a, b) => a - b);

    for (let i = 0; i < sorted.length; i++) {

        if (sorted[i] !== i + 1) {
            throw new Error(
                "Kunci Permutation harus berupa urutan angka 1 sampai n."
            );
        }
    }

    return key;
}

function permutationCipher(text, decrypt = false) {

    const key = getPermutationKey();

    let clean = cleanLetters(text);

    if (clean.length === 0) {
        return "";
    }

    const blockSize = key.length;

    while (clean.length % blockSize !== 0) {
        clean += "x";
    }

    let result = "";

    for (
        let blockStart = 0;
        blockStart < clean.length;
        blockStart += blockSize
    ) {

        const block = clean.slice(
            blockStart,
            blockStart + blockSize
        );

        let output = new Array(blockSize);

        if (!decrypt) {

            for (let i = 0; i < blockSize; i++) {
                output[i] = block[key[i] - 1];
            }

        } else {

            for (let i = 0; i < blockSize; i++) {
                output[key[i] - 1] = block[i];
            }
        }

        result += output.join("");
    }

    return result;
}


// =====================================================
// ONE-TIME PAD
// =====================================================

async function readOTPKey() {

    const file = otpFile.files[0];

    if (!file) {
        throw new Error(
            "Pilih file kunci OTP terlebih dahulu."
        );
    }

    const content = await file.text();

    const key = cleanLetters(content);

    if (key.length === 0) {
        throw new Error(
            "File kunci OTP tidak berisi huruf."
        );
    }

    return key;
}

async function otpCipher(text, decrypt = false) {

    const key = await readOTPKey();

    const message = cleanLetters(text);

    if (key.length < message.length) {
        throw new Error(
            "Panjang kunci OTP lebih pendek daripada pesan."
        );
    }

    let result = "";

    for (let i = 0; i < message.length; i++) {

        const x = letterToNumber(message[i]);
        const k = letterToNumber(key[i]);

        const y = decrypt
            ? x - k
            : x + k;

        result += numberToLetter(y);
    }

    return result;
}


// =====================================================
// PROSES UTAMA
// =====================================================

async function processCipher(decrypt = false) {

    const cipher = cipherSelect.value;
    const text = inputText.value;

    if (!text.trim()) {
        setStatus(
            "Masukkan plaintext/ciphertext terlebih dahulu.",
            "error"
        );
        return;
    }

    try {

        let result = "";

        switch (cipher) {

            case "shift":

                result = shiftCipher(
                    text,
                    document.getElementById("shiftKey").value,
                    decrypt
                );

                break;


            case "substitution":

                result = substitutionCipher(
                    text,
                    document.getElementById(
                        "substitutionKey"
                    ).value,
                    decrypt
                );

                break;


            case "affine":

                result = affineCipher(
                    text,
                    document.getElementById("affineA").value,
                    document.getElementById("affineB").value,
                    decrypt
                );

                break;


            case "vigenere":

                result = vigenereCipher(
                    text,
                    document.getElementById(
                        "vigenereKey"
                    ).value,
                    decrypt
                );

                break;


            case "hill":

                result = hillCipher(
                    text,
                    decrypt
                );

                break;


            case "permutation":

                result = permutationCipher(
                    text,
                    decrypt
                );

                break;


            case "otp":

                result = await otpCipher(
                    text,
                    decrypt
                );

                break;
        }

        resultText.value = result;

        setStatus(
            decrypt
                ? "Dekripsi berhasil."
                : "Enkripsi berhasil.",
            "success"
        );

    } catch (error) {

        setStatus(
            error.message,
            "error"
        );
    }
}


// =====================================================
// FILE INPUT PESAN
// =====================================================

messageFile.addEventListener("change", async () => {

    const file = messageFile.files[0];

    if (!file) {
        return;
    }

    fileName.textContent = file.name;

    try {

        const content = await file.text();

        inputText.value = content;

        setStatus(
            `File "${file.name}" berhasil dibaca.`,
            "success"
        );

    } catch (error) {

        setStatus(
            "File tidak dapat dibaca sebagai teks.",
            "error"
        );
    }
});


// =====================================================
// BUTTON
// =====================================================

encryptBtn.addEventListener(
    "click",
    () => processCipher(false)
);

decryptBtn.addEventListener(
    "click",
    () => processCipher(true)
);

clearBtn.addEventListener("click", () => {

    inputText.value = "";
    resultText.value = "";

    messageFile.value = "";

    fileName.textContent =
        "Belum ada file dipilih";

    setStatus("");
});


// =====================================================
// COPY
// =====================================================

copyBtn.addEventListener("click", async () => {

    if (!resultText.value) {
        setStatus(
            "Belum ada hasil untuk disalin.",
            "error"
        );
        return;
    }

    try {

        await navigator.clipboard.writeText(
            resultText.value
        );

        setStatus(
            "Hasil berhasil disalin.",
            "success"
        );

    } catch {

        setStatus(
            "Gagal menyalin hasil.",
            "error"
        );
    }
});


// =====================================================
// SAVE
// =====================================================

saveBtn.addEventListener("click", () => {

    if (!resultText.value) {
        setStatus(
            "Belum ada hasil untuk disimpan.",
            "error"
        );
        return;
    }

    const blob = new Blob(
        [resultText.value],
        { type: "text/plain" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "hasil_kriptografi.txt";

    document.body.appendChild(a);

    a.click();

    a.remove();

    URL.revokeObjectURL(url);

    setStatus(
        "Hasil berhasil disimpan.",
        "success"
    );
});