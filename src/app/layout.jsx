import { Suspense } from 'react';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { SettingsProvider } from '@/providers/settings-provider';
import { TooltipsProvider } from '@/providers/tooltips-provider';
import { Toaster } from '@/components/ui/sonner';
import '@/css/styles.css';
import '@/components/keenicon/assets/styles.css';
import { I18nProvider } from '@/providers/i18n-provider';
import { ThemeProvider } from '@/providers/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: {
      template: '%s | Metronic',
      default: 'Metronic', // a default is required when creating a template
    },
  };

  export default async function RootLayout({ children }) {
    return (
      <html className="h-full" suppressHydrationWarning>
        <body
          className={cn(
            'antialiased flex h-full text-base text-foreground bg-background',
            inter.className,
          )}
        >
              <SettingsProvider>
                <ThemeProvider>
                  <I18nProvider>
                    <TooltipsProvider>
                        <Suspense>{children}</Suspense>
                        <Toaster />
                    </TooltipsProvider>
                  </I18nProvider>
                </ThemeProvider>
              </SettingsProvider>
        </body>
      </html>
    );
  }