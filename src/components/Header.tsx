'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Users, LogOut, ArrowLeft } from 'lucide-react';

export default function Header() {
  const { isAdmin, logoutAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/');
  };

  return (
    <header className="layout-header">
      <div className="container header-content">
        <Link href="/" className="logo">
          <Users size={24} style={{ color: 'var(--primary-color)' }} />
          SinergiWarga
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {pathname === '/admin' ? (
            isAdmin ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="badge badge-completed">
                  <ShieldCheck size={16} /> Admin (RT/RW)
                </span>
                <button 
                  onClick={handleLogout}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  <LogOut size={16} /> Keluar
                </button>
              </div>
            ) : (
              <Link 
                href="/" 
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
              >
                <ArrowLeft size={16} /> Halaman Utama
              </Link>
            )
          ) : (
            <Link 
              href="/admin" 
              className="btn btn-primary"
              style={{ padding: '0.6rem 1.2rem', fontSize: '0.875rem' }}
            >
              <ShieldCheck size={16} /> Portal RT/RW
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
