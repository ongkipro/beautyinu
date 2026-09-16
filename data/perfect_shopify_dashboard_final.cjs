const fs = require('fs');
const { execSync } = require('child_process');

const store = 'p1d3wg-6i.myshopify.com';
const cwd = '/Users/ongki';

function executeGraphQL(query, variables = {}) {
  const varsPath = '/tmp/shopify_final_vars.json';
  const queryPath = '/tmp/shopify_final_query.graphql';
  fs.writeFileSync(varsPath, JSON.stringify(variables));
  fs.writeFileSync(queryPath, query);

  const cmd = `npx shopify store execute --store ${store} --query-file "${queryPath}" --variable-file "${varsPath}" --allow-mutations --json`;
  const raw = execSync(cmd, { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const parsed = JSON.parse(raw);
  return parsed.data || parsed;
}

const productsToUpdate = [
  {
    id: 'gid://shopify/Product/9492845035741',
    title: 'Brightening Body Cream Grape 100g',
    productType: 'Body Cream',
    tags: ['body-care', 'brightening', 'cream', 'grape', 'travel-size', 'bpom-certified'],
    seo: {
      title: 'Brightening Body Cream Grape 100g — Beautyinu',
      description: 'Krim tubuh 100g beraroma anggur segar dengan Glutathione & Niacinamide. Melembapkan area kering, praktis travel-friendly. Resmi BPOM NA18230100799.'
    }
  },
  {
    id: 'gid://shopify/Product/9492846510301',
    title: 'Brightening Body Cream Grape',
    productType: 'Body Cream',
    tags: ['best-seller', 'body-care', 'brightening', 'cream', 'grape', 'bpom-certified'],
    seo: {
      title: 'Brightening Body Cream Grape — Beautyinu',
      description: 'Krim tubuh aroma anggur segar dengan Glutathione & Niacinamide. Dual fungsi pelembap harian atau masker bilas intensif. Resmi BPOM NA18230100799.'
    }
  },
  {
    id: 'gid://shopify/Product/9492852834525',
    title: 'Bright Glow Body Lotion UV Filter 750ml (Classic Edition)',
    productType: 'Body Lotion',
    tags: ['body-care', 'brightening', 'lotion', 'uv-protection', 'classic-edition', 'bpom-certified'],
    seo: {
      title: 'Bright Glow Body Lotion 750ml Classic — Beautyinu',
      description: 'Body lotion jumbo 750ml Classic Edition dengan UV Filter & Tranexamic Acid. Melindungi kulit dari sinar matahari tanpa rasa lengket. Resmi BPOM.'
    }
  },
  {
    id: 'gid://shopify/Product/9492853293277',
    title: 'Bright Glow Body Lotion UV Filter 750ml',
    productType: 'Body Lotion',
    tags: ['best-seller', 'body-care', 'brightening', 'lotion', 'uv-protection', 'bpom-certified'],
    seo: {
      title: 'Bright Glow Body Lotion UV Filter 750ml — Beautyinu',
      description: 'Body lotion jumbo 750ml dengan UV Filter & Tranexamic Acid. Cepat meresap, mencerahkan merata, bebas efek abu-abu. Resmi BPOM NA18230100798.'
    }
  },
  {
    id: 'gid://shopify/Product/9492853653725',
    title: 'English Pear Body Toner 100ml',
    productType: 'Body Toner',
    tags: ['body-care', 'brightening', 'english-pear', 'toner', 'bpom-certified'],
    seo: {
      title: 'English Pear Body Toner 100ml — Beautyinu',
      description: 'Body toner dengan keharuman mewah English Pear & Freesia. Diperkaya Niacinamide dan AHA untuk mengangkat sel kulit mati dan menyegarkan tubuh. Resmi BPOM.'
    }
  },
  {
    id: 'gid://shopify/Product/9492853915869',
    title: 'Bright Glow Body Wash 250ml',
    productType: 'Body Wash',
    tags: ['body-care', 'body-wash', 'brightening', 'bpom-certified'],
    seo: {
      title: 'Bright Glow Body Wash 250ml — Beautyinu',
      description: 'Sabun mandi cair wangi mango & milk dengan busa melimpah. Diperkaya Niacinamide, Alpha Arbutin, dan Glutathione untuk kulit bersih dan segar. Resmi BPOM.'
    }
  },
  {
    id: 'gid://shopify/Product/9492855095517',
    title: 'Brightening Booster Gold Powder 25g (Classic Edition)',
    productType: 'Booster Powder',
    tags: ['body-care', 'booster', 'brightening', 'powder', 'classic-edition', 'bpom-certified'],
    seo: {
      title: 'Brightening Booster Gold Powder 25g Classic — Beautyinu',
      description: 'Serbuk booster pencerah 25g Classic Edition dengan Niacinamide dan Kakadu Plum. Campurkan 3:1 dengan lotion untuk hasil cerah optimal. Resmi BPOM.'
    }
  },
  {
    id: 'gid://shopify/Product/9492855390429',
    title: 'Brightening Booster Gold Powder 25g',
    productType: 'Booster Powder',
    tags: ['best-seller', 'body-care', 'booster', 'brightening', 'powder', 'bpom-certified'],
    seo: {
      title: 'Brightening Booster Gold Powder 25g — Beautyinu',
      description: 'Serbuk booster konsentrat pencerah dengan Kakadu Plum, Niacinamide, dan Vitamin C. Efektif 3x lebih cepat dicampur body lotion. Resmi BPOM NA18231900224.'
    }
  },
  {
    id: 'gid://shopify/Product/9492855587037',
    title: 'Kefir Collagen Soap Bar 60g',
    productType: 'Soap Bar',
    tags: ['best-seller', 'body-care', 'brightening', 'collagen', 'kefir', 'soap', 'soap-bar', 'bpom-certified'],
    seo: {
      title: 'Kefir Collagen Soap Bar 60g — Beautyinu',
      description: 'Sabun batang pembersih dengan fermentasi kefir, collagen, dan glutathione. Membantu mencerahkan dan menjaga elastisitas kulit. Resmi BPOM NA18230500115.'
    }
  },
  {
    id: 'gid://shopify/Product/9535046648029',
    title: 'Brightening Body Cream Grape 200g',
    productType: 'Body Cream',
    tags: ['body-care', 'brightening', 'cream', 'grape', 'bpom-certified'],
    seo: {
      title: 'Brightening Body Cream Grape 200g — Beautyinu',
      description: 'Krim tubuh 200g beraroma anggur dengan Glutathione & Niacinamide. Ukuran besar hemat untuk perawatan intensif harian. Resmi BPOM NA18230100799.'
    }
  },
  {
    id: 'gid://shopify/Product/9565836968157',
    title: 'Glowing Set (3-in-1)',
    productType: 'Bundle & Value Set',
    tags: ['best-seller', 'brightening', 'bundle', 'value-set', 'bpom-certified'],
    seo: {
      title: 'Glowing Set 3-in-1 — Beautyinu Official',
      description: 'Paket perawatan kulit tubuh 3-in-1: Kefir Soap Bar 60g, Booster Gold Powder 25g, dan Body Lotion UV Filter 750ml. Rangkaian lengkap berizin BPOM.'
    }
  },
  {
    id: 'gid://shopify/Product/9566029906141',
    title: 'Lotion & Booster Set (2-in-1)',
    productType: 'Bundle & Value Set',
    tags: ['brightening', 'bundle', 'value-set', 'bpom-certified'],
    seo: {
      title: 'Lotion & Booster Set 2-in-1 — Beautyinu',
      description: 'Duo pencerah harian: Bright Glow Body Lotion UV Filter 750ml + Booster Gold Powder 25g. Sinergi booster pencerah dan proteksi UV berizin BPOM.'
    }
  },
  {
    id: 'gid://shopify/Product/9566071718109',
    title: 'Cream & Booster Set (2-in-1)',
    productType: 'Bundle & Value Set',
    tags: ['brightening', 'bundle', 'value-set', 'bpom-certified'],
    seo: {
      title: 'Cream & Booster Set 2-in-1 — Beautyinu',
      description: 'Duo pencerah intensif: Brightening Body Cream Grape 200g + Booster Gold Powder 25g. Perawatan malam hari ekstra melembapkan dan berizin resmi BPOM.'
    }
  },
  {
    id: 'gid://shopify/Product/9566120313053',
    title: 'Complete Brightening Set (5-in-1)',
    productType: 'Bundle & Value Set',
    tags: ['best-seller', 'brightening', 'bundle', 'complete-set', 'value-set', 'bpom-certified'],
    seo: {
      title: 'Complete Brightening Set 5-in-1 — Beautyinu',
      description: 'Rangkaian lengkap 5 produk perawatan tubuh Beautyinu: Sabun Mandi, Soap Bar, Toner, Lotion UV Filter, dan Body Cream. Formula lengkap berizin BPOM.'
    }
  },
  {
    id: 'gid://shopify/Product/9566138466525',
    title: 'Booster Gold Powder (7-Pack Value)',
    productType: 'Bundle & Value Set',
    tags: ['booster', 'brightening', 'bulk', 'bundle', 'value-set', 'bpom-certified'],
    seo: {
      title: 'Booster Gold Powder 7-Pack — Beautyinu',
      description: 'Paket hemat isi 7 pcs Brightening Booster Gold Powder 25g. Pilihan tepat untuk stok perawatan rutin atau pemakaian bersama keluarga. Resmi BPOM.'
    }
  }
];

async function run() {
  console.log('=== 1. POLISHING PAGE ABOUT (CLEANING WHATSAPP LINK) ===');
  const getAboutQuery = `{ page(id: "gid://shopify/Page/138083533021") { body } }`;
  const aboutRes = executeGraphQL(getAboutQuery);
  let aboutBody = (aboutRes.page || aboutRes.data?.page).body;
  if (aboutBody.includes('api.whatsapp.com/send/?phone=6281936574690&amp;text=')) {
    aboutBody = aboutBody.replace(
      'https://api.whatsapp.com/send/?phone=6281936574690&amp;text=Halo%20Admin%2C%20saya%20tertarik%20bergabung%20dengan%20Brightygengs%20Beautyinu',
      'https://wa.me/6281936574690?text=Halo%20Admin%2C%20saya%20tertarik%20bergabung%20dengan%20Brightygengs%20Beautyinu'
    );
    const updateAboutMutation = `
      mutation UpdateAbout($id: ID!, $page: PageUpdateInput!) {
        pageUpdate(id: $id, page: $page) {
          page { id title }
          userErrors { field message }
        }
      }
    `;
    const res = executeGraphQL(updateAboutMutation, {
      id: 'gid://shopify/Page/138083533021',
      page: { body: aboutBody }
    });
    console.log('  Page About WhatsApp link cleaned to wa.me format.');
  } else {
    console.log('  Page About WhatsApp link is already clean.');
  }

  console.log('\n=== 2. PERFECTING ALL 15 PRODUCTS (TITLES, TYPES, TAGS, SEO & METADATA) ===');
  const productUpdateMutation = `
    mutation UpdateProduct($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
          productType
          tags
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

  const metafieldsSetMutation = `
    mutation SetMetafields($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          namespace
          key
          value
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const productUpdateMediaMutation = `
    mutation UpdateProductMedia($productId: ID!, $media: [UpdateMediaInput!]!) {
      productUpdateMedia(productId: $productId, media: $media) {
        media {
          id
          alt
        }
        mediaUserErrors {
          field
          message
        }
      }
    }
  `;

  for (let i = 0; i < productsToUpdate.length; i++) {
    const pr = productsToUpdate[i];
    console.log(`\n[${i + 1}/${productsToUpdate.length}] Processing "${pr.title}"...`);

    // A. Update Product core properties
    const resProd = executeGraphQL(productUpdateMutation, {
      input: {
        id: pr.id,
        title: pr.title,
        productType: pr.productType,
        tags: pr.tags,
        seo: {
          title: pr.seo.title,
          description: pr.seo.description
        }
      }
    });

    if (resProd.productUpdate?.userErrors?.length > 0) {
      console.error('  ❌ ProductUpdate errors:', resProd.productUpdate.userErrors);
    } else {
      console.log(`  ✅ Product core updated: Type="${pr.productType}", Tags=${pr.tags.length}`);
    }

    // B. Set Admin Search Engine Preview Metafields
    const resMeta = executeGraphQL(metafieldsSetMutation, {
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

    if (resMeta.metafieldsSet?.userErrors?.length > 0) {
      console.error('  ❌ Metafields errors:', resMeta.metafieldsSet.userErrors);
    } else {
      console.log(`  ✅ Metafields set: title_tag & description_tag`);
    }

    // C. Fetch Product Media & Update Image Alt Texts (ONLY MediaImage)
    const getMediaQuery = `
      query GetMedia($id: ID!) {
        product(id: $id) {
          media(first: 20) {
            nodes {
              id
              mediaContentType
              ... on MediaImage {
                alt
              }
            }
          }
        }
      }
    `;
    const mediaRes = executeGraphQL(getMediaQuery, { id: pr.id });
    const mediaNodes = (mediaRes.product || mediaRes.data?.product)?.media?.nodes || [];
    const imageNodes = mediaNodes.filter(m => m.mediaContentType === 'IMAGE' && m.id);
    
    if (imageNodes.length > 0) {
      const mediaUpdates = imageNodes.map((m, idx) => {
        const altText = idx === 0 
          ? `${pr.title} — Beautyinu Skincare Official`
          : `${pr.title} — Detail & Kemasan ${idx + 1} Beautyinu`;
        return {
          id: m.id,
          alt: altText
        };
      });

      const resMedia = executeGraphQL(productUpdateMediaMutation, {
        productId: pr.id,
        media: mediaUpdates
      });

      if (resMedia.productUpdateMedia?.mediaUserErrors?.length > 0) {
        console.error('  ❌ Media alt errors:', resMedia.productUpdateMedia.mediaUserErrors);
      } else {
        console.log(`  ✅ Media alt texts updated for ${imageNodes.length} images`);
      }
    }
  }

  console.log('\n======================================================');
  console.log('🎉 ALL SHOPIFY DASHBOARD ASSETS PERFECTED SUCCESSFULLY!');
  console.log('======================================================');
}

run().catch(err => {
  console.error('Fatal error during update:', err);
  process.exit(1);
});
