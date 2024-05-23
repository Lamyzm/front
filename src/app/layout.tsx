import type { Metadata } from 'next';
import { Theme } from '@radix-ui/themes';
import { MSWComponent } from '@/mocks/MswProvider';
import { roboto, notoSansKr } from '@/style/font';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import clsx from 'clsx';
import ReactQueryProviders from '@/contexts/ReactQueryProvider';
import './globals.scss';
import '@radix-ui/themes/styles.css';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
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
          <Theme>{children}</Theme>
        </ReactQueryProviders>
      </body>
    </html>
  );
}
