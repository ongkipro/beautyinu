const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const STORE = 'p1d3wg-6i.myshopify.com';
const CWD = '/Users/ongki';

const articlesToUpdate = [
  {
    id: 'gid://shopify/Article/597303787741',
    title: 'Tren Skinification: Standar Baru Perawatan Kulit Tubuh di Indonesia',
    filePath: '/Users/ongki/Projects/beautyinu-hydrogen/data/blog_images/tren-skinification-bodycare-indonesia.webp',
    fileName: 'tren-skinification-bodycare-indonesia.webp',
    altText: 'Tren Skinification Perawatan Kulit Tubuh Indonesia — Beautyinu'
  },
  {
    id: 'gid://shopify/Article/597304639709',
    title: 'Beautyinu Catat Penjualan 1 Juta Produk di Tengah Tren Bodycare Racikan',
    filePath: '/Users/ongki/Projects/beautyinu-hydrogen/data/blog_images/beautyinu-1-juta-produk-booster-racikan.webp',
    fileName: 'beautyinu-1-juta-produk-booster-racikan.webp',
    altText: 'Pencapaian Penjualan 1 Juta Produk Booster Racikan — Beautyinu'
  },
  {
    id: 'gid://shopify/Article/597304672477',
    title: 'Tren Wellness Holistik: Integrasi Perawatan Tubuh & Aktivitas Luar Ruang',
    filePath: '/Users/ongki/Projects/beautyinu-hydrogen/data/blog_images/tren-wellness-holistik-perawatan-tubuh-outdoor.webp',
    fileName: 'tren-wellness-holistik-perawatan-tubuh-outdoor.webp',
    altText: 'Perawatan Tubuh Holistik Aktivitas Luar Ruang Bersama Beautyinu'
  },
  {
    id: 'gid://shopify/Article/597304738013',
    title: 'Program Sosial Glow & Grow: Menjunjung Etika Dokumentasi Empatik',
    filePath: '/Users/ongki/Projects/beautyinu-hydrogen/data/blog_images/program-sosial-glow-grow-moonbabies.webp',
    fileName: 'program-sosial-glow-grow-moonbabies.webp',
    altText: 'Program Sosial Moonbabies Dokumentasi Empatik — Beautyinu'
  },
  {
    id: 'gid://shopify/Article/597304770781',
    title: '7 Urutan Perawatan Tubuh Cuaca Tropis yang Aman untuk Remaja',
    filePath: '/Users/ongki/Projects/beautyinu-hydrogen/data/blog_images/7-urutan-perawatan-tubuh-cuaca-tropis-remaja.webp',
    fileName: '7-urutan-perawatan-tubuh-cuaca-tropis-remaja.webp',
    altText: '7 Urutan Perawatan Tubuh Tropis untuk Remaja — Beautyinu'
  },
  {
    id: 'gid://shopify/Article/597921300701',
    title: 'Program Distributor Resmi Beautyinu: Tumbuh Bersama & Capai Lebih Banyak',
    filePath: '/Users/ongki/Projects/beautyinu-hydrogen/data/blog_images/program-distributor-resmi-beautyinu.webp',
    fileName: 'program-distributor-resmi-beautyinu.webp',
    altText: 'Program Kemitraan Distributor Resmi — Beautyinu'
  }
];

function runShopifyGraphQL(query, vars = {}) {
  const qPath = `/tmp/shopify_gql_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.graphql`;
  const vPath = `/tmp/shopify_vars_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.json`;

  fs.writeFileSync(qPath, query);
  fs.writeFileSync(vPath, JSON.stringify(vars));

  try {
    const cmd = `npx shopify store execute --store ${STORE} --query-file ${qPath} --variable-file ${vPath} --allow-mutations --json`;
    const res = execSync(cmd, { encoding: 'utf-8', cwd: CWD });
    const jsonStart = res.indexOf('{');
    if (jsonStart === -1) throw new Error(`Invalid JSON output: ${res}`);
    return JSON.parse(res.slice(jsonStart));
  } finally {
    try { fs.unlinkSync(qPath); } catch (e) {}
    try { fs.unlinkSync(vPath); } catch (e) {}
  }
}

async function uploadFileAndSetArticleImage(article) {
  console.log(`\n--------------------------------------------------`);
  console.log(`Processing: "${article.title}"`);
  console.log(`File: ${article.fileName}`);

  const fileBuffer = fs.readFileSync(article.filePath);

  // 1. stagedUploadsCreate
  const stagedMutation = `mutation StagedUpload($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets {
        url
        resourceUrl
        parameters {
          name
          value
        }
      }
      userErrors { field message }
    }
  }`;

  const stagedVars = {
    input: [{
      resource: 'IMAGE',
      filename: article.fileName,
      mimeType: 'image/webp',
      httpMethod: 'POST'
    }]
  };

  const stagedRes = runShopifyGraphQL(stagedMutation, stagedVars);
  const target = stagedRes.stagedUploadsCreate.stagedTargets[0];
  if (!target) {
    throw new Error(`Failed to stage upload for ${article.fileName}: ${JSON.stringify(stagedRes)}`);
  }

  // 2. Upload via multipart/form-data
  const formData = new FormData();
  for (const param of target.parameters) {
    formData.append(param.name, param.value);
  }
  const blob = new Blob([fileBuffer], { type: 'image/webp' });
  formData.append('file', blob, article.fileName);

  const uploadRes = await fetch(target.url, {
    method: 'POST',
    body: formData
  });

  if (uploadRes.status !== 201 && uploadRes.status !== 200) {
    const errText = await uploadRes.text();
    throw new Error(`Upload failed with status ${uploadRes.status}: ${errText}`);
  }
  console.log(`  ✅ Staged file uploaded to Google Cloud Storage (HTTP ${uploadRes.status})`);

  // 3. Update article with new image
  const updateMutation = `mutation UpdateArticle($id: ID!, $article: ArticleUpdateInput!) {
    articleUpdate(id: $id, article: $article) {
      article {
        id
        title
        image {
          url
          altText
        }
      }
      userErrors { field message }
    }
  }`;

  const updateVars = {
    id: article.id,
    article: {
      image: {
        url: target.resourceUrl,
        altText: article.altText
      }
    }
  };

  const updateRes = runShopifyGraphQL(updateMutation, updateVars);
  const errors = updateRes.articleUpdate.userErrors;
  if (errors && errors.length > 0) {
    throw new Error(`Article update failed: ${JSON.stringify(errors)}`);
  }

  const updatedImage = updateRes.articleUpdate.article.image;
  console.log(`  🎉 Article image updated successfully!`);
  console.log(`  CDN URL: ${updatedImage.url}`);
  console.log(`  Alt Text: "${updatedImage.altText}"`);
}

async function main() {
  console.log('=== UPDATING ALL 6 BLOG ARTICLE IMAGES (WEBP, 3:2, NATURAL HD) ===');
  for (const article of articlesToUpdate) {
    await uploadFileAndSetArticleImage(article);
  }
  console.log('\n======================================================');
  console.log('🎉 ALL 6 BLOG ARTICLES NOW HAVE PERFECT WEBP IMAGES!');
  console.log('======================================================');
}

main().catch(err => {
  console.error('Error during execution:', err);
  process.exit(1);
});
