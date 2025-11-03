
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const optimizeImages = async () => {
  const distPath = join(rootDir, 'dist/assets');

  if (!existsSync(distPath)) {
    console.log('❌ dist/assets not found. Run build first.');
    return;
  }

  console.log('🖼️  Optimizing images in dist/assets...\n');

  try {
    const files = await imagemin([`${distPath}/**/*.{jpg,jpeg,png}`], {
      destination: distPath,
      glob: { expandDirectories: true },
      plugins: [
        imageminMozjpeg({
          quality: 60, 
          progressive: true,
        }),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });

    if (files.length === 0) {
      console.log('ℹ️  No images found to optimize.');
      return;
    }

    console.log('✅ Optimized images:\n');

    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;

    files.forEach((file) => {
      const originalSize = file.sourcePath
        ? statSync(file.sourcePath).size
        : 0;
      const optimizedSize = file.data.length;
      const savedBytes = originalSize - optimizedSize;
      const savedPercent =
        originalSize > 0
          ? ((savedBytes / originalSize) * 100).toFixed(1)
          : 0;

      totalOriginalSize += originalSize;
      totalOptimizedSize += optimizedSize;

      const fileName = file.destinationPath.split('/').pop();
      const sizeKB = (optimizedSize / 1024).toFixed(2);
      const savedKB = (savedBytes / 1024).toFixed(2);

      console.log(
        `  ${fileName.padEnd(30)} ${sizeKB.padStart(8)} KB  (saved: ${savedKB.padStart(8)} KB, ${savedPercent}%)`
      );
    });

    const totalSavedBytes = totalOriginalSize - totalOptimizedSize;
    const totalSavedPercent =
      totalOriginalSize > 0
        ? ((totalSavedBytes / totalOriginalSize) * 100).toFixed(1)
        : 0;

    console.log('\n📊 Summary:');
    console.log(
      `   Original:  ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`
    );
    console.log(
      `   Optimized: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`
    );
    console.log(
      `   Saved:     ${(totalSavedBytes / 1024 / 1024).toFixed(2)} MB (${totalSavedPercent}%)\n`
    );
  } catch (error) {
    console.error('❌ Error optimizing images:', error.message);
    process.exit(1);
  }
};

optimizeImages();
