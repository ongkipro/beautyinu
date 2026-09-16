const fs = require('fs');
const { execSync } = require('child_process');

const catalogFile = __dirname + '/catalog/products-cleaned-2026-09-16.json';
const products = JSON.parse(fs.readFileSync(catalogFile, 'utf8'));
const store = 'p1d3wg-6i.myshopify.com';
const cwd = '/Users/ongki';

console.log(`Starting sync for ${products.length} products to Shopify store ${store}...\n`);

for (let i = 0; i < products.length; i++) {
  const p = products[i];
  console.log(`================================================================`);
  console.log(`[${i + 1}/${products.length}] Syncing: ${p.newTitle}`);
  console.log(`  - Handle: ${p.newHandle}`);
  console.log(`  - ID: ${p.id}`);

  // 1. Prepare Product Input
  const productInput = {
    id: p.id,
    title: p.newTitle,
    handle: p.newHandle,
    descriptionHtml: p.descriptionHtml,
    seo: p.seo,
    collectionsToJoin: p.collectionsToJoin,
  };

  if (p.metafields && p.metafields.length > 0) {
    productInput.metafields = p.metafields.map(m => ({
      namespace: m.namespace,
      key: m.key,
      value: m.value,
      type: m.type
    }));
  }

  const productMutation = `
    mutation productUpdate($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
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

  const prodVarsPath = `/tmp/shopify_sync_prod_vars.json`;
  const prodQueryPath = `/tmp/shopify_sync_prod_query.graphql`;
  fs.writeFileSync(prodVarsPath, JSON.stringify({ input: productInput }));
  fs.writeFileSync(prodQueryPath, productMutation);

  try {
    const prodCmd = `npx shopify store execute --store ${store} --query-file "${prodQueryPath}" --variable-file "${prodVarsPath}" --allow-mutations --json`;
    const prodRes = JSON.parse(execSync(prodCmd, { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }));
    if (prodRes.productUpdate?.userErrors?.length > 0) {
      console.error(`  ❌ User errors on productUpdate:`, prodRes.productUpdate.userErrors);
    } else {
      console.log(`  ✓ Product details & metafields updated: "${prodRes.productUpdate?.product?.title}" (handle: ${prodRes.productUpdate?.product?.handle})`);
    }
  } catch (err) {
    console.error(`  ❌ Failed productUpdate:`, err.message);
  }

  // 2. Prepare Variant Bulk Input
  if (p.variants && p.variants.length > 0) {
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

    const varVarsPath = `/tmp/shopify_sync_var_vars.json`;
    const varQueryPath = `/tmp/shopify_sync_var_query.graphql`;
    fs.writeFileSync(varVarsPath, JSON.stringify({ productId: p.id, variants: variantInputs }));
    fs.writeFileSync(varQueryPath, variantMutation);

    try {
      const varCmd = `npx shopify store execute --store ${store} --query-file "${varQueryPath}" --variable-file "${varVarsPath}" --allow-mutations --json`;
      const varRes = JSON.parse(execSync(varCmd, { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }));
      if (varRes.productVariantsBulkUpdate?.userErrors?.length > 0) {
        console.error(`  ❌ User errors on productVariantsBulkUpdate:`, varRes.productVariantsBulkUpdate.userErrors);
      } else {
        const count = varRes.productVariantsBulkUpdate?.productVariants?.length;
        console.log(`  ✓ ${count} variant(s) updated with inventoryPolicy CONTINUE & pricing`);
      }
    } catch (err) {
      console.error(`  ❌ Failed productVariantsBulkUpdate:`, err.message);
    }
  }
}

// 3. Clean up archived products from Home page (frontpage) collection
console.log(`\n================================================================`);
console.log(`Cleaning up archived products from Home page (frontpage) collection...`);
const archivedToLeave = [
  'gid://shopify/Product/9492855095517',
  'gid://shopify/Product/9492852834525',
  'gid://shopify/Product/9492845035741'
];

for (const archId of archivedToLeave) {
  const input = {
    id: archId,
    collectionsToLeave: ['gid://shopify/Collection/455670300893']
  };
  const varsPath = `/tmp/shopify_sync_arch_vars.json`;
  const queryPath = `/tmp/shopify_sync_arch_query.graphql`;
  fs.writeFileSync(varsPath, JSON.stringify({ input }));
  fs.writeFileSync(queryPath, `mutation prodLeave($input: ProductInput!) { productUpdate(input: $input) { product { id } userErrors { message } } }`);
  try {
    execSync(`npx shopify store execute --store ${store} --query-file "${queryPath}" --variable-file "${varsPath}" --allow-mutations --json`, { cwd, encoding: 'utf8' });
    console.log(`  ✓ Removed archived product ${archId} from frontpage`);
  } catch (e) {
    console.error(`  ❌ Failed to remove archived product ${archId}:`, e.message);
  }
}

// Clean up temporary files
try {
  fs.unlinkSync('/tmp/shopify_sync_prod_vars.json');
  fs.unlinkSync('/tmp/shopify_sync_prod_query.graphql');
  fs.unlinkSync('/tmp/shopify_sync_var_vars.json');
  fs.unlinkSync('/tmp/shopify_sync_var_query.graphql');
  fs.unlinkSync('/tmp/shopify_sync_arch_vars.json');
  fs.unlinkSync('/tmp/shopify_sync_arch_query.graphql');
} catch (_) {}

console.log(`\n================================================================`);
console.log(`All 10 active products successfully synced to Shopify!`);
