import '@root/global.scss';
import '@root/animations.scss';

import { Metadata } from 'next';

export const metadata: Metadata = {
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="theme-light">
        {children}
      </body>
    </html>
  );
}
