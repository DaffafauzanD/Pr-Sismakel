# RBAC Helper Usage Guide

## 🎯 Overview

Fungsi RBAC helper telah diperbarui untuk mendukung pengambilan data dari header (middleware) dan cookie httpOnly. Ini memberikan fleksibilitas dan keamanan yang lebih baik untuk sistem autentikasi.

## 📦 Fungsi yang Tersedia

### 1. `hasPermission(req, requiredPermission)`
Mengecek apakah user memiliki permission tertentu.

```javascript
import { hasPermission } from "@/lib/rbac";

// Contoh penggunaan di API route
export async function GET(req) {
    if (!hasPermission(req, 'user.read')) {
        return NextResponse.json(
            { message: 'Forbidden: Insufficient permissions' },
            { status: 403 }
        );
    }
    
    // Lanjutkan dengan logika endpoint
}
```

### 2. `hasRole(req, requiredRole)`
Mengecek apakah user memiliki role tertentu.

```javascript
import { hasRole } from "@/lib/rbac";

export async function POST(req) {
    if (!hasRole(req, 'admin')) {
        return NextResponse.json(
            { message: 'Forbidden: Admin role required' },
            { status: 403 }
        );
    }
    
    // Lanjutkan dengan logika endpoint
}
```

### 3. `getRbacPayload(req)`
Mendapatkan data RBAC payload lengkap.

```javascript
import { getRbacPayload } from "@/lib/rbac";

export async function GET(req) {
    const rbacData = getRbacPayload(req);
    
    if (rbacData) {
        console.log('User:', rbacData.username);
        console.log('Role:', rbacData.roleName);
        console.log('Permissions:', rbacData.permissions);
        
        // Gunakan untuk audit trail
        const auditData = {
            action: 'user.list',
            user: rbacData.username,
            role: rbacData.roleName,
            timestamp: new Date().toISOString()
        };
    }
}
```

### 4. `getPermissions(req)`
Mendapatkan array permissions saja.

```javascript
import { getPermissions } from "@/lib/rbac";

export async function GET(req) {
    const permissions = getPermissions(req);
    
    // Cek multiple permissions
    const canManageUsers = permissions.includes('user.read') && 
                          permissions.includes('user.create');
    
    if (!canManageUsers) {
        return NextResponse.json(
            { message: 'Forbidden: User management permissions required' },
            { status: 403 }
        );
    }
}
```

## 🔄 Alur Kerja

### Prioritas 1: Header (dari Middleware)
```javascript
// Data diambil dari header yang diset oleh middleware
x-user-id: "1"
x-user-username: "admin"
x-user-role: "admin"
x-user-permissions: '["user.read","user.create","role.read"]'
```

### Prioritas 2: Cookie httpOnly
```javascript
// Fallback ke cookie jika header tidak tersedia
rbacPayload={"id":"1","username":"admin","id_role":"1","roleName":"admin","permissions":["user.read","user.create"]}
```

## 📝 Contoh Implementasi Lengkap

### API Route dengan Multiple Checks

```javascript
import { NextResponse } from "next/server";
import { hasPermission, hasRole, getRbacPayload } from "@/lib/rbac";

export async function POST(req) {
    // 1. Cek permission
    if (!hasPermission(req, 'user.create')) {
        return NextResponse.json(
            { message: 'Forbidden: Cannot create users' },
            { status: 403 }
        );
    }

    // 2. Cek role (opsional, untuk akses khusus)
    if (!hasRole(req, 'admin')) {
        return NextResponse.json(
            { message: 'Forbidden: Admin role required' },
            { status: 403 }
        );
    }

    // 3. Ambil data RBAC untuk audit trail
    const rbacData = getRbacPayload(req);
    if (rbacData) {
        console.log(`[USER_CREATE] ${rbacData.username} (${rbacData.roleName})`);
    }

    // 4. Lanjutkan dengan logika bisnis
    try {
        const body = await req.json();
        
        // Buat user dengan audit trail
        const newUser = await prisma.user.create({
            data: {
                ...body,
                created_by: rbacData?.username || 'unknown'
            }
        });

        return NextResponse.json({
            message: 'User created successfully',
            data: newUser
        }, { status: 201 });

    } catch (error) {
        console.error('[USER_CREATE_ERROR]', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
```

### Middleware Integration

```javascript
// src/middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
    // ... existing JWT verification logic ...

    // Set headers untuk RBAC helper
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', payload.id);
    requestHeaders.set('x-user-username', payload.username);
    requestHeaders.set('x-user-role', payload.roleName);
    requestHeaders.set('x-user-permissions', JSON.stringify(payload.permissions));

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}
```

## 🛡️ Best Practices

### 1. Error Handling
```javascript
// Selalu gunakan try-catch untuk parsing
try {
    const rbacData = getRbacPayload(req);
    // Gunakan data
} catch (error) {
    console.error('RBAC parsing error:', error);
    return NextResponse.json(
        { message: 'Authentication error' },
        { status: 401 }
    );
}
```

### 2. Logging dan Audit Trail
```javascript
const rbacData = getRbacPayload(req);
if (rbacData) {
    // Log untuk debugging
    console.log(`[${action}] ${rbacData.username} (${rbacData.roleName})`);
    
    // Audit trail
    await auditLog.create({
        action: 'user.create',
        user_id: rbacData.id,
        user_username: rbacData.username,
        user_role: rbacData.roleName,
        timestamp: new Date()
    });
}
```

### 3. Permission Granularity
```javascript
// Gunakan permission yang spesifik
if (!hasPermission(req, 'user.create')) {
    // Lebih baik daripada 'admin' atau 'user.*'
}

// Untuk operasi kompleks, cek multiple permissions
const canManageUsers = hasPermission(req, 'user.read') && 
                      hasPermission(req, 'user.create') && 
                      hasPermission(req, 'user.update');
```

## 🔍 Debugging

### Console Logs
```javascript
// Fungsi akan menampilkan warning jika parsing gagal
Failed to parse permissions from header: [error]
Failed to parse RBAC payload from cookie: [error]
```

### Manual Testing
```javascript
// Test dengan curl
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Cookie: rbacPayload=YOUR_RBAC_DATA"
```

## 📋 Permission Naming Convention

Gunakan format: `resource.action`

```javascript
// User permissions
'user.read'     // Membaca data user
'user.create'   // Membuat user baru
'user.update'   // Mengupdate user
'user.delete'   // Menghapus user

// Role permissions
'role.read'     // Membaca data role
'role.create'   // Membuat role baru
'role.update'   // Mengupdate role
'role.delete'   // Menghapus role

// Permission permissions
'permission.read'   // Membaca data permission
'permission.create' // Membuat permission baru
'permission.update' // Mengupdate permission
'permission.delete' // Menghapus permission
```

## 🚀 Migration Guide

### Dari Versi Lama
```javascript
// Sebelumnya
const permissions = JSON.parse(req.headers.get('x-user-permissions') || '[]');
return permissions.includes(requiredPermission);
```

### Ke Versi Baru
```javascript
// Sekarang
import { hasPermission } from "@/lib/rbac";
return hasPermission(req, requiredPermission);
```

## 🔧 Configuration

### Environment Variables
```bash
# .env
AUTH_SECRET=your-secret-key
NODE_ENV=production
```

### Cookie Settings
```javascript
// Cookie httpOnly settings (sudah dikonfigurasi di login route)
response.cookies.set('rbacPayload', JSON.stringify(tokenPayload), {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 hari
});
``` 