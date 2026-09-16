const fs = require('fs');
const { execSync } = require('child_process');

const store = 'p1d3wg-6i.myshopify.com';
const cwd = '/Users/ongki';

const pagesData = [
  {
    id: 'gid://shopify/Page/138083533021',
    handle: 'about',
    title: 'About Beautyinu',
    isPublished: true,
    seo: {
      title: 'About Beautyinu — Your Bodycare Bestie',
      description: 'Kenali Beautyinu dari CV. Dinare Anugrah Kosmetika. Filosofi glow with confidence, komunitas Moonbabies, Brightygengs, dan komitmen BPOM resmi.'
    },
    body: `
<p><strong>Your Bodycare Bestie untuk Kulit Bersih, Lembap, dan Glowing Terawat.</strong></p>

<h2>Tentang Beautyinu</h2>
<p>Beautyinu adalah brand beauty dan bodycare lokal di bawah naungan <strong>CV. DINARE ANUGRAH KOSMETIKA</strong> yang berbasis di Surabaya, Jawa Timur. Kami hadir untuk menemani perjalanan setiap perempuan Indonesia dalam merawat diri dengan cara yang lebih menyenangkan (<em>fun</em>), praktis, dan percaya diri.</p>
<p>Kami percaya bahwa merawat diri bukan tentang mengejar standar kecantikan yang kaku atau mahal, melainkan tentang memiliki kulit yang bersih, sehat terhidrasi, merasa nyaman dengan diri sendiri, serta merayakan keunikan setiap individu. Karena itu, Beautyinu menghadirkan rangkaian perawatan tubuh harian yang mudah digunakan, mulai dari sabun mandi kaya nutrisi, body lotion jumbo ber-UV Filter, krim tubuh intensif, hingga serbuk booster pencerah inovatif.</p>

<h2>Our Belief</h2>
<blockquote>
<p><strong>"Glow with confidence, grow with kindness."</strong></p>
</blockquote>
<p>Bagi kami, kecantikan sejati adalah tentang keberanian untuk merawat diri, merasa lebih baik, dan tumbuh menjadi versi diri yang paling percaya diri. Cantik tidak harus rumit dan tidak harus mahal. Kami ingin setiap produk, kampanye, dan inisiatif Beautyinu dapat memberikan manfaat nyata yang berkelanjutan—baik untuk kesehatan kulit, komunitas pendukung kami, maupun lingkungan sekitar.</p>

<h2>Komitmen Kualitas &amp; Keamanan (BPOM)</h2>
<p>Setiap produk Beautyinu dikembangkan melalui riset mendalam dengan memprioritaskan keamanan jangka panjang:</p>
<ul>
<li><strong>100% Ternotifikasi Resmi BPOM:</strong> Seluruh formula terdaftar resmi di Badan Pengawas Obat dan Makanan Republik Indonesia.</li>
<li><strong>Bahan Aktif Teruji Klinis:</strong> Menggabungkan Niacinamide konsentrat tinggi, Alpha Arbutin, Glutathione, Tranexamic Acid, Kakadu Plum alami, dan Botanical Oils.</li>
<li><strong>Bebas Bahan Berbahaya:</strong> Bebas merkuri, bebas hidrokuinon, dan tidak meninggalkan efek warna abu-abu (<em>no ashy cast</em>).</li>
<li><strong>Ramah Kulit (Usia 12+):</strong> Diformulasikan lembut dan aman digunakan mulai usia 12 tahun ke atas untuk semua jenis kulit.</li>
</ul>

<h2>Beautyinu Programs — Ruang Tumbuh Bersama</h2>
<p>Beautyinu bukan sekadar brand perawatan tubuh, melainkan ekosistem untuk bertumbuh bersama melalui 4 program utama:</p>

<h3>1. Moonbabies (Community &amp; Social Movement)</h3>
<p>Moonbabies adalah program komunitas dan gerakan sosial dari Beautyinu yang berfokus pada workshop keterampilan, edukasi self-care, pemberdayaan perempuan, serta kepedulian lingkungan dan aksi berbagi kepada masyarakat yang membutuhkan.</p>
<p><strong>Benefit Anggota:</strong> Free workshop berkala, produk gratis, dan peningkatan wawasan diri.</p>
<p>👉 <a href="https://forms.gle/RBM26oTsz1jEgrae8" target="_blank" rel="noopener noreferrer"><strong>Daftar Program Moonbabies (Google Form Resmi)</strong></a></p>

<h3>2. Brightygengs (Creator &amp; Affiliate Ambassador)</h3>
<p>Brightygengs adalah ruang kolaborasi untuk para beauty enthusiast, pengguna aktif, dan content creator yang ingin mendapatkan penghasilan tambahan serta berkembang di dunia digital.</p>
<p><strong>Benefit Anggota:</strong> Free sample produk terbaru, komisi afiliasi menarik, dan tips pembuatan konten viral.</p>
<p>👉 <a href="https://api.whatsapp.com/send/?phone=6281936574690&amp;text=Halo%20Admin%2C%20saya%20tertarik%20bergabung%20dengan%20Brightygengs%20Beautyinu" target="_blank" rel="noopener noreferrer"><strong>Gabung Brightygengs via WhatsApp Resmi</strong></a></p>

<h3>3. Official Distributor &amp; Reseller Program</h3>
<p>Kami membuka peluang kemitraan resmi bagi pelaku usaha, toko kosmetik, reseller, dan distributor di seluruh pelosok Nusantara untuk tumbuh bersama dalam jaringan distribusi resmi Beautyinu.</p>
<p><strong>Dukungan Kemitraan:</strong> Produk dengan permintaan pasar tinggi, tester gratis, materi promosi siap pakai, dan program reward tahunan.</p>
<p>👉 Hubungi tim kemitraan kami melalui WhatsApp: <a href="https://wa.me/6281936574690" target="_blank" rel="noopener noreferrer"><strong>+62 819-3657-4690</strong></a></p>

<h3>4. Birthday Treats (Spesial Hari Ulang Tahunmu)</h3>
<p>Bagi kami, setiap momen spesial pelanggan layak dirayakan. Beautyinu memberikan hadiah produk gratis bagi Anda yang sedang berulang tahun!</p>
<p><strong>Cara Klaim Birthday Treats:</strong></p>
<ol>
<li>Pastikan proses klaim dilakukan tepat pada hari ulang tahun Anda melalui Direct Message Instagram resmi <a href="https://instagram.com/beautyinu.id" target="_blank" rel="noopener noreferrer"><strong>@beautyinu.id</strong></a>.</li>
<li>Tunjukkan foto kartu identitas resmi (KTP/Kartu Pelajar) yang masih berlaku.</li>
<li>Tunggu proses verifikasi dari tim Customer Care Beautyinu.</li>
<li>Hadiah produk spesial akan dikirimkan langsung ke alamat rumah Anda (*ongkir ditanggung oleh penerima).</li>
</ol>

<p><em>Beautyinu — Your bodycare bestie to glow, grow, and feel confident every day.</em></p>
`
  },
  {
    id: 'gid://shopify/Page/138083565789',
    handle: 'faq',
    title: 'Frequently Asked Questions (FAQ)',
    isPublished: true,
    seo: {
      title: 'FAQ & Panduan Produk — Beautyinu Official',
      description: 'Pertanyaan umum seputar produk Beautyinu: takaran Gold Powder, body lotion UV filter, body cream dibilas/tidak, sabun kefir, dan keamanan BPOM.'
    },
    body: `
<p>Temukan jawaban lengkap dan panduan pemakaian seputar seluruh rangkaian produk dan layanan Beautyinu di bawah ini.</p>

<h2>1. Brightening Booster Gold Powder (25gr)</h2>
<h3>Apa itu Brightening Booster Gold Powder?</h3>
<p>Brightening Booster Gold Powder adalah serbuk booster pencerah kulit tubuh multifungsi dengan konsentrasi aktif tinggi. Diformulasikan khusus dengan Niacinamide 5.22%, Alpha Arbutin 2.30%, Kakadu Plum, Glutathione, dan Salicylic Acid untuk membantu mempercepat regenerasi sel kulit dan mencerahkan area tubuh yang kusam serta belang.</p>

<h3>Bisa dicampur dengan body lotion merek apa saja?</h3>
<p>Secara umum bisa dicampurkan dengan berbagai merek body lotion harian. Namun, <strong>dilarang keras</strong> dicampur langsung dengan lotion atau krim yang memiliki konsentrasi bahan aktif eksfoliasi sangat tinggi (AHA di atas 8%, BHA di atas 2%, Retinol di atas 0.5%, atau Vitamin C murni di atas 15%) guna mencegah risiko iritasi kulit.</p>

<h3>Berapa takaran campuran yang disarankan?</h3>
<p>Ada dua cara penggunaan yang disarankan:</p>
<ul>
<li><strong>Campuran Harian:</strong> 1 botol penuh (25 gram) dilarutkan ke dalam botol body lotion ukuran 400–750 ml, lalu kocok merata. Atau ambil sedikit serbuk (secubit) di telapak tangan lalu campurkan dengan lotion harian dengan perbandingan 3:1 (lebih banyak lotion).</li>
<li><strong>Masker / Lulur Badan Mingguan:</strong> Campurkan serbuk dengan Brightening Body Cream atau lulur mandi dengan rasio 1:1. Oleskan merata ke tubuh, diamkan 10–15 menit, lalu bilas bersih.</li>
</ul>

<h3>Apakah bisa digunakan untuk wajah?</h3>
<p>Bisa digunakan sebagai campuran masker bilas berbasis serbuk (powder mask) sesuai kebutuhan. Karena kulit wajah lebih sensitif dibanding tubuh, lakukan <em>patch test</em> di rahang bawah terlebih dahulu dan jangan mencampur booster langsung ke dalam jar pelembap wajah harian.</p>

<h3>Apakah sudah BPOM dan aman jangka panjang?</h3>
<p>Ya! Brightening Booster Gold Powder telah mengantongi izin edar resmi BPOM NA18240200017, bebas merkuri, bebas hidrokuinon, dan aman untuk perawatan rutin harian mulai usia 12+.</p>

<h2>2. Bright Glow Body Lotion UV Filter (750ml Jumbo)</h2>
<h3>Apa keunggulan Bright Glow Body Lotion 750ml?</h3>
<p>Body lotion harian ukuran jumbo 750ml ini memadukan sistem UV Filter harian, Tranexamic Acid, Niacinamide, Shea Butter, Multivitamin (B5, E), dan 4-Layer Hyaluronic Complex. Menjaga kelembapan hingga 24 jam sekaligus melindungi kulit dari paparan sinar UV matahari saat beraktivitas di luar ruangan.</p>

<h3>Kapan waktu terbaik menggunakan lotion ini?</h3>
<p>Gunakan merata ke seluruh tubuh setiap selesai mandi pagi dan sore. Di siang hari, Anda dapat mengulangi pemakaian terutama jika banyak terpapar sinar matahari langsung atau berada di ruangan ber-AC.</p>

<h3>Apakah teksturnya lengket atau meninggalkan bercak putih (white cast)?</h3>
<p>Tidak. Formulanya dirancang ringan, mudah diratakan, cepat meresap ke lapisan kulit, dan tidak meninggalkan rasa lengket ataupun residu abu-abu di pakaian.</p>

<h2>3. Brightening Body Cream Grape (100gr &amp; 200gr)</h2>
<h3>Apakah Body Cream dibilas atau tanpa dibilas?</h3>
<p>Brightening Body Cream Grape memiliki inovasi <em>dual-action mode</em>:</p>
<ul>
<li><strong>Mode Daily Night Moisturizer (Tanpa Bilas):</strong> Oleskan tipis dan merata pada area tubuh (terutama siku, lutut, tumit yang kasar/kering) setelah mandi malam atau sebelum tidur, lalu biarkan meresap semalaman.</li>
<li><strong>Mode Intensive Body Mask (Bilas):</strong> Oleskan tebal ke area tubuh yang kusam (dapat dipadukan dengan Gold Powder 1:1), diamkan 10–15 menit, lalu bilas hingga bersih.</li>
</ul>

<h3>Apa hero ingredients utamanya?</h3>
<p>Diperkaya Glutathione konsentrat tinggi, Niacinamide, Licorice Extract, Mulberry Extract, dan Glycerin pelembap mendalam (BPOM NA18230100799).</p>

<h2>4. Sabun Mandi (Kefir Collagen Soap &amp; Body Wash)</h2>
<h3>Apakah Sabun Kefir Collagen bisa untuk wajah dan badan?</h3>
<p>Ya! Sabun batang Kefir Collagen 60gr diformulasikan multifungsi untuk wajah dan badan. Untuk badan, busakan dan diamkan selama 2–3 menit agar fermentasi kefir dan collagen meresap, lalu bilas bersih. Untuk wajah, busakan lembut di tangan, usapkan perlahan, dan segera bilas (BPOM NA18211200972).</p>

<h3>Apa keunggulan Bright Glow Body Wash 250ml?</h3>
<p>Sabun mandi cair beraroma tropis menyegarkan dengan kombinasi Niacinamide, Alpha Arbutin, Tranexamic Acid, serta ekstrak susu dan mangga. Membersihkan kotoran dan keringat secara tuntas tanpa membuat kulit terasa kering kesat (BPOM NA18250701893).</p>

<h2>5. Keamanan Umum, Kehamilan, &amp; Usia Pengguna</h2>
<h3>Mulai usia berapa produk Beautyinu dapat digunakan?</h3>
<p>Seluruh produk Beautyinu diformulasikan aman dan ramah kulit untuk pria dan wanita mulai usia <strong>12 tahun ke atas</strong>.</p>

<h3>Apakah aman untuk ibu hamil dan menyusui?</h3>
<p>Produk Beautyinu diformulasikan tanpa bahan berbahaya dan telah tersertifikasi BPOM. Namun, bagi ibu hamil (khususnya trimester pertama) yang memiliki sensitivitas kulit tertentu, disarankan untuk mengonsultasikan dengan dokter spesialis terlebih dahulu.</p>

<h3>Berapa lama hasil pemakaian mulai terlihat?</h3>
<p>Efek kelembapan dan kehalusan kulit terasa seketika setelah penggunaan. Untuk tampilan kulit yang lebih cerah merata, hasil optimal umumnya terlihat dalam 2–4 minggu pemakaian teratur disertai perlindungan pakaian atau sunscreen saat beraktivitas di terik matahari.</p>
`
  },
  {
    id: 'gid://shopify/Page/132654989533',
    handle: 'contact',
    title: 'Contact Us',
    isPublished: true,
    seo: {
      title: 'Contact Us — Layanan Pelanggan Beautyinu',
      description: 'Hubungi Customer Care Beautyinu via WhatsApp dan Email. Layanan konsultasi produk bodycare dan status pengiriman resmi.'
    },
    body: `
<p>Kami siap membantu Anda! Hubungi Customer Care resmi Beautyinu melalui salah satu saluran komunikasi di bawah ini untuk konsultasi produk, pertanyaan pesanan, maupun peluang kerja sama.</p>

<h2>Saluran Layanan Pelanggan (Customer Support)</h2>
<ul>
<li><strong>WhatsApp Layanan Konsumen (Fast Response):</strong> <a href="https://wa.me/6287777118186" target="_blank" rel="noopener noreferrer"><strong>+62 877-7711-8186</strong></a> (Konsultasi pemakaian, status pengiriman pesanan, dan kendala produk).</li>
<li><strong>WhatsApp Kemitraan, Afiliasi &amp; Komunitas:</strong> <a href="https://wa.me/6281936574690" target="_blank" rel="noopener noreferrer"><strong>+62 819-3657-4690</strong></a> (Program Brightygengs, Distributor, Reseller, dan Kerjasama Bisnis).</li>
<li><strong>Email Resmi:</strong> <a href="mailto:support@beautyinu.id"><strong>support@beautyinu.id</strong></a> / <a href="mailto:hello@beautyinu.id"><strong>hello@beautyinu.id</strong></a></li>
</ul>

<h2>Jam Operasional</h2>
<p>Tim layanan pelanggan kami beroperasi aktif pada:</p>
<ul>
<li><strong>Senin – Sabtu:</strong> 09.00 – 18.00 WIB</li>
<li><strong>Minggu &amp; Hari Libur Nasional:</strong> Pengiriman dan layanan pesan terbatas (Slow Response).</li>
</ul>

<h2>Media Sosial Resmi</h2>
<p>Ikuti update kampanye, edukasi bodycare harian, dan promo eksklusif kami:</p>
<ul>
<li><strong>Instagram:</strong> <a href="https://instagram.com/beautyinu.id" target="_blank" rel="noopener noreferrer">@beautyinu.id</a> &amp; <a href="https://instagram.com/beautyinucastle" target="_blank" rel="noopener noreferrer">@beautyinucastle</a></li>
<li><strong>TikTok:</strong> <a href="https://tiktok.com/@beautyinu.official" target="_blank" rel="noopener noreferrer">@beautyinu.official</a></li>
</ul>

<h2>Kantor &amp; Perusahaan</h2>
<p><strong>CV. DINARE ANUGRAH KOSMETIKA</strong><br />
Produsen Resmi Produk Perawatan Tubuh Beautyinu<br />
Surabaya, Jawa Timur, Indonesia</p>
`
  },
  {
    id: 'gid://shopify/Page/138083598557',
    handle: 'shipping-returns',
    title: 'Shipping & Returns Policy',
    isPublished: true,
    seo: {
      title: 'Kebijakan Pengiriman & Garansi Retur — Beautyinu',
      description: 'Informasi pengiriman JNE, SiCepat, J&T, estimasi tiba kota besar 1-3 hari, serta garansi retur produk rusak 100% ganti baru dengan video unboxing.'
    },
    body: `
<p>Komitmen kami adalah memastikan setiap paket pesanan Anda tiba dengan aman, cepat, dan dalam kondisi terbaik.</p>

<h2>1. Kebijakan &amp; Jadwal Pengiriman</h2>
<ul>
<li><strong>Standar Pengemasan Aman:</strong> Setiap pesanan dikemas menggunakan lapisan pelindung <em>bubble wrap</em> tebal dan kardus kokoh tanpa dikenakan biaya tambahan.</li>
<li><strong>Waktu Pemrosesan:</strong> Pesanan yang pembayaran atau konfirmasinya berhasil sebelum pukul 14.00 WIB akan diserahkan ke pihak ekspedisi pada hari yang sama (Senin – Sabtu).</li>
<li><strong>Pilihan Ekspedisi:</strong> Kami bekerja sama dengan kurir terpercaya seperti JNE, SiCepat, J&amp;T, Lion Parcel, dan Anteraja.</li>
</ul>

<h2>2. Estimasi Waktu Tiba</h2>
<table>
<thead>
<tr>
<th>Wilayah Pengiriman</th>
<th>Estimasi Tiba (Hari Kerja)</th>
</tr>
</thead>
<tbody>
<tr>
<td>Pulau Jawa &amp; Kota Besar</td>
<td>1 – 3 Hari</td>
</tr>
<tr>
<td>Luar Pulau Jawa (Sumatera, Bali, NTB, Kalimantan, Sulawesi)</td>
<td>3 – 6 Hari</td>
</tr>
<tr>
<td>Wilayah Timur (Maluku, Papua &amp; Daerah Pelosok)</td>
<td>5 – 9 Hari</td>
</tr>
<tr>
<td>Pengiriman Regional (Malaysia &amp; Singapura)</td>
<td>5 – 10 Hari</td>
</tr>
</tbody>
</table>
<p><em>*Catatan: Pada periode puncak diskon (seperti Payday atau tanggal kembar 11.11 / 12.12), estimasi pengiriman ekspedisi dapat mengalami penyesuaian 1-2 hari kerja.</em></p>

<h2>3. Pelacakan Nomor Resi</h2>
<p>Setelah pesanan diserahkan ke pihak logistik, nomor resi otomatis dikirimkan ke alamat email dan/atau nomor WhatsApp yang Anda daftarkan saat checkout. Anda dapat memantau posisi paket secara <em>real-time</em> melalui tautan pelacakan yang diberikan.</p>

<h2>4. Garansi Produk &amp; Kebijakan Retur (Pengembalian)</h2>
<p>Kepuasan dan kenyamanan berbelanja Anda adalah prioritas utama kami. Kami memberikan garansi penggantian produk 100% baru jika Anda menerima pesanan dalam kondisi rusak atau tidak sesuai:</p>

<h3>Syarat &amp; Ketentuan Klaim:</h3>
<ol>
<li><strong>Video Unboxing Lengkap:</strong> Pembeli wajib merekam video pembukaan paket secara utuh (unbroken video) mulai dari memperlihatkan label resi, kondisi paket luar yang masih tersegel, hingga produk dikeluarkan dan diperiksa.</li>
<li><strong>Batas Waktu Klaim:</strong> Laporan kendala wajib diajukan maksimal <strong>2 x 24 jam</strong> sejak status nomor resi tercatat "Diterima / Delivered".</li>
<li><strong>Kondisi yang Mendapat Penggantian:</strong>
<ul>
<li>Produk mengalami kerusakan fisik saat transit (botol pecah, bocor parah, segel rusak).</li>
<li>Varian produk yang diterima berbeda dengan rincian pesanan.</li>
<li>Jumlah produk yang diterima kurang dari pesanan invoice.</li>
</ul>
</li>
</ol>

<h3>Langkah Pengajuan Retur:</h3>
<p>Hubungi Customer Care Beautyinu melalui WhatsApp di <a href="https://wa.me/6287777118186" target="_blank" rel="noopener noreferrer"><strong>+62 877-7711-8186</strong></a> atau email ke <strong>support@beautyinu.id</strong> dengan format:</p>
<ul>
<li>Nama Pemesan:</li>
<li>Nomor Invoice / Order ID:</li>
<li>Video Unboxing &amp; Foto Kendala:</li>
</ul>
<p>Tim Customer Care kami akan memverifikasi dan mengirimkan produk pengganti baru secepatnya tanpa membebani biaya tambahan kepada pelanggan.</p>
`
  }
];

