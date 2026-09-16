const fs = require('fs');
const { execSync } = require('child_process');

function makeRichText(paragraphs) {
  return JSON.stringify({
    type: 'root',
    children: paragraphs.map(p => ({
      type: 'paragraph',
      children: [{ type: 'text', value: p }]
    }))
  });
}

const store = 'p1d3wg-6i.myshopify.com';
const cwd = '/Users/ongki';

const productsToActivate = [
  {
    id: 'gid://shopify/Product/9492853653725',
    oldHandle: 'english-pear-freesia-deep-cleansing-body-toner-100ml',
    newTitle: 'English Pear Body Toner 100ml',
    newHandle: 'english-pear-body-toner-100ml',
    productType: 'Body Toner',
    descriptionHtml: `<p><strong>Segarkan dan Bersihkan Kulit Tubuh Secara Mendalam.</strong> Body toner dengan keharuman mewah English Pear &amp; Freesia yang diformulasikan khusus untuk mengangkat sisa kotoran, minyak berlebih, dan residu sabun setelah mandi. Membantu mengembalikan kesegaran alami kulit, menghaluskan tekstur, serta mempersiapkan kulit agar menyerap lotion dan booster nutrisi secara optimal.</p><p><strong>Keunggulan Utama:</strong></p><ul><li>Membersihkan sisa kotoran dan sel kulit mati secara lembut tanpa rasa perih</li><li>Menyegarkan dan menyeimbangkan kelembapan kulit tubuh seketika</li><li>Membantu kulit tampak lebih cerah, halus, dan tidak kusam</li><li>Aroma floral-fruity mewah menyegarkan yang tahan lama</li><li>Formula ringan, cepat meresap, dan nyaman untuk penggunaan harian</li><li>Aman digunakan setiap hari untuk usia 12+</li></ul>`,
    seo: {
      title: 'English Pear Body Toner 100ml — Beautyinu',
      description: 'Body toner dengan aroma English Pear & Freesia untuk membersihkan sisa kotoran dan residu setelah mandi. Kulit terasa segar, halus, dan bercahaya alami.'
    },
    collectionsToJoin: [
      'gid://shopify/Collection/455670300893', // Home page
      'gid://shopify/Collection/462376599773'  // Body Care
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/47908817535197',
        price: '100000.00',
        compareAtPrice: '125000.00',
        sku: '1BT-100',
        inventoryPolicy: 'CONTINUE'
      }
    ],
    metafields: [
      {
        namespace: 'custom',
        key: 'cara_pakai',
        type: 'rich_text_field',
        value: makeRichText([
          'Cara Pemakaian:',
          '1. Gunakan setelah mandi saat tubuh sudah kering bersih.',
          '2. Tuangkan body toner secukupnya pada kapas atau telapak tangan yang bersih.',
          '3. Usapkan secara merata ke seluruh tubuh, terutama area yang rentan kotor seperti leher, lipatan tangan, siku, dan kaki.',
          '4. Biarkan meresap sempurna sebelum mengaplikasikan body lotion atau body cream.'
        ])
      },
      {
        namespace: 'custom',
        key: 'ingredients',
        type: 'rich_text_field',
        value: makeRichText([
          'Hero Ingredients & Fungsinya:',
          '• English Pear & Freesia Extract: Memberikan keharuman floral-fruity mewah yang menyegarkan tubuh sepanjang hari.',
          '• Niacinamide: Mencerahkan kulit tubuh, menyamarkan tampilan kusam, dan merawat lapisan pelindung kulit.',
          '• Mild Exfoliant Complex: Mengangkat residu kotoran dan sel kulit mati secara lembut tanpa mengikis kelembapan alami.',
          '• Glycerin & Panthenol: Menghidrasi kulit secara intensif agar terasa kenyal, halus, dan tenang.'
        ])
      },
      {
        namespace: 'custom',
        key: 'manfaat',
        type: 'rich_text_field',
        value: makeRichText([
          'Manfaat Utama:',
          '• Membersihkan kotoran dan residu sabun yang tertinggal di pori-pori kulit.',
          '• Mengembalikan kesegaran dan kelembapan alami setelah mandi.',
          '• Membantu penyerapan body lotion dan booster hingga 2x lebih efektif.',
          '• Merawat kehalusan kulit dan menyamarkan tampilan kulit kasar.',
          '• Memberikan wangi segar elegan yang menenangkan.'
        ])
      }
    ]
  },
  {
    id: 'gid://shopify/Product/9535046648029',
    oldHandle: 'brightening-body-cream-grape-scent-gr',
    newTitle: 'Brightening Body Cream Grape 200gr',
    newHandle: 'brightening-body-cream-grape-200g',
    productType: 'Body Cream',
    descriptionHtml: `<p><strong>Nutrisi Intensif Ukuran Jumbo 200gr.</strong> Krim tubuh bernutrisi tinggi dengan aroma anggur segar yang diformulasikan khusus untuk merawat kelembapan mendalam dan mencerahkan area tubuh yang kering serta kusam, seperti siku, lutut, tumit, tangan, dan kaki. Ukuran 200gr lebih ekonomis dan tahan lama untuk perawatan harian keluarga.</p><p><strong>Keunggulan Utama:</strong></p><ul><li>Kombinasi Glutathione &amp; Niacinamide untuk mencerahkan kulit kusam</li><li>Glycerin konsentrat tinggi mengunci kelembapan hingga lapisan terdalam</li><li>Dual-action: pelembap malam tanpa bilas atau masker tubuh bilas intensif</li><li>Tekstur rich namun mudah meresap tanpa rasa lengket</li><li>Ukuran jumbo 200gr hemat untuk perawatan rutin harian</li><li>Ternotifikasi BPOM NA18230100799 dan aman untuk usia 12+</li></ul>`,
    seo: {
      title: 'Brightening Body Cream Grape 200gr — Beautyinu',
      description: 'Krim tubuh 200gr beraroma anggur dengan Glutathione dan Niacinamide. Melembapkan area sangat kering dan mencerahkan kulit secara intensif.'
    },
    collectionsToJoin: [
      'gid://shopify/Collection/455670300893',
      'gid://shopify/Collection/462376599773'
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/48082473844957',
        price: '80300.00',
        compareAtPrice: '110000.00',
        sku: '1BC-200G',
        inventoryPolicy: 'CONTINUE'
      }
    ],
    metafields: [
      {
        namespace: 'custom',
        key: 'cara_pakai',
        type: 'rich_text_field',
        value: makeRichText([
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
          '• Melembapkan dan melembutkan area kulit yang kasar serta sangat kering.',
          '• Membantu mencerahkan dan meratakan warna kulit secara bertahap.',
          '• Menutrisi kulit tubuh pada malam hari saat proses regenerasi sel berlangsung.',
          '• Formula nyaman, tidak lengket, dan beraroma anggur segar menenangkan.',
          '• Aman digunakan pria dan wanita mulai usia 12 tahun ke atas (BPOM NA18230100799).'
        ])
      }
    ]
  },
  {
    id: 'gid://shopify/Product/9492845035741',
    oldHandle: 'beautyinu-brightening-body-cream-grape-scent-bleaching-pemutih-badan-100-gram-200-gram',
    newTitle: 'Brightening Body Cream Grape 100gr',
    newHandle: 'brightening-body-cream-grape-100g',
    productType: 'Body Cream',
    descriptionHtml: `<p><strong>Perawatan Mencerahkan Praktis Ukuran 100gr.</strong> Krim tubuh bernutrisi dengan aroma anggur segar yang diformulasikan untuk melembapkan dan mencerahkan area tubuh yang kering serta kusam. Kemasan 100gr yang praktis dan mudah dibawa bepergian (travel-friendly).</p><p><strong>Keunggulan Utama:</strong></p><ul><li>Membantu mencerahkan dan meratakan tampilan warna kulit tubuh</li><li>Merawat kelembapan mendalam pada area siku, lutut, dan tumit</li><li>Dual fungsi: pelembap harian tanpa bilas atau masker tubuh bilas</li><li>Tekstur lembut, cepat meresap, dan tidak lengket di kulit</li><li>Kemasan compact 100gr praktis dibawa ke mana saja</li><li>Ternotifikasi BPOM NA18230100799 dan aman untuk usia 12+</li></ul>`,
    seo: {
      title: 'Brightening Body Cream Grape 100gr — Beautyinu',
      description: 'Krim tubuh 100gr beraroma anggur segar dengan Glutathione & Niacinamide. Solusi praktis merawat kelembapan dan mencerahkan area tubuh yang kusam.'
    },
    collectionsToJoin: [
      'gid://shopify/Collection/455670300893',
      'gid://shopify/Collection/462376599773'
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/47908794892509',
        price: '50600.00',
        compareAtPrice: '65000.00',
        sku: '1BC-100G',
        inventoryPolicy: 'CONTINUE'
      }
    ],
    metafields: [
      {
        namespace: 'custom',
        key: 'cara_pakai',
        type: 'rich_text_field',
        value: makeRichText([
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
          '• Melembapkan dan melembutkan area kulit yang kasar serta sangat kering.',
          '• Membantu mencerahkan dan meratakan warna kulit secara bertahap.',
          '• Menutrisi kulit tubuh pada malam hari saat proses regenerasi sel berlangsung.',
          '• Formula nyaman, tidak lengket, dan beraroma anggur segar menenangkan.',
          '• Aman digunakan pria dan wanita mulai usia 12 tahun ke atas (BPOM NA18230100799).'
        ])
      }
    ]
  },
  {
    id: 'gid://shopify/Product/9492852834525',
    oldHandle: 'beautyinu-bright-glow-body-lotion-jumbo-with-uv-filter-750ml',
    newTitle: 'Bright Glow Body Lotion UV Filter 750ml (Classic Edition)',
    newHandle: 'bright-glow-body-lotion-uv-filter-750ml-classic',
    productType: 'Body Lotion',
    descriptionHtml: `<p><strong>Daily Moisturizer 14 Hari Kulit Lembap &amp; Glowing (Classic Edition).</strong> Body lotion harian kemasan jumbo 750ml dengan formula klasik terpercaya yang dilengkapi UV Filter, Tranexamic Acid, Niacinamide, Shea Butter, dan Multivitamin. Memberikan perlindungan harian dari sinar matahari sekaligus merawat hidrasi dan kecerahan kulit agar selalu kenyal, halus, dan bercahaya.</p><p><strong>Keunggulan Utama:</strong></p><ul><li>Dilengkapi UV Filter untuk perlindungan harian dari sinar matahari</li><li>Tranexamic Acid &amp; Niacinamide untuk mencerahkan dan meratakan warna kulit</li><li>Shea Butter &amp; Hyaluronic Complex mengunci kelembapan 24 jam</li><li>Tekstur ringan, mudah meresap, dan tidak meninggalkan rasa lengket</li><li>Kemasan jumbo 750ml dengan pump higienis, ekonomis untuk pemakaian harian</li><li>Ternotifikasi BPOM NA18240109992 dan aman untuk usia 12+</li></ul>`,
    seo: {
      title: 'Bright Glow Body Lotion UV Filter 750ml Classic — Beautyinu',
      description: 'Body lotion jumbo 750ml Classic Edition dengan UV Filter, Tranexamic Acid, dan Niacinamide. Menjaga kelembapan 24 jam dan melindungi kulit dari sinar UV.'
    },
    collectionsToJoin: [
      'gid://shopify/Collection/455670300893',
      'gid://shopify/Collection/462376599773'
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/47908813242589',
        price: '100737.00',
        compareAtPrice: '159900.00',
        sku: '1BL-750-CLASSIC',
        inventoryPolicy: 'CONTINUE'
      }
    ],
    metafields: [
      {
        namespace: 'custom',
        key: 'cara_pakai',
        type: 'rich_text_field',
        value: makeRichText([
          'Cara Pemakaian:',
          '• Usapkan lotion secara merata pada seluruh area badan, tangan, dan kaki setelah mandi pagi dan sore.',
          '• Ulangi pemakaian di siang hari terutama jika banyak beraktivitas di luar ruangan.',
          '• Dapat dipadukan dengan Brightening Booster Gold Powder untuk hasil cerah yang lebih maksimal.'
        ])
      },
      {
        namespace: 'custom',
        key: 'ingredients',
        type: 'rich_text_field',
        value: makeRichText([
          'Hero Ingredients & Fungsinya:',
          '• UV Filter System: Melindungi kulit dari paparan sinar UV matahari saat beraktivitas harian.',
          '• Tranexamic Acid: Mencerahkan dan membantu menyamarkan tampilan noda hitam dan warna kulit tidak merata.',
          '• Niacinamide: Menutrisi kulit, merawat skin barrier, dan meningkatkan kecerahan alami.',
          '• Shea Butter & Multivitamin: Melembutkan kulit serta menjaga elastisitas dan kekenyalan kulit.'
        ])
      },
      {
        namespace: 'custom',
        key: 'manfaat',
        type: 'rich_text_field',
        value: makeRichText([
          'Manfaat Utama:',
          '• Melindungi kulit dari bahaya paparan sinar UV matahari.',
          '• Menghidrasi kulit sepanjang hari tanpa rasa berminyak.',
          '• Membantu kulit tampak lebih cerah dalam 14 hari pemakaian rutin.',
          '• Kemasan jumbo 750ml hemat dan tahan lama.',
          '• Terdaftar resmi BPOM NA18240109992.'
        ])
      }
    ]
  },
  {
    id: 'gid://shopify/Product/9492855095517',
    oldHandle: 'beautyinu-brightening-booster-gold-powder-serbuk-pemutih-badan-wajah-25-gram',
    newTitle: 'Brightening Booster Gold Powder 25gr (Classic Edition)',
    newHandle: 'brightening-booster-gold-powder-25gr-classic',
    productType: 'Booster Powder',
    descriptionHtml: `<p><strong>Booster Pencerah 3x Lebih Cepat (Classic Edition).</strong> Serbuk booster pencerah kulit tubuh berkonsentrasi tinggi dengan Niacinamide 5.22%, Alpha Arbutin 2.30%, Kakadu Plum, Glutathione, dan Salicylic Acid. Diformulasikan khusus untuk dicampurkan ke dalam body lotion atau lulur mandi guna mempercepat proses regenerasi sel kulit dan mencerahkan kulit tubuh yang kusam serta belang.</p><p><strong>Keunggulan Utama:</strong></p><ul><li>Konsentrasi aktif Niacinamide 5.22% &amp; Alpha Arbutin 2.30% teruji klinis</li><li>Ekstrak Kakadu Plum alami kaya Vitamin C untuk antioksidan tinggi</li><li>Praktis dicampurkan ke body lotion harian atau lulur mandi mingguan</li><li>Bebas merkuri, bebas hidrokuinon, dan tidak membuat kulit tampak abu-abu</li><li>Ternotifikasi BPOM NA18240200017 dan aman untuk usia 12+</li></ul>`,
    seo: {
      title: 'Brightening Booster Gold Powder 25gr Classic — Beautyinu',
      description: 'Serbuk booster pencerah 25gr Classic Edition dengan Niacinamide 5.22% & Alpha Arbutin 2.30%. Campuran lotion dan masker tubuh untuk kulit tampak cerah merata.'
    },
    collectionsToJoin: [
      'gid://shopify/Collection/455670300893',
      'gid://shopify/Collection/462376599773'
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/47908820320477',
        price: '55350.00',
        compareAtPrice: '75000.00',
        sku: '1G-25-CLASSIC',
        inventoryPolicy: 'CONTINUE'
      }
    ],
    metafields: [
      {
        namespace: 'custom',
        key: 'cara_pakai',
        type: 'rich_text_field',
        value: makeRichText([
          'Cara Pemakaian:',
          '1. Pemakaian Harian (Campuran Body Lotion): Tuangkan 1 botol (25gr) serbuk ke dalam botol lotion 400–750ml, lalu kocok hingga larut merata. Atau campurkan secubit serbuk dengan lotion di telapak tangan saat akan digunakan.',
          '2. Pemakaian Mingguan (Masker / Lulur Tubuh): Campurkan serbuk dengan body cream atau lulur mandi dengan rasio 1:1. Oleskan ke seluruh tubuh, diamkan 10–15 menit, lalu bilas bersih.',
          'Catatan: Jangan mencampur dengan produk yang mengandung AHA/BHA konsentrasi sangat tinggi atau retinol dosis tinggi.'
        ])
      },
      {
        namespace: 'custom',
        key: 'ingredients',
        type: 'rich_text_field',
        value: makeRichText([
          'Hero Ingredients & Fungsinya:',
          '• Niacinamide 5.22%: Mencerahkan kulit secara intensif, merawat skin barrier, dan mengurangi kusam.',
          '• Alpha Arbutin 2.30%: Menyamarkan noda hitam, hiperpigmentasi, dan meratakan warna kulit.',
          '• Kakadu Plum Extract: Sumber alami Vitamin C tertinggi untuk melindungi kulit dari kerusakan radikal bebas.',
          '• Glutathione & Salicylic Acid: Antioksidan kuat dan eksfoliasi ringan untuk membersihkan sel kulit mati.'
        ])
      },
      {
        namespace: 'custom',
        key: 'manfaat',
        type: 'rich_text_field',
        value: makeRichText([
          'Manfaat Utama:',
          '• Mempercepat hasil cerah lotion harian hingga 3x lipat.',
          '• Membantu meratakan warna kulit yang belang akibat paparan matahari.',
          '• Menjadikan kulit tubuh terasa lebih halus, cerah, dan glowing sehat.',
          '• Aman digunakan jangka panjang dengan izin edar resmi BPOM NA18240200017.'
        ])
      }
    ]
  }
];

