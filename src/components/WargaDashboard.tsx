'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Camera, MapPin, Send, Search, CheckCircle2, Clock, AlertCircle, RefreshCw, X } from 'lucide-react';
import ApresiasiModal from './ApresiasiModal';

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
  apresiasi?: { id: string; message: string; stickerId: string }[];
};

export default function WargaDashboard() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showApresiasi, setShowApresiasi] = useState<string | null>(null);
  
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const [form, setForm] = useState({
    category: 'Lampu',
    description: '',
    imageUrl: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setForm({ ...form, imageUrl: '' });
  };

  const fetchReports = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/reports?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position) return alert('Pilih lokasi di peta terlebih dahulu dengan mengeklik peta');
    if (!form.imageUrl) return alert('Masukkan foto kerusakan terlebih dahulu');
    setLoading(true);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'warga-123',
          ...form,
          latitude: position[0],
          longitude: position[1],
        }),
      });

      if (res.ok) {
        alert('Laporan Anda berhasil terkirim dan masuk antrean.');
        setForm({ ...form, description: '', imageUrl: '' });
        setPosition(null);
        fetchReports();
      } else {
        alert('Gagal mengirim laporan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(r => {
    if (filterStatus === 'IN_PROGRESS') {
      if (r.status === 'COMPLETED') return false; 
    } else if (filterStatus === 'COMPLETED') {
      if (r.status !== 'COMPLETED') return false;
    }
    
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      if (!r.category.toLowerCase().includes(keyword) && !r.description.toLowerCase().includes(keyword)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
      
      {/* Kolom Kiri: Form Laporan */}
      <div className="card" style={{ position: 'sticky', top: '6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <div style={{ 
            backgroundColor: 'var(--primary-glow)', 
            padding: '0.5rem', 
            borderRadius: '0.5rem', 
            color: 'var(--primary-color)',
            display: 'flex'
          }}>
            <Camera size={22} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Lapor Kerusakan Fasum</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Kategori Kerusakan</label>
            <select 
              className="input-field"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="Lampu">💡 Lampu Penerangan Jalan</option>
              <option value="Jalan">🛣️ Infrastruktur Jalan & Trotoar</option>
              <option value="Drainase">💧 Saluran Air / Drainase / Got</option>
              <option value="Lainnya">📦 Fasilitas Umum Lainnya</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Deskripsi Detail</label>
            <textarea 
              className="input-field" 
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Berikan deskripsi detail (lokasi tepat, tingkat kerusakan, dll)..."
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Foto Bukti Kerusakan</label>
            
            {!form.imageUrl ? (
              <label className="file-upload-container">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  required
                />
                <Camera size={32} style={{ color: '#94a3b8', marginBottom: '0.5rem' }} />
                <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Klik untuk Upload Gambar</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Format PNG, JPG, JPEG (Max 5MB)</span>
              </label>
            ) : (
              <div style={{ position: 'relative', borderRadius: '0.75rem', overflow: 'hidden', height: '180px' }}>
                <img src={form.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  type="button" 
                  onClick={clearImage}
                  style={{ 
                    position: 'absolute', 
                    top: '0.5rem', 
                    right: '0.5rem', 
                    backgroundColor: 'rgba(15, 23, 42, 0.7)', 
                    color: '#fff', 
                    padding: '0.35rem', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.9)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.7)'}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="input-group" style={{ marginBottom: '1.75rem' }}>
            <label className="input-label">
              <MapPin size={18} style={{ color: 'var(--primary-color)' }} /> Tandai Lokasi Kerusakan
            </label>
            <div style={{ borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <MapComponent 
                position={position} 
                setPosition={setPosition} 
                otherMarkers={reports.map(r => ({ lat: r.latitude, lng: r.longitude, category: r.category }))}
              />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: '1.3' }}>
              *Klik pada peta untuk menaruh pin merah tempat kerusakan. Pin abu-abu adalah laporan warga lain.
            </span>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }} 
            disabled={loading}
          >
            <Send size={18} /> {loading ? 'Mengirim Laporan...' : 'Kirim Laporan Warga'}
          </button>
        </form>
      </div>

      {/* Kolom Kanan: Riwayat & List Laporan */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Stats Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.25rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-color)', lineHeight: 1 }}>{reports.length}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Aduan</span>
          </div>
          <div className="card" style={{ padding: '1.25rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--warning-color)', lineHeight: 1 }}>{reports.filter(r => r.status !== 'COMPLETED').length}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Diproses</span>
          </div>
          <div className="card" style={{ padding: '1.25rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success-color)', lineHeight: 1 }}>{reports.filter(r => r.status === 'COMPLETED').length}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Selesai</span>
          </div>
        </div>

        {/* List Laporan */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Riwayat Laporan Warga
              <button 
                type="button"
                onClick={fetchReports} 
                disabled={refreshing} 
                style={{ color: 'var(--text-secondary)', display: 'flex', padding: '0.25rem', borderRadius: '50%', backgroundColor: '#f1f5f9' }}
              >
                <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              </button>
            </h2>

            <div style={{ display: 'flex', gap: '0.5rem', flex: '1 0 100%', maxWidth: '400px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  placeholder="Cari kata kunci..." 
                  className="input-field" 
                  style={{ paddingLeft: '2.25rem', width: '100%', paddingBottom: '0.6rem', paddingTop: '0.6rem' }}
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                />
              </div>
              <select 
                className="input-field" 
                style={{ padding: '0.6rem 0.5rem', width: '130px', fontSize: '0.875rem' }}
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="ALL">Semua</option>
                <option value="IN_PROGRESS">Diproses</option>
                <option value="COMPLETED">Selesai</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredReports.map((report) => {
              const hasComparison = report.status === 'COMPLETED';
              
              return (
                <div key={report.id} className="card" style={{ padding: '1.5rem' }}>
                  
                  {/* Bagian Atas: Kategori & Tanggal */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                      {report.category === 'Lampu' ? '💡 Lampu Jalan' : 
                       report.category === 'Jalan' ? '🛣️ Jalan & Trotoar' : 
                       report.category === 'Drainase' ? '💧 Saluran Air' : '📦 Lainnya'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(report.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Bagian Tengah: Deskripsi */}
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                    {report.description}
                  </p>

                  {/* Foto Laporan - Side-by-Side jika Selesai */}
                  {!hasComparison ? (
                    <div style={{ width: '100%', height: '180px', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '1.5rem' }}>
                      <img src={report.imageUrl} alt="Laporan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>SEBELUM PERBAIKAN</span>
                        <div style={{ height: '120px', borderRadius: '0.5rem', overflow: 'hidden' }}>
                          <img src={report.imageUrl} alt="Sebelum" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success-color)', display: 'block', marginBottom: '0.25rem' }}>SETELAH PERBAIKAN</span>
                        <div style={{ height: '120px', borderRadius: '0.5rem', overflow: 'hidden', border: '2px solid var(--success-border)' }}>
                          <img src={report.afterImageUrl || report.imageUrl} alt="Setelah" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stepper Timeline Pelacakan Laporan */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    position: 'relative', 
                    marginBottom: '1.5rem', 
                    padding: '0 0.5rem' 
                  }}>
                    <div style={{ 
                      position: 'absolute', 
                      top: '12px', 
                      left: '20px', 
                      right: '20px', 
                      height: '3px', 
                      backgroundColor: 'var(--border-color)', 
                      zIndex: 0 
                    }}></div>
                    
                    {['PENDING', 'VERIFIED', 'IN_PROGRESS', 'COMPLETED'].map((step, idx) => {
                      const stepNames = { PENDING: 'Diterima', VERIFIED: 'Diverifikasi', IN_PROGRESS: 'Pengerjaan', COMPLETED: 'Selesai' };
                      const stepColors = { PENDING: 'var(--danger-color)', VERIFIED: '#3B82F6', IN_PROGRESS: 'var(--warning-color)', COMPLETED: 'var(--success-color)' };
                      const statuses = ['PENDING', 'VERIFIED', 'IN_PROGRESS', 'COMPLETED'];
                      const currentIdx = statuses.indexOf(report.status);
                      const isActive = idx <= currentIdx;
                      const activeColor = stepColors[step as keyof typeof stepColors];
                      
                      return (
                        <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '0.35rem', flex: 1 }}>
                          <div style={{ 
                            width: '24px', height: '24px', borderRadius: '50%', 
                            backgroundColor: isActive ? activeColor : '#fff',
                            border: isActive ? `2.5px solid ${activeColor}` : '2.5px solid var(--border-color)',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            boxShadow: isActive ? `0 0 10px ${activeColor}40` : 'none',
                            transition: 'var(--transition-smooth)'
                          }}>
                            {isActive && <CheckCircle2 size={12} color="#fff" />}
                          </div>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: isActive ? 700 : 500, 
                            color: isActive ? activeColor : 'var(--text-secondary)', 
                            textAlign: 'center',
                            transition: 'var(--transition-smooth)'
                          }}>
                            {stepNames[step as keyof typeof stepNames]}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Respon Admin Speech Bubble */}
                  {report.adminReply && (
                    <div style={{ 
                      marginTop: '1.25rem', 
                      padding: '1rem', 
                      backgroundColor: '#f8fafc', 
                      borderRadius: '0.75rem', 
                      borderLeft: '4px solid var(--primary-color)',
                      position: 'relative'
                    }}>
                      <div style={{ 
                        fontWeight: 700, 
                        fontSize: '0.8rem', 
                        color: 'var(--text-primary)',
                        marginBottom: '0.25rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Tanggapan RT/RW:
                      </div>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        &ldquo;{report.adminReply}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Tombol Apresiasi jika Selesai */}
                  {report.status === 'COMPLETED' && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginTop: '1.25rem', 
                      paddingTop: '1rem', 
                      borderTop: '1px solid var(--border-color)' 
                    }}>
                      <button 
                        onClick={() => setShowApresiasi(report.id)}
                        className="btn" 
                        style={{ 
                          backgroundColor: '#fef9c3', 
                          color: '#854d0e', 
                          padding: '0.4rem 1rem', 
                          fontSize: '0.85rem',
                          borderRadius: '0.5rem',
                          fontWeight: 700,
                          boxShadow: '0 2px 5px rgba(234, 179, 8, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fef08a';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#fef9c3';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        Beri Apresiasi ⭐
                      </button>
                      {report.apresiasi && report.apresiasi.length > 0 && (
                        <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          ❤️ {report.apresiasi.length} Warga Mengapresiasi
                        </span>
                      )}
                    </div>
                  )}

                </div>
              );
            })}

            {filteredReports.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#94a3b8' }}>
                <Clock size={40} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
                <p style={{ fontSize: '0.95rem' }}>Belum ada laporan aduan yang sesuai filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showApresiasi && (
        <ApresiasiModal reportId={showApresiasi} onClose={() => { setShowApresiasi(null); fetchReports(); }} />
      )}
    </div>
  );
}
