'use client';

import { useEffect, useRef } from 'react';
import { SwaggerUIBundle, SwaggerUIStandalonePreset } from 'swagger-ui-dist';
import 'swagger-ui-dist/swagger-ui.css';

export default function PageContent({ spec }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && spec) {
      SwaggerUIBundle({
        domNode: ref.current,
        spec,
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: 'StandaloneLayout',
        persistAuthorization: true,
        onComplete: async function() {

          // Add custom login button
          const authBtn = document.createElement('button');
          authBtn.innerHTML = '🔑 Login & Get Token';
          authBtn.className = 'btn authorize button';
          authBtn.style.cssText = `
            background: #4990e2;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin: 10px;
            font-size: 14px;
          `;
          
          authBtn.onclick = async function() {
            const username = prompt('Username:');
            const password = prompt('Password:');
            
            if (username && password) {
              try {
                const response = await fetch('/api/auth/login', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ username, password }),
                });
                
                const data = await response.json();
                
                if (data.success && data.data.accessToken) {
                  // Tampilkan instruksi manual
                  alert('Login berhasil!\n\nSalin token berikut:\n' + data.data.accessToken + '\n\nLalu klik tombol "Authorize" di Swagger UI dan paste token ke kolom yang tersedia.');

                } else {
                  alert('Login gagal: ' + data.message);
                }
              } catch (error) {
                alert('Error: ' + error.message);
              }
            }
          };
          
          // Insert the button after the title
          const titleElement = document.querySelector('.swagger-ui .info .title');
          if (titleElement) {
            titleElement.parentNode.insertBefore(authBtn, titleElement.nextSibling);
          }
        },
      });
    }
  }, [spec]);

  return (
    <div className="w-full h-screen overflow-auto bg-white p-4">
      <div
        ref={ref}
        className="swagger-ui-container"
        style={{ width: '100%' }}
      />
    </div>
  );
}