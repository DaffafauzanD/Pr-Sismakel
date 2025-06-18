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
        onComplete: function() {
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
                  // Set the token in Swagger UI
                  const token = data.data.accessToken;
                  
                  // Update the authorization header
                  const authInput = document.querySelector('.auth-wrapper input[type="text"]');
                  if (authInput) {
                    authInput.value = token;
                    authInput.dispatchEvent(new Event('input', { bubbles: true }));
                  }
                  
                  // Click the authorize button
                  const authorizeBtn = document.querySelector('.auth-wrapper .authorize');
                  if (authorizeBtn) {
                    authorizeBtn.click();
                  }
                  
                  alert('Login berhasil! Token telah diset.');
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
        requestInterceptor: function(request) {
          // Add authorization header if token exists
          const token = localStorage.getItem('swagger_ui_token');
          if (token && request.url.includes('/api/')) {
            request.headers.Authorization = `Bearer ${token}`;
          }
          return request;
        },
        responseInterceptor: function(response) {
          // Store token from login response
          if (response.url.includes('/api/auth/login') && response.status === 200) {
            try {
              const data = JSON.parse(response.text);
              if (data.data && data.data.accessToken) {
                localStorage.setItem('swagger_ui_token', data.data.accessToken);
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
          return response;
        }
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