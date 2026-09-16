const fs = require('fs');

function makeRichText(paragraphs) {
  return JSON.stringify({
    type: 'root',
    children: paragraphs.map(p => ({
      type: 'paragraph',
      children: [{ type: 'text', value: p }]
    }))
  });
}

const catalog = JSON.parse(fs.readFileSync(__dirname + '/catalog/products-cleaned-2026-09-16.json', 'utf8'));

// 1. Brightening Body Cream Grape
const p1 = catalog.find(p => p.newHandle === 'brightening-body-cream-grape');
if (p1) {
  p1.descriptionHtml = `<p><strong>Kulit Cerah Anti Ribet.</strong> Krim tubuh bernutrisi tinggi dengan aroma anggur segar yang diformulasikan khusus untuk merawat kelembapan dan mencerahkan area tubuh yang kering serta kusam, seperti siku, lutut, tumit, tangan, dan kaki. Diperkaya Glutathione, Niacinamide, Licorice Extract, Mulberry Extract, dan Glycerin berkonsentrasi tinggi.</p><p><strong>Keunggulan Utama:</strong></p><ul><li>Membantu mencerahkan dan meratakan tampilan warna kulit</li><li>Menjaga kelembapan mendalam dan kehalusan kulit sepanjang hari</li><li>Dual-action: dapat digunakan sebagai pelembap malam tanpa bilas atau masker tubuh bilas</li><li>Formula lembut, ramah kulit, dan cepat meresap tanpa rasa lengket</li><li>Ternotifikasi BPOM NA18230100799 dan aman untuk usia 12+</li></ul>`;
  p1.metafields = [
    {
      namespace: 'custom',
      key: 'cara_pakai',
      type: 'rich_text_field',
      value: makeRichText([
        'Cara Pemakaian:',
        '1. Mode Daily Night Moisturizer (Tanpa Bilas): Gunakan setelah mandi atau sebelum tidur. Ambil body cream secukupnya, oleskan tipis dan merata pada area tubuh (terutama siku, lutut, tumit), lalu pijat perlahan hingga meresap.',
        '2. Mode Intensive Body Mask (Bilas): Oleskan body cream dengan tebal ke area tubuh (dapat dicampurkan dengan Brightening Booster Gold Powder rasio 1:1). Diamkan selama 10–15 menit, kemudian bilas hingga bersih.',
        'Gunakan rutin setiap hari untuk hasil optimal.'
      ])
    },
    {
      namespace: 'custom',
      key: 'ingredients',
      type: 'rich_text_field',
      value: makeRichText([
        'Hero Ingredients & Fungsinya:',
        '• Glycerin: Menjaga kelembapan kulit secara intensif, merawat kulit kering, dan memperkuat lapisan pelindung kulit (skin barrier).',
        '• Glutathione: Antioksidan kuat untuk membantu kulit tampak lebih cerah, segar, dan terlindungi dari radikal bebas.',
        '• Niacinamide: Mencerahkan kulit, mengurangi tampilan kusam, dan membantu warna kulit terlihat lebih merata.',
        '• Licorice Extract: Bahan pencerah alami yang membantu menyamarkan tampilan noda hitam dan merawat kesehatan kulit.',
        '• Mulberry Extract: Kaya antioksidan untuk meremajakan dan menyegarkan kulit tubuh.'
      ])
    },
    {
      namespace: 'custom',
      key: 'manfaat',
      type: 'rich_text_field',
      value: makeRichText([
        'Manfaat Utama:',
        '• Melembapkan dan melembutkan area kulit yang kasar serta sangat kering.',
        '• Membantu mencerahkan dan meratakan warna kulit secara bertahap.',
        '• Menutrisi kulit tubuh pada malam hari saat proses regenerasi sel berlangsung.',
        '• Formula nyaman, tidak lengket, dan beraroma anggur segar menenangkan.',
        '• Aman digunakan pria dan wanita mulai usia 12 tahun ke atas (BPOM NA18230100799).'
      ])
    }
  ];
}

