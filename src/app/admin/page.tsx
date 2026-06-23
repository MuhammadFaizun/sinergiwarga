'use client'

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminDashboard from '@/components/AdminDashboard';
import { ShieldCheck, Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { isAdmin, loading, loginAdmin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const result = await loginAdmin(username, password);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.error || 'Username atau password salah.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: '1rem' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary-color)' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Memeriksa sesi...</p>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="animate-fade-in">
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="login-wrapper">
      <div className="card login-card animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--primary-glow)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            margin: '0 auto 1rem auto' 
          }}>
            <ShieldCheck size={32} style={{ color: 'var(--primary-color)' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Portal Admin</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Khusus pengurus RT/RW SinergiWarga</p>
        </div>

        {errorMsg && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            backgroundColor: 'var(--danger-bg)', 
            color: 'var(--danger-color)', 
            border: '1px solid var(--danger-border)',
            padding: '0.75rem 1rem', 
            borderRadius: '0.75rem', 
            marginBottom: '1.25rem',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">
              <User size={16} /> Username
            </label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Masukkan username admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label className="input-label">
              <Lock size={16} /> Password
            </label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="Masukkan password admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>Masuk Sekarang</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
