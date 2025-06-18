# NextAuth dengan Swagger UI - JWT Bearer Token

## 🚀 Quick Start

### 1. Akses Swagger UI
```
http://localhost:3000/swagger
```

### 2. Login & Dapatkan Token
- **Metode 1**: Klik tombol "🔑 Login & Get Token" di Swagger UI
- **Metode 2**: Gunakan endpoint `/api/auth/login` dengan credentials:
```json
{
  "username": "admin",
  "password": "password"
}
```

### 3. Response Login
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "username": "admin",
      "roleName": "admin",
      "permissions": ["read", "write", "delete"]
    }
  }
}
```

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