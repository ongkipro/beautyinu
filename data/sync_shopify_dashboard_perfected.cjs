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
<p><strong>Cara Bergabung:</strong> Follow akun Instagram resmi <a href="https://instagram.com/beautyinu.id" target="_blank" rel="noopener noreferrer">@beautyinu.id</a> dan <a href="https://instagram.com/beautyinucastle" target="_blank" rel="noopener noreferrer">@beautyinucastle</a>, klik tautan di bio profil, lalu pilih menu pendaftaran komunitas.</p>
<p><a href="https://forms.gle/RBM26oTsz1jEgrae8" target="_blank" rel="noopener noreferrer"><strong>👉 Daftar Program Moonbabies (Google Form Resmi) &rarr;</strong></a></p>

<h3>2. Brightygengs (Creator &amp; Affiliate Ambassador)</h3>
<p>Brightygengs adalah ruang kolaborasi untuk para beauty enthusiast, pengguna setia, dan content creator yang ingin mendapatkan penghasilan tambahan serta berkembang di dunia digital melalui cerita inspiratif glow up dan review jujur.</p>
<p><strong>Benefit Anggota:</strong> Free sample produk terbaru, komisi afiliasi menarik, dan tips pembuatan konten viral.</p>
<p><a href="https://api.whatsapp.com/send/?phone=6281936574690&amp;text=Halo%20Admin%2C%20saya%20tertarik%20bergabung%20dengan%20Brightygengs%20Beautyinu" target="_blank" rel="noopener noreferrer"><strong>👉 Gabung Brightygengs via WhatsApp Resmi (+62 819-3657-4690) &rarr;</strong></a></p>

<h3>3. Official Distributor &amp; Reseller Program</h3>
<p>Kami membuka peluang kemitraan resmi bagi pelaku usaha, toko kosmetik, reseller, dan distributor di seluruh pelosok Nusantara untuk tumbuh bersama dalam jaringan distribusi resmi Beautyinu.</p>
<p><strong>Dukungan Kemitraan:</strong> Produk dengan permintaan pasar tinggi (fast-moving), tester gratis, materi promosi siap pakai, dan program reward tahunan 2026.</p>
<p><a href="https://wa.me/6281936574690?text=Halo%20Admin%2C%20saya%20tertarik%20bergabung%20menjadi%20Distributor%2FReseller%20Beautyinu" target="_blank" rel="noopener noreferrer"><strong>👉 Hubungi Kemitraan Distributor via WhatsApp (+62 819-3657-4690) &rarr;</strong></a></p>

<h3>4. Birthday Treats (Spesial Hari Ulang Tahunmu)</h3>
<p>Bagi kami, setiap momen spesial pelanggan layak dirayakan. Beautyinu memberikan hadiah produk gratis bagi Anda yang sedang berulang tahun!</p>
<p><strong>Tata Cara Klaim Birthday Treats:</strong></p>
<ol>
<li>Pastikan proses klaim dilakukan tepat pada hari ulang tahun Anda melalui Direct Message Instagram resmi <a href="https://instagram.com/beautyinu.id" target="_blank" rel="noopener noreferrer"><strong>@beautyinu.id</strong></a>.</li>
<li>Tunjukkan foto kartu identitas resmi (KTP/Kartu Pelajar) yang masih berlaku.</li>
<li>Tunggu proses verifikasi cepat dari tim Customer Care Beautyinu.</li>
<li>Hadiah produk spesial akan dikirimkan langsung ke alamat rumah Anda (*ongkos kirim ditanggung oleh penerima).</li>
</ol>
<p><a href="https://instagram.com/beautyinu.id" target="_blank" rel="noopener noreferrer"><strong>👉 Klaim Hadiah Ulang Tahun via DM Instagram @beautyinu.id &rarr;</strong></a></p>

<h2>Jelajahi Produk Pilihan Beautyinu</h2>
<p>Mulai rutinitas perawatan tubuh harian Anda bersama produk-produk favorit kami:</p>
<ul>
<li><a href="/collections/all"><strong>Katalog Lengkap Seluruh Produk &rarr;</strong></a></li>
<li><a href="/collections/body-care"><strong>Koleksi Perawatan Tubuh (Body Care) &rarr;</strong></a></li>
<li><a href="/collections/bundles"><strong>Paket Hemat Bundling Perawatan Tubuh &rarr;</strong></a></li>
<li><a href="/collections/best-sellers"><strong>Jajaran Produk Terlaris (Best Sellers) &rarr;</strong></a></li>
</ul>

