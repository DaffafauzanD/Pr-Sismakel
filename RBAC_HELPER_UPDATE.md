# RBAC Helper Update - Header & Cookie Support

## 📋 Ringkasan Perubahan

Fungsi `hasPermission` di `src/lib/rbac.js` telah dimodifikasi untuk mendukung pengambilan data RBAC payload dari:
1. **Header** (dari middleware) - prioritas utama
2. **Cookie httpOnly** - fallback jika header tidak tersedia

## 🔧 Fungsi yang Tersedia

### 1. `hasPermission(req, requiredPermission)`
Mengecek apakah user memiliki permission tertentu.

```javascript
// Contoh penggunaan
if (!hasPermission(req, 'user.create')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
}
```

### 2. `getRbacPayload(req)`
Mendapatkan data RBAC payload lengkap dari request.

```javascript
// Contoh penggunaan
const rbacData = getRbacPayload(req);
if (rbacData) {
    console.log('User:', rbacData.username, 'Role:', rbacData.roleName);
    console.log('Permissions:', rbacData.permissions);
}
```

### 3. `getPermissions(req)`
Mendapatkan array permissions saja.

```javascript
// Contoh penggunaan
const permissions = getPermissions(req);
console.log('User permissions:', permissions);
```

### 4. `hasRole(req, requiredRole)`
Mengecek apakah user memiliki role tertentu.

```javascript
// Contoh penggunaan
if (!hasRole(req, 'admin')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
}
```

## 🔄 Alur Kerja

### Prioritas 1: Header (dari Middleware)
Fungsi akan mencoba mengambil data dari header yang diset oleh middleware:
- `x-user-id`
- `x-user-username`
- `x-user-role`
- `x-user-permissions`

### Prioritas 2: Cookie httpOnly
Jika header tidak tersedia, fungsi akan mengambil dari cookie `rbacPayload`:
```javascript
// Cookie format yang diharapkan
rbacPayload={"id":"1","username":"admin","id_role":"1","roleName":"admin","permissions":["user.read","user.create"]}
```

## 📝 Contoh Implementasi di API Route

```javascript
import { hasPermission, hasRole, getRbacPayload } from "@/lib/rbac";

export async function GET(req) {
    // Cek permission
    if (!hasPermission(req, 'user.read')) {
        return NextResponse.json(
            { message: 'Forbidden: Insufficient permissions' },
            { status: 403 }
        );
    }

    // Cek role
    if (!hasRole(req, 'admin')) {
        return NextResponse.json(
            { message: 'Forbidden: Admin role required' },
            { status: 403 }
        );
    }

    // Ambil data RBAC lengkap
    const rbacData = getRbacPayload(req);
    if (rbacData) {
        console.log('Processing request for user:', rbacData.username);
    }

    // Lanjutkan dengan logika endpoint
    // ...
}
```

## 🛡️ Keamanan

- **Error Handling**: Semua parsing JSON dilengkapi dengan try-catch untuk menghindari crash
- **Fallback**: Jika header tidak tersedia, otomatis fallback ke cookie
- **Logging**: Warning log untuk debugging jika parsing gagal
- **Validation**: Validasi data sebelum digunakan

## 🔍 Debugging

Jika ada masalah, cek console untuk warning messages:
```
Failed to parse permissions from header: [error]
Failed to parse RBAC payload from cookie: [error]
```

## 📋 Daftar Permission yang Umum

Berdasarkan struktur aplikasi, permission yang umum digunakan:
- `user.read` - Membaca data user
- `user.create` - Membuat user baru
- `user.update` - Mengupdate user
- `user.delete` - Menghapus user
- `role.read` - Membaca data role
- `role.create` - Membuat role baru
- `role.update` - Mengupdate role
- `role.delete` - Menghapus role
- `permission.read` - Membaca data permission
- `permission.create` - Membuat permission baru
- `permission.update` - Mengupdate permission
- `permission.delete` - Menghapus permission

## 🚀 Migrasi dari Versi Lama

Jika sebelumnya menggunakan:
```javascript
// Versi lama
const permissions = JSON.parse(req.headers.get('x-user-permissions') || '[]');
return permissions.includes(requiredPermission);
```

Sekarang bisa langsung menggunakan:
```javascript
// Versi baru
import { hasPermission } from "@/lib/rbac";
return hasPermission(req, requiredPermission);
``` 