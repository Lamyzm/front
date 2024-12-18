import type { Metadata } from 'next';
import { Theme } from '@radix-ui/themes';
import { MSWComponent } from '@/mocks/MswProvider';
import { roboto, notoSansKr } from '@/style/font';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import clsx from 'clsx';
import ReactQueryProviders from '@/contexts/ReactQueryProvider';
import './globals.scss';
import '@radix-ui/themes/styles.css';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
  title: 'officener',
  description: '소유자를 위한 ',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={clsx(roboto.variable, notoSansKr.variable)}>
        <MSWComponent />
        <ReactQueryProviders>
          <SessionProvider>
            <Theme>{children}</Theme>
          </SessionProvider>
        </ReactQueryProviders>
      </body>
    </html>
  );
}