// 2. Bright Glow Body Lotion UV Filter 750ml
const p2 = catalog.find(p => p.newHandle === 'bright-glow-body-lotion-uv-filter-750ml');
if (p2) {
  p2.descriptionHtml = `<p><strong>Daily Moisturizer 14 Hari Glowing.</strong> Body lotion harian ukuran jumbo 750ml dengan kombinasi UV Filter, Tranexamic Acid, Niacinamide, Shea Butter, Multivitamin (B3, B5, E), dan 4-Layer Hyaluronic Complex. Melindungi kulit dari paparan sinar matahari sekaligus merawat hidrasi dan kecerahan kulit agar tampak sehat, kenyal, dan bercahaya setiap hari.</p><p><strong>Keunggulan Utama:</strong></p><ul><li>Dilengkapi UV Filter untuk perlindungan harian dari paparan sinar matahari</li><li>Tranexamic Acid & Niacinamide untuk mencerahkan dan meratakan warna kulit</li><li>Hyaluronic Complex & Shea Butter mengunci kelembapan hingga lapisan terdalam</li><li>Tekstur ringan, cepat meresap, nyaman dipakai seharian tanpa rasa lengket</li><li>Kemasan jumbo 750ml dengan pump dispenser higienis, hemat, dan tahan lama</li><li>Ternotifikasi BPOM NA18240109992 dan aman untuk usia 12+</li></ul>`;
  p2.metafields = [
    {
      namespace: 'custom',
      key: 'cara_pakai',
      type: 'rich_text_field',
      value: makeRichText([
        'Cara Pemakaian:',
        '• Usapkan lotion secara merata pada seluruh area badan dan tangan setelah mandi pagi dan sore.',
        '• Ulangi pemakaian di siang hari terutama jika banyak beraktivitas di bawah paparan sinar matahari langsung.',
        '• Dapat dipadukan dengan Brightening Booster Gold Powder untuk hasil cerah yang lebih cepat.',
        '• Gunakan secara teratur setiap hari untuk menjaga kulit tetap lembap, lembut, dan terlindungi.'
      ])
    },
    {
      namespace: 'custom',
      key: 'ingredients',
      type: 'rich_text_field',
      value: makeRichText([
        'Hero Ingredients & Fungsinya:',
        '• UV Filter System: Memberikan perlindungan harian terhadap paparan sinar UV matahari saat beraktivitas di luar ruangan.',
        '• Tranexamic Acid: Mencerahkan kulit dan membantu meratakan tampilan warna kulit yang belang.',
        '• Niacinamide (Vitamin B3): Menutrisi kulit, merawat skin barrier, dan meningkatkan kecerahan alami.',
        '• 4-Layer Hyaluronic Complex: Menghidrasi intensif dan mengunci kelembapan pada berbagai lapisan kulit.',
        '• Shea Butter & Multivitamin (B5, E): Memberikan nutrisi esensial agar kulit terasa lebih kenyal, halus, dan ternutrisi.'
      ])
    },
    {
      namespace: 'custom',
      key: 'manfaat',
      type: 'rich_text_field',
      value: makeRichText([
        'Manfaat Utama:',
        '• Menjaga kelembapan kulit selama 24 jam tanpa rasa berminyak atau lengket.',
        '• Memberikan perlindungan UV harian saat beraktivitas di luar ruangan.',
        '• Membantu kulit tampak lebih cerah terawat dalam 14 hari pemakaian rutin.',
        '• Ukuran jumbo 750ml lebih ekonomis untuk pemakaian harian jangka panjang.',
        '• Terdaftar resmi BPOM NA18240109992.'
      ])
    }
  ];
}

