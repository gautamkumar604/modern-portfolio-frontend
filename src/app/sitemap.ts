import { MetadataRoute } from 'next';
import { projectsService } from '@/lib/services/projects.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '');

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  try {
    const projectsResponse = await projectsService.getProjects({
      limit: 100,
      isPublished: true,
    });

    if (projectsResponse && Array.isArray(projectsResponse.data)) {
      const projectRoutes: MetadataRoute.Sitemap = projectsResponse.data
        .filter((project) => project && project.slug && project.isPublished)
        .map((project) => ({
          url: `${baseUrl}/projects/${project.slug}`,
          lastModified: project.updatedAt
            ? new Date(project.updatedAt)
            : new Date(),
          changeFrequency: 'monthly',
          priority: 0.8,
        }));

      routes.push(...projectRoutes);
    }
  } catch {
    // Fail gracefully if backend API is temporarily unavailable during static generation
  }

  return routes;
}
