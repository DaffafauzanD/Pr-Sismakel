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