const publicationIds = [
  'gid://shopify/Publication/192248676573', // Online Store
  'gid://shopify/Publication/192248709341', // Point of Sale
  'gid://shopify/Publication/215659970781'  // Beautyinu Skincare Headless
];

console.log(`Starting activation & sync for ${productsToActivate.length} draft/archived products...\n`);

for (let i = 0; i < productsToActivate.length; i++) {
  const p = productsToActivate[i];
  console.log(`================================================================`);
  console.log(`[${i + 1}/${productsToActivate.length}] Perfecting & Activating: ${p.newTitle}`);
  console.log(`  - ID: ${p.id}`);
  console.log(`  - Target Handle: ${p.newHandle}`);

  // 1. Update Product details, SEO, Collections, Metafields, and STATUS = ACTIVE
  const productInput = {
    id: p.id,
    title: p.newTitle,
    handle: p.newHandle,
    productType: p.productType,
    descriptionHtml: p.descriptionHtml,
    status: 'ACTIVE',
    redirectNewHandle: true,
    seo: p.seo,
    collectionsToJoin: p.collectionsToJoin,
    metafields: p.metafields.map(m => ({
      namespace: m.namespace,
      key: m.key,
      value: m.value,
      type: m.type
    }))
  };

  const prodMutation = `
    mutation productUpdate($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
          handle
          status
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const prodVarsPath = '/tmp/shopify_sync_draft_prod_vars.json';
  const prodQueryPath = '/tmp/shopify_sync_draft_prod_query.graphql';
  fs.writeFileSync(prodVarsPath, JSON.stringify({ input: productInput }));
  fs.writeFileSync(prodQueryPath, prodMutation);

  try {
    const prodCmd = `npx shopify store execute --store ${store} --query-file "${prodQueryPath}" --variable-file "${prodVarsPath}" --allow-mutations --json`;
    const prodRes = JSON.parse(execSync(prodCmd, { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }));
    if (prodRes.productUpdate?.userErrors?.length > 0) {
      console.error(`  ❌ User errors on productUpdate:`, prodRes.productUpdate.userErrors);
    } else {
      console.log(`  ✓ Product set to ACTIVE: "${prodRes.productUpdate?.product?.title}" (handle: ${prodRes.productUpdate?.product?.handle}, status: ${prodRes.productUpdate?.product?.status})`);
    }
  } catch (err) {
    console.error(`  ❌ Failed productUpdate:`, err.message);
  }

  // 2. Update Variants: Price, Compare-at, SKU, and inventoryPolicy: CONTINUE
  const variantInputs = p.variants.map(v => ({
    id: v.id,
    price: v.price,
    compareAtPrice: v.compareAtPrice,
    inventoryPolicy: v.inventoryPolicy,
    inventoryItem: {
      sku: v.sku,
      tracked: true
    }
  }));

  const variantMutation = `
    mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          title
          price
          compareAtPrice
          inventoryPolicy
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const varVarsPath = '/tmp/shopify_sync_draft_var_vars.json';
  const varQueryPath = '/tmp/shopify_sync_draft_var_query.graphql';
  fs.writeFileSync(varVarsPath, JSON.stringify({ productId: p.id, variants: variantInputs }));
  fs.writeFileSync(varQueryPath, variantMutation);

  try {
    const varCmd = `npx shopify store execute --store ${store} --query-file "${varQueryPath}" --variable-file "${varVarsPath}" --allow-mutations --json`;
    const varRes = JSON.parse(execSync(varCmd, { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }));
    if (varRes.productVariantsBulkUpdate?.userErrors?.length > 0) {
      console.error(`  ❌ User errors on productVariantsBulkUpdate:`, varRes.productVariantsBulkUpdate.userErrors);
    } else {
      const count = varRes.productVariantsBulkUpdate?.productVariants?.length;
      console.log(`  ✓ ${count} variant(s) updated with inventoryPolicy CONTINUE, price ${p.variants[0].price} & compareAt ${p.variants[0].compareAtPrice}`);
    }
  } catch (err) {
    console.error(`  ❌ Failed productVariantsBulkUpdate:`, err.message);
  }

  // 3. Publish to all 3 sales channels (Publications)
  const publishMutation = `
    mutation publishProduct($id: ID!, $input: [PublicationInput!]!) {
      publishablePublish(id: $id, input: $input) {
        publishable {
          availablePublicationsCount {
            count
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const pubVarsPath = '/tmp/shopify_sync_pub_vars.json';
  const pubQueryPath = '/tmp/shopify_sync_pub_query.graphql';
  fs.writeFileSync(pubVarsPath, JSON.stringify({
    id: p.id,
    input: publicationIds.map(pubId => ({ publicationId: pubId }))
  }));
  fs.writeFileSync(pubQueryPath, publishMutation);

  try {
    const pubCmd = `npx shopify store execute --store ${store} --query-file "${pubQueryPath}" --variable-file "${pubVarsPath}" --allow-mutations --json`;
    const pubRes = JSON.parse(execSync(pubCmd, { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }));
    if (pubRes.publishablePublish?.userErrors?.length > 0) {
      console.error(`  ❌ User errors on publishablePublish:`, pubRes.publishablePublish.userErrors);
    } else {
      console.log(`  ✓ Published to 3 sales channels (Online Store, Point of Sale, Headless)`);
    }
  } catch (err) {
    console.error(`  ❌ Failed publishablePublish:`, err.message);
  }
}

// 4. Update the local catalog file
const catalogFile = __dirname + '/catalog/products-cleaned-2026-09-16.json';
let existingCatalog = JSON.parse(fs.readFileSync(catalogFile, 'utf8'));

// Filter out any existing entries of these 5 products if present
const targetIds = productsToActivate.map(p => p.id);
existingCatalog = existingCatalog.filter(p => !targetIds.includes(p.id));

// Add all 5 products
existingCatalog.push(...productsToActivate);

fs.writeFileSync(catalogFile, JSON.stringify(existingCatalog, null, 2));
console.log(`\n================================================================`);
console.log(`Local catalog updated! Total products now in local cleaned catalog: ${existingCatalog.length}`);

// Clean up temporary files
try {
  fs.unlinkSync('/tmp/shopify_sync_draft_prod_vars.json');
  fs.unlinkSync('/tmp/shopify_sync_draft_prod_query.graphql');
  fs.unlinkSync('/tmp/shopify_sync_draft_var_vars.json');
  fs.unlinkSync('/tmp/shopify_sync_draft_var_query.graphql');
  fs.unlinkSync('/tmp/shopify_sync_pub_vars.json');
  fs.unlinkSync('/tmp/shopify_sync_pub_query.graphql');
} catch (_) {}

console.log(`Finished successfully!`);
