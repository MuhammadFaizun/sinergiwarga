'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AlertCircle, CheckCircle2, Clock, ShieldAlert, MessageSquare, Image as ImageIcon, Send, RefreshCw, X } from 'lucide-react';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });

type Report = {
  id: string;
  category: string;
  description: string;
  status: 'PENDING' | 'VERIFIED' | 'IN_PROGRESS' | 'COMPLETED';
  imageUrl: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  adminReply?: string;
  afterImageUrl?: string;
};

export default function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [editForms, setEditForms] = useState<Record<string, { adminReply: string, afterImageUrl: string }>>({});

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        setReports(data);
        
        // Initialize edit forms with existing data
        const initialForms: Record<string, { adminReply: string, afterImageUrl: string }> = {};
        data.forEach((r: Report) => {
          initialForms[r.id] = { 
            adminReply: r.adminReply || '', 
            afterImageUrl: r.afterImageUrl || '' 
          };
        });
        setEditForms(initialForms);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleEditChange = (id: string, field: string, value: string) => {
    setEditForms(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleImageChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleEditChange(id, 'afterImageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearAfterImage = (id: string) => {
    handleEditChange(id, 'afterImageUrl', '');
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const payload: { status: string; adminReply?: string; afterImageUrl?: string } = { status: newStatus };
    if (editForms[id]?.adminReply !== undefined) payload.adminReply = editForms[id].adminReply;
    if (editForms[id]?.afterImageUrl !== undefined) payload.afterImageUrl = editForms[id].afterImageUrl;

    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if(res.ok) {
        alert(`Status laporan berhasil diubah menjadi ${newStatus}!`);
        fetchReports();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal memperbarui status');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan koneksi.');
    }
  };

  return (
    <div>
      {/* Page Title & Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Dashboard RT/RW</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Kelola dan selesaikan keluhan laporan warga secara transparan</p>
        </div>
        <button 
          type="button"
          onClick={fetchReports} 
          disabled={loading}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem' }}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Grid Statistik Dashboard */}
      <div className="stats-grid">
        <div className="card stat-card pending" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger-color)', display: 'flex' }}>
            <AlertCircle size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, lineHeight: 1.1 }}>{reports.filter(r => r.status === 'PENDING').length}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Aduan Baru</p>
          </div>
        </div>

        <div className="card stat-card verified" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex' }}>
            <ShieldAlert size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, lineHeight: 1.1 }}>{reports.filter(r => r.status === 'VERIFIED').length}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Diverifikasi</p>
          </div>
        </div>

        <div className="card stat-card progress" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: 'var(--warning-bg)', color: 'var(--warning-color)', display: 'flex' }}>
            <Clock size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, lineHeight: 1.1 }}>{reports.filter(r => r.status === 'IN_PROGRESS').length}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Dalam Pengerjaan</p>
          </div>
        </div>

        <div className="card stat-card completed" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: 'var(--success-bg)', color: 'var(--success-color)', display: 'flex' }}>
            <CheckCircle2 size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, lineHeight: 1.1 }}>{reports.filter(r => r.status === 'COMPLETED').length}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Selesai Diperbaiki</p>
          </div>
        </div>
      </div>

      {/* Main Task List */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 800 }}>Daftar Pengelolaan Aduan Warga</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {reports.map(report => {
            const hasAfterImage = !!editForms[report.id]?.afterImageUrl;
            
            return (
              <div 
                key={report.id} 
                style={{ 
                  display: 'flex', 
                  gap: '2rem', 
                  borderBottom: '1px solid var(--border-color)', 
                  paddingBottom: '2.5rem', 
                  flexWrap: 'wrap',
                  alignItems: 'start'
                }}
              >
                {/* 1. Gambar & Peta (Kolom Kiri) */}
                <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '1rem', flexShrink: 0 }}>
                  <div style={{ borderRadius: '0.75rem', overflow: 'hidden', height: '150px', border: '1px solid var(--border-color)' }}>
                    <img src={report.imageUrl} alt="Kerusakan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ borderRadius: '0.75rem', overflow: 'hidden', height: '130px', border: '1px solid var(--border-color)' }}>
                    <MapComponent position={[report.latitude, report.longitude]} setPosition={() => {}} readonly />
                  </div>
                </div>

                {/* 2. Informasi Laporan & Form Respons Admin (Kolom Kanan) */}
                <div style={{ flex: 1, minWidth: '320px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div>
                      <span className={`badge ${
                        report.status === 'PENDING' ? 'badge-pending' : 
                        report.status === 'VERIFIED' ? 'badge-progress' : 
                        report.status === 'IN_PROGRESS' ? 'badge-progress' : 'badge-completed'
                      }`} style={{ marginBottom: '0.5rem' }}>
                        {report.status === 'PENDING' ? 'Aduan Baru' : 
                         report.status === 'VERIFIED' ? 'Terverifikasi' : 
                         report.status === 'IN_PROGRESS' ? 'Pengerjaan' : 'Selesai'}
                      </span>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                        {report.category === 'Lampu' ? '💡 Lampu Jalan' : 
                         report.category === 'Jalan' ? '🛣️ Jalan & Trotoar' : 
                         report.category === 'Drainase' ? '💧 Saluran Air' : '📦 Lainnya'}
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Dilaporkan: {new Date(report.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Deskripsi */}
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                    {report.description}
                  </p>

                  {/* Form Update Respons & Foto Setelah */}
                  <div style={{ 
                    backgroundColor: '#f8fafc', 
                    padding: '1.5rem', 
                    borderRadius: '1rem', 
                    border: '1px solid #e2e8f0' 
                  }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                      <MessageSquare size={16} /> Berikan Tanggapan Pekerjaan
                    </h4>

                    {/* Textarea Balasan */}
                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.85rem' }}>Tanggapan / Balasan untuk Warga</label>
                      <textarea 
                        className="input-field" 
                        rows={2} 
                        placeholder="Contoh: Lampu sudah dibeli dan akan segera dipasang besok pagi..."
                        value={editForms[report.id]?.adminReply || ''}
                        onChange={(e) => handleEditChange(report.id, 'adminReply', e.target.value)}
                      />
                    </div>

                    {/* Upload Foto Hasil Perbaikan */}
                    <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                      <label className="input-label" style={{ fontSize: '0.85rem' }}>
                        <ImageIcon size={16} /> Foto Hasil / Setelah Perbaikan (Opsional)
                      </label>
                      
                      {!hasAfterImage ? (
                        <label className="file-upload-container" style={{ padding: '1rem' }}>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleImageChange(report.id, e)}
                            style={{ display: 'none' }}
                          />
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Pilih Foto Setelah Perbaikan</span>
                        </label>
                      ) : (
                        <div style={{ position: 'relative', width: '120px', height: '90px', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--border-color)', marginTop: '0.25rem' }}>
                          <img src={editForms[report.id].afterImageUrl} alt="Hasil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button 
                            type="button" 
                            onClick={() => clearAfterImage(report.id)}
                            style={{ 
                              position: 'absolute', 
                              top: '2px', 
                              right: '2px', 
                              backgroundColor: 'rgba(0,0,0,0.6)', 
                              color: '#fff', 
                              padding: '2px', 
                              borderRadius: '50%',
                              display: 'flex' 
                            }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons to Update Status */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.5rem', 
                      alignItems: 'center', 
                      flexWrap: 'wrap', 
                      paddingTop: '1rem', 
                      borderTop: '1px solid var(--border-color)' 
                    }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', marginRight: '0.5rem', color: 'var(--text-secondary)' }}>Ubah Status ke:</span>
                      
                      <button 
                        className="btn"
                        onClick={() => updateStatus(report.id, 'PENDING')}
                        style={{ 
                          padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '0.5rem',
                          backgroundColor: report.status === 'PENDING' ? 'var(--danger-bg)' : 'white', 
                          color: 'var(--danger-color)', 
                          border: `1px solid ${report.status === 'PENDING' ? 'var(--danger-color)' : 'var(--border-color)'}`,
                          fontWeight: report.status === 'PENDING' ? 700 : 500
                        }}
                      >
                        Aduan Baru
                      </button>

                      <button 
                        className="btn"
                        onClick={() => updateStatus(report.id, 'VERIFIED')}
                        style={{ 
                          padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '0.5rem',
                          backgroundColor: report.status === 'VERIFIED' ? '#eff6ff' : 'white', 
                          color: '#3b82f6', 
                          border: `1px solid ${report.status === 'VERIFIED' ? '#3b82f6' : 'var(--border-color)'}`,
                          fontWeight: report.status === 'VERIFIED' ? 700 : 500
                        }}
                      >
                        Verifikasi
                      </button>

                      <button 
                        className="btn"
                        onClick={() => updateStatus(report.id, 'IN_PROGRESS')}
                        style={{ 
                          padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '0.5rem',
                          backgroundColor: report.status === 'IN_PROGRESS' ? 'var(--warning-bg)' : 'white', 
                          color: 'var(--warning-color)', 
                          border: `1px solid ${report.status === 'IN_PROGRESS' ? 'var(--warning-color)' : 'var(--border-color)'}`,
                          fontWeight: report.status === 'IN_PROGRESS' ? 700 : 500
                        }}
                      >
                        Pengerjaan
                      </button>

                      <button 
                        className="btn btn-primary"
                        onClick={() => updateStatus(report.id, 'COMPLETED')}
                        style={{ 
                          padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: '0.5rem',
                          background: report.status === 'COMPLETED' ? 'linear-gradient(135deg, var(--success-color) 0%, #059669 100%)' : 'white', 
                          color: report.status === 'COMPLETED' ? 'white' : 'var(--success-color)', 
                          border: `1px solid ${report.status === 'COMPLETED' ? 'transparent' : 'var(--success-color)'}`,
                          boxShadow: report.status === 'COMPLETED' ? '0 2px 6px rgba(16, 185, 129, 0.2)' : 'none',
                          fontWeight: 700
                        }}
                      >
                        Selesai Perbaikan
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
          {reports.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#94a3b8' }}>
              <Clock size={40} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
              <p style={{ fontSize: '0.95rem' }}>Belum ada laporan dari warga saat ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
