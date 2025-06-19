'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScreenLoader } from '@/components/common/screen-loader';
import { MainLayout } from '../components/main/layout';

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Cek status login dengan fetch ke endpoint protected
    fetch('/api/auth/me')
      .then(res => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/auth/signin');
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        router.push('/auth/signin');
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <ScreenLoader />;
  }

  return isAuthenticated ? <MainLayout>{children}</MainLayout> : null;
}