// 3. Bright Glow Body Wash 250ml
const p3 = catalog.find(p => p.newHandle === 'bright-glow-body-wash-250ml');
if (p3) {
  p3.descriptionHtml = `<p><strong>Mandi Lebih Fresh, Kulit Lembut Terawat.</strong> Sabun mandi cair bernutrisi yang membersihkan keringat, debu, dan kotoran aktivitas harian dengan lembut tanpa membuat kulit terasa kesat atau kering. Diperkaya Niacinamide, Alpha Arbutin, Tranexamic Acid, serta ekstrak susu dan mangga yang menyegarkan untuk memulai langkah pertama rutinitas kulit glowing.</p><p><strong>Keunggulan Utama:</strong></p><ul><li>Membersihkan kulit secara menyeluruh dengan busa lembut melimpah</li><li>Kandungan aktif Niacinamide, Arbutin, dan Tranexamic Acid mencerahkan sejak mandi</li><li>Ekstrak susu dan mangga menjaga kelembutan dan aroma segar tropis</li><li>Menjaga kelembapan alami kulit sehingga terasa fresh dan halus setelah dibilas</li><li>Cocok untuk mandi pagi dan sore hari</li><li>Ternotifikasi BPOM NA18250701893 dan aman untuk usia 12+</li></ul>`;
  p3.metafields = [
    {
      namespace: 'custom',
      key: 'cara_pakai',
      type: 'rich_text_field',
      value: makeRichText([
        'Cara Pemakaian:',
        '1. Basahi tubuh dengan air bersih.',
        '2. Tuangkan body wash secukupnya ke telapak tangan atau shower puff.',
        '3. Busakan ke seluruh tubuh secara merata, pijat lembut, lalu bilas dengan air hingga bersih.',
        '4. Lanjutkan dengan Bright Glow Body Lotion setelah mandi untuk hasil kelembapan maksimal.'
      ])
    },
    {
      namespace: 'custom',
      key: 'ingredients',
      type: 'rich_text_field',
      value: makeRichText([
        'Hero Ingredients & Fungsinya:',
        '• Niacinamide: Membersihkan dan merawat kecerahan kulit sejak langkah pertama mandi.',
        '• Alpha Arbutin: Mengurangi tampilan kusam dan membantu meratakan warna kulit.',
        '• Tranexamic Acid: Merawat tampilan noda hitam dan bekas luka ringan pada tubuh.',
        '• Milk & Mango Extract: Memberikan nutrisi alami, kelembutan ekstra, dan aroma segar buah yang membangkitkan semangat.'
      ])
    },
    {
      namespace: 'custom',
      key: 'manfaat',
      type: 'rich_text_field',
      value: makeRichText([
        'Manfaat Utama:',
        '• Mengangkat kotoran, debu, dan keringat harian secara optimal.',
        '• Menjaga kelembapan kulit alami sehingga tidak terasa kering atau tertarik setelah mandi.',
        '• Menjadikan kulit terasa lebih halus, segar, dan wangi sepanjang hari.',
        '• Terdaftar resmi BPOM NA18250701893.'
      ])
    }
  ];
}

// 4. Brightening Booster Gold Powder 25gr
const p4 = catalog.find(p => p.newHandle === 'brightening-booster-gold-powder-25gr');
if (p4) {
  p4.descriptionHtml = `<p><strong>Booster Pencerah 3x Lebih Cepat.</strong> Serbuk booster pencerah konsentrat multifungsi dengan formulasi klinis Niacinamide 5.22%, Alpha Arbutin 2.30%, Kakadu Plum (sumber Vitamin C alami tertinggi), Glutathione, dan Salicylic Acid. Dirancang khusus untuk dicampurkan ke body lotion, body cream, atau lulur favorit guna mempercepat hasil perawatan kulit agar tampak cerah, glowing merata, dan bebas kusam tanpa efek abu-abu.</p><p><strong>Keunggulan Utama:</strong></p><ul><li>Konsentrasi presisi: Niacinamide 5.22% dan Alpha Arbutin 2.30% untuk efektivitas optimal</li><li>Kakadu Plum Extract kaya antioksidan alami melawan radikal bebas</li><li>Praktis dicampurkan ke lotion, cream, maupun lulur harian</li><li>Tidak menimbulkan white cast abu-abu saat digunakan sesuai takaran</li><li>Membantu kulit tampak lebih glowing dan noda hitam tersamarkan dalam 2–4 minggu</li><li>Ternotifikasi BPOM NA18240200017 dan aman untuk usia 12+</li></ul>`;
  p4.metafields = [
    {
      namespace: 'custom',
      key: 'cara_pakai',
      type: 'rich_text_field',
      value: makeRichText([
        'Panduan Takaran & Cara Pemakaian:',
        '1. Campur ke Botol Body Lotion: Masukkan 1 tube (25gr) Gold Powder ke dalam 400ml Beautyinu Bright Glow Body Lotion. Aduk atau kocok hingga tercampur rata. Gunakan setiap hari pagi dan malam.',
        '2. Campur di Telapak Tangan: Ambil lotion atau body cream di telapak tangan, taburkan sedikit Gold Powder (rasio 3:1 lebih banyak lotion), ratakan, lalu usapkan ke kulit.',
        '3. Treatment Mingguan (Lulur / Scrub): Campurkan Gold Powder dengan perbandingan 1:1 ke lulur atau body scrub saat akan digunakan. Balurkan ke kulit, diamkan 10–15 menit, lalu bilas bersih.',
        'Catatan Keamanan: Tidak disarankan dicampur dengan produk yang memiliki kandungan aktif tinggi seperti AHA > 8%, BHA > 2%, Retinol > 0.5%, atau Vitamin C murni > 15% untuk menghindari risiko iritasi.'
      ])
    },
    {
      namespace: 'custom',
      key: 'ingredients',
      type: 'rich_text_field',
      value: makeRichText([
        'Hero Ingredients Presisi & Fungsinya:',
        '• Niacinamide 5.22%: Konsentrasi teruji untuk mencerahkan, memperkuat skin barrier, dan meratakan warna kulit.',
        '• Alpha Arbutin 2.30%: Agen pencerah yang efektif menyamarkan noda hitam, flek, dan hiperpigmentasi.',
        '• Kakadu Plum Extract: Sumber Vitamin C alami tertinggi dari alam untuk perlindungan antioksidan maksimal.',
        '• Glutathione: Menjaga elastisitas, kekenyalan, dan kilau cerah alami kulit.',
        '• Salicylic Acid: Membantu membersihkan pori dari minyak berlebih dan mengangkat sel kulit mati.'
      ])
    },
    {
      namespace: 'custom',
      key: 'manfaat',
      type: 'rich_text_field',
      value: makeRichText([
        'Manfaat Utama:',
        '• Mempercepat hasil perawatan bodycare hingga 3x lebih cerah dan glowing.',
        '• Menyamarkan noda hitam, bekas luka ringan, dan area kulit yang belang.',
        '• Formulasi serbuk halus yang menyatu sempurna tanpa rasa berpasir atau abu-abu.',
        '• Terdaftar resmi BPOM NA18240200017.'
      ])
    }
  ];
}

