import fs from 'fs';
import path from 'path';

// Define the type for a product, matching your JSON structure
export interface Product {
  id: string;
  slug: string;
  category_slug: string;
  sub_category_slug?: string;
  name_th: string;
  name_cn: string;
  short_description: Record<string, string>;
  full_description_html: Record<string, string>;
  images: string[];
  detail_infographic_images?: string[];
  pricing_tier: any;
  specs: Record<string, string>;
  variants?: string[];
}

const productsDirectory = path.join(process.cwd(), 'src/data/products');

/**
 * Recursively fetches all JSON files in a directory
 */
function getAllJsonFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllJsonFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.json')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

/**
 * Reads all product JSON files and returns an array of products
 */
export function getAllProducts(): Product[] {
  if (!fs.existsSync(productsDirectory)) {
    return [];
  }
  
  const files = getAllJsonFiles(productsDirectory);
  const products: Product[] = [];

  for (const file of files) {
    try {
      const fileContents = fs.readFileSync(file, 'utf8');
      const product = JSON.parse(fileContents);
      products.push(product);
    } catch (error) {
      console.error(`Error reading product file ${file}:`, error);
    }
  }

  return products;
}

/**
 * Gets a single product by slug
 */
export function getProductBySlug(slug: string): Product | undefined {
  const allProducts = getAllProducts();
  return allProducts.find((p) => p.slug === slug);
}
