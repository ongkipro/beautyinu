const fs = require('fs');
const { execSync } = require('child_process');

const store = 'p1d3wg-6i.myshopify.com';
const cwd = '/Users/ongki';

console.log(`Starting refinement of collections on store ${store}...\n`);

// 1. Update frontpage collection title to "All Products"
const frontpageInput = {
  id: 'gid://shopify/Collection/455670300893',
  title: 'All Products',
  handle: 'frontpage',
  descriptionHtml: '<p>Katalog lengkap seluruh rangkaian produk perawatan tubuh Beautyinu. Dari body lotion jumbo ber-UV Filter, serbuk booster pencerah, krim tubuh bernutrisi, hingga paket bundling hemat terdaftar resmi BPOM.</p>',
  seo: {
    title: 'All Products — Beautyinu Official Store',
    description: 'Katalog lengkap produk perawatan tubuh Beautyinu. Rangkaian lotion, booster powder, sabun kefir, dan body cream resmi BPOM untuk kulit cerah dan sehat.'
  },
  image: {
    src: 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_10.png?v=1781661867',
    altText: 'Beautyinu All Products Collection'
  }
};

const updateMutation = `
  mutation collectionUpdate($input: CollectionInput!) {
    collectionUpdate(input: $input) {
      collection {
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

const varsPath1 = '/tmp/shopify_refine_fp_vars.json';
const queryPath1 = '/tmp/shopify_refine_fp_query.graphql';
fs.writeFileSync(varsPath1, JSON.stringify({ input: frontpageInput }));
fs.writeFileSync(queryPath1, updateMutation);

try {
  const cmd = `npx shopify store execute --store ${store} --query-file "${queryPath1}" --variable-file "${varsPath1}" --allow-mutations --json`;
  const res = JSON.parse(execSync(cmd, { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }));
  if (res.collectionUpdate?.userErrors?.length > 0) {
    console.error(`  ❌ User errors:`, res.collectionUpdate.userErrors);
  } else {
    console.log(`  ✓ Updated frontpage title to: "${res.collectionUpdate?.collection?.title}"`);
  }
} catch (e) {
  console.error(`  ❌ Failed updating frontpage:`, e.message);
}

// 2. Ensure best-sellers has sortOrder = MANUAL
const bestSellersSortInput = {
  id: 'gid://shopify/Collection/462376665309',
  sortOrder: 'MANUAL'
};

const varsPath2 = '/tmp/shopify_refine_bs_sort_vars.json';
fs.writeFileSync(varsPath2, JSON.stringify({ input: bestSellersSortInput }));

try {
  const cmd = `npx shopify store execute --store ${store} --query-file "${queryPath1}" --variable-file "${varsPath2}" --allow-mutations --json`;
  const res = JSON.parse(execSync(cmd, { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }));
  if (res.collectionUpdate?.userErrors?.length > 0) {
    console.error(`  ❌ User errors:`, res.collectionUpdate.userErrors);
  } else {
    console.log(`  ✓ Set best-sellers sortOrder to MANUAL`);
  }
} catch (e) {
  console.error(`  ❌ Failed setting sortOrder:`, e.message);
}

// 3. Reorder products in best-sellers
const reorderMoves = [
  { id: 'gid://shopify/Product/9492855390429', newPosition: '0' }, // Booster Gold Powder 25gr
  { id: 'gid://shopify/Product/9492853293277', newPosition: '1' }, // Lotion Jumbo 750ml
  { id: 'gid://shopify/Product/9492846510301', newPosition: '2' }, // Body Cream Grape
  { id: 'gid://shopify/Product/9565836968157', newPosition: '3' }, // Glowing Set (3-in-1)
  { id: 'gid://shopify/Product/9492855587037', newPosition: '4' }, // Kefir Collagen Soap 60gr
  { id: 'gid://shopify/Product/9492853915869', newPosition: '5' }, // Body Wash 250ml
  { id: 'gid://shopify/Product/9566029906141', newPosition: '6' }, // Lotion & Booster Set
  { id: 'gid://shopify/Product/9566120313053', newPosition: '7' }  // Complete Set (5-in-1)
];

const reorderMutation = `
  mutation collectionReorderProducts($id: ID!, $moves: [MoveInput!]!) {
    collectionReorderProducts(id: $id, moves: $moves) {
      job {
        id
        done
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const varsPath3 = '/tmp/shopify_refine_reorder_vars.json';
const queryPath3 = '/tmp/shopify_refine_reorder_query.graphql';
fs.writeFileSync(varsPath3, JSON.stringify({
  id: 'gid://shopify/Collection/462376665309',
  moves: reorderMoves
}));
fs.writeFileSync(queryPath3, reorderMutation);

try {
  const cmd = `npx shopify store execute --store ${store} --query-file "${queryPath3}" --variable-file "${varsPath3}" --allow-mutations --json`;
  const res = JSON.parse(execSync(cmd, { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }));
  if (res.collectionReorderProducts?.userErrors?.length > 0) {
    console.error(`  ❌ User errors on reorder:`, res.collectionReorderProducts.userErrors);
  } else {
    console.log(`  ✓ Successfully reordered 8 products in Best Sellers!`);
  }
} catch (e) {
  console.error(`  ❌ Failed reordering:`, e.message);
}

// 4. Update local collections json
const localColFile = __dirname + '/collections/collections-cleaned-2026-09-16.json';
const localCols = JSON.parse(fs.readFileSync(localColFile, 'utf8'));
const fp = localCols.find(c => c.handle === 'frontpage');
if (fp) {
  fp.title = 'All Products';
  fp.descriptionHtml = frontpageInput.descriptionHtml;
  fp.seo = frontpageInput.seo;
}
fs.writeFileSync(localColFile, JSON.stringify(localCols, null, 2));
console.log(`\nUpdated local collections file: ${localColFile}`);

// Clean up
try {
  fs.unlinkSync(varsPath1);
  fs.unlinkSync(queryPath1);
  fs.unlinkSync(varsPath2);
  fs.unlinkSync(varsPath3);
  fs.unlinkSync(queryPath3);
} catch (_) {}

console.log(`All refinements completed!`);