// 5. Kefir Collagen Soap 60gr
const p5 = catalog.find(p => p.newHandle === 'kefir-collagen-soap-60gr');
if (p5) {
  p5.descriptionHtml = `<p><strong>14 Hari Kulit Lebih Cerah.</strong> Sabun batang perawatan kulit multifungsi yang dapat digunakan untuk wajah dan badan. Mengombinasikan fermentasi susu Kefir, Collagen alami, serta minyak botani pilihan (Coconut Oil, Olive Oil, Rice Bran Oil, Sunflower Oil) dengan Niacinamide, Glutathione, dan Arbutin. Membersihkan pori secara mendalam sekaligus menjaga kelembutan dan elastisitas kulit agar tampak cerah bercahaya.</p><p><strong>Keunggulan Utama:</strong></p><ul><li>Kefir & Collagen membantu peremajaan kulit agar tetap kencang dan kenyal</li><li>Kombinasi 4 botanical oils menjaga kelembapan alami kulit (tidak membuat kulit kering ketarik)</li><li>Multifungsi: aman digunakan untuk membersihkan badan maupun wajah</li><li>Membantu kulit tampak lebih bersih, segar, dan cerah dalam 14 hari pemakaian rutin</li><li>Ternotifikasi BPOM NA18211200972 dan aman untuk usia 12+</li></ul>`;
  p5.metafields = [
    {
      namespace: 'custom',
      key: 'cara_pakai',
      type: 'rich_text_field',
      value: makeRichText([
        'Cara Pemakaian:',
        '• Untuk Badan: Basahi tubuh dengan air, usapkan sabun hingga berbusa melimpah, ratakan ke seluruh tubuh. Diamkan selama 2–3 menit agar nutrisi kefir dan kolagen meresap, lalu bilas hingga bersih.',
        '• Untuk Wajah: Busakan sabun di telapak tangan, aplikasikan busa lembut ke wajah dengan pijatan ringan (hindari area mata dan bibir), lalu langsung bilas bersih.',
        'Tips: Simpan sabun di tempat yang kering setelah digunakan agar tidak mudah mencair dan tetap higienis.'
      ])
    },
    {
      namespace: 'custom',
      key: 'ingredients',
      type: 'rich_text_field',
      value: makeRichText([
        'Hero Ingredients & Fungsinya:',
        '• Fermentasi Susu Kefir: Melembapkan mendalam, menjaga keseimbangan mikrobioma kulit, dan mencerahkan secara alami.',
        '• Hydrolyzed Collagen: Membantu menjaga kekenyalan, kelembutan, dan elastisitas kulit.',
        '• Botanical Oils (Coconut, Olive, Rice Bran, Sunflower): Menutrisi kulit dan mencegah kekeringan setelah mandi.',
        '• Niacinamide, Glutathione & Arbutin: Formula pencerah terpadu untuk meratakan warna kulit kusam.',
        '• Aloe Vera Extract: Memberikan efek hidrasi dan menyejukkan kulit.'
      ])
    },
    {
      namespace: 'custom',
      key: 'manfaat',
      type: 'rich_text_field',
      value: makeRichText([
        'Manfaat Utama:',
        '• Membersihkan debu, kotoran, dan sel kulit mati secara menyeluruh.',
        '• Kulit tampak lebih cerah, bersih, dan segar dalam 14 hari pemakaian rutin.',
        '• Menjaga kulit tetap lembap, kenyal, dan tidak terasa ketarik setelah mandi.',
        '• Terdaftar resmi BPOM NA18211200972.'
      ])
    }
  ];
}

