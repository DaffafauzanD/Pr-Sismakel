# Panduan Implementasi NextAuth dengan Swagger UI

## Overview

Implementasi ini memungkinkan Anda menggunakan NextAuth dengan Swagger UI untuk menghasilkan JWT bearer token yang bisa digunakan untuk autentikasi API.

## Fitur yang Tersedia

### 1. Endpoint Autentikasi

#### POST `/api/auth/login`
- **Fungsi**: Login dengan username dan password untuk mendapatkan JWT token
- **Request Body**: JSON dengan `username` dan `password`
- **Response**: JWT token dalam field `data.accessToken`

#### GET `/api/auth/me`
- **Fungsi**: Mendapatkan informasi user yang sedang login
- **Header**: `Authorization: Bearer <token>`
- **Response**: Informasi user (id, username, role, permissions)

#### POST `/api/auth/logout`
- **Fungsi**: Logout user (invalidate token)
- **Header**: `Authorization: Bearer <token>`
- **Response**: Konfirmasi logout berhasil

### 2. Swagger UI Integration

#### Fitur Otomatis
- **Login Button**: Tombol "🔑 Login & Get Token" di Swagger UI
- **Token Persistence**: Token disimpan di localStorage
- **Auto Authorization**: Token otomatis diset ke semua request
- **Request Interceptor**: Menambahkan header Authorization otomatis

## Cara Penggunaan

### 1. Akses Swagger UI
```
http://localhost:3000/swagger
```

### 2. Login dan Dapatkan Token

#### Metode 1: Menggunakan Tombol Login
1. Klik tombol "🔑 Login & Get Token" di Swagger UI
2. Masukkan username dan password
3. Token akan otomatis diset dan bisa digunakan

#### Metode 2: Menggunakan Endpoint Login
1. Buka endpoint `/api/auth/login`
2. Klik "Try it out"
3. Masukkan credentials:
```json
{
  "username": "admin",
  "password": "password"
}
```
4. Klik "Execute"
5. Copy token dari response `data.accessToken`

### 3. Menggunakan Token

#### Metode 1: Otomatis (jika menggunakan tombol login)
- Token sudah otomatis diset untuk semua request

#### Metode 2: Manual
1. Klik tombol "Authorize" di Swagger UI
2. Masukkan token (tanpa "Bearer ")
3. Klik "Authorize"

### 4. Test Endpoint yang Memerlukan Auth
1. Pilih endpoint yang memerlukan autentikasi
2. Klik "Try it out"
3. Klik "Execute"
4. Response akan menampilkan data yang sesuai dengan role/permission user

## Struktur Response

### Login Response
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "username": "admin",
      "id_role": "1",
      "roleName": "admin",
      "permissions": ["read", "write", "delete"]
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

## Konfigurasi

### Environment Variables
```env
AUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Middleware
Middleware sudah dikonfigurasi untuk:
- Mengizinkan akses ke `/api/auth/*` dan `/api/docs` tanpa token
- Memvalidasi JWT token untuk endpoint lainnya
- Menambahkan user info ke header request

## Keamanan

### JWT Token
- **Expiration**: 24 jam
- **Algorithm**: HS256
- **Payload**: User ID, username, role, permissions

### Middleware Protection
- Semua endpoint API (kecuali auth dan docs) dilindungi
- Token validation menggunakan `jose` library
- User info ditambahkan ke header untuk authorization

## Troubleshooting

### Token Expired
- Login ulang untuk mendapatkan token baru
- Token berlaku 24 jam

### Unauthorized Error
- Pastikan token valid dan belum expired
- Pastikan endpoint memerlukan autentikasi
- Cek role dan permission user

### CORS Issues
- Pastikan `NEXT_PUBLIC_BASE_URL` dikonfigurasi dengan benar
- Swagger UI harus diakses dari domain yang sama

## Contoh Penggunaan di Code

### Frontend (React)
```javascript
// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'password' })
});

const { data: { accessToken } } = await loginResponse.json();

// Use token for API calls
const apiResponse = await fetch('/api/user-management/users', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

### Backend (API Route)
```javascript
// Verify token in API route
import { jwtVerify } from "jose";

export async function GET(req) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.AUTH_SECRET)
    );
    
    // Use payload.userId, payload.role, etc.
    return NextResponse.json({ data: 'protected data' });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
```

## Dependencies

Pastikan package berikut sudah terinstall:
```json
{
  "next-auth": "^4.24.11",
  "jsonwebtoken": "^9.0.2",
  "jose": "^6.0.11",
  "bcryptjs": "^3.0.2",
  "next-swagger-doc": "^0.4.1",
  "swagger-ui-dist": "^5.24.2"
}
``` 