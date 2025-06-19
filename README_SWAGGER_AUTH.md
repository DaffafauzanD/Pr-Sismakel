# NextAuth dengan Swagger UI - JWT Bearer Token

## 🚀 Quick Start

### 1. Akses Swagger UI
```
http://localhost:3000/swagger
```

### 2. Login & Dapatkan Token
- **Metode 1**: Klik tombol "🔑 Login & Get Token" di Swagger UI
- **Metode 2**: Gunakan endpoint `/api/auth/login` (set cookie httpOnly, cocok untuk browser)
- **Metode 3**: Gunakan endpoint `/api/auth/token` (hanya return JWT, cocok untuk Postman/curl)

#### Contoh request `/api/auth/token`:
```bash
curl -X POST http://localhost:3000/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

### 3. Menggunakan Token
- Untuk Swagger UI, klik tombol "Authorize" dan paste token.
- Untuk Postman/curl, tambahkan header:
  ```
  Authorization: Bearer <accessToken>
  ```

### 4. Client-side (Browser)
- Setelah login, cookie httpOnly dikirim otomatis pada setiap request.
- **Tidak perlu** set header Authorization manual di fetch/axios.

## 🔧 Endpoint yang Tersedia

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login untuk mendapatkan JWT token |
| GET | `/api/auth/me` | Get info user yang sedang login |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/user-management/profile` | Get profile user lengkap |

## 🛡️ Keamanan

- **JWT Token**: Expires dalam 24 jam
- **Middleware**: Melindungi semua endpoint kecuali `/api/auth/*` dan `/api/docs`
- **Headers**: User info ditambahkan ke request headers:
  - `x-user-id`
  - `x-user-username` 
  - `x-user-role`
  - `x-user-permissions`

## 📝 Contoh Penggunaan

### Frontend
```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'password' })
});

const { data: { accessToken } } = await response.json();

// Use token
const apiResponse = await fetch('/api/user-management/users', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

### Backend (API Route)
```javascript
export async function GET(req) {
  const userId = req.headers.get('x-user-id');
  const userRole = req.headers.get('x-user-role');
  
  // Use user info from middleware
  return NextResponse.json({ userId, userRole });
}
```

## 🧪 Testing

Jalankan test script:
```bash
node test-swagger-auth.js
```

## 📚 Dokumentasi Lengkap

Lihat file `SWAGGER_AUTH_GUIDE.md` untuk dokumentasi lengkap dan troubleshooting. 