import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'SinergiWarga - Pelaporan Fasilitas Umum',
  description: 'Sistem Manajemen Tugas yang transparan untuk komunitas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          <Header />
          <main className="main-content container">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