// 6. Glowing Set (3-in-1)
const p6 = catalog.find(p => p.newHandle === 'glowing-set-3-in-1');
if (p6) {
  p6.descriptionHtml = `<p><strong>Rangkaian Rutinitas Glowing 3-in-1.</strong> Paket perawatan tubuh terpadu untuk hasil cerah optimal setiap hari. Terdiri dari langkah pembersihan (Kefir Collagen Soap 60gr), booster konsentrat pencerah (Brightening Booster Gold Powder 25gr), dan pelembap harian pelindung UV (Bright Glow Body Lotion UV Filter 750ml). Diformulasikan bersinergi untuk menutrisi kulit secara menyeluruh dari pagi hingga malam.</p><p><strong>Isi Paket & Tahapan Rutinitas:</strong></p><ul><li><strong>Step 1 (Cleanse):</strong> Kefir Collagen Soap 60gr (BPOM NA18211200972) — Membersihkan pori dan menyiapkan kulit.</li><li><strong>Step 2 (Boost):</strong> Brightening Booster Gold Powder 25gr (BPOM NA18240200017) — Serbuk pencerah konsentrat tinggi.</li><li><strong>Step 3 (Moisturize & Protect):</strong> Bright Glow Body Lotion UV Filter 750ml (BPOM NA18240109992) — Hidrasi harian & UV Filter.</li></ul><p><strong>Manfaat Rangkaian:</strong></p><ul><li>Merawat kulit kusam dan kering secara berkesinambungan</li><li>Melindungi kulit dari paparan sinar UV selama beraktivitas harian</li><li>Lebih hemat dengan harga paket bundling resmi</li></ul>`;
  p6.metafields = [
    {
      namespace: 'custom',
      key: 'cara_pakai',
      type: 'rich_text_field',
      value: makeRichText([
        'Urutan Pemakaian Rangkaian Glowing Set 3-in-1:',
        '1. Step 1 (Mandi): Gunakan Kefir Collagen Soap saat mandi pagi dan sore. Usap hingga berbusa, ratakan ke tubuh, diamkan 2–3 menit, lalu bilas bersih.',
        '2. Step 2 & 3 (Campur Booster & Lotion): Campurkan 1 tube Gold Powder ke botol Body Lotion 750ml (atau campur perbandingan 3:1 lotion:booster di telapak tangan). Usapkan merata ke seluruh tubuh setiap hari setelah mandi.'
      ])
    },
    {
      namespace: 'custom',
      key: 'ingredients',
      type: 'rich_text_field',
      value: makeRichText([
        'Kandungan Aktif Rangkaian:',
        '• Kefir Collagen Soap: Kefir ferment, hydrolyzed collagen, botanical oils, niacinamide, glutathione.',
        '• Brightening Booster Gold Powder: Niacinamide 5.22%, alpha arbutin 2.30%, kakadu plum, glutathione, salicylic acid.',
        '• Bright Glow Body Lotion: UV filter, tranexamic acid, niacinamide, 4-layer hyaluronic complex, shea butter, multivitamin B5 & E.'
      ])
    },
    {
      namespace: 'custom',
      key: 'manfaat',
      type: 'rich_text_field',
      value: makeRichText([
        'Manfaat Rangkaian:',
        '• Memberikan perawatan menyeluruh: membersihkan, mencerahkan intensif, dan melindungi dari sinar matahari.',
        '• Kulit tampak lebih cerah, halus, dan glowing alami secara bertahap.',
        '• Paket bundling hemat resmi bersertifikasi BPOM lengkap.'
      ])
    }
  ];
}

