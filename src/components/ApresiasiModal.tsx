'use client'

import React, { useState } from 'react';

export default function ApresiasiModal({ reportId, onClose }: { reportId: string, onClose: () => void }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await fetch('/api/apresiasi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId, message, stickerId: 'thank-you-1' })
    });
    
    setLoading(false);
    alert('Terima kasih! Apresiasi Anda telah dikirimkan ke tim lapangan.');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--primary-color)' }}>Beri Apresiasi 🌟</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          Apresiasi Anda sangat berarti bagi pengurus dan tim lapangan yang telah memperbaiki fasilitas ini.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Pesan Terima Kasih</label>
            <textarea 
              className="input-field" 
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Contoh: Terima kasih pak! Jalannya sekarang mulus."
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn" onClick={onClose} style={{ color: 'var(--text-secondary)' }}>Batal</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim Apresiasi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