<p><em>Beautyinu — Your bodycare bestie to glow, grow, and feel confident every day.</em></p>
`
  },
  {
    id: 'gid://shopify/Page/138083565789',
    handle: 'faq',
    title: 'Frequently Asked Questions (FAQ)',
    isPublished: true,
    seo: {
      title: 'FAQ & Panduan Produk — Beautyinu Official Store',
      description: 'Pertanyaan umum produk Beautyinu: takaran Gold Powder, body lotion UV filter, cara pakai body cream dibilas/tidak, sabun kefir, dan izin resmi BPOM.'
    },
    body: `
<p><strong>Pusat Bantuan &amp; Panduan Lengkap Pemakaian Produk Beautyinu.</strong></p>
<p>Temukan jawaban lengkap seputar cara pakai, takaran campuran, kandungan hero ingredients, dan panduan keamanan seluruh rangkaian perawatan tubuh Beautyinu di bawah ini.</p>

<h2>1. Brightening Booster Gold Powder (25gr)</h2>
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
<p><a href="/products/brightening-booster-gold-powder-25gr"><strong>👉 Lihat Produk Brightening Booster Gold Powder 25gr &rarr;</strong></a></p>

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
<p><a href="/products/bright-glow-body-lotion-uv-filter-750ml"><strong>👉 Lihat Produk Bright Glow Body Lotion UV Filter 750ml &rarr;</strong></a></p>

<h2>3. Brightening Body Cream Grape (100gr &amp; 200gr)</h2>
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
<p><a href="/products/brightening-body-cream-grape"><strong>👉 Lihat Produk Brightening Body Cream Grape &rarr;</strong></a></p>

<h2>4. Sabun Mandi (Kefir Collagen Soap &amp; Body Wash)</h2>
<h3>Apakah Sabun Kefir Collagen bisa untuk wajah dan badan?</h3>
<p>Ya! Sabun batang Kefir Collagen 60gr diformulasikan multifungsi untuk wajah dan badan. Untuk badan, busakan dan diamkan selama 2–3 menit agar fermentasi kefir dan collagen meresap, lalu bilas bersih. Untuk wajah, busakan lembut di tangan, usapkan perlahan, dan segera bilas bersih (BPOM NA18211200972).</p>

<h3>Bagaimana cara menyimpan sabun batang kefir agar tidak mudah lembek?</h3>
<p>Simpan di tempat sabun yang memiliki lubang saluran air kering dan hindari tergenang air setelah pemakaian agar sabun tetap higienis dan awet.</p>

<h3>Apa keunggulan Bright Glow Body Wash 250ml?</h3>
<p>Sabun mandi cair beraroma tropis menyegarkan (mango &amp; milk) dengan kombinasi Niacinamide, Alpha Arbutin, Tranexamic Acid, serta ekstrak susu alami. Membersihkan kotoran dan keringat secara tuntas tanpa membuat kulit terasa kering kesat (BPOM NA18250701893).</p>
<p><a href="/products/kefir-collagen-soap-60gr"><strong>👉 Lihat Produk Kefir Collagen Soap 60gr &rarr;</strong></a> | <a href="/products/bright-glow-body-wash-250ml"><strong>👉 Lihat Produk Bright Glow Body Wash 250ml &rarr;</strong></a></p>

<h2>5. Panduan Keamanan Umum, Kehamilan, &amp; Usia Pengguna</h2>
<h3>Mulai usia berapa produk Beautyinu dapat digunakan?</h3>
<p>Seluruh produk Beautyinu diformulasikan aman dan ramah kulit untuk pria dan wanita mulai usia <strong>12 tahun ke atas</strong>.</p>

<h3>Apakah aman untuk ibu hamil dan menyusui?</h3>
<p>Produk Beautyinu diformulasikan tanpa merkuri, tanpa hidrokuinon, dan telah tersertifikasi BPOM resmi. Namun, bagi ibu hamil (khususnya trimester pertama) yang memiliki sensitivitas kulit tertentu, disarankan untuk mengonsultasikan dengan dokter spesialis terlebih dahulu.</p>

<h3>Berapa lama hasil pemakaian mulai terlihat?</h3>
<p>Efek kelembapan dan kehalusan kulit terasa seketika setelah penggunaan pertama. Untuk tampilan kulit yang lebih cerah merata, hasil optimal umumnya terlihat dalam 2–4 minggu pemakaian teratur disertai perlindungan pakaian atau sunscreen saat beraktivitas di terik matahari.</p>