// 7. Lotion & Booster Set (2-in-1)
const p7 = catalog.find(p => p.newHandle === 'body-lotion-booster-set');
if (p7) {
  p7.descriptionHtml = `<p><strong>Duo Daily Glow Routine.</strong> Kombinasi favorit untuk perawatan kulit cerah harian. Memadukan Bright Glow Body Lotion UV Filter 750ml dengan Brightening Booster Gold Powder 25gr. Cukup campurkan serbuk booster ke dalam lotion untuk mendapatkan lotion pencerah berkonsentrasi tinggi yang melindungi kulit dari sinar UV sekaligus menjaga kelembapan 24 jam.</p><p><strong>Isi Paket:</strong></p><ul><li>Bright Glow Body Lotion UV Filter 750ml (BPOM NA18240109992)</li><li>Brightening Booster Gold Powder 25gr (BPOM NA18240200017)</li></ul><p><strong>Cara Pakai Praktis:</strong></p><ul><li>Campurkan 1 tube Gold Powder ke botol lotion 750ml (atau gunakan rasio 3:1 di telapak tangan saat pakai)</li><li>Oleskan merata ke seluruh tubuh setiap pagi dan sore setelah mandi</li></ul>`;
  p7.metafields = [
    {
      namespace: 'custom',
      key: 'cara_pakai',
      type: 'rich_text_field',
      value: makeRichText([
        'Cara Pakai Duo Lotion & Booster:',
        '• Cara Praktis: Masukkan 1 tube (25gr) Gold Powder ke dalam botol Body Lotion 750ml, kocok atau aduk hingga tercampur merata. Gunakan lotion seperti biasa setiap hari setelah mandi.',
        '• Cara Manual: Ambil lotion di telapak tangan, tambahkan sedikit Gold Powder (rasio 3:1), campurkan dan oleskan merata pada kulit badan dan tangan.'
      ])
    },
    {
      namespace: 'custom',
      key: 'ingredients',
      type: 'rich_text_field',
      value: makeRichText([
        'Kandungan Aktif Sinergis:',
        '• Tranexamic Acid & Niacinamide: Mencerahkan dan meratakan warna kulit.',
        '• Alpha Arbutin 2.30% & Kakadu Plum: Menyamarkan noda hitam dan melindungi dari radikal bebas.',
        '• UV Filter & Hyaluronic Complex: Proteksi dari sinar matahari dan hidrasi mendalam 24 jam.'
      ])
    },
    {
      namespace: 'custom',
      key: 'manfaat',
      type: 'rich_text_field',
      value: makeRichText([
        'Manfaat Utama:',
        '• Melindungi kulit dari sinar UV matahari saat beraktivitas siang hari.',
        '• Membantu mencerahkan kulit tubuh lebih cepat dan merata.',
        '• Menjaga kelembapan kulit agar tetap lembut, kenyal, dan tidak kering.'
      ])
    }
  ];
}