console.log(`Starting update for ${pagesData.length} pages without any <hr> tags and with full SEO metafields...\n`);

const mutation = `
  mutation pageUpdate($id: ID!, $page: PageUpdateInput!) {
    pageUpdate(id: $id, page: $page) {
      page {
        id
        title
        handle
        isPublished
      }
      userErrors {
        field
        message
      }
    }
  }
`;

for (let i = 0; i < pagesData.length; i++) {
  const p = pagesData[i];
  console.log(`[${i + 1}/${pagesData.length}] Updating Page: "${p.title}" (handle: ${p.handle})`);

  const pageInput = {
    title: p.title,
    body: p.body.trim(),
    isPublished: p.isPublished,
    metafields: [
      {
        namespace: 'global',
        key: 'title_tag',
        value: p.seo.title,
        type: 'string'
      },
      {
        namespace: 'global',
        key: 'description_tag',
        value: p.seo.description,
        type: 'string'
      }
    ]
  };

  const varsPath = '/tmp/shopify_page_clean_vars.json';
  const queryPath = '/tmp/shopify_page_clean_query.graphql';
  fs.writeFileSync(varsPath, JSON.stringify({ id: p.id, page: pageInput }));
  fs.writeFileSync(queryPath, mutation);

  try {
    const cmd = `npx shopify store execute --store ${store} --query-file "${queryPath}" --variable-file "${varsPath}" --allow-mutations --json`;
    const res = JSON.parse(execSync(cmd, { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }));

    if (res.pageUpdate?.userErrors?.length > 0) {
      console.error(`  ❌ User errors:`, res.pageUpdate.userErrors);
    } else {
      console.log(`  ✓ Successfully updated: "${res.pageUpdate?.page?.title}" (handle: ${res.pageUpdate?.page?.handle})`);
    }
  } catch (err) {
    console.error(`  ❌ Failed pageUpdate:`, err.message);
  }
}

// Save local copy
const localPagesFile = __dirname + '/pages/pages-cleaned-2026-09-16.json';
fs.writeFileSync(localPagesFile, JSON.stringify(pagesData, null, 2));
console.log(`\nLocal copy saved to: ${localPagesFile}`);

// Clean up
try {
  fs.unlinkSync('/tmp/shopify_page_clean_vars.json');
  fs.unlinkSync('/tmp/shopify_page_clean_query.graphql');
} catch (_) {}

console.log(`\nAll pages updated cleanly without <hr> tags!`);
