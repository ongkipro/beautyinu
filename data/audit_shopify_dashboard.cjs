const fs = require('fs');
const { execSync } = require('child_process');

const store = 'p1d3wg-6i.myshopify.com';
const cwd = '/Users/ongki';

function executeGraphQL(query, variables = {}) {
  const varsPath = '/tmp/shopify_audit_vars.json';
  const queryPath = '/tmp/shopify_audit_query.graphql';
  fs.writeFileSync(varsPath, JSON.stringify(variables));
  fs.writeFileSync(queryPath, query);

  const cmd = `npx shopify store execute --store ${store} --query-file "${queryPath}" --variable-file "${varsPath}" --allow-mutations --json`;
  const raw = execSync(cmd, { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const parsed = JSON.parse(raw);
  return parsed.data || parsed;
}

const auditQuery = `
{
  pages(first: 20) {
    nodes {
      id
      handle
      title
      updatedAt
      body
      metafields(first: 10) {
        nodes {
          namespace
          key
          value
          type
        }
      }
    }
  }
  collections(first: 20) {
    nodes {
      id
      handle
      title
      updatedAt
      productsCount {
        precision
        count
      }
      seo {
        title
        description
      }
      metafields(first: 10) {
        nodes {
          namespace
          key
          value
          type
        }
      }
    }
  }
  products(first: 25) {
    nodes {
      id
      handle
      title
      vendor
      productType
      status
      tags
      seo {
        title
        description
      }
      metafields(first: 10) {
        nodes {
          namespace
          key
          value
          type
        }
      }
    }
  }
}
`;

const res = executeGraphQL(auditQuery);

if (res.errors) {
  console.error("GraphQL Errors:", JSON.stringify(res.errors, null, 2));
  process.exit(1);
}

console.log('================ AUDIT REPORT ================');
console.log('\n--- 1. PAGES (Total: ' + (res.pages?.nodes?.length || 0) + ') ---');
res.pages?.nodes?.forEach(p => {
  const hrCount = (p.body.match(/<hr/gi) || []).length;
  const linkMatches = p.body.match(/href="([^"]+)"/g) || [];
  const titleTag = p.metafields.nodes.find(m => m.namespace === 'global' && m.key === 'title_tag')?.value;
  const descTag = p.metafields.nodes.find(m => m.namespace === 'global' && m.key === 'description_tag')?.value;

  console.log(`Page: [${p.handle}] "${p.title}"`);
  console.log(`  HTML length: ${p.body.length} chars | <hr> tags: ${hrCount} | Links: ${linkMatches.length}`);
  console.log(`  Admin Metafields -> Title Tag: "${titleTag || ''}" | Desc Tag: "${descTag || ''}"`);
});

console.log('\n--- 2. COLLECTIONS (Total: ' + (res.collections?.nodes?.length || 0) + ') ---');
res.collections?.nodes?.forEach(c => {
  const titleTag = c.metafields.nodes.find(m => m.namespace === 'global' && m.key === 'title_tag')?.value;
  const descTag = c.metafields.nodes.find(m => m.namespace === 'global' && m.key === 'description_tag')?.value;
  console.log(`Collection: [${c.handle}] "${c.title}" (Products: ${c.productsCount?.count || 0})`);
  console.log(`  Native SEO -> Title: "${c.seo?.title || ''}" | Desc: "${c.seo?.description || ''}"`);
  console.log(`  Admin Metafields -> Title Tag: "${titleTag || ''}" | Desc Tag: "${descTag || ''}"`);
});

console.log('\n--- 3. PRODUCTS (Total: ' + (res.products?.nodes?.length || 0) + ') ---');
res.products?.nodes?.forEach((pr, idx) => {
  const titleTag = pr.metafields.nodes.find(m => m.namespace === 'global' && m.key === 'title_tag')?.value;
  const descTag = pr.metafields.nodes.find(m => m.namespace === 'global' && m.key === 'description_tag')?.value;
  console.log(`[${idx + 1}] "${pr.title}" (handle: ${pr.handle}, status: ${pr.status})`);
  console.log(`    Vendor: "${pr.vendor}" | Type: "${pr.productType}" | Tags: [${pr.tags.join(', ')}]`);
  console.log(`    Native SEO -> Title: "${pr.seo?.title || ''}" | Metafield: "${titleTag || ''}"`);
  console.log(`    Desc: "${pr.seo?.description?.substring(0, 60) || ''}..."`);
});
