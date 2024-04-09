import '@/styles/output.css';
import React from 'react';
import { ApolloWrapper } from '@/lib/apollo/apollo-provider';
import { cn } from '@/lib/utils';
import { inter } from '@/components/fonts';
import { Toaster } from '@/components/ui/toaster';
import ThemeProvider from '@/components/theme.context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ApolloWrapper>
            <div
              className={cn(
                'flex flex-col items-center bg-background text-base antialiased',
                inter.variable,
              )}
            >
              {children}
              <Toaster />
            </div>
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
