import { notFound } from 'next/navigation';
import PageContent from './page-content';

export default async function SwaggerPage() {
  if (process.env.NODE_ENV !== 'development') notFound();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const res = await fetch(`${baseUrl}/api/docs`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 0 }, // Optional: Biar tidak cache
  });

  if (!res.ok) {
    notFound(); // Jika gagal fetch
  }

  const spec = await res.json();
  return <PageContent spec={spec} />;
}
