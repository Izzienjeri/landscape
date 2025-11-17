import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../public');
const allowedExtensions = ['.jpg', '.jpeg', '.png'];

// Optimization settings
const QUALITY = 75; // Reduced from 80
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;

const optimizeAndOverwrite = async (dir) => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await optimizeAndOverwrite(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      const baseName = path.basename(file, ext);

      if (allowedExtensions.includes(ext)) {
        const webpPath = path.join(dir, `${baseName}.webp`);

        try {
          // Get original dimensions
          const metadata = await sharp(fullPath).metadata();
          
          // Resize if too large
          const shouldResize = metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT;
          
          let pipeline = sharp(fullPath);
          
          if (shouldResize) {
            pipeline = pipeline.resize(MAX_WIDTH, MAX_HEIGHT, {
              withoutEnlargement: true,
              fit: 'inside'
            });
          }

          await pipeline
            .webp({ 
              quality: QUALITY,
              effort: 6, // Max compression effort
              smartSubsample: true
            })
            .toFile(webpPath);

          // Delete original
          fs.unlinkSync(fullPath);
          
          const originalSize = stat.size;
          const newSize = fs.statSync(webpPath).size;
          const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
          
          console.log(`✔ ${file} → ${baseName}.webp (${savings}% smaller)`);
        } catch (err) {
          console.error(`✖ Error processing ${file}:`, err.message);
        }
      }
    }
  }
};

console.log('🖼️  Starting image optimization...\n');
optimizeAndOverwrite(inputDir).then(() => {
  console.log('\n✅ All images optimized and converted to WebP!');
});