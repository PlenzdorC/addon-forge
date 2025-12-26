import { MetadataRoute } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://addon-forge.web.app';
  
  // Statische Seiten
  const staticPages = [
    '',
    '/about',
    '/create',
    '/login',
    '/imprint',
    '/privacy',
    '/support',
    '/news',
  ];

  const locales = ['en', 'de'];
  
  const staticRoutes = locales.flatMap(locale =>
    staticPages.map(page => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 1 : page === '/news' ? 0.9 : 0.8,
    }))
  );

  // Dynamische Request-Seiten
  try {
    const requestsSnapshot = await getDocs(collection(db, 'requests'));
    const requestRoutes = locales.flatMap(locale =>
      requestsSnapshot.docs.map(doc => {
        const data = doc.data();
        const lastModified = data.updatedAt?.seconds 
          ? new Date(data.updatedAt.seconds * 1000)
          : data.createdAt?.seconds
          ? new Date(data.createdAt.seconds * 1000)
          : new Date();

        return {
          url: `${baseUrl}/${locale}/request/${doc.id}`,
          lastModified: lastModified,
          changeFrequency: 'daily' as const,
          priority: data.status === 'completed' ? 0.9 : 0.7,
        };
      })
    );

    return [...staticRoutes, ...requestRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticRoutes;
  }
}

