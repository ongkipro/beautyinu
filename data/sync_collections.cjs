const fs = require('fs');
const { execSync } = require('child_process');

const store = 'p1d3wg-6i.myshopify.com';
const cwd = '/Users/ongki';

const collectionsData = [
  {
    id: 'gid://shopify/Collection/462376599773',
    title: 'Body Care',
    handle: 'body-care',
    descriptionHtml: '<p>Rangkaian lengkap produk perawatan tubuh harian Beautyinu: body lotion jumbo ber-UV Filter, krim tubuh bernutrisi tinggi, sabun mandi pembersih segar, toner pembersih mendalam, dan serbuk booster pencerah. Diformulasikan secara sinergis dengan Niacinamide, Alpha Arbutin, Glutathione, dan Hyaluronic Complex untuk kulit tampak cerah, halus, dan terhidrasi optimal sepanjang hari.</p>',
    seo: {
      title: 'Koleksi Body Care Beautyinu — Perawatan Kulit Cerah & Sehat',
      description: 'Rangkaian lengkap body care Beautyinu berizin BPOM: sabun mandi, lotion UV filter, body cream, dan toner tubuh untuk kulit tampak cerah, lembut, dan glowing.'
    },
    image: {
      src: 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_9.png?v=1781661846',
      altText: 'Beautyinu Body Care Collection'
    }
  },
  {
    id: 'gid://shopify/Collection/462376632541',
    title: 'Bundles & Sets',
    handle: 'bundles',
    descriptionHtml: '<p>Pilihan paket bundling hemat perawatan tubuh Beautyinu. Dapatkan kombinasi sinergis 2-in-1, 3-in-1, hingga paket lengkap 5-in-1 dengan harga coret lebih hemat untuk hasil cerah dan glowing maksimal.</p>',
    seo: {
      title: 'Paket Hemat & Bundles Beautyinu — Lebih Hemat Lebih Glowing',
      description: 'Pilihan paket bundling perawatan tubuh Beautyinu dengan harga lebih hemat. Kombinasi lotion, booster gold powder, sabun kefir, dan body cream ber-BPOM.'
    },
    image: {
      src: 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/WebsiteBeautyinu-3.png?v=1784278179',
      altText: 'Beautyinu Bundles and Value Sets'
    }
  },
  {
    id: 'gid://shopify/Collection/462376665309',
    title: 'Best Sellers',
    handle: 'best-sellers',
    descriptionHtml: '<p>Produk perawatan tubuh terfavorit yang paling banyak diminati dan dipercaya ribuan konsumen di seluruh Indonesia. Dari serbuk booster pencerah 3x lebih cepat hingga body lotion jumbo 750ml untuk perlindungan harian keluarga.</p>',
    seo: {
      title: 'Produk Terlaris (Best Sellers) — Beautyinu Official Store',
      description: 'Jajaran produk terlaris Beautyinu yang menjadi favorit ribuan pengguna. Formula efektif mencerahkan, melembapkan, dan terdaftar resmi BPOM RI.'
    },
    image: {
      src: 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_6.png?v=1781661891',
      altText: 'Beautyinu Best Sellers Collection'
    }
  },
  {
    id: 'gid://shopify/Collection/455670300893',
    title: 'Featured Collection',
    handle: 'frontpage',
    descriptionHtml: '<p>Rangkaian produk unggulan Beautyinu untuk menemani rutinitas perawatan tubuh Anda. Diformulasikan ramah kulit dengan sertifikasi resmi BPOM untuk kulit tampak bersih, lembap, dan glowing terawat setiap hari.</p>',
    seo: {
      title: 'Produk Pilihan Beautyinu — Official Bodycare Store',
      description: 'Koleksi produk perawatan tubuh pilihan dari Beautyinu. Mulai dari lotion UV filter, booster powder, sabun kefir collagen, hingga body cream teruji BPOM.'
    },
    image: {
      src: 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_10.png?v=1781661867',
      altText: 'Beautyinu Featured Collection'
    }
  }
];

console.log(`Starting sync for ${collectionsData.length} collections to Shopify store ${store}...\n`);

const mutation = `
  mutation collectionUpdate($input: CollectionInput!) {
    collectionUpdate(input: $input) {
      collection {
        id
        title
        handle
        descriptionHtml
        seo {
          title
          description
        }
        image {
          url
          altText
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
  console.log(`[${i + 1}/${collectionsData.length}] Updating Collection: "${c.title}" (handle: ${c.handle})`);

  const input = {
    id: c.id,
    title: c.title,
    handle: c.handle,
    descriptionHtml: c.descriptionHtml,
    seo: c.seo,
    image: c.image
  };

  const varsPath = '/tmp/shopify_col_update_vars.json';
  const queryPath = '/tmp/shopify_col_update_query.graphql';
  fs.writeFileSync(varsPath, JSON.stringify({ input }));
  fs.writeFileSync(queryPath, mutation);

  try {
    const cmd = `npx shopify store execute --store ${store} --query-file "${queryPath}" --variable-file "${varsPath}" --allow-mutations --json`;
    const res = JSON.parse(execSync(cmd, { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }));

    if (res.collectionUpdate?.userErrors?.length > 0) {
      console.error(`  ❌ User errors:`, res.collectionUpdate.userErrors);
    } else {
      console.log(`  ✓ Successfully updated: "${res.collectionUpdate?.collection?.title}" (handle: ${res.collectionUpdate?.collection?.handle})`);
    }
  } catch (err) {
    console.error(`  ❌ Failed collectionUpdate:`, err.message);
  }
}

// Save local copy of updated collections
const localColFile = __dirname + '/collections/collections-cleaned-2026-09-16.json';
fs.writeFileSync(localColFile, JSON.stringify(collectionsData, null, 2));
console.log(`\nLocal collections file saved to: ${localColFile}`);

// Clean up temp files
try {
  fs.unlinkSync('/tmp/shopify_col_update_vars.json');
  fs.unlinkSync('/tmp/shopify_col_update_query.graphql');
} catch (_) {}

console.log(`\nAll collections updated and synced successfully!`);
