import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ITLegend Course Player',
  description: 'ITLegend Frontend Hiring Assessment - Course Player & Courses Catalog',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#F8FAFC]">
        {children}
      </body>
    </html>
  );
}
