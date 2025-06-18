# Troubleshooting Middleware JWT

## 🔍 Masalah yang Mungkin Terjadi

### 1. Middleware Tidak Berjalan
**Gejala**: Request ke endpoint protected tidak mendapat response 401, langsung ke endpoint

**Penyebab**:
- File middleware tidak berada di lokasi yang benar
- Konfigurasi matcher tidak tepat
- Next.js tidak mendeteksi perubahan middleware

**Solusi**:
```bash
# Restart development server
npm run dev

# Pastikan file middleware berada di:
src/app/middleware.js
# atau
src/middleware.js
```

### 2. Header Authorization Tidak Terdeteksi
**Gejala**: Middleware berjalan tapi tidak mendeteksi header Authorization

**Penyebab**:
- Case sensitivity pada header
- Header dikirim dengan format yang salah
- Browser/client tidak mengirim header dengan benar

**Solusi**:
```javascript
// Middleware sudah menangani case sensitivity
const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
```

### 3. JWT Token Invalid
**Gejala**: Middleware mendeteksi token tapi verification gagal

**Penyebab**:
- `AUTH_SECRET` tidak sesuai dengan yang digunakan saat generate token
- Token expired
- Token format salah

**Solusi**:
```bash
# Pastikan AUTH_SECRET sama di .env
AUTH_SECRET=your-secret-key-here

# Cek token di jwt.io untuk memastikan format benar
```

### 4. Headers Tidak Di-inject
**Gejala**: Middleware berjalan tapi endpoint tidak mendapat user info

**Penyebab**:
- Payload JWT tidak memiliki field yang diharapkan
- Error saat inject headers

**Solusi**:
```javascript
// Pastikan payload JWT memiliki field ini:
{
  id: "user_id",
  username: "username",
  roleName: "role_name",
  permissions: ["permission1", "permission2"]
}
```

## 🧪 Cara Testing

### 1. Test dengan Script
```bash
node test-middleware.js
```

### 2. Test dengan Swagger UI
1. Buka `http://localhost:3000/swagger`
2. Login dengan tombol "🔑 Login & Get Token"
3. Test endpoint `/api/test-middleware`

### 3. Test Manual dengan cURL
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Test dengan token
curl -X GET http://localhost:3000/api/test-middleware \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔧 Debug Steps

### 1. Cek Logs Middleware
Middleware sekarang memiliki logging yang detail. Cek console untuk melihat:
- Path yang diakses
- Header Authorization
- JWT verification
- Headers injection

### 2. Cek Environment Variables
```bash
# Pastikan AUTH_SECRET ada
echo $AUTH_SECRET
```

### 3. Cek Token Format
```javascript
// Token harus dalam format:
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Cek Endpoint Response
Endpoint `/api/test-middleware` akan menampilkan:
- Semua headers yang diterima
- User info dari middleware
- Debug information

## 🚨 Common Issues

### Issue 1: "Middleware tidak berjalan"
**Solution**: Restart development server dan pastikan file middleware berada di lokasi yang benar.

### Issue 2: "Token tidak terdeteksi"
**Solution**: Pastikan header dikirim dengan format `Authorization: Bearer <token>`.

### Issue 3: "JWT verification failed"
**Solution**: Pastikan `AUTH_SECRET` sama dengan yang digunakan saat generate token.

### Issue 4: "Headers tidak di-inject"
**Solution**: Cek payload JWT dan pastikan memiliki field yang diperlukan.

## 📞 Support

Jika masih mengalami masalah:
1. Cek logs di console browser/server
2. Test dengan endpoint `/api/test-middleware`
3. Pastikan semua environment variables ter-set dengan benar
4. Restart development server 