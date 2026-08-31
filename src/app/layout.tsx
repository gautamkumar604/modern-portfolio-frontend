import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/context/theme-context';
import { siteSettingsService } from '@/lib/services/site-settings.service';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await siteSettingsService.getSiteSettings();
    return {
      title: settings?.defaultSeoTitle || settings?.siteName || 'Developer Portfolio',
      description:
        settings?.defaultSeoDescription || settings?.tagline || 'Modern Dynamic Software Engineer Portfolio',
      keywords: settings?.keywords && settings.keywords.length > 0 ? settings.keywords : ['portfolio', 'developer', 'fullstack'],
      openGraph: {
        title: settings?.defaultSeoTitle || settings?.siteName,
        description: settings?.defaultSeoDescription,
        images: settings?.ogImageUrl ? [{ url: settings.ogImageUrl }] : [],
      },
      icons: settings?.faviconUrl ? { icon: settings.faviconUrl } : undefined,
    };
  } catch {
    // Graceful fallback if Site Settings API fails
    return {
      title: 'Developer Portfolio',
      description: 'Modern Dynamic Software Engineer Portfolio',
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${outfit.variable} ${jetbrainsMono.variable}`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="antialiased selection:bg-blue-600 selection:text-white font-sans bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
