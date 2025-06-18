// Test script untuk implementasi NextAuth dengan Swagger UI
// Jalankan dengan: node test-swagger-auth.js

const BASE_URL = 'http://localhost:3000';

async function testAuthFlow() {
    console.log('🧪 Testing NextAuth dengan Swagger UI...\n');

    // Test 1: Login
    console.log('1. Testing Login...');
    try {
        const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'admin',
                password: 'password'
            })
        });

        const loginData = await loginResponse.json();
        
        if (loginData.success) {
            console.log('✅ Login berhasil');
            console.log('Token:', loginData.data.accessToken.substring(0, 50) + '...');
            
            const token = loginData.data.accessToken;
            
            // Test 2: Get user info
            console.log('\n2. Testing Get User Info...');
            const meResponse = await fetch(`${BASE_URL}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const meData = await meResponse.json();
            if (meData.success) {
                console.log('✅ User info berhasil diambil');
                console.log('Username:', meData.data.username);
                console.log('Role:', meData.data.roleName);
                console.log('Permissions:', meData.data.permissions);
            } else {
                console.log('❌ Gagal mengambil user info:', meData.message);
            }
            
            // Test 3: Get profile
            console.log('\n3. Testing Get Profile...');
            const profileResponse = await fetch(`${BASE_URL}/api/user-management/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const profileData = await profileResponse.json();
            if (profileData.success) {
                console.log('✅ Profile berhasil diambil');
                console.log('User ID:', profileData.data.id);
                console.log('Created at:', profileData.data.created_at);
            } else {
                console.log('❌ Gagal mengambil profile:', profileData.message);
            }
            
            // Test 4: Test protected endpoint without token
            console.log('\n4. Testing Protected Endpoint Without Token...');
            const noTokenResponse = await fetch(`${BASE_URL}/api/user-management/profile`);
            const noTokenData = await noTokenResponse.json();
            
            if (noTokenResponse.status === 401) {
                console.log('✅ Middleware berhasil memblokir request tanpa token');
            } else {
                console.log('❌ Middleware gagal memblokir request tanpa token');
            }
            
            // Test 5: Logout
            console.log('\n5. Testing Logout...');
            const logoutResponse = await fetch(`${BASE_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const logoutData = await logoutResponse.json();
            if (logoutData.success) {
                console.log('✅ Logout berhasil');
            } else {
                console.log('❌ Logout gagal:', logoutData.message);
            }
            
        } else {
            console.log('❌ Login gagal:', loginData.message);
        }
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
    
    console.log('\n🎉 Testing selesai!');
    console.log('\n📖 Cara menggunakan di Swagger UI:');
    console.log('1. Buka http://localhost:3000/swagger');
    console.log('2. Klik tombol "🔑 Login & Get Token"');
    console.log('3. Masukkan username: admin, password: password');
    console.log('4. Token akan otomatis diset untuk semua request');
    console.log('5. Test endpoint yang memerlukan autentikasi');
}

// Run test if this file is executed directly
if (require.main === module) {
    testAuthFlow();
}

module.exports = { testAuthFlow }; 