const fs = require('fs');
const { execSync } = require('child_process');

const store = 'p1d3wg-6i.myshopify.com';
const cwd = '/Users/ongki';

function executeGraphQL(query, variables = {}) {
  const varsPath = '/tmp/shopify_clean_vars.json';
  const queryPath = '/tmp/shopify_clean_query.graphql';
  fs.writeFileSync(varsPath, JSON.stringify(variables));
  fs.writeFileSync(queryPath, query);

  const cmd = `npx shopify store execute --store ${store} --query-file "${queryPath}" --variable-file "${varsPath}" --allow-mutations --json`;
  const raw = execSync(cmd, { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const parsed = JSON.parse(raw);
  return parsed.data || parsed;
}

const pageUpdateMutation = `
  mutation UpdatePage($id: ID!, $page: PageUpdateInput!) {
    pageUpdate(id: $id, page: $page) {
      page { id title handle }
      userErrors { field message }
    }
  }
`;

const articleUpdateMutation = `
  mutation UpdateArticle($id: ID!, $article: ArticleUpdateInput!) {
    articleUpdate(id: $id, article: $article) {
      article { id title summary tags }
      userErrors { field message }
    }
  }
`;

const metafieldsSetMutation = `
  mutation SetMetafields($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { id key value }
      userErrors { field message }
    }
  }
`;

// ==========================================
// 1. PAGES DEFINITION (NATURAL TITLES & CLEAN COPY)
// ==========================================
const pagesData = [
  {
    id: 'gid://shopify/Page/138083533021',
    cleanTitle: 'About',
    seo: {
      title: 'About Beautyinu — Your Bodycare Bestie',
      description: 'Kenali Beautyinu dari CV. Dinare Anugrah Kosmetika. Filosofi glow with confidence, komunitas Moonbabies, Brightygengs, distributor resmi, dan komitmen BPOM.'
    },
    body: `
<p><strong>Your Bodycare Bestie untuk Kulit Bersih, Sehat, dan Glowing Terawat.</strong></p>

<h2>Tentang Beautyinu</h2>
<p>Beautyinu adalah brand beauty dan bodycare lokal di bawah naungan <strong>CV. DINARE ANUGRAH KOSMETIKA</strong> yang berbasis di Surabaya, Jawa Timur. Kami hadir untuk menemani perjalanan setiap perempuan Indonesia dalam merawat diri dengan cara yang lebih menyenangkan (<em>fun</em>), praktis, dan percaya diri.</p>
<p>Kami percaya bahwa merawat diri bukan tentang mengejar standar kecantikan yang kaku atau mahal, melainkan tentang memiliki kulit yang bersih, sehat terhidrasi, merasa nyaman dengan diri sendiri, serta merayakan keunikan setiap individu. Karena itu, Beautyinu menghadirkan rangkaian perawatan tubuh harian yang mudah digunakan, mulai dari sabun mandi kaya nutrisi, body lotion jumbo ber-UV Filter, krim tubuh bernutrisi tinggi, hingga serbuk booster pencerah inovatif.</p>

<h2>Our Belief</h2>
<blockquote>
<p><strong>"Glow with confidence, grow with kindness."</strong></p>
</blockquote>
<p>Bagi kami, kecantikan sejati adalah tentang keberanian untuk merawat diri, merasa lebih baik, dan tumbuh menjadi versi diri yang paling percaya diri. Cantik tidak harus rumit dan tidak harus mahal. Kami ingin setiap produk, kampanye, dan inisiatif Beautyinu dapat memberikan manfaat nyata yang berkelanjutan—baik untuk kesehatan kulit, rasa percaya diri, komunitas pendukung kami, maupun lingkungan sekitar.</p>

<h2>Komitmen Kualitas &amp; Legalitas BPOM</h2>
<p>Setiap produk Beautyinu dikembangkan melalui riset mendalam dengan memprioritaskan keamanan jangka panjang:</p>
<ul>
<li><strong>100% Ternotifikasi Resmi BPOM:</strong> Seluruh formula terdaftar resmi di Badan Pengawas Obat dan Makanan Republik Indonesia.</li>
<li><strong>Bahan Aktif Teruji Klinis:</strong> Menggabungkan Niacinamide konsentrat tinggi, Alpha Arbutin, Glutathione, Tranexamic Acid, Kakadu Plum alami, Shea Butter, dan Botanical Oils.</li>
<li><strong>Bebas Bahan Berbahaya:</strong> Bebas merkuri, bebas hidrokuinon, dan tidak meninggalkan efek warna abu-abu (<em>no ashy cast</em>).</li>
<li><strong>Ramah Kulit (Usia 12+):</strong> Diformulasikan lembut dan aman digunakan mulai usia 12 tahun ke atas untuk semua jenis kulit (pria &amp; wanita).</li>
</ul>

<h2>Beautyinu Programs — Ruang Tumbuh Bersama</h2>
<p>Beautyinu bukan sekadar brand perawatan tubuh, melainkan ekosistem untuk bertumbuh bersama melalui 4 program utama:</p>

<h3>1. Moonbabies (Community &amp; Social Movement)</h3>
<p>Moonbabies adalah program komunitas dan gerakan sosial dari Beautyinu yang berfokus pada workshop keterampilan, edukasi self-care, pemberdayaan perempuan, kepedulian lingkungan, serta aksi berbagi kepada masyarakat yang membutuhkan. Glow yang sesungguhnya bukan hanya terlihat dari luar, melainkan terpancar dari kebaikan yang kita bagikan.</p>
<p><strong>Benefit Anggota:</strong> Free workshop berkala, produk gratis, dan peningkatan wawasan diri (upgrading skills).</p>
<p><strong>Cara Bergabung:</strong> Follow akun Instagram resmi <a href="https://instagram.com/beautyinu.id" target="_blank" rel="noopener noreferrer">@beautyinu.id</a> dan <a href="https://instagram.com/beautyinucastle" target="_blank" rel="noopener noreferrer">@beautyinucastle</a>, lalu isi formulir pendaftaran komunitas.</p>
<p><a href="https://forms.gle/RBM26oTsz1jEgrae8" target="_blank" rel="noopener noreferrer">Daftar Program Moonbabies melalui Google Form resmi</a></p>

<h3>2. Brightygengs (Creator &amp; Affiliate Ambassador)</h3>
<p>Brightygengs adalah ruang kolaborasi untuk para beauty enthusiast, pengguna setia, dan content creator yang ingin mendapatkan penghasilan tambahan serta berkembang di dunia digital melalui cerita inspiratif glow up dan review jujur.</p>
<p><strong>Benefit Anggota:</strong> Free sample produk terbaru, komisi afiliasi menarik, dan tips pembuatan konten viral.</p>
<p><a href="https://wa.me/6281936574690?text=Halo%20Admin%2C%20saya%20tertarik%20bergabung%20dengan%20Brightygengs%20Beautyinu" target="_blank" rel="noopener noreferrer">Gabung Komunitas Brightygengs via WhatsApp (+62 819-3657-4690)</a></p>

<h3>3. Official Distributor &amp; Reseller Program</h3>
<p>Kami membuka peluang kemitraan resmi bagi pelaku usaha, toko kosmetik, reseller, dan distributor di seluruh pelosok Nusantara untuk tumbuh bersama dalam jaringan distribusi resmi Beautyinu.</p>
<p><strong>Dukungan Kemitraan:</strong> Produk dengan permintaan pasar tinggi (fast-moving), tester gratis, materi promosi siap pakai, dan program reward tahunan 2026.</p>
<p><a href="https://wa.me/6281936574690?text=Halo%20Admin%2C%20saya%20tertarik%20bergabung%20menjadi%20Distributor%2FReseller%20Beautyinu" target="_blank" rel="noopener noreferrer">Hubungi Kemitraan Distributor via WhatsApp (+62 819-3657-4690)</a></p>

<h3>4. Birthday Treats (Spesial Hari Ulang Tahunmu)</h3>
<p>Bagi kami, setiap momen spesial pelanggan layak dirayakan. Beautyinu memberikan hadiah produk gratis bagi Anda yang sedang berulang tahun!</p>
<p><strong>Tata Cara Klaim Birthday Treats:</strong></p>
<ol>
<li>Pastikan proses klaim dilakukan tepat pada hari ulang tahun Anda melalui Direct Message Instagram resmi <a href="https://instagram.com/beautyinu.id" target="_blank" rel="noopener noreferrer">@beautyinu.id</a>.</li>
<li>Tunjukkan foto kartu identitas resmi (KTP/Kartu Pelajar) yang masih berlaku.</li>
<li>Tunggu proses verifikasi cepat dari tim Customer Care Beautyinu.</li>
<li>Hadiah produk spesial akan dikirimkan langsung ke alamat rumah Anda (*ongkos kirim ditanggung oleh penerima).</li>
</ol>
<p><a href="https://instagram.com/beautyinu.id" target="_blank" rel="noopener noreferrer">Klaim Hadiah Ulang Tahun via DM Instagram @beautyinu.id</a></p>

<h2>Jelajahi Produk Pilihan Beautyinu</h2>
<p>Mulai rutinitas perawatan tubuh harian Anda bersama produk-produk favorit kami:</p>
<ul>
<li><a href="/collections/all">Katalog Lengkap Seluruh Produk</a></li>
<li><a href="/collections/body-care">Koleksi Perawatan Tubuh (Body Care)</a></li>
<li><a href="/collections/bundles">Paket Hemat Bundling Perawatan Tubuh</a></li>
<li><a href="/collections/best-sellers">Jajaran Produk Terlaris (Best Sellers)</a></li>
</ul>

<p><em>Beautyinu — Your bodycare bestie to glow, grow, and feel confident every day.</em></p>
`
  },
  {
    id: 'gid://shopify/Page/138083565789',
    cleanTitle: 'FAQ',
    seo: {
      title: 'FAQ & Panduan Produk — Beautyinu Official Store',
      description: 'Pertanyaan umum produk Beautyinu: takaran Gold Powder, body lotion UV filter, cara pakai body cream dibilas/tidak, sabun kefir, dan izin resmi BPOM.'
    },
    body: `
<p><strong>Pertanyaan Umum &amp; Panduan Penggunaan Produk Beautyinu.</strong></p>
<p>Temukan jawaban lengkap seputar takaran, cara pemakaian, kompatibilitas bahan, serta legalitas BPOM seluruh lini produk perawatan tubuh kami.</p>

<h2>1. Brightening Booster Gold Powder (25g)</h2>
<h3>Apa itu Brightening Booster Gold Powder?</h3>
<p>Brightening Booster Gold Powder adalah serbuk booster pencerah kulit tubuh multifungsi dengan konsentrasi aktif tinggi. Diformulasikan khusus dengan Niacinamide 5.22%, Alpha Arbutin 2.30%, Kakadu Plum, Glutathione, dan Salicylic Acid untuk membantu mempercepat regenerasi sel kulit dan mencerahkan area tubuh yang kusam serta belang.</p>

<h3>Bisa dicampur dengan body lotion merek apa saja?</h3>
<p>Secara umum bisa dicampurkan dengan berbagai merek body lotion harian. Namun, <strong>dilarang keras</strong> dicampur langsung dengan lotion atau krim yang memiliki konsentrasi bahan aktif eksfoliasi sangat tinggi (AHA di atas 8%, BHA di atas 2%, Retinol di atas 0.5%, atau Vitamin C murni di atas 15%) guna mencegah risiko iritasi kulit.</p>

<h3>Berapa takaran campuran yang disarankan?</h3>
<p>Ada dua metode penggunaan harian:</p>
<ul>
<li><strong>Metode Botol (Praktis):</strong> Larutkan 1 botol penuh (25 gram) ke dalam 1 botol body lotion ukuran 400–750 ml (misalnya Beautyinu Bright Glow Body Lotion), lalu kocok merata. Jika lotion Anda sudah memiliki efek tone up tebal, gunakan setengah botol serbuk terlebih dahulu.</li>
<li><strong>Metode Telapak Tangan (Daily Mix):</strong> Tuang lotion atau krim di telapak tangan secukupnya, taburkan sedikit serbuk booster dengan perbandingan 3:1 (lebih banyak lotion), ratakan, lalu usapkan ke kulit tubuh.</li>
<li><strong>Treatment Mingguan (Masker / Lulur Bilas):</strong> Campurkan serbuk booster dengan Brightening Body Cream Grape atau lulur mandi dengan rasio 1:1. Balurkan merata ke area tubuh yang kusam/kasar, diamkan 10–15 menit, lalu bilas hingga bersih.</li>
</ul>

<h3>Apakah bisa digunakan untuk kulit wajah?</h3>
<p>Bisa digunakan sebagai campuran masker wajah bilas berbasis serbuk (powder mask) sesuai kebutuhan. Karena kulit wajah lebih tipis dan sensitif dibanding badan, wajib lakukan <em>patch test</em> di area rahang bawah terlebih dahulu. <strong>Jangan mencampurkan serbuk booster langsung ke dalam jar pelembap wajah harian.</strong></p>

<h3>Berapa isi bersih dan masa kedaluwarsa produk?</h3>
<p>Isi bersih 25 gram. Masa kedaluwarsa 2 tahun sejak tanggal produksi tertera pada kemasan.</p>

<h3>Apakah sudah terdaftar resmi di BPOM?</h3>
<p>Ya! Brightening Booster Gold Powder telah mengantongi nomor izin edar resmi BPOM NA18240200017, bebas merkuri, bebas hidrokuinon, dan aman digunakan jangka panjang mulai usia 12+.</p>
<p><a href="/products/brightening-booster-gold-powder-25gr">Lihat detail Brightening Booster Gold Powder 25g</a></p>

<h2>2. Bright Glow Body Lotion UV Filter (750ml Jumbo)</h2>
<h3>Apa keunggulan Bright Glow Body Lotion 750ml?</h3>
<p>Body lotion harian ukuran jumbo 750ml ini memadukan UV Filter harian, Tranexamic Acid, Niacinamide, Shea Butter, Multivitamin (B5, E), dan 4-Layer Hyaluronic Complex. Memberikan kelembapan intensif hingga 24 jam sekaligus melindungi kulit dari paparan sinar UV matahari saat beraktivitas di luar ruangan.</p>

<h3>Kapan waktu terbaik menggunakan lotion ini?</h3>
<p>Gunakan merata ke seluruh tubuh setiap selesai mandi pagi dan sore. Di siang hari, Anda dapat mengulangi pemakaian terutama jika banyak terpapar sinar matahari langsung atau berada di ruangan ber-AC.</p>

<h3>Apakah teksturnya lengket atau meninggalkan bercak putih (white cast)?</h3>
<p>Tidak. Formulanya dirancang ringan, mudah diratakan, cepat meresap ke lapisan kulit, dan tidak meninggalkan rasa lengket ataupun residu abu-abu di pakaian.</p>

<h3>Apakah bisa menggantikan fungsi sunscreen tubuh?</h3>
<p>Body lotion ini sudah dibekali UV Filter untuk perlindungan harian normal. Namun, jika Anda beraktivitas intensif di bawah terik matahari pantai atau luar ruangan dalam durasi panjang, tetap disarankan mengombinasikannya dengan sunscreen tubuh tambahan.</p>

<h3>Apakah aman untuk pria, ibu hamil, dan remaja?</h3>
<p>Ya, lotion ini diformulasikan aman dan ramah untuk pria maupun wanita mulai usia 12 tahun ke atas, serta aman untuk ibu hamil dan menyusui (BPOM NA18240103681).</p>
<p><a href="/products/bright-glow-body-lotion-uv-filter-750ml">Lihat detail Bright Glow Body Lotion UV Filter 750ml</a></p>

<h2>3. Brightening Body Cream Grape (100g &amp; 200g)</h2>
<h3>Apakah Body Cream dibilas atau tanpa dibilas?</h3>
<p>Brightening Body Cream Grape memiliki inovasi <em>dual-action mode</em>:</p>
<ul>
<li><strong>Mode Daily Night Moisturizer (Tanpa Bilas):</strong> Oleskan tipis dan merata pada area tubuh (terutama siku, lutut, tumit yang kasar/kering) setelah mandi malam atau sebelum tidur, lalu biarkan meresap semalaman.</li>
<li><strong>Mode Intensive Body Mask (Bilas):</strong> Oleskan tebal ke area tubuh yang kusam (dapat dipadukan dengan Gold Powder rasio 1:1), diamkan 10–15 menit, lalu bilas hingga bersih.</li>
</ul>

<h3>Apa hero ingredients utamanya?</h3>
<p>Diperkaya Glutathione konsentrat tinggi, Niacinamide, Licorice Extract, Mulberry Extract, dan Glycerin pelembap mendalam (BPOM NA18230100799).</p>

<h3>Cocok untuk jenis kulit apa?</h3>
<p>Sangat cocok untuk semua jenis kulit, terutama kulit yang sangat kering, bersisik, belang, atau memiliki area lipatan kasar.</p>
<p><a href="/products/brightening-body-cream-grape">Lihat detail Brightening Body Cream Grape</a></p>

<h2>4. Sabun Mandi (Kefir Collagen Soap &amp; Body Wash)</h2>
<h3>Apakah Sabun Kefir Collagen bisa untuk wajah dan badan?</h3>
<p>Ya! Sabun batang Kefir Collagen 60g diformulasikan multifungsi untuk wajah dan badan. Untuk badan, busakan dan diamkan selama 2–3 menit agar fermentasi kefir dan collagen meresap, lalu bilas bersih. Untuk wajah, busakan lembut di tangan, usapkan perlahan, dan segera bilas bersih (BPOM NA18211200972).</p>

<h3>Bagaimana cara menyimpan sabun batang kefir agar tidak mudah lembek?</h3>
<p>Simpan di tempat sabun yang memiliki lubang saluran air kering dan hindari tergenang air setelah pemakaian agar sabun tetap higienis dan awet.</p>

<h3>Apa keunggulan Bright Glow Body Wash 250ml?</h3>
<p>Sabun mandi cair beraroma tropis menyegarkan (mango &amp; milk) dengan kombinasi Niacinamide, Alpha Arbutin, Tranexamic Acid, serta ekstrak susu alami. Membersihkan kotoran dan keringat secara tuntas tanpa membuat kulit terasa kering kesat (BPOM NA18250701893).</p>
<p><a href="/products/kefir-collagen-soap-60gr">Lihat detail Kefir Collagen Soap Bar 60g</a> | <a href="/products/bright-glow-body-wash-250ml">Lihat detail Bright Glow Body Wash 250ml</a></p>

<h2>5. Panduan Keamanan Umum, Kehamilan, &amp; Usia Pengguna</h2>
<h3>Mulai usia berapa produk Beautyinu dapat digunakan?</h3>
<p>Seluruh produk Beautyinu diformulasikan aman dan ramah kulit untuk pria dan wanita mulai usia <strong>12 tahun ke atas</strong>.</p>

<h3>Apakah aman untuk ibu hamil dan menyusui?</h3>
<p>Produk Beautyinu diformulasikan tanpa merkuri, tanpa hidrokuinon, dan telah tersertifikasi BPOM resmi. Namun, bagi ibu hamil (khususnya trimester pertama) yang memiliki sensitivitas kulit tertentu, disarankan untuk mengonsultasikan dengan dokter spesialis terlebih dahulu.</p>

<h3>Berapa lama hasil pemakaian mulai terlihat?</h3>
<p>Efek kelembapan dan kehalusan kulit terasa seketika setelah penggunaan pertama. Untuk tampilan kulit yang lebih cerah merata, hasil optimal umumnya terlihat dalam 2–4 minggu pemakaian teratur disertai perlindungan pakaian atau sunscreen saat beraktivitas di terik matahari.</p>

<h2>Butuh Bantuan atau Konsultasi Lebih Lanjut?</h2>
<p>Tim Customer Care Beautyinu siap mendampingi perjalanan perawatan kulit Anda:</p>
<p><a href="https://wa.me/6287777118186?text=Halo%20Customer%20Care%20Beautyinu%2C%20saya%20ingin%20konsultasi%20pemakaian%20produk" target="_blank" rel="noopener noreferrer">Konsultasi Pemakaian via WhatsApp (+62 877-7711-8186)</a></p>
<p><a href="/pages/contact">Kunjungi Halaman Kontak Resmi</a></p>
`
  },
  {
    id: 'gid://shopify/Page/132654989533',
    cleanTitle: 'Contact',
    seo: {
      title: 'Contact Us — Layanan Pelanggan Resmi Beautyinu',
      description: 'Hubungi Customer Care Beautyinu via WhatsApp +62 877-7711-8186 dan Email support@beautyinu.id. Konsultasi produk bodycare, info resi, dan kemitraan distributor.'
    },
    body: `
<p><strong>Kami Siap Membantu Anda</strong></p>
<p>Hubungi saluran layanan resmi Beautyinu di bawah ini untuk konsultasi pemilihan produk, panduan pemakaian, pemantauan status pesanan, maupun peluang kerja sama bisnis.</p>

<h2>1. Layanan Pelanggan (Customer Care Fast Response)</h2>
<p>Untuk pertanyaan seputar produk, rekomendasi perawatan tubuh, informasi nomor resi, dan kendala pesanan Anda:</p>
<ul>
<li><strong>WhatsApp Resmi:</strong> <a href="https://wa.me/6287777118186" target="_blank" rel="noopener noreferrer">+62 877-7711-8186</a></li>
<li><strong>Email Bantuan:</strong> <a href="mailto:support@beautyinu.id">support@beautyinu.id</a></li>
</ul>
<p><a href="https://wa.me/6287777118186?text=Halo%20Customer%20Care%20Beautyinu%2C%20saya%20butuh%20bantuan%20terkait%20pesanan%2Fproduk" target="_blank" rel="noopener noreferrer">Hubungi Customer Care via WhatsApp (+62 877-7711-8186)</a></p>

<h2>2. Kemitraan, Afiliasi &amp; Komunitas (Partnership &amp; Business)</h2>
<p>Untuk pendaftaran program Creator Ambassador Brightygengs, peluang keagenan Distributor / Reseller resmi seluruh Indonesia, serta kegiatan komunitas Moonbabies:</p>
<ul>
<li><strong>WhatsApp Kemitraan:</strong> <a href="https://wa.me/6281936574690" target="_blank" rel="noopener noreferrer">+62 819-3657-4690</a></li>
<li><strong>Email Kerjasama:</strong> <a href="mailto:hello@beautyinu.id">hello@beautyinu.id</a></li>
</ul>
<p><a href="https://wa.me/6281936574690?text=Halo%20Admin%20Kemitraan%2C%20saya%20tertarik%20bekerjasama%20dengan%20Beautyinu" target="_blank" rel="noopener noreferrer">Hubungi Tim Kemitraan via WhatsApp (+62 819-3657-4690)</a></p>

<h2>3. Jam Operasional Layanan</h2>
<p>Tim layanan pelanggan kami siap melayani Anda pada:</p>
<ul>
<li><strong>Senin – Sabtu:</strong> 09.00 – 18.00 WIB</li>
<li><strong>Minggu &amp; Hari Libur Nasional:</strong> Pengiriman ekspedisi libur, layanan pesan dibalas terbatas (Slow Response).</li>
</ul>

<h2>4. Media Sosial Resmi</h2>
<p>Dapatkan tips bodycare harian, edukasi kecantikan, dan promo eksklusif melalui kanal resmi kami:</p>
<ul>
<li><strong>Instagram Utama:</strong> <a href="https://instagram.com/beautyinu.id" target="_blank" rel="noopener noreferrer">@beautyinu.id</a></li>
<li><strong>Instagram Komunitas:</strong> <a href="https://instagram.com/beautyinucastle" target="_blank" rel="noopener noreferrer">@beautyinucastle</a></li>
<li><strong>TikTok Resmi:</strong> <a href="https://tiktok.com/@beautyinu.official" target="_blank" rel="noopener noreferrer">@beautyinu.official</a></li>
</ul>

<h2>5. Kantor Produsen &amp; Legalitas</h2>
<p><strong>CV. DINARE ANUGRAH KOSMETIKA</strong><br>
Produsen Resmi Produk Perawatan Tubuh Beautyinu<br>
Surabaya, Jawa Timur, Indonesia</p>
`
  },
  {
    id: 'gid://shopify/Page/138083598557',
    cleanTitle: 'Shipping & Returns',
    seo: {
      title: 'Kebijakan Pengiriman & Garansi Retur — Beautyinu',
      description: 'Informasi pengiriman JNE, SiCepat, J&T tiba 1-3 hari kota besar. Garansi retur 100% ganti baru untuk produk rusak dengan bukti video unboxing.'
    },
    body: `
<p><strong>Komitmen Pengiriman Aman &amp; Garansi Kepuasan Pelanggan.</strong></p>
<p>Kami memastikan setiap paket pesanan Anda dikemas dengan standar keamanan tertinggi dan tiba dalam kondisi sempurna di tempat Anda.</p>

<h2>1. Kebijakan &amp; Jadwal Pengiriman</h2>
<ul>
<li><strong>Standar Pengemasan Aman:</strong> Setiap pesanan dikemas menggunakan lapisan pelindung <em>bubble wrap</em> tebal berlapis dan kardus kokoh tanpa dipungut biaya tambahan.</li>
<li><strong>Waktu Pemrosesan Cepat:</strong> Pembayaran atau pesanan yang terkonfirmasi sebelum pukul <strong>14.00 WIB</strong> akan diserahkan ke pihak ekspedisi pada hari yang sama (Senin – Sabtu).</li>
<li><strong>Mitra Ekspedisi Terpercaya:</strong> Kami bekerja sama dengan kurir pilihan terbaik seperti JNE, SiCepat, J&amp;T, Lion Parcel, dan Anteraja.</li>
</ul>

<h2>2. Estimasi Waktu Tiba Pesanan</h2>
<table>
<thead>
<tr>
<th>Wilayah Pengiriman</th>
<th>Estimasi Tiba (Hari Kerja)</th>
</tr>
</thead>
<tbody>
<tr>
<td>Pulau Jawa &amp; Kota-Kota Besar</td>
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
<p><em>*Catatan: Pada periode promo nasional (Payday atau tanggal kembar 11.11 / 12.12), pihak ekspedisi dapat memerlukan penyesuaian waktu transit 1-2 hari kerja.</em></p>

<h2>3. Pelacakan Nomor Resi</h2>
<p>Setelah paket diserahkan ke kurir, nomor resi pengiriman otomatis dikirimkan ke email dan nomor WhatsApp yang Anda daftarkan saat checkout. Anda dapat melacak keberadaan paket Anda secara langsung (real-time).</p>

<h2>4. Garansi Retur 100% Produk Baru</h2>
<p>Kepuasan Anda adalah prioritas utama Beautyinu. Kami memberikan garansi penggantian produk 100% baru tanpa biaya tambahan jika Anda mengalami salah satu kendala berikut:</p>
<ul>
<li>Produk mengalami kerusakan fisik saat pengiriman (pecah, tumpah, segel rusak parah).</li>
<li>Varian produk yang diterima tidak sesuai dengan invoice pesanan.</li>
<li>Jumlah produk yang diterima kurang dari yang dipesan.</li>
</ul>

<h3>Syarat &amp; Ketentuan Klaim Garansi:</h3>
<ol>
<li><strong>Wajib Video Unboxing:</strong> Rekam video pembukaan paket secara utuh (unbroken video) tanpa jeda/pause, memperlihatkan label resi, kondisi paket luar sebelum dibuka, hingga isi paket dikeluarkan dan diperiksa.</li>
<li><strong>Batas Waktu Pengajuan:</strong> Laporan kendala wajib diajukan maksimal <strong>2 x 24 jam</strong> sejak status nomor resi tercatat "Diterima / Delivered".</li>
</ol>

<h3>Cara Mengajukan Klaim:</h3>
<p>Hubungi tim Customer Care kami melalui WhatsApp atau Email dengan menyertakan Nomor Pesanan, Nama Pemesan, dan Video Unboxing:</p>
<p><a href="https://wa.me/6287777118186?text=Halo%20Admin%2C%20saya%20ingin%20mengajukan%20klaim%20garansi%20retur%20pesanan%20Beautyinu" target="_blank" rel="noopener noreferrer">Ajukan Klaim Retur via WhatsApp Customer Care (+62 877-7711-8186)</a></p>
<p><a href="mailto:support@beautyinu.id?subject=Klaim%20Garansi%20Retur%20Pesanan">Ajukan Klaim Retur via Email (support@beautyinu.id)</a></p>
<p><a href="/pages/contact">Lihat Informasi Kontak Lengkap</a></p>
`
  }
];

// ==========================================
// 2. BLOG ARTICLES DEFINITION (CLEAN EDITORIAL COPY)
// ==========================================
const articlesData = [
  {
    id: 'gid://shopify/Article/597303787741',
    title: 'Tren Skinification: Standar Baru Perawatan Kulit Tubuh di Indonesia',
    summary: 'Tren skinification mendorong konsumen urban menerapkan standar bahan aktif skincare wajah ke seluruh tubuh dengan kandungan Niacinamide dan Glutathione.',
    tags: ['Beautyinu', 'Skinification', 'Body Care', 'Edukasi'],
    imageAlt: 'Tren Skinification Perawatan Kulit Tubuh Indonesia Beautyinu',
    seo: {
      title: 'Tren Skinification Perawatan Tubuh Indonesia — Beautyinu',
      description: 'Ulasan pergeseran tren skinification konsumen urban Indonesia dalam menerapkan standar bahan aktif skincare wajah ke rutinitas perawatan tubuh.'
    },
    body: `
<p>Standar rutinitas kebersihan pribadi masyarakat urban di Indonesia saat ini tengah mengalami pergeseran signifikan seiring masifnya adopsi tren <em>skinification</em>. Fenomena ini merujuk pada pendekatan di mana konsumen mulai sadar menerapkan standar perawatan kulit wajah ke seluruh permukaan tubuh.</p>

<p>Dalam konteks harian, mandi tidak lagi dipandang secara konvensional sebagai sekadar aktivitas dasar untuk membersihkan residu keringat atau debu polusi setelah seharian beraktivitas di luar ruangan. Mandi modern mulai diposisikan strategis sebagai langkah krusial pertama dalam menjaga kesehatan dan kelembapan integritas kulit secara menyeluruh. Perubahan paradigma perilaku ini secara langsung mendorong tuntutan fungsionalitas baru pada sektor produk pembersih tubuh di pasar domestik.</p>

<h2>Evolusi Literasi Bahan Aktif Dermatologi</h2>
<p>Pergeseran preferensi konsumen ini sangat dipengaruhi oleh peningkatan literasi masyarakat terkait fungsi spesifik kandungan bahan aktif dermatologi. Konsumen modern bertahap menyadari bahwa kulit tubuh, yang secara anatomis menutupi area jauh lebih luas dibandingkan wajah, juga rentan terhadap masalah klinis seperti hiperpigmentasi, warna kulit belang, dan paparan radikal bebas lingkungan.</p>

<p>Konsekuensi logis dari tingginya kesadaran tersebut adalah munculnya lonjakan permintaan pasar terhadap produk pembersih harian yang memuat komponen spesifik seperti <strong>Niacinamide</strong>, <strong>Alpha Arbutin</strong>, dan <strong>Tranexamic Acid</strong>. Ketiga komponen tersebut selama beberapa dekade terakhir dikenal mendominasi formulasi serum wajah karena efektivitas teknisnya yang telah teruji dalam meratakan warna kulit.</p>

<h2>Solusi Perawatan Praktis bagi Masyarakat Perkotaan</h2>
<p>Di sisi lain, tingginya mobilitas masyarakat perkotaan senantiasa berbanding lurus dengan tuntutan solusi perawatan mandiri yang efisien secara waktu. Publik membutuhkan komoditas harian yang mampu menjembatani tingginya kebutuhan perawatan tubuh berstandar klinis tinggi, tanpa harus menambah beban durasi rutinitas berlebihan.</p>

<p>Kesenjangan empiris antara tingginya kesadaran perawatan berbahan aktif dan ketatnya tuntutan kepraktisan inilah yang memicu inovasi produk pembersih tubuh cair. Penggunaan bahan fungsional pada tahap awal pencucian dinilai sangat efektif mempersiapkan kondisi permukaan kulit, sehingga mengoptimalkan rasio laju penyerapan produk lanjutan seperti penggunaan losion pelembap setelah fase mandi.</p>

<h2>Bright Glow Body Wash: Inovasi Pembersih Berizin Resmi BPOM</h2>
<p>Merespons secara presisi terhadap dinamika pergeseran permintaan pasar tersebut, merek kecantikan lokal Beautyinu menghadirkan lini <strong>Bright Glow Body Wash</strong>. Formulasi ini sengaja diposisikan untuk mengisi segmen pasar konsumen yang mencari kepraktisan perawatan tubuh berbasis bahan aktif melalui satu langkah pencucian harian.</p>

<p>Sabun cair ini mengintegrasikan kombinasi formulasi Niacinamide, Alpha Arbutin, serta Tranexamic Acid. Guna mengamankan aspek kepatuhan operasional terhadap regulasi negara, produk kosmetik ini telah didaftarkan dan divalidasi oleh Badan Pengawas Obat dan Makanan (BPOM) dengan nomor registrasi <strong>NA18250701893</strong> untuk menjamin standar mutlak keamanan distribusi komersial.</p>

<h2>Pendekatan Fungsional dan Keamanan Jangka Panjang</h2>
<blockquote>
<p>"Pendekatan fungsional kami secara tegas difokuskan pada target optimalisasi tahap pembersihan dasar. Penambahan tiga komponen aktif pada sabun cair ini bertujuan agar pertahanan pelindung kulit stabil sebelum menerima suplai hidrasi dari losion. Spesifikasi molekuler ini juga diuji relevan bagi pemakaian harian remaja usia 12 tahun ke atas, kelompok ibu hamil, serta populasi ibu menyusui," jelas <strong>Nia Laviana</strong>, perwakilan resmi Beautyinu.</p>
</blockquote>

<p>Realitas pasar ini merepresentasikan adaptasi industri kosmetik dalam merespons eskalasi tuntutan efisiensi dan keamanan konsumen modern saat ini.</p>

<h2>Rekomendasi Produk Terkait</h2>
<ul>
<li><a href="/collections/body-care">Jelajahi seluruh koleksi Body Care Beautyinu</a></li>
<li><a href="/products/bright-glow-body-wash-250ml">Lihat detail Bright Glow Body Wash 250ml</a></li>
</ul>
`
  },
  {
    id: 'gid://shopify/Article/597304639709',
    title: 'Beautyinu Catat Penjualan 1 Juta Produk di Tengah Tren Bodycare Racikan',
    summary: 'Beautyinu mencatat rekor penjualan 1 juta produk didorong oleh tingginya antusiasme konsumen terhadap tren meracik bodycare menggunakan Booster Gold Powder.',
    tags: ['Beautyinu', 'Brightening Booster Gold Powder', 'Tren Kecantikan', 'Berita'],
    imageAlt: 'Pencapaian Penjualan 1 Juta Produk Beautyinu Skincare',
    seo: {
      title: 'Beautyinu Raih 1 Juta Penjualan Produk Bodycare — Beautyinu',
      description: 'Pencapaian penjualan 1 juta produk Beautyinu seiring tren penggunaan racikan booster pencerah kulit tubuh yang efektif dan terdaftar resmi BPOM.'
    },
    body: `
<p>Pergeseran perilaku dan preferensi konsumen kecantikan di kawasan perkotaan maupun regional Indonesia menunjukkan terbentuknya tren baru secara masif pada pertengahan tahun 2026. Konsumen masa kini tidak lagi bergantung secara eksklusif pada satu lini produk perawatan tubuh (<em>bodycare</em>) utuh, melainkan mulai beralih menuju tren personalisasi atau <em>customized bodycare</em>.</p>

<p>Pendekatan mandiri ini memungkinkan masyarakat meracik produk perawatannya dengan menambahkan bahan aktif pelengkap ke dalam sediaan pelembap, sabun, maupun lulur sesuai kebutuhan spesifik kondisi kulit mereka sehari-hari.</p>

<h2>Literasi Konsumen &amp; Efisiensi Produk Personalisasi</h2>
<p>Tren meracik kosmetik mandiri ini sejalan dengan peningkatan indeks literasi konsumen mengenai fungsi bahan aktif kosmetik. Fleksibilitas serta kepraktisan pemakaian menjadi alasan utama mengapa masyarakat mengadopsi metode ini secara rutin.</p>

<p>Daripada harus membeli beragam produk terpisah untuk mengatasi masalah kulit tubuh yang bervariasi, konsumen memilih mencampurkan konsentrat bahan aktif ke dalam produk dasar yang sudah mereka miliki. Metode ini dinilai lebih efisien dari sisi alokasi pengeluaran finansial, sekaligus memberikan keleluasaan dalam mengatur takaran intensitas perawatan sesuai target hasil yang ingin dicapai.</p>

<h2>Brightening Booster Gold Powder: Pendorong 1 Juta Penjualan</h2>
<p>Fenomena pergeseran tren pasar tersebut terkonfirmasi nyata melalui pencapaian volume penjualan merek perawatan tubuh lokal Beautyinu. Merek yang berbasis di Surabaya ini mencatatkan rekor pencapaian penjualan akumulatif yang menembus angka <strong>1 juta produk</strong> di seluruh jaringan pasar komersial mereka.</p>

<p>Pendorong utama dari tingginya angka penyerapan pasar tersebut bersumber dari tingginya permintaan terhadap lini <strong>Brightening Booster Gold Powder</strong>. Produk ini hadir dalam bentuk serbuk pencerah konsentrat yang dirancang khusus untuk dicampurkan langsung ke dalam losion tubuh harian maupun krim pelembap malam.</p>

<h2>Formulasi Konsentrat Tinggi &amp; Sertifikasi BPOM</h2>
<p>Daya tarik utama produk ini terletak pada formula bahan aktifnya yang memadukan <strong>Kakadu Plum Extract</strong> sebagai sumber Vitamin C alami berdaya antioksidan tinggi, konsentrasi <strong>Niacinamide</strong>, serta <strong>Alpha Arbutin</strong>. Bentuk sediaan serbuk terbukti menjaga kestabilan potensi bahan aktif pencerah dari risiko degradasi oksidasi udara jika dibandingkan dengan sediaan cair konvensional.</p>

<p>Untuk memastikan rasa aman konsumen di tengah maraknya peredaran kosmetik oplosan berbahaya, Beautyinu memastikan seluruh produknya telah teruji secara dermatologis dan mengantongi izin edar resmi dari Badan Pengawas Obat dan Makanan (BPOM) Republik Indonesia dengan nomor notifikasi <strong>NA18231900224</strong> (dan <strong>NA18240200017</strong> untuk varian terbaru), menjamin formulasi 100% bebas merkuri dan hidrokuinon.</p>

<h2>Edukasi Takaran &amp; Prosedur Patch Test</h2>
<blockquote>
<p>"Pencapaian 1 juta produk ini bukan sekadar metrik angka penjualan, melainkan cerminan kepercayaan konsumen terhadap solusi cerdas yang aman. Kami selalu mengedukasi konsumen untuk tetap mengikuti panduan takaran yang dianjurkan (rasio 3:1 untuk losion harian) dan melakukan patch test terlebih dahulu guna memastikan kenyamanan kulit," jelas tim riset dan pengembangan Beautyinu.</p>
</blockquote>

<h2>Rekomendasi Produk Terkait</h2>
<ul>
<li><a href="/products/brightening-booster-gold-powder-25gr">Lihat detail Brightening Booster Gold Powder 25g</a></li>
<li><a href="/collections/best-sellers">Lihat jajaran produk terlaris (Best Sellers) Beautyinu</a></li>
<li><a href="/pages/faq">Baca panduan takaran lengkap di halaman FAQ</a></li>
</ul>
`
  },
  {
    id: 'gid://shopify/Article/597304672477',
    title: 'Tren Wellness Holistik: Integrasi Perawatan Tubuh & Aktivitas Luar Ruang',
    summary: 'Perawatan tubuh modern bertransformasi menjadi gaya hidup aktif di luar ruang dengan mengutamakan proteksi UV Filter dan hidrasi kulit optimal.',
    tags: ['Beautyinu', 'Body Care', 'Gaya Hidup', 'Wellness'],
    imageAlt: 'Perawatan Tubuh Holistik Aktivitas Luar Ruang Bersama Beautyinu',
    seo: {
      title: 'Perawatan Tubuh Holistik & Aktivitas Luar Ruang — Beautyinu',
      description: 'Evolusi perawatan tubuh holistik yang menyatukan gaya hidup aktif luar ruang dengan proteksi UV Filter dan hidrasi intensif Beautyinu.'
    },
    body: `
<p>Fenomena gaya hidup sehat dan kesadaran akan <em>wellness</em> di kalangan perempuan urban Indonesia terus mengalami pergeseran yang cukup signifikan sepanjang tahun ini. Praktik perawatan diri pada masa kini tidak lagi hanya terpusat pada penggunaan produk kosmetik di depan cermin atau di dalam ruangan tertutup.</p>

<p>Praktik tersebut kini mulai terintegrasi secara kuat dengan aktivitas fisik di luar ruang serta keterlibatan aktif dalam sebuah komunitas yang saling mendukung.</p>

<h2>Sinergi Komunitas &amp; Aktivitas Luar Ruang</h2>
<p>Menjawab pergeseran perilaku konsumen yang dinamis tersebut, Beautyinu menginisiasi program berbasis komunitas yang menggabungkan edukasi perawatan tubuh holistik dengan olahraga aktif di alam terbuka.</p>

<p>Inisiatif ini dirancang sebagai wadah interaktif bagi para konsumen dan penggiat self-care untuk merasakan pengalaman langsung merawat kulit di tengah paparan cuaca tropis, sekaligus memperkuat keterikatan emosional antaranggota komunitas pecinta kesehatan tubuh.</p>

<h2>Tantangan Paparan Radiasi UV Tropis &amp; Polusi</h2>
<p>Beraktivitas di luar ruangan di kawasan tropis seperti Indonesia membawa tantangan tersendiri bagi kesehatan pelindung kulit (<em>skin barrier</em>). Kombinasi paparan sinar ultraviolet matahari (UVA &amp; UVB), suhu udara panas, kelembapan tinggi, serta polusi partikulat debu rentan memicu dehidrasi kulit, sensasi terbakar, dan penuaan dini.</p>

<p>Oleh karena itu, rutinitas perawatan tubuh pra dan pasca-aktivitas luar ruangan memerlukan perlindungan ganda: hidrasi intensif yang mengunci kelembapan alami, serta lapisan pelindung filter UV yang mampu membiaskan sengatan terik matahari tanpa membebani pori-pori kulit.</p>

<h2>Bright Glow Body Lotion Jumbo: Proteksi UV Harian</h2>
<p>Dalam mendukung gaya hidup aktif tersebut, Beautyinu menghadirkan <strong>Bright Glow Body Lotion UV Filter</strong> dalam kemasan jumbo <strong>750ml</strong>. Diformulasikan khusus dengan spektrum UV Filter harian, <strong>Tranexamic Acid</strong>, <strong>Niacinamide</strong>, serta <strong>Shea Butter</strong>, losion ini memberikan kenyamanan maksimal bagi pengguna yang aktif di luar ruang.</p>

<p>Teksturnya yang ringan, cepat meresap, dan tidak meninggalkan rasa lengket ataupun residu warna abu-abu (<em>no ashy cast</em>) menjadikannya pilihan ideal untuk pemakaian berulang sepanjang hari di bawah terik matahari.</p>

<h2>Membangun Budaya Perawatan Diri Berkelanjutan</h2>
<blockquote>
<p>"Kecantikan sejati adalah tentang merasa nyaman, sehat, dan berenergi saat bergerak aktif di dunia nyata. Melalui kolaborasi antara aktivitas fisik dan edukasi proteksi kulit yang tepat, kami ingin perempuan Indonesia dapat menikmati keindahan alam dengan penuh percaya diri tanpa rasa cemas akan kerusakan kulit," ungkap perwakilan manajemen Beautyinu.</p>
</blockquote>

<h2>Rekomendasi Produk Terkait</h2>
<ul>
<li><a href="/products/bright-glow-body-lotion-uv-filter-750ml">Lihat detail Bright Glow Body Lotion UV Filter 750ml</a></li>
<li><a href="/collections/body-care">Rangkaian lengkap proteksi tubuh harian Beautyinu</a></li>
</ul>
`
  },
  {
    id: 'gid://shopify/Article/597304738013',
    title: 'Program Sosial Glow & Grow: Menjunjung Etika Dokumentasi Empatik',
    summary: 'Melalui payung gerakan sosial Moonbabies, Beautyinu menerapkan etika dokumentasi empatik yang menjaga martabat dan privasi penerima manfaat.',
    tags: ['Beautyinu', 'Moonbabies', 'CSR', 'Sosial'],
    imageAlt: 'Program Sosial Glow and Grow Komunitas Beautyinu',
    seo: {
      title: 'Etika Dokumentasi Empatik Program Sosial — Beautyinu',
      description: 'Komitmen Beautyinu dalam menerapkan etika dokumentasi empatik pada program sosial Moonbabies demi menjaga martabat dan privasi penerima manfaat.'
    },
    body: `
<p>Pendekatan Tanggung Jawab Sosial Perusahaan (CSR) di sektor industri gaya hidup dan perawatan jasmani nasional saat ini mulai mengalami pergeseran paradigma secara fundamental. Tingginya sorotan publik serta kritik terhadap gaya dokumentasi konvensional yang mengeksploitasi kerentanan kelompok penerima bantuan kini mendorong percepatan adopsi standar komunikasi yang jauh lebih humanis dan beretika.</p>

<p>Pelaporan kegiatan kemasyarakatan dari sebuah entitas bisnis tidak lagi bisa hanya bertumpu pada seremoni penyerahan donasi semata. Fokus utama pelaporan kini bergeser drastis pada pembuktian metrik transparansi data faktual di lapangan serta penerapan pedoman ketat pengambilan gambar visual guna menjamin perlindungan privasi sasaran program secara komprehensif.</p>

<h2>Pedoman Etika Dokumentasi &amp; Perlindungan Privasi</h2>
<p>Beautyinu melalui payung gerakan sosial <strong>Moonbabies</strong> secara konsisten menerapkan pedoman ketat etika dokumentasi empatik. Setiap materi dokumentasi visual yang dipublikasikan wajib memenuhi standar persetujuan sadar (<em>informed consent</em>) dari individu atau kelompok masyarakat yang terlibat.</p>

<p>Kami menolak praktik dramatisasi kemiskinan atau pamer kebaikan yang berlebihan. Bagi Beautyinu, menjaga martabat, rasa hormat, dan privasi penerima manfaat adalah nilai moral yang jauh lebih penting daripada sekadar pencitraan publik.</p>

<h2>6 Pilar Utama Implementasi Kemanusiaan</h2>
<p>Penerapan etika dokumentasi dan transparansi data tersebut diwujudkan secara konkret melalui enam pilar utama operasional kemanusiaan Beautyinu:</p>

<ul>
<li><strong>Beautyinu Wellness Day:</strong> Program edukasi kebersihan pribadi dan self-care bagi perempuan dan remaja di berbagai komunitas daerah.</li>
<li><strong>Beautyinu Blood Donation Movement:</strong> Aksi donor darah berkala bekerja sama dengan Palang Merah Indonesia untuk mendukung ketersediaan stok darah nasional.</li>
<li><strong>Beautyinu Green Care:</strong> Inisiatif keberlanjutan lingkungan melalui pemilahan sampah plastik dan penanaman pohon di area kritis.</li>
<li><strong>Beautyinu Elderly Care:</strong> Kunjungan sosial, pemeriksaan kesehatan dasar, dan pendampingan interaktif bagi para lansia di panti sosial.</li>
<li><strong>Beautyinu Ramadhan Care:</strong> Penyaluran logistik makanan bergizi dan kebutuhan pokok bagi keluarga prasejahtera selama bulan suci.</li>
<li><strong>Anniver5ary Beautyinu:</strong> Program pemberdayaan keterampilan wirausaha dan pelatihan UMKM mandiri untuk perempuan prasejahtera.</li>
</ul>

<h2>Komitmen Keberlanjutan Manajemen Beautyinu</h2>
<blockquote>
<p>"Bagi Beautyinu, program sosial adalah cara untuk hadir lebih dekat dengan masyarakat dan memahami kebutuhan nyata di sekitar kami. Melalui kegiatan yang berfokus pada kesehatan, lingkungan, dan edukasi, kami ingin memberi manfaat yang relevan dan berkelanjutan. Kami percaya bahwa merawat diri dan peduli pada lingkungan bisa berjalan bersama," ungkap <strong>Dina Revita</strong>, Owner Beautyinu.</p>
</blockquote>

<h2>Pelajari Lebih Lanjut Inisiatif Kami</h2>
<ul>
<li><a href="/pages/about">Kenali program Moonbabies &amp; komunitas Beautyinu</a></li>
<li><a href="https://instagram.com/beautyinu.id" target="_blank" rel="noopener noreferrer">Ikuti dokumentasi sosial di Instagram @beautyinu.id</a></li>
</ul>
`
  },
  {
    id: 'gid://shopify/Article/597304770781',
    title: '7 Urutan Perawatan Tubuh Cuaca Tropis yang Aman untuk Remaja',
    summary: 'Panduan 7 langkah sistematis perawatan kulit tubuh di iklim tropis yang dirancang aman, lembut, dan ramah untuk remaja mulai usia 12 tahun.',
    tags: ['Beautyinu', 'Bright Glow Body Lotion', 'Panduan Remaja', 'Edukasi'],
    imageAlt: '7 Urutan Perawatan Tubuh Tropis Remaja Beautyinu',
    seo: {
      title: '7 Urutan Perawatan Tubuh Tropis untuk Remaja — Beautyinu',
      description: 'Panduan lengkap 7 tahapan perawatan tubuh harian di cuaca tropis yang aman dan efektif bagi remaja mulai usia 12 tahun bersama Beautyinu.'
    },
    body: `
<p>Masa pubertas yang diiringi lonjakan perubahan hormonal serta tingginya intensitas aktivitas fisik di iklim tropis sering memicu permasalahan kulit pada kelompok usia belasan. Peningkatan produksi kelenjar keringat yang bercampur polusi luar ruangan secara terus-menerus rentan menyebabkan permukaan kulit menjadi kusam, kering bersisik, atau terasa lengket tidak nyaman.</p>

<p>Menghadapi kondisi biologis dan lingkungan tersebut, penerapan prosedur perawatan kulit tubuh yang terstruktur menjadi penyelesaian krusial. Pemahaman mengenai tahapan dasar perawatan secara higienis dan praktis mutlak diperlukan guna meminimalisasi risiko iritasi pada pelindung kulit remaja yang masih sensitif.</p>

<h2>7 Tahapan Urutan Perawatan Tubuh Harian</h2>
<p>Berikut adalah 7 urutan langkah perawatan tubuh harian yang direkomendasikan untuk remaja aktif:</p>

<ol>
<li><strong>Pembersihan Kulit Harian:</strong> Mandi 2 kali sehari menggunakan sabun cair berbusa lembut seperti <em>Bright Glow Body Wash</em> atau sabun batang <em>Kefir Collagen Soap Bar</em> untuk meluruhkan keringat, debu, dan bakteri tanpa merusak lapisan kelembapan alami.</li>
<li><strong>Eksfoliasi Lembut (1-2x Sepekan):</strong> Lakukan eksfoliasi berkala menggunakan lulur scrub lembut untuk mengangkat tumpukan sel kulit mati di area leher, siku, dan lutut. Hindari menggosok terlalu keras agar pelindung kulit tetap utuh.</li>
<li><strong>Perawatan Mingguan Tambahan:</strong> Gunakan masker badan atau toner badan sesekali untuk menyegarkan dan melembutkan tekstur kulit tubuh setelah beraktivitas panjang di bawah sinar matahari.</li>
<li><strong>Hidrasi Dasar Pasca-Mandi:</strong> Aplikasikan pelembap tubuh sesaat setelah mandi saat kulit masih dalam kondisi lembap (<em>damp</em>) agar penyerapan bahan aktif hidrasi berlangsung maksimal.</li>
<li><strong>Perawatan Intensif Area Kering:</strong> Gunakan krim tubuh yang lebih pekat seperti <em>Brightening Body Cream Grape</em> pada area lipatan dan bagian tubuh yang cenderung sangat kering, seperti siku, lutut, dan tumit kaki.</li>
<li><strong>Booster Pencerah Tambahan (Opsional):</strong> Untuk area tubuh yang mengalami hiperpigmentasi atau belang akibat sinar matahari, tambahkan sedikit serbuk <em>Brightening Booster Gold Powder</em> ke dalam losion tubuh dengan takaran aman.</li>
<li><strong>Perlindungan UV &amp; Konsistensi:</strong> Pastikan losion tubuh harian dilengkapi UV Filter seperti pada <em>Bright Glow Body Lotion UV Filter 750ml</em> dan gunakan secara teratur setiap hari.</li>
</ol>

<h2>Prinsip Keamanan Biologis Kulit Remaja</h2>
<blockquote>
<p>"Strategi pengembangan lini perawatan tubuh kami murni didasarkan pada kebutuhan fungsi biologis kulit remaja. Rangkaian produk ini dirancang secara sistematis agar pengguna dapat langsung mengaplikasikan urutan perawatan dari tahap pembersihan hingga hidrasi dasar dengan aman, tanpa mengeksploitasi kulit menggunakan bahan aktif berlebih," jelas <strong>Crusita N. B</strong>, Head Marketing Beautyinu.</p>
</blockquote>

<h2>Verifikasi Izin BPOM &amp; Uji Tempel (Patch Test)</h2>
<p>Sebagai indikator keamanan paling utama, selalu pastikan setiap produk yang digunakan telah mengantongi nomor notifikasi resmi dari Badan Pengawas Obat dan Makanan (BPOM) Republik Indonesia, sebagaimana seluruh lini produk Beautyinu yang telah tersertifikasi resmi bebas merkuri dan hidrokuinon.</p>

<p>Bagi pemilik kulit sensitif, lakukan uji tempel (<em>patch test</em>) pada area kecil di lengan bagian dalam selama 24 jam sebelum menggunakan produk baru secara menyeluruh.</p>

<h2>Panduan &amp; Produk Rekomendasi</h2>
<ul>
<li><a href="/pages/faq">Baca panduan takaran dan pemakaian di halaman FAQ</a></li>
<li><a href="/collections/bundles">Lihat pilihan paket bundling hemat perawatan tubuh</a></li>
<li><a href="/products/bright-glow-body-lotion-uv-filter-750ml">Lihat detail Bright Glow Body Lotion UV Filter 750ml</a></li>
</ul>
`
  },
  {
    id: 'gid://shopify/Article/597921300701',
    title: 'Program Distributor Resmi Beautyinu: Tumbuh Bersama & Capai Lebih Banyak',
    summary: 'Peluang kemitraan distributor dan reseller resmi Beautyinu dengan produk fast-moving, materi promosi siap pakai, dan sistem pembinaan bisnis transparan.',
    tags: ['Beautyinu', 'Bisnis', 'Distributor', 'Kemitraan'],
    imageAlt: 'Program Kemitraan Distributor Resmi Beautyinu',
    seo: {
      title: 'Peluang Kemitraan Distributor Resmi — Beautyinu',
      description: 'Bergabunglah dalam jaringan distributor resmi Beautyinu dengan margin menarik, materi promosi lengkap, dan dukungan bisnis berkelanjutan.'
    },
    body: `
<p>Beautyinu membuka peluang kemitraan bagi individu, pemilik toko kosmetik, pelaku usaha, dan jaringan penjualan yang ingin mengembangkan bisnis perawatan tubuh bersama brand lokal yang terus bertumbuh pesat.</p>

<p>Program Distributor Beautyinu tidak hanya menawarkan harga grosir khusus. Program ini dirancang sebagai sistem kemitraan terpadu yang membantu setiap mitra membangun pasar, mengembangkan jaringan reseller, menjaga kestabilan harga, dan mencapai target usaha secara lebih terarah dan menguntungkan.</p>

<h2>Mengapa Bergabung Menjadi Distributor Beautyinu?</h2>
<p>Menjadi distributor Beautyinu berarti mendapatkan peluang untuk memasarkan berbagai produk bodycare yang relevan dengan kebutuhan konsumen sehari-hari. Produk Beautyinu dapat dipasarkan melalui toko offline, marketplace, media sosial, komunitas, maupun jaringan reseller daerah.</p>

<p>Setiap mitra mendapat dukungan menyeluruh untuk mempercepat proses penetrasi pasar, antara lain:</p>
<ul>
<li>Materi promosi digital dan visual resolusi tinggi yang siap pakai</li>
<li>Panduan pengetahuan produk (<em>product knowledge</em>) mendalam</li>
<li>Sampel dan tester produk gratis untuk calon pelanggan</li>
<li>Akses eksklusif ke komunitas resmi dan grup koordinasi distributor se-Indonesia</li>
<li>Pelatihan strategi pemasaran digital dan teknik penjualan terkini</li>
</ul>

<h2>Keunggulan Produk Beautyinu di Pasar Domestik</h2>
<ul>
<li><strong>Permintaan Pasar Tinggi (Fast-Moving):</strong> Produk perawatan tubuh harian dengan tingkat pembelian ulang (<em>repeat order</em>) yang sangat konsisten.</li>
<li><strong>100% Resmi BPOM:</strong> Seluruh formula terdaftar resmi di BPOM RI, bebas merkuri, hidrokuinon, dan zat berbahaya.</li>
<li><strong>Kualitas Teruji &amp; Ramah Pengguna:</strong> Menggunakan bahan aktif teruji klinis (Niacinamide, Glutathione, Alpha Arbutin, Kakadu Plum) yang aman untuk usia 12+, ibu hamil, dan menyusui.</li>
<li><strong>Harga Kompetitif:</strong> Menjangkau segmen pasar luas dengan rasio volume kemasan bernilai tinggi (misalnya kemasan lotion jumbo 750ml).</li>
</ul>

<h2>Sistem Kemitraan yang Terarah &amp; Program Reward</h2>
<p>Beautyinu percaya bahwa keberhasilan sebuah brand dibangun di atas pertumbuhan para mitranya. Oleh karena itu, sistem kemitraan kami dirancang dengan aturan perlindungan harga pasar yang ketat guna mencegah perang harga tidak sehat, serta skema insentif reward tahunan yang transparan bagi mitra yang berprestasi mencapai target.</p>

<h2>Cara Bergabung Menjadi Mitra Resmi</h2>
<p>Calon mitra dapat langsung menghubungi tim distributor resmi Beautyinu untuk:</p>
<ul>
<li>Memeriksa ketersediaan wilayah distribusi</li>
<li>Mendapatkan katalog produk dan daftar harga distributor</li>
<li>Memahami tingkatan level kemitraan dan simulasi margin keuntungan</li>
<li>Mempelajari syarat, ketentuan, dan program reward tahunan</li>
</ul>

<p><a href="https://wa.me/6281936574690?text=Halo%20Admin%2C%20saya%20tertarik%20bergabung%20menjadi%20Distributor%20Beautyinu" target="_blank" rel="noopener noreferrer">Hubungi Tim Kemitraan Distributor via WhatsApp (+62 819-3657-4690)</a></p>
<p><a href="/pages/contact">Lihat Informasi Kontak &amp; Kantor Resmi Kami</a></p>
`
  }
];

async function run() {
  console.log('=== PART 1: REFINING ALL 4 PAGES (NATURAL TITLES & CLEAN ELEGANT COPY) ===');
  for (let i = 0; i < pagesData.length; i++) {
    const p = pagesData[i];
    console.log(`[${i + 1}/${pagesData.length}] Updating page: "${p.cleanTitle}"...`);
    
    // 1. Update Title & Body
    const resPage = executeGraphQL(pageUpdateMutation, {
      id: p.id,
      page: {
        title: p.cleanTitle,
        body: p.body.trim()
      }
    });

    if (resPage.pageUpdate?.userErrors?.length > 0) {
      console.error('  ❌ PageUpdate errors:', resPage.pageUpdate.userErrors);
    } else {
      console.log(`  ✅ Page title set to: "${resPage.pageUpdate?.page?.title}"`);
    }

    // 2. Set Rich SEO Metafields
    const resMeta = executeGraphQL(metafieldsSetMutation, {
      metafields: [
        {
          ownerId: p.id,
          namespace: 'global',
          key: 'title_tag',
          type: 'single_line_text_field',
          value: p.seo.title
        },
        {
          ownerId: p.id,
          namespace: 'global',
          key: 'description_tag',
          type: 'multi_line_text_field',
          value: p.seo.description
        }
      ]
    });

    if (resMeta.metafieldsSet?.userErrors?.length > 0) {
      console.error('  ❌ Metafields errors:', resMeta.metafieldsSet.userErrors);
    } else {
      console.log(`  ✅ SEO Metafields synced: "${p.seo.title}"`);
    }
  }

  console.log('\n=== PART 2: REFINING ALL 6 BLOG ARTICLES (EDITORIAL HEADINGS, CLEAN ANCHOR TEXT & SEO) ===');
  for (let i = 0; i < articlesData.length; i++) {
    const art = articlesData[i];
    console.log(`[${i + 1}/${articlesData.length}] Updating article: "${art.title}"...`);

    const updateInput = {
      title: art.title,
      summary: art.summary,
      tags: art.tags,
      body: art.body.trim(),
      image: {
        altText: art.imageAlt
      }
    };

    if (art.id === 'gid://shopify/Article/597304738013') {
      delete updateInput.image;
    }

    const resArt = executeGraphQL(articleUpdateMutation, {
      id: art.id,
      article: updateInput
    });

    if (resArt.articleUpdate?.userErrors?.length > 0) {
      console.error('  ❌ ArticleUpdate errors:', resArt.articleUpdate.userErrors);
    } else {
      console.log(`  ✅ Article body, title & summary updated.`);
    }

    const resMeta = executeGraphQL(metafieldsSetMutation, {
      metafields: [
        {
          ownerId: art.id,
          namespace: 'global',
          key: 'title_tag',
          type: 'single_line_text_field',
          value: art.seo.title
        },
        {
          ownerId: art.id,
          namespace: 'global',
          key: 'description_tag',
          type: 'multi_line_text_field',
          value: art.seo.description
        }
      ]
    });

    if (resMeta.metafieldsSet?.userErrors?.length > 0) {
      console.error('  ❌ Metafields errors:', resMeta.metafieldsSet.userErrors);
    } else {
      console.log(`  ✅ SEO Metafields synced: "${art.seo.title}"`);
    }
  }

  console.log('\n===============================================================');
  console.log('🎉 ALL PAGES & BLOG ARTICLES ARE CLEAN, NATURAL, AND PERFECTED!');
  console.log('===============================================================');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
