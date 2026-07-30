import fs from 'fs';
import path from 'path';

// Define the type for a product, matching your JSON structure
export interface Product {
  id: string;
  slug: string;
  name_th: string;
  name_cn: string;
  short_description?: Record<string, string>;
  full_description_html?: Record<string, string>;
  images?: string[];
  image?: string;
  detail_infographic_images?: string[];
  pricing_tier?: any;
  specs?: Record<string, string>;
  variants?: string[];
  price?: number;
}

export interface ProductGroup {
  id: string;
  main_category_slug: string;
  sub_category_slug: string;
  name_th: string;
  name_cn: string;
  products: Product[];
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
 * Reads all product JSON files and returns an array of product groups
 */
export function getAllProducts(): ProductGroup[] {
  if (!fs.existsSync(productsDirectory)) {
    return [];
  }
  
  const files = getAllJsonFiles(productsDirectory);
  const groups: ProductGroup[] = [];

  for (const file of files) {
    try {
      const fileContents = fs.readFileSync(file, 'utf8');
      const group = JSON.parse(fileContents) as ProductGroup;
      groups.push(group);
    } catch (error) {
      console.error(`Error reading product file ${file}:`, error);
    }
  }

  return groups;
}

/**
 * Gets a single product by slug
 */
export function getProductBySlug(slug: string): Product | undefined {
  const allGroups = getAllProducts();
  for (const group of allGroups) {
    const product = group.products.find((p) => p.slug === slug);
    if (product) {
      return product;
    }
  }
  return undefined;
}
