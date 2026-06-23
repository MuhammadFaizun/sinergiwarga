import { reportSchema, updateStatusSchema, apresiasiSchema } from '../src/lib/validations';
import * as assert from 'assert';

console.log("=== Menjalankan Uji Coba Skema Validasi ===");

try {
  // Test 1: Valid Report
  console.log("Menguji laporan yang valid...");
  const validReport = reportSchema.parse({
    userId: "warga-1",
    category: "Lampu",
    description: "Lampu jalan mati di depan RT 02",
    imageUrl: "data:image/png;base64,...",
    latitude: -6.2,
    longitude: 106.8
  });
  assert.strictEqual(validReport.category, "Lampu");
  console.log("✓ Laporan valid berhasil divalidasi.");

  // Test 2: Invalid Report (description too short)
  console.log("Menguji laporan yang tidak valid (deskripsi kurang dari 10 karakter)...");
  try {
    reportSchema.parse({
      userId: "warga-1",
      category: "Lampu",
      description: "Pendek",
      imageUrl: "data:image/png;base64,...",
      latitude: -6.2,
      longitude: 106.8
    });
    assert.fail("Harusnya gagal karena deskripsi terlalu pendek");
  } catch (err: any) {
    if (err.name === 'AssertionError') {
      throw err;
    }
    const issues = err.errors || err.issues;
    assert.ok(issues && issues.some((e: any) => e.path.includes("description")));
    console.log("✓ Kegagalan laporan terdeteksi dengan benar.");
  }

  // Test 3: Valid Apresiasi
  console.log("Menguji apresiasi yang valid...");
  const validApresiasi = apresiasiSchema.parse({
    reportId: "report-123",
    message: "Terima kasih pak!",
    stickerId: "sticker-1"
  });
  assert.strictEqual(validApresiasi.stickerId, "sticker-1");
  console.log("✓ Apresiasi valid berhasil divalidasi.");

  console.log("\n=== Semua Uji Coba Berhasil! ===");
  process.exit(0);
} catch (error) {
  console.error("❌ Uji coba gagal:", error);
  process.exit(1);
}