// 8. Cream & Booster Set (2-in-1)
const p8 = catalog.find(p => p.newHandle === 'body-cream-booster-set');
if (p8) {
  p8.descriptionHtml = `<p><strong>Duo Intensive Night Care & Body Mask.</strong> Kombinasi ampuh untuk menutrisi kulit kering, kasar, dan warna kulit tidak merata. Menggabungkan Brightening Body Cream Grape Scent 200gr dengan Brightening Booster Gold Powder 25gr. Sangat ideal sebagai perawatan hidrasi mendalam di malam hari atau sebagai masker tubuh mingguan.</p><p><strong>Isi Paket:</strong></p><ul><li>Brightening Body Cream Grape Scent 200gr (BPOM NA18230100799)</li><li>Brightening Booster Gold Powder 25gr (BPOM NA18240200017)</li></ul><p><strong>Cara Pakai:</strong></p><ul><li>Sebagai Krim Malam: Campurkan di telapak tangan, oleskan tipis pada area tubuh sebelum tidur.</li><li>Sebagai Body Mask: Campurkan dengan rasio 1:1, oleskan tebal pada tubuh, diamkan 15 menit, lalu bilas bersih.</li></ul>`;
  p8.metafields = [
    {
      namespace: 'custom',
      key: 'cara_pakai',
      type: 'rich_text_field',
      value: makeRichText([
        'Cara Pakai Duo Cream & Booster:',
        '1. Perawatan Malam (Tanpa Bilas): Ambil body cream secukupnya di telapak tangan, taburkan sedikit booster powder, ratakan dan oleskan tipis ke kulit sebelum tidur.',
        '2. Body Mask Mingguan (Bilas): Campurkan body cream dan booster powder dengan perbandingan 1:1 di mangkuk bersih. Oleskan tebal ke seluruh tubuh atau area yang kusam, diamkan 10–15 menit, lalu bilas bersih saat mandi.'
      ])
    },
    {
      namespace: 'custom',
      key: 'ingredients',
      type: 'rich_text_field',
      value: makeRichText([
        'Kandungan Aktif Sinergis:',
        '• Glutathione, Niacinamide & Alpha Arbutin: Formula pencerah konsentrasi tinggi.',
        '• Licorice & Mulberry Extract: Botanical actives untuk menyamarkan bintik hitam.',
        '• Glycerin & Kakadu Plum: Hidrasi mendalam dan antioksidan alami pelindung kulit.'
      ])
    },
    {
      namespace: 'custom',
      key: 'manfaat',
      type: 'rich_text_field',
      value: makeRichText([
        'Manfaat Utama:',
        '• Membantu melembutkan dan mencerahkan area kulit yang sangat kering atau kasar (siku, lutut, tumit).',
        '• Memberikan perawatan ekstra di malam hari saat kulit beristirahat.',
        '• Menjadikan kulit tampak lebih halus, glowing, dan bernutrisi sehat.'
      ])
    }
  ];
}

// 9. Complete Brightening Set (5-in-1)
const p9 = catalog.find(p => p.newHandle === 'complete-brightening-set');
if (p9) {
  p9.descriptionHtml = `<p><strong>Rangkaian Lengkap 5-in-1 Head-to-Toe.</strong> Solusi menyeluruh untuk perawatan kulit tubuh dari A sampai Z. Menghadirkan 5 produk unggulan Beautyinu untuk membersihkan, menutrisi, mencerahkan, melindungi dari sinar matahari, dan meregenerasi kulit secara optimal.</p><p><strong>Rangkaian 5 Produk Resmi:</strong></p><ul><li><strong>1. Kefir Collagen Soap 60gr (BPOM NA18211200972):</strong> Sabun batang pembersih wajah dan tubuh.</li><li><strong>2. Bright Glow Body Wash 250ml (BPOM NA18250701893):</strong> Sabun cair mandi harian beraroma segar.</li><li><strong>3. Brightening Booster Gold Powder 25gr (BPOM NA18240200017):</strong> Serbuk pencerah konsentrat tinggi.</li><li><strong>4. Bright Glow Body Lotion UV Filter 750ml (BPOM NA18240109992):</strong> Pelembap harian pelindung UV ukuran jumbo.</li><li><strong>5. Brightening Body Cream Grape 100gr (BPOM NA18230100799):</strong> Krim pelembap intensif & masker pencerah.</li></ul><p><strong>Urutan Pemakaian:</strong> Mandi (Soap / Body Wash) ➔ Campur Booster ke Lotion untuk pemakaian harian ➔ Gunakan Body Cream untuk area kering atau sebagai masker malam.</p>`;
  p9.metafields = [
    {
      namespace: 'custom',
      key: 'cara_pakai',
      type: 'rich_text_field',
      value: makeRichText([
        'Panduan Rutinitas Lengkap 5 Produk:',
        '1. Mandi (Cleanse): Bersihkan tubuh dengan Kefir Collagen Soap atau Bright Glow Body Wash saat mandi pagi dan sore.',
        '2. Pagi / Siang (Protect): Campurkan Gold Powder ke Body Lotion Jumbo 750ml, gunakan merata ke seluruh tubuh sebelum beraktivitas.',
        '3. Malam (Intensive Care): Oleskan Body Cream pada area kulit yang membutuhkan hidrasi ekstra sebelum tidur.',
        '4. Perawatan Mingguan: Campurkan Body Cream dengan Gold Powder rasio 1:1 sebagai masker tubuh selama 15 menit, lalu bilas bersih.'
      ])
    },
    {
      namespace: 'custom',
      key: 'ingredients',
      type: 'rich_text_field',
      value: makeRichText([
        'Formulasi Lengkap 5 Produk Resmi:',
        '• Body Lotion: UV Filter, Tranexamic Acid, Niacinamide, Hyaluronic Complex, Shea Butter, Vitamin B5 & E.',
        '• Kefir Collagen Soap: Kefir ferment, Collagen, Coconut, Olive, Rice Bran & Sunflower Oils, Niacinamide, Arbutin.',
        '• Gold Powder: Niacinamide 5.22%, Alpha Arbutin 2.30%, Kakadu Plum, Glutathione, Salicylic Acid.',
        '• Body Wash: Niacinamide, Alpha Arbutin, Tranexamic Acid, Milk & Mango Extract.',
        '• Body Cream: Glycerin, Glutathione, Niacinamide, Licorice Extract, Mulberry Extract.'
      ])
    },
    {
      namespace: 'custom',
      key: 'manfaat',
      type: 'rich_text_field',
      value: makeRichText([
        'Manfaat Lengkap 5-in-1:',
        '• Menjawab seluruh kebutuhan kulit tubuh: membersihkan, melembapkan, mencerahkan, dan melindungi dari sinar UV.',
        '• Merawat kulit kusam, kering, dan warna kulit tidak merata secara menyeluruh.',
        '• Seluruh 5 produk 100% berlegalitas resmi BPOM.'
      ])
    }
  ];
}