<h2>Butuh Bantuan atau Konsultasi Lebih Lanjut?</h2>
<p>Tim Customer Care Beautyinu siap mendampingi perjalanan perawatan kulit Anda:</p>
<p><a href="https://wa.me/6287777118186?text=Halo%20Customer%20Care%20Beautyinu%2C%20saya%20ingin%20konsultasi%20pemakaian%20produk" target="_blank" rel="noopener noreferrer"><strong>👉 Konsultasi Langsung via WhatsApp (+62 877-7711-8186) &rarr;</strong></a></p>
<p><a href="/pages/contact"><strong>👉 Kunjungi Halaman Kontak Resmi Kami &rarr;</strong></a></p>
`
  },
  {
    id: 'gid://shopify/Page/132654989533',
    handle: 'contact',
    title: 'Contact Us',
    isPublished: true,
    seo: {
      title: 'Contact Us — Layanan Pelanggan Resmi Beautyinu',
      description: 'Hubungi Customer Care Beautyinu via WhatsApp +62 877-7711-8186 dan Email support@beautyinu.id. Konsultasi produk bodycare, info resi, dan kemitraan distributor.'
    },
    body: `
<p><strong>Kami Siap Membantu Anda!</strong></p>
<p>Hubungi saluran layanan resmi Beautyinu di bawah ini untuk konsultasi pemilihan produk, panduan pemakaian, pemantauan status pesanan, maupun peluang kerja sama bisnis.</p>

<h2>1. Layanan Pelanggan (Customer Care Fast Response)</h2>
<p>Untuk pertanyaan seputar produk, rekomendasi perawatan tubuh, informasi nomor resi, dan kendala pesanan Anda:</p>
<ul>
<li><strong>WhatsApp Resmi:</strong> <a href="https://wa.me/6287777118186" target="_blank" rel="noopener noreferrer"><strong>+62 877-7711-8186</strong></a> (Respons Cepat).</li>
<li><strong>Email Bantuan:</strong> <a href="mailto:support@beautyinu.id"><strong>support@beautyinu.id</strong></a></li>
</ul>
<p><a href="https://wa.me/6287777118186?text=Halo%20Customer%20Care%20Beautyinu%2C%20saya%20butuh%20bantuan%20terkait%20pesanan%2Fproduk" target="_blank" rel="noopener noreferrer"><strong>👉 Hubungi Customer Care via WhatsApp (+62 877-7711-8186) &rarr;</strong></a></p>

