const fs = require('fs');
const { execSync } = require('child_process');

const store = 'p1d3wg-6i.myshopify.com';
const cwd = '/Users/ongki';

function executeGraphQL(query, variables = {}) {
  const varsPath = '/tmp/shopify_blog_vars.json';
  const queryPath = '/tmp/shopify_blog_query.graphql';
  fs.writeFileSync(varsPath, JSON.stringify(variables));
  fs.writeFileSync(queryPath, query);

  const cmd = `npx shopify store execute --store ${store} --query-file "${queryPath}" --variable-file "${varsPath}" --allow-mutations --json`;
  const raw = execSync(cmd, { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const parsed = JSON.parse(raw);
  return parsed.data || parsed;
}

const articlesData = [
  {
    id: 'gid://shopify/Article/597303787741',
    handle: 'tren-skinification-mengubah-standar-perawatan-tubuh-konsumen-urban-di-indonesia',
    title: 'Tren Skinification Mengubah Standar Perawatan Tubuh Konsumen Urban di Indonesia',
    tags: ['Beautyinu', 'Skinification', 'Body Care', 'Edukasi'],
    summary: 'Tren skinification mendorong konsumen urban menerapkan standar bahan aktif skincare wajah ke seluruh tubuh dengan kandungan Niacinamide dan Glutathione.',
    imageAlt: 'Tren Skinification Perawatan Tubuh Beautyinu',
    seo: {
      title: 'Tren Skinification Perawatan Tubuh Indonesia — Beautyinu',
      description: 'Ulasan pergeseran tren skinification konsumen urban Indonesia dalam menerapkan standar bahan aktif skincare wajah ke rutinitas perawatan tubuh.'
    },
    internalLinkHtml: `
<p><strong>Rekomendasi Produk Terkait:</strong></p>
<ul>
<li><a href="/collections/body-care"><strong>👉 Jelajahi Seluruh Koleksi Body Care Beautyinu &rarr;</strong></a></li>
<li><a href="/products/bright-glow-body-wash-250ml"><strong>👉 Lihat Produk Bright Glow Body Wash 250ml &rarr;</strong></a></li>
</ul>
`
  },
  {
    id: 'gid://shopify/Article/597304639709',
    handle: 'beautyinu-catat-penjualan-1-juta-produk-seiring-naiknya-tren-bodycare-racikan',
    title: 'Beautyinu Catat Penjualan 1 Juta Produk Seiring Naiknya Tren Bodycare Racikan',
    tags: ['Beautyinu', 'Brightening Booster Gold Powder', 'Tren Kecantikan', 'Berita'],
    summary: 'Beautyinu mencatat penjualan 1 juta produk didorong oleh tingginya antusiasme konsumen terhadap Brightening Booster Gold Powder sebagai racikan bodycare cerah.',
    imageAlt: 'Pencapaian 1 Juta Produk Beautyinu Skincare',
    seo: {
      title: 'Beautyinu Raih 1 Juta Penjualan Produk Bodycare — Beautyinu',
      description: 'Pencapaian penjualan 1 juta produk Beautyinu seiring tren penggunaan racikan booster pencerah kulit tubuh yang efektif dan terdaftar resmi BPOM.'
    },
    internalLinkHtml: `
<p><strong>Rekomendasi Produk Terkait:</strong></p>
<ul>
<li><a href="/products/brightening-booster-gold-powder-25gr"><strong>👉 Lihat Produk Brightening Booster Gold Powder 25g &rarr;</strong></a></li>
<li><a href="/collections/best-sellers"><strong>👉 Koleksi Produk Terlaris (Best Sellers) Beautyinu &rarr;</strong></a></li>
</ul>
`
  },
  {
    id: 'gid://shopify/Article/597304672477',
    handle: 'tren-kesehatan-holistik-menguat-perawatan-tubuh-kini-terintegrasi-dengan-aktivitas-luar-ruang',
    title: 'Tren Kesehatan Holistik Menguat, Perawatan Tubuh Kini Terintegrasi dengan Aktivitas Luar Ruang',
    tags: ['Beautyinu', 'Gaya Hidup', 'Wellness', 'Body Care'],
    summary: 'Perawatan tubuh kini menjadi bagian gaya hidup aktif di luar ruang dengan kombinasi proteksi UV Filter dan hidrasi kulit optimal sepanjang hari.',
    imageAlt: 'Perawatan Tubuh Holistik Aktivitas Luar Ruang Beautyinu',
    seo: {
      title: 'Perawatan Tubuh Holistik & Aktivitas Luar Ruang — Beautyinu',
      description: 'Evolusi perawatan tubuh holistik yang menyatukan gaya hidup aktif luar ruang dengan proteksi UV Filter dan hidrasi intensif Beautyinu.'
    },
    internalLinkHtml: `
<p><strong>Rekomendasi Produk Terkait:</strong></p>
<ul>
<li><a href="/products/bright-glow-body-lotion-uv-filter-750ml"><strong>👉 Lihat Produk Bright Glow Body Lotion UV Filter 750ml &rarr;</strong></a></li>
<li><a href="/collections/body-care"><strong>👉 Rangkaian Lengkap Proteksi Tubuh Harian &rarr;</strong></a></li>
</ul>
`
  },
  {
    id: 'gid://shopify/Article/597304738013',
    handle: 'tinggalkan-gaya-lama-beautyinu-terapkan-etika-dokumentasi-empatik-dalam-program-sosial-glow-grow',
    title: 'Tinggalkan Gaya Lama, Beautyinu Terapkan Etika Dokumentasi Empatik dalam Program Sosial Glow & Grow',
    tags: ['Beautyinu', 'Moonbabies', 'CSR', 'Sosial'],
    summary: 'Melalui gerakan sosial Moonbabies, Beautyinu menerapkan etika dokumentasi yang menjaga martabat penerima manfaat dan mengedepankan empati sejati.',
    imageAlt: 'Program Sosial Glow & Grow Komunitas Beautyinu',
    seo: {
      title: 'Etika Dokumentasi Empatik Program Sosial — Beautyinu',
      description: 'Komitmen Beautyinu dalam menerapkan etika dokumentasi empatik pada program sosial Moonbabies demi menjaga martabat dan privasi penerima manfaat.'
    },
    internalLinkHtml: `
<p><strong>Pelajari Lebih Lanjut Inisiatif Kami:</strong></p>
<ul>
<li><a href="/pages/about"><strong>👉 Kenali Program Moonbabies & Komunitas Beautyinu &rarr;</strong></a></li>
<li><a href="https://instagram.com/beautyinu.id" target="_blank" rel="noopener noreferrer"><strong>👉 Ikuti Dokumentasi Sosial di Instagram @beautyinu.id &rarr;</strong></a></li>
</ul>
`
  },
  {
    id: 'gid://shopify/Article/597304770781',
    handle: 'hadapi-cuaca-tropis-ini-7-urutan-perawatan-tubuh-harian-dengan-beautyinu-yang-aman-bagi-remaja',
    title: 'Hadapi Cuaca Tropis, Ini 7 Urutan Perawatan Tubuh Harian dengan Beautyinu yang Aman bagi Remaja',
    tags: ['Beautyinu', 'Bright Glow Body Lotion', 'Panduan Remaja', 'Edukasi'],
    summary: 'Panduan 7 langkah perawatan tubuh harian di iklim tropis yang aman dan ramah untuk remaja mulai usia 12 tahun menggunakan rangkaian produk ber-BPOM.',
    imageAlt: '7 Urutan Perawatan Tubuh Tropis Remaja Beautyinu',
    seo: {
      title: '7 Urutan Perawatan Tubuh Tropis untuk Remaja — Beautyinu',
      description: 'Panduan lengkap 7 tahapan perawatan tubuh harian di cuaca tropis yang aman dan efektif bagi remaja mulai usia 12 tahun bersama Beautyinu.'
    },
    internalLinkHtml: `
<p><strong>Panduan & Produk Rekomendasi:</strong></p>
<ul>
<li><a href="/pages/faq"><strong>👉 Baca Panduan Takaran & Penggunaan di Halaman FAQ &rarr;</strong></a></li>
<li><a href="/collections/bundles"><strong>👉 Pilihan Paket Bundling Hemat Perawatan Tubuh &rarr;</strong></a></li>
</ul>
`
  },
  {
    id: 'gid://shopify/Article/597921300701',
    handle: 'tumbuh-bersama-capai-lebih-banyak',
    title: 'Tumbuh Bersama, Capai Lebih Banyak: Program Distributor Resmi Beautyinu',
    tags: ['Beautyinu', 'Distributor', 'Kemitraan', 'Bisnis'],
    summary: 'Peluang kemitraan distributor dan reseller resmi Beautyinu dengan produk fast-moving, materi promosi siap pakai, dan sistem pembinaan bisnis transparan.',
    imageAlt: 'Program Kemitraan Distributor Resmi Beautyinu',
    seo: {
      title: 'Peluang Kemitraan Distributor Resmi — Beautyinu',
      description: 'Bergabunglah dalam jaringan distributor resmi Beautyinu dengan margin menarik, materi promosi lengkap, dan dukungan bisnis berkelanjutan.'
    },
    internalLinkHtml: `
<p><a href="https://wa.me/6281936574690?text=Halo%20Admin%2C%20saya%20tertarik%20bergabung%20menjadi%20Distributor%20Beautyinu" target="_blank" rel="noopener noreferrer"><strong>👉 Hubungi Tim Kemitraan Distributor via WhatsApp (+62 819-3657-4690) &rarr;</strong></a></p>
<p><a href="/pages/contact"><strong>👉 Lihat Informasi Kontak Lengkap &rarr;</strong></a></p>
`
  }
];

async function run() {
  console.log('=== 1. SYNCING BLOG SEO METADATA ===');
  const blogMetaMutation = `
    mutation SetBlogMeta($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id key value }
        userErrors { field message }
      }
    }
  `;
  executeGraphQL(blogMetaMutation, {
    metafields: [
      {
        ownerId: 'gid://shopify/Blog/105422749917',
        namespace: 'global',
        key: 'title_tag',
        type: 'single_line_text_field',
        value: 'News & Beauty Journal — Beautyinu Official Store'
      },
      {
        ownerId: 'gid://shopify/Blog/105422749917',
        namespace: 'global',
        key: 'description_tag',
        type: 'multi_line_text_field',
        value: 'Edukasi perawatan tubuh, panduan skincare tropis harian, tren kecantikan, dan informasi program resmi Beautyinu.'
      }
    ]
  });
  console.log('  ✅ Blog SEO metafields updated.');

  console.log('\n=== 2. PERFECTING ALL 6 ARTICLES ===');
  const articleUpdateMutation = `
    mutation UpdateArticle($id: ID!, $article: ArticleUpdateInput!) {
      articleUpdate(id: $id, article: $article) {
        article {
          id
          title
          summary
          tags
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const metafieldsSetMutation = `
    mutation SetArticleMeta($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id key value }
        userErrors { field message }
      }
    }
  `;

  for (let i = 0; i < articlesData.length; i++) {
    const art = articlesData[i];
    console.log(`\n[${i + 1}/${articlesData.length}] Processing article: "${art.title}"...`);

    // Fetch existing body
    const getQuery = `query GetArt($id: ID!) { article(id: $id) { body image { url } } }`;
    const cur = executeGraphQL(getQuery, { id: art.id });
    const curArticle = cur.article || cur.data?.article;
    let newBody = curArticle.body || '';

    // Append internalLinkHtml if not already present
    if (!newBody.includes('Rekomendasi Produk Terkait') && !newBody.includes('Hubungi Tim Kemitraan Distributor')) {
      newBody = newBody.trim() + '\n\n' + art.internalLinkHtml.trim();
    }

    const updateInput = {
      title: art.title,
      summary: art.summary,
      tags: art.tags,
      body: newBody
    };

    if (curArticle.image?.url) {
      updateInput.image = {
        altText: art.imageAlt
      };
    }

    const resArt = executeGraphQL(articleUpdateMutation, {
      id: art.id,
      article: updateInput
    });

    if (resArt.articleUpdate?.userErrors?.length > 0) {
      console.error('  ❌ ArticleUpdate errors:', resArt.articleUpdate.userErrors);
    } else {
      console.log(`  ✅ Article updated: Summary=${art.summary.length} chars, Tags=${art.tags.length}`);
    }

    // Set SEO Metafields for Shopify Admin
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
      console.log(`  ✅ SEO Metafields set: "${art.seo.title}"`);
    }
  }

  console.log('\n======================================================');
  console.log('🎉 ALL BLOG ARTICLES PERFECTED SUCCESSFULLY IN SHOPIFY!');
  console.log('======================================================');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
