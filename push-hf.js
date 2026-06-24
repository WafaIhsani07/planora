const { execSync } = require('child_process');

console.log("Memulai proses push backend ke Hugging Face...");

try {
  // 1. Tambahkan perubahan pada folder backend ke Git Index
  console.log("-> git add backend");
  execSync('git add backend');
  
  // 1.5. Hapus folder uploads dari git index agar tidak ikut ter-push (menghindari error binary files)
  console.log("-> Menghapus folder uploads dari index...");
  try {
    execSync('git rm -r --cached backend/uploads');
  } catch (e) {
    // Abaikan jika folder uploads belum ada di index
  }
  
  // 2. Tulis tree dari Git Index saat ini (mendapatkan hash seluruh tree)
  console.log("-> Menjalankan git write-tree");
  const fullTree = execSync('git write-tree').toString().trim();
  
  // 3. Ekstrak object tree spesifik HANYA untuk folder 'backend'
  const lsTreeOut = execSync(`git ls-tree ${fullTree} backend`).toString().trim();
  const match = lsTreeOut.match(/tree\s+([a-f0-9]+)\s+backend/);
  
  if (!match) {
    throw new Error("Gagal menemukan struktur tree untuk folder 'backend'. Pastikan folder tersebut ada dan sudah ditambahkan ke git.");
  }
  const subTree = match[1];
  
  // 4. Buat objek commit baru dari tree folder backend
  console.log(`-> Membuat commit dari subtree backend (${subTree})`);
  const commitMessage = "Deploy update backend terbaru";
  const commitId = execSync(`git commit-tree ${subTree} -m "${commitMessage}"`).toString().trim();
  
  // 5. Push spesifik commit tersebut ke branch main di remote Hugging Face
  const remoteUrl = "https://huggingface.co/spaces/Nooname77/planora-api";
  console.log(`\nPushing commit [${commitId}] ke Hugging Face Spaces...`);
  console.log(`Command: git push ${remoteUrl} ${commitId}:main --force\n`);
  
  execSync(`git push ${remoteUrl} ${commitId}:main --force`, { stdio: 'inherit' });
  
  console.log('\n✅ Sukses! Update backend berhasil dikirim ke Hugging Face Spaces.');
} catch (err) {
  console.error('\n❌ Terjadi kesalahan saat melakukan push:');
  console.error(err.message);
}