<h2>2. Kemitraan, Afiliasi &amp; Komunitas (Partnership &amp; Business)</h2>
<p>Untuk pendaftaran program Creator Ambassador Brightygengs, peluang keagenan Distributor / Reseller resmi seluruh Indonesia, serta kegiatan komunitas Moonbabies:</p>
<ul>
<li><strong>WhatsApp Kemitraan:</strong> <a href="https://wa.me/6281936574690" target="_blank" rel="noopener noreferrer"><strong>+62 819-3657-4690</strong></a></li>
<li><strong>Email Kerjasama:</strong> <a href="mailto:hello@beautyinu.id"><strong>hello@beautyinu.id</strong></a></li>
</ul>
<p><a href="https://wa.me/6281936574690?text=Halo%20Admin%20Kemitraan%2C%20saya%20tertarik%20bekerjasama%20dengan%20Beautyinu" target="_blank" rel="noopener noreferrer"><strong>👉 Hubungi Tim Kemitraan via WhatsApp (+62 819-3657-4690) &rarr;</strong></a></p>

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
<p><a href="https://wa.me/6287777118186?text=Halo%20Admin%2C%20saya%20ingin%20mengajukan%20klaim%20garansi%20retur%20pesanan%20Beautyinu" target="_blank" rel="noopener noreferrer"><strong>👉 Ajukan Klaim via WhatsApp Customer Care (+62 877-7711-8186) &rarr;</strong></a></p>
<p><a href="mailto:support@beautyinu.id?subject=Klaim%20Garansi%20Retur%20Pesanan"><strong>👉 Ajukan Klaim via Email (support@beautyinu.id) &rarr;</strong></a></p>
<p><a href="/pages/contact"><strong>👉 Lihat Informasi Kontak Lengkap &rarr;</strong></a></p>
`
  }
];

// Helper to execute GraphQL
function executeGraphQL(query, variables = {}) {
  const varsPath = '/tmp/shopify_exec_vars.json';
  const queryPath = '/tmp/shopify_exec_query.graphql';
  fs.writeFileSync(varsPath, JSON.stringify(variables));
  fs.writeFileSync(queryPath, query);

  const cmd = `npx shopify store execute --store ${store} --query-file "${queryPath}" --variable-file "${varsPath}" --allow-mutations --json`;
  const raw = execSync(cmd, { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  return JSON.parse(raw);
}

async function run() {
  console.log('=== 1. UPDATING ALL 4 PAGES IN SHOPIFY DASHBOARD ===');
  const pageUpdateMutation = `
    mutation UpdatePage($id: ID!, $page: PageUpdateInput!) {
      pageUpdate(id: $id, page: $page) {
        page {
          id
          title
          handle
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const metafieldsSetMutation = `
    mutation SetMetafields($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          namespace
          key
          value
          type
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
    console.log(`\n[${i + 1}/${pagesData.length}] Syncing Page: "${p.title}" (${p.handle})`);

    // 1. Update title and body
    const resPage = executeGraphQL(pageUpdateMutation, {
      id: p.id,
      page: {
        title: p.title,
        body: p.body.trim(),
        isPublished: p.isPublished
      }
    });

    if (resPage.pageUpdate?.userErrors?.length > 0) {
      console.error('  ❌ PageUpdate errors:', resPage.pageUpdate.userErrors);
    } else {
      console.log('  ✓ Page text & title updated successfully');
    }

    // 2. Set SEO Metafields (title_tag as single_line_text_field, description_tag as multi_line_text_field)
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
      console.error('  ❌ MetafieldsSet errors:', resMeta.metafieldsSet.userErrors);
    } else {
      console.log('  ✓ SEO Meta (title_tag & description_tag) updated successfully');
    }
  }

  // Save local copy
  const localFile = __dirname + '/pages/pages-cleaned-2026-09-16.json';
  fs.writeFileSync(localFile, JSON.stringify(pagesData, null, 2));
  console.log(`\nLocal copy saved to: ${localFile}`);

  console.log('\n=== 2. UPDATING ALL 4 COLLECTIONS SEO IN SHOPIFY DASHBOARD ===');
  const collectionsFile = __dirname + '/collections/collections-cleaned-2026-09-16.json';
  const collectionsData = JSON.parse(fs.readFileSync(collectionsFile, 'utf8'));

  const collectionUpdateMutation = `
    mutation UpdateCollection($input: CollectionInput!) {
      collectionUpdate(input: $input) {
        collection {
          id
          title
          handle
          seo {
            title
            description
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  for (let i = 0; i < collectionsData.length; i++) {
    const c = collectionsData[i];
    console.log(`\n[${i + 1}/${collectionsData.length}] Syncing Collection: "${c.title}" (${c.handle})`);

    const resCol = executeGraphQL(collectionUpdateMutation, {
      input: {
        id: c.id,
        title: c.title,
        seo: {
          title: c.seo.title,
          description: c.seo.description
        }
      }
    });

    if (resCol.collectionUpdate?.userErrors?.length > 0) {
      console.error('  ❌ CollectionUpdate errors:', resCol.collectionUpdate.userErrors);
    } else {
      console.log('  ✓ Collection title & native SEO updated successfully');
    }

    // Also set metafields for collection search engine listing preview
    const resColMeta = executeGraphQL(metafieldsSetMutation, {
      metafields: [
        {
          ownerId: c.id,
          namespace: 'global',
          key: 'title_tag',
          type: 'single_line_text_field',
          value: c.seo.title
        },
        {
          ownerId: c.id,
          namespace: 'global',
          key: 'description_tag',
          type: 'multi_line_text_field',
          value: c.seo.description
        }
      ]
    });

    if (resColMeta.metafieldsSet?.userErrors?.length > 0) {
      console.error('  ❌ Collection MetafieldsSet errors:', resColMeta.metafieldsSet.userErrors);
    } else {
      console.log('  ✓ Collection SEO Metafields updated successfully');
    }
  }

  console.log('\n=== 3. ENSURING ALL 15 PRODUCTS SEO METATAGS IN SHOPIFY DASHBOARD ===');
  const productsFile = __dirname + '/catalog/products-cleaned-2026-09-16.json';
  const productsData = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

  const productUpdateMutation = `
    mutation UpdateProduct($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
          handle
          seo {
            title
            description
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  for (let i = 0; i < productsData.length; i++) {
    const pr = productsData[i];
    console.log(`[${i + 1}/${productsData.length}] Checking Product: "${pr.newTitle}"`);

    // Ensure native SEO and clean title
    const resProd = executeGraphQL(productUpdateMutation, {
      input: {
        id: pr.id,
        title: pr.newTitle,
        seo: {
          title: pr.seo.title,
          description: pr.seo.description
        }
      }
    });

    if (resProd.productUpdate?.userErrors?.length > 0) {
      console.error('  ❌ ProductUpdate errors:', resProd.productUpdate.userErrors);
    }

    // Also sync metafields
    executeGraphQL(metafieldsSetMutation, {
      metafields: [
        {
          ownerId: pr.id,
          namespace: 'global',
          key: 'title_tag',
          type: 'single_line_text_field',
          value: pr.seo.title
        },
        {
          ownerId: pr.id,
          namespace: 'global',
          key: 'description_tag',
          type: 'multi_line_text_field',
          value: pr.seo.description
        }
      ]
    });
  }

  console.log('\n=== ALL SHOPIFY DASHBOARD PAGES, COLLECTIONS, AND PRODUCTS PERFECTED! ===');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