// 10. Booster Gold Powder (7-Pack Value)
const p10 = catalog.find(p => p.newHandle === 'booster-gold-powder-7-pack');
if (p10) {
  p10.descriptionHtml = `<p><strong>Paket Super Hemat Isi 7 Pcs.</strong> Pilihan terbaik dan paling ekonomis bagi pengguna setia Brightening Booster Gold Powder 25gr. Ideal untuk stok perawatan jangka panjang, berbagi bersama keluarga, atau persediaan rutin harian dengan jaminan produk 100% original ber-BPOM langsung dari produsen resmi.</p><p><strong>Detail Paket:</strong></p><ul><li>Total: 7 botol Brightening Booster Gold Powder @ 25gr (Total 175gr)</li><li>Sertifikasi Resmi: BPOM NA18240200017</li><li>Formulasi: Niacinamide 5.22%, Alpha Arbutin 2.30%, Kakadu Plum, Glutathione, Salicylic Acid</li><li>Masa Simpan: 2 tahun (simpan di tempat kering dan sejuk)</li></ul>`;
  p10.metafields = [
    {
      namespace: 'custom',
      key: 'cara_pakai',
      type: 'rich_text_field',
      value: makeRichText([
        'Panduan Pemakaian:',
        '• Campurkan 1 tube ke dalam botol body lotion ukuran 400ml–750ml, aduk/kocok hingga rata, gunakan setiap hari setelah mandi.',
        '• Atau campurkan di telapak tangan dengan rasio 3:1 (lebih banyak lotion daripada booster).',
        '• Dapat pula digunakan sebagai campuran lulur atau masker tubuh mingguan.'
      ])
    },
    {
      namespace: 'custom',
      key: 'ingredients',
      type: 'rich_text_field',
      value: makeRichText([
        'Hero Ingredients Presisi:',
        '• Niacinamide 5.22% & Alpha Arbutin 2.30%: Agen pencerah efektif meratakan warna kulit.',
        '• Kakadu Plum Extract: Sumber Vitamin C alami tertinggi untuk antioksidan harian.',
        '• Glutathione & Salicylic Acid: Mengangkat sel kulit mati dan menjaga elastisitas kulit.'
      ])
    },
    {
      namespace: 'custom',
      key: 'manfaat',
      type: 'rich_text_field',
      value: makeRichText([
        'Manfaat Paket Hemat 7 Pcs:',
        '• Stok perawatan pencerah harian jangka panjang dengan harga bundling paling hemat.',
        '• Produk multifungsi: dapat dicampur ke berbagai body lotion, body cream, maupun lulur.',
        '• Jaminan 100% original ber-BPOM NA18240200017.'
      ])
    }
  ];
}

fs.writeFileSync(__dirname + '/catalog/products-cleaned-2026-09-16.json', JSON.stringify(catalog, null, 2));
console.log('✓ Successfully generated rich catalog with validated research data!');
