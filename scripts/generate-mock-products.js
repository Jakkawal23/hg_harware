const fs = require('fs');
const path = require('path');

const categoriesPath = path.join(__dirname, '../src/data/categories.json');
const productsDir = path.join(__dirname, '../src/data/products');

const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));

// Helper to create directory
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const generateProduct = (mainCat, subCat, index) => {
  const id = `p-${subCat.slug}-${index}`;
  const slug = `${subCat.slug}-mock-item-${index}`;
  
  return {
    id,
    slug,
    category_slug: mainCat.slug,
    sub_category_slug: subCat.slug,
    name_th: `${subCat.name_th} รุ่นทดสอบ ${index}`,
    name_cn: `${subCat.name_cn} 测试型号 ${index}`,
    short_description: {
      th: `รายละเอียดแบบย่อสำหรับ ${subCat.name_th} หมายเลข ${index} สินค้าคุณภาพสูง`,
      cn: `这是关于 ${subCat.name_cn} ${index} 的简短描述，高品质产品。`
    },
    full_description_html: {
      th: `<h4>รายละเอียดสินค้า</h4><p>นี่คือข้อมูลจำลองของ ${subCat.name_th} หมายเลข ${index} สำหรับใช้ทดสอบระบบ</p><ul><li>คุณสมบัติ 1</li><li>คุณสมบัติ 2</li></ul>`,
      cn: `<h4>产品详情</h4><p>这是 ${subCat.name_cn} ${index} 的测试数据，用于系统测试。</p><ul><li>特点 1</li><li>特点 2</li></ul>`
    },
    images: [
      `https://picsum.photos/seed/${id}1/800/800`,
      `https://picsum.photos/seed/${id}2/800/800`
    ],
    pricing_tier: {
      type: "range",
      price_display: {
        th: `${index * 100}.00 - ${index * 150}.00 บาท`,
        cn: `${index * 100}.00 - ${index * 150}.00 泰铢`
      },
      tiers: []
    },
    specs: {
      "Brand": "MockBrand",
      "Material": "Standard"
    },
    items: [
      {
        id: `${id}-sku-1`,
        sku: `SKU-${id}-1`,
        name_th: "ขนาดเล็ก",
        name_cn: "小号",
        price: index * 100,
        stock: 50
      },
      {
        id: `${id}-sku-2`,
        sku: `SKU-${id}-2`,
        name_th: "ขนาดใหญ่",
        name_cn: "大号",
        price: index * 150,
        stock: 20
      }
    ]
  };
};

categories.forEach(mainCat => {
  if (mainCat.sub_categories) {
    mainCat.sub_categories.forEach(subCat => {
      const targetDir = path.join(productsDir, mainCat.slug, subCat.slug);
      ensureDir(targetDir);

      // Generate 2 products for each sub-category
      for (let i = 1; i <= 2; i++) {
        const product = generateProduct(mainCat, subCat, i);
        const filePath = path.join(targetDir, `${product.slug}.json`);
        
        // Skip if it's one of the files we manually created earlier to avoid overwriting them
        if (
          product.slug === 'hex-bolt-din933-8-8' || 
          product.slug === 'angle-grinder-900w' || 
          product.slug === 'safety-helmet-abs'
        ) {
          continue;
        }

        fs.writeFileSync(filePath, JSON.stringify(product, null, 2), 'utf8');
        console.log(`Created ${filePath}`);
      }
    });
  }
});

console.log('Mock products generated successfully!');
