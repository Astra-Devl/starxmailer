<div align="center">

# 📬 starxmailer

**Kirim email lewat API HTTP dengan antarmuka ala Nodemailer.**
Tanpa SMTP, tanpa port yang diblokir.

![Node](https://img.shields.io/badge/node-%3E%3D18-3c873a?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![ESM](https://img.shields.io/badge/ESM-✔-f7df1e?style=for-the-badge)
![CJS](https://img.shields.io/badge/CommonJS-✔-cb3837?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

</div>

---

## ℹ️ Informasi

`starxmailer` mengirim email lewat API HTTP (port 443), bukan SMTP. Cocok untuk VPS yang memblokir port 25, 465, dan 587 seperti DigitalOcean.

- 🔌 Provider: <img src="https://cdn.simpleicons.org/resend/000000" width="16" height="16" align="center"> **Resend**, <img src="https://cdn.simpleicons.org/brevo/0B996E" width="16" height="16" align="center"> **Brevo**, dan <img src="https://cdn.simpleicons.org/gmail/EA4335" width="16" height="16" align="center"> **Gmail API**
- 🧩 Antarmuka mirip Nodemailer: `createTransport()` dan `sendMail()`
- 👥 Banyak penerima: `to`, `cc`, `bcc` bisa array atau string dipisah koma
- 📦 Mendukung ESM dan CommonJS, lengkap dengan tipe TypeScript
- 🪶 Tanpa dependency, hanya butuh Node.js 18+

---

## 📥 Install

```bash
npm install starxmailer
```

---

## 🚀 Contoh Kode

Simpan kodenya sebagai `email.js`. Format modul ditentukan oleh `package.json` proyek Anda:

| `package.json` | Format | Pakai contoh |
|---|---|---|
| `"type": "module"` | ESM | `import` |
| `"type": "commonjs"` (atau tidak ada `type`) | CommonJS | `require` |

### <img src="https://cdn.simpleicons.org/resend/000000" width="22" height="22" align="center" alt="Resend"> Resend

**ESM** (`import`)

```js
import { createTransport } from "starxmailer";

const mailer = createTransport({
    provider: "resend",
    apiKey: process.env.RESEND_API_KEY
});

const info = await mailer.sendMail({
    from: '"Nama Saya" <noreply@domainanda.com>',
    to: ["a@gmail.com", "b@yahoo.com"],
    subject: "Halo 👋",
    text: "Isi email versi teks",
    html: "<h2>Isi email versi HTML</h2>"
});

console.log(info.messageId, info.accepted);
```

**CommonJS** (`require`)

```js
const { createTransport } = require("starxmailer");

const mailer = createTransport({
    provider: "resend",
    apiKey: process.env.RESEND_API_KEY
});

async function main() {
    const info = await mailer.sendMail({
        from: '"Nama Saya" <noreply@domainanda.com>',
        to: ["a@gmail.com", "b@yahoo.com"],
        subject: "Halo 👋",
        text: "Isi email versi teks",
        html: "<h2>Isi email versi HTML</h2>"
    });

    console.log(info.messageId, info.accepted);
}

main().catch(console.error);
```


### <img src="https://cdn.simpleicons.org/brevo/0B996E" width="22" height="22" align="center" alt="Brevo"> Brevo

**ESM** (`import`)

```js
import { createTransport } from "starxmailer";

const mailer = createTransport({
    provider: "brevo",
    apiKey: process.env.BREVO_API_KEY
});

const info = await mailer.sendMail({
    from: '"Nama Saya" <emailterverifikasi@domainanda.com>',
    to: ["a@gmail.com", "b@yahoo.com"],
    subject: "Halo 👋",
    text: "Isi email versi teks",
    html: "<h2>Isi email versi HTML</h2>"
});

console.log(info.messageId, info.accepted);
```

**CommonJS** (`require`)

```js
const { createTransport } = require("starxmailer");

const mailer = createTransport({
    provider: "brevo",
    apiKey: process.env.BREVO_API_KEY
});

async function main() {
    const info = await mailer.sendMail({
        from: '"Nama Saya" <emailterverifikasi@domainanda.com>',
        to: ["a@gmail.com", "b@yahoo.com"],
        subject: "Halo 👋",
        text: "Isi email versi teks",
        html: "<h2>Isi email versi HTML</h2>"
    });

    console.log(info.messageId, info.accepted);
}

main().catch(console.error);
```


### <img src="https://cdn.simpleicons.org/gmail/EA4335" width="22" height="22" align="center" alt="Gmail"> Gmail

**ESM** (`import`)

```js
import { createTransport } from "starxmailer";

const mailer = createTransport({
    provider: "gmail",
    apiKey: process.env.GMAIL_API_KEY
});

const info = await mailer.sendMail({
    from: '"Nama Saya" <emailanda@gmail.com>',
    to: ["a@gmail.com", "b@yahoo.com"],
    subject: "Halo 👋",
    text: "Isi email versi teks",
    html: "<h2>Isi email versi HTML</h2>"
});

console.log(info.messageId, info.accepted);
```

**CommonJS** (`require`)

```js
const { createTransport } = require("starxmailer");

const mailer = createTransport({
    provider: "gmail",
    apiKey: process.env.GMAIL_API_KEY
});

async function main() {
    const info = await mailer.sendMail({
        from: '"Nama Saya" <emailanda@gmail.com>',
        to: ["a@gmail.com", "b@yahoo.com"],
        subject: "Halo 👋",
        text: "Isi email versi teks",
        html: "<h2>Isi email versi HTML</h2>"
    });

    console.log(info.messageId, info.accepted);
}

main().catch(console.error);
```

> Untuk Gmail, `apiKey` berformat `gm_xxx` dan alamat `from` harus akun Gmail pemilik token. Cara membuatnya ada di bagian berikutnya.


---

## 🔐 Membuat Credential Gmail

Dilakukan **sekali saja**. Hasil akhirnya satu `apiKey` berformat `gm_xxx`.

### 1️⃣ Buat project dan aktifkan Gmail API

1. Buka [console.cloud.google.com](https://console.cloud.google.com) dan login dengan Gmail pengirim.
2. Klik pemilih project di kiri atas → **New Project**, beri nama (misalnya `starxmailer`).
3. Buka **APIs & Services → Library**, cari **Gmail API**, lalu klik **Enable**.

### 2️⃣ Atur OAuth consent screen

1. Buka **APIs & Services → OAuth consent screen** (di tampilan baru: **Google Auth Platform**).
2. Isi nama app dan email dukungan.
3. Pada **Audience**, pilih **External**.
4. Pada **Test users**, klik **Add users** dan masukkan Gmail pengirim.

> ⚠️ Jika akun pengirim tidak ada di Test users, login akan ditolak dengan pesan *"Akses diblokir: belum menyelesaikan proses verifikasi Google"*.

### 3️⃣ Buat Client ID dan Client Secret

1. Buka **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
2. **Application type:** `Web application`.
3. Pada **Authorized redirect URIs**, isi persis:

   ```
   https://developers.google.com/oauthplayground
   ```
4. Klik **Create**, lalu salin **Client ID** dan **Client Secret**.

### 4️⃣ Ambil Refresh Token

1. Buka [OAuth Playground](https://developers.google.com/oauthplayground).
2. Klik ikon ⚙️ di kanan atas, centang **Use your own OAuth credentials**, lalu isi Client ID dan Secret tadi.
3. Pada kolom scope di bawah, isi:

   ```
   https://www.googleapis.com/auth/gmail.send
   ```
4. Klik **Authorize APIs** dan login dengan Gmail pengirim.
5. Jika muncul *"Google hasn't verified this app"*, pilih **Advanced → Go to ... (unsafe)**, lalu izinkan.
6. Klik **Exchange authorization code for tokens**.
7. Salin nilai **Refresh token** (diawali `1//`).

### 5️⃣ Publish ke production

Selama status masih **Testing**, refresh token mati dalam **7 hari**.

1. Buka **Google Auth Platform → Audience** (atau OAuth consent screen).
2. Klik **Publish app**, lalu **Confirm**. Status berubah jadi **In production**.
3. Ulangi langkah 4 untuk mengambil refresh token baru.

### 6️⃣ Gabungkan jadi satu `apiKey`

**ESM** (`make-key.js`, `"type": "module"`)

```js
import { createGmailKey } from "starxmailer";

console.log(
    createGmailKey({
        clientId: "xxxx.apps.googleusercontent.com",
        clientSecret: "GOCSPX-xxxx",
        refreshToken: "1//xxxx"
    })
);
```

**CommonJS** (`make-key.js`, `"type": "commonjs"`)

```js
const { createGmailKey } = require("starxmailer");

console.log(
    createGmailKey({
        clientId: "xxxx.apps.googleusercontent.com",
        clientSecret: "GOCSPX-xxxx",
        refreshToken: "1//xxxx"
    })
);
```

Jalankan:

```bash
node make-key.js
# gm_eyJjbGllbnRJZCI6...
```

Simpan hasilnya di `.env`:

```env
GMAIL_API_KEY=gm_eyJjbGllbnRJZCI6...
```

> 🔒 `gm_...` tetap **rahasia** seperti Client Secret dan Refresh Token. Jangan di-commit ke Git atau dibagikan.

---

<div align="center">

MIT License · **starxmailer** 📬

</div>
