const fs = require('fs');
const { execSync } = require('child_process');

const store = 'p1d3wg-6i.myshopify.com';
const cwd = '/Users/ongki';

function executeGraphQL(query, variables = {}) {
  const varsPath = '/tmp/shopify_pages_vars.json';
  const queryPath = '/tmp/shopify_pages_query.graphql';
  fs.writeFileSync(varsPath, JSON.stringify(variables));
  fs.writeFileSync(queryPath, query);

  const cmd = `npx shopify store execute --store ${store} --query-file "${queryPath}" --variable-file "${varsPath}" --allow-mutations --json`;
  const raw = execSync(cmd, { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const parsed = JSON.parse(raw);
  return parsed.data || parsed;
}

const pagesToUpdate = [
  {
    id: 'gid://shopify/Page/138083533021',
    cleanTitle: 'About',
    seo: {
      title: 'About Beautyinu — Your Bodycare Bestie',
      description: 'Kenali Beautyinu dari CV. Dinare Anugrah Kosmetika. Filosofi glow with confidence, komunitas Moonbabies, Brightygengs, distributor resmi, dan komitmen BPOM.'
    }
  },
  {
    id: 'gid://shopify/Page/138083565789',
    cleanTitle: 'FAQ',
    seo: {
      title: 'FAQ & Panduan Produk — Beautyinu Official Store',
      description: 'Pertanyaan umum produk Beautyinu: takaran Gold Powder, body lotion UV filter, cara pakai body cream dibilas/tidak, sabun kefir, dan izin resmi BPOM.'
    }
  },
  {
    id: 'gid://shopify/Page/132654989533',
    cleanTitle: 'Contact',
    seo: {
      title: 'Contact Us — Layanan Pelanggan Resmi Beautyinu',
      description: 'Hubungi Customer Care Beautyinu via WhatsApp +62 877-7711-8186 dan Email support@beautyinu.id. Konsultasi produk bodycare, info resi, dan kemitraan distributor.'
    }
  },
  {
    id: 'gid://shopify/Page/138083598557',
    cleanTitle: 'Shipping & Returns',
    seo: {
      title: 'Kebijakan Pengiriman & Garansi Retur — Beautyinu',
      description: 'Informasi pengiriman JNE, SiCepat, J&T tiba 1-3 hari kota besar. Garansi retur 100% ganti baru untuk produk rusak dengan bukti video unboxing.'
    }
  }
];

async function run() {
  console.log('=== REFINING PAGES: SHORT NATURAL TITLES & RICH SEO METADATA ===');

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
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  for (let i = 0; i < pagesToUpdate.length; i++) {
    const p = pagesToUpdate[i];
    console.log(`\n[${i + 1}/${pagesToUpdate.length}] Updating page title to "${p.cleanTitle}"...`);

    const resPage = executeGraphQL(pageUpdateMutation, {
      id: p.id,
      page: {
        title: p.cleanTitle
      }
    });

    if (resPage.pageUpdate?.userErrors?.length > 0) {
      console.error('  ❌ PageUpdate errors:', resPage.pageUpdate.userErrors);
    } else {
      console.log(`  ✅ Page title updated to: "${resPage.pageUpdate?.page?.title}"`);
    }

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
      console.log(`  ✅ Metafields set: title_tag="${p.seo.title}"`);
    }
  }

  console.log('\n======================================================');
  console.log('🎉 ALL 4 PAGES CLEANED WITH NATURAL TITLES & RICH SEO!');
  console.log('======================================================');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
