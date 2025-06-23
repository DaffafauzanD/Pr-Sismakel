/**
 * RBAC (Role-Based Access Control) Helper Functions
 * 
 * Fungsi-fungsi ini mendukung pengambilan data RBAC dari:
 * 1. Header (dari middleware) - prioritas utama
 * 2. Cookie httpOnly - fallback jika header tidak tersedia
 * 
 * Contoh penggunaan:
 * 
 * // Cek permission
 * if (!hasPermission(req, 'user.create')) {
 *   return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
 * }
 * 
 * // Cek role
 * if (!hasRole(req, 'admin')) {
 *   return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
 * }
 * 
 * // Ambil data RBAC lengkap
 * const rbacData = getRbacPayload(req);
 * if (rbacData) {
 *   console.log('User:', rbacData.username, 'Role:', rbacData.roleName);
 * }
 * 
 * // Ambil permissions saja
 * const permissions = getPermissions(req);
 * console.log('User permissions:', permissions);
 */

export function hasPermission(req, requiredPermission) {
    let permissions = [];
    
    // Coba ambil dari header terlebih dahulu (dari middleware)
    const headerPermissions = req.headers.get('x-user-permissions');
    console.log("permissions", headerPermissions)
    if (headerPermissions) {
        try {
            permissions = JSON.parse(headerPermissions);
        } catch (e) {
            console.warn('Failed to parse permissions from header:', e);
        }
    }
    
    // Jika tidak ada di header, coba ambil dari cookie httpOnly
    if (permissions.length === 0) {
        const cookie = req.headers.get('cookie');
        if (cookie) {
            const rbacMatch = cookie.match(/rbacPayload=([^;]+)/);
            if (rbacMatch) {
                try {
                    const rbacPayload = JSON.parse(decodeURIComponent(rbacMatch[1]));
                    permissions = rbacPayload.permissions || [];
                } catch (e) {
                    console.warn('Failed to parse RBAC payload from cookie:', e);
                }
            }
        }
    }
    
    return permissions.includes(requiredPermission);
}

/**
 * Fungsi untuk mendapatkan data RBAC payload dari request
 * @param {Request} req - Request object
 * @returns {Object|null} RBAC payload atau null jika tidak ditemukan
 */
export function getRbacPayload(req) {
    // Coba ambil dari header terlebih dahulu (dari middleware)
    const userId = req.headers.get('x-user-id');
    const username = req.headers.get('x-user-username');
    const role = req.headers.get('x-user-role');
    const headerPermissions = req.headers.get('x-user-permissions');
    
    if (userId && username && role && headerPermissions) {
        try {
            return {
                id: userId,
                username: username,
                id_role: role,
                roleName: role,
                permissions: JSON.parse(headerPermissions)
            };
        } catch (e) {
            console.warn('Failed to parse RBAC data from headers:', e);
        }
    }
    
    // Jika tidak ada di header, coba ambil dari cookie httpOnly
    const cookie = req.headers.get('cookie');
    if (cookie) {
        const rbacMatch = cookie.match(/rbacPayload=([^;]+)/);
        if (rbacMatch) {
            try {
                return JSON.parse(decodeURIComponent(rbacMatch[1]));
            } catch (e) {
                console.warn('Failed to parse RBAC payload from cookie:', e);
            }
        }
    }
    
    return null;
}

/**
 * Fungsi untuk mendapatkan permissions dari request
 * @param {Request} req - Request object
 * @returns {Array} Array of permissions
 */
export function getPermissions(req) {
    const rbacPayload = getRbacPayload(req);
    return rbacPayload?.permissions || [];
}

/**
 * Fungsi untuk mengecek apakah user memiliki role tertentu
 * @param {Request} req - Request object
 * @param {string} requiredRole - Role yang dibutuhkan
 * @returns {boolean} True jika user memiliki role yang dibutuhkan
 */
export function hasRole(req, requiredRole) {
    const rbacPayload = getRbacPayload(req);
    return rbacPayload?.roleName === requiredRole || rbacPayload?.id_role === requiredRole;
}