
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readdirSync, statSync, mkdirSync } from 'fs';
import { promisify } from 'util';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const AUDIO_SETTINGS = {
  music: {
    bitrate: '64k',
    channels: 1,
    sampleRate: 22050,
    pattern: /theme|music|background|bgm/i,
  },
  sfx: {
    bitrate: '64k',
    channels: 1, 
    sampleRate: 22050,
    pattern: /.*/,
  },
};

function getAudioType(filename) {
  if (AUDIO_SETTINGS.music.pattern.test(filename)) {
    return 'music';
  }
  return 'sfx';
}

async function optimizeAudioFile(inputPath, outputPath, settings) {
  return new Promise((resolve, reject) => {
    const startSize = statSync(inputPath).size;

    ffmpeg(inputPath)
      .audioBitrate(settings.bitrate)
      .audioChannels(settings.channels)
      .audioFrequency(settings.sampleRate)
      .audioCodec('libmp3lame')
      .format('mp3')
      .on('end', () => {
        const endSize = existsSync(outputPath) ? statSync(outputPath).size : 0;
        resolve({
          inputPath,
          outputPath,
          originalSize: startSize,
          optimizedSize: endSize,
          saved: startSize - endSize,
        });
      })
      .on('error', (err) => {
        reject(err);
      })
      .save(outputPath);
  });
}

function findAudioFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      findAudioFiles(filePath, fileList);
    } else if (/\.(mp3|ogg|wav|m4a)$/i.test(file)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Main optimization function
 */
async function optimizeAudio() {
  const distPath = join(rootDir, 'dist/assets');

  if (!existsSync(distPath)) {
    console.log('❌ dist/assets not found. Run build first.');
    return;
  }

  console.log('🎵 Optimizing audio files in dist/assets...\n');

  try {
    const audioFiles = findAudioFiles(distPath);

    if (audioFiles.length === 0) {
      console.log('ℹ️  No audio files found to optimize.');
      return;
    }

    console.log(`📂 Found ${audioFiles.length} audio file(s)\n`);

    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;
    const results = [];


    const tempDir = join(rootDir, 'dist/temp-audio');
    if (!existsSync(tempDir)) {
      mkdirSync(tempDir, { recursive: true });
    }

    for (const inputFile of audioFiles) {
      const filename = inputFile.split('/').pop();
      const audioType = getAudioType(filename);
      const settings = AUDIO_SETTINGS[audioType];

      console.log(
        `  Processing: ${filename.padEnd(30)} [${audioType.toUpperCase()}]`
      );

      try {
        const tempOutput = join(tempDir, filename.replace(/\.\w+$/, '.mp3'));

        const result = await optimizeAudioFile(inputFile, tempOutput, settings);

        results.push({
          filename,
          audioType,
          ...result,
        });

        totalOriginalSize += result.originalSize;
        totalOptimizedSize += result.optimizedSize;

        const { renameSync } = await import('fs');
        renameSync(tempOutput, inputFile.replace(/\.\w+$/, '.mp3'));
      } catch (error) {
        console.error(`    ❌ Error: ${error.message}`);
      }
    }

    const { rmSync } = await import('fs');
    rmSync(tempDir, { recursive: true, force: true });

    console.log('\n✅ Optimized audio files:\n');

    results.forEach((result) => {
      const savedBytes = result.saved;
      const savedPercent =
        result.originalSize > 0
          ? ((savedBytes / result.originalSize) * 100).toFixed(1)
          : 0;

      const sizeKB = (result.optimizedSize / 1024).toFixed(2);
      const savedKB = (savedBytes / 1024).toFixed(2);

      console.log(
        `  ${result.filename.padEnd(30)} ${sizeKB.padStart(8)} KB  (saved: ${savedKB.padStart(8)} KB, ${savedPercent}%) [${result.audioType.toUpperCase()}]`
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

    console.log('💡 Settings used:');
    console.log(`   Music: ${AUDIO_SETTINGS.music.bitrate}, ${AUDIO_SETTINGS.music.channels}ch, ${AUDIO_SETTINGS.music.sampleRate}Hz`);
    console.log(`   SFX:   ${AUDIO_SETTINGS.sfx.bitrate}, ${AUDIO_SETTINGS.sfx.channels}ch, ${AUDIO_SETTINGS.sfx.sampleRate}Hz\n`);
  } catch (error) {
    console.error('❌ Error optimizing audio:', error.message);
    process.exit(1);
  }
}

optimizeAudio();
