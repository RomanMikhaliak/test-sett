import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);
const command = args[0] || 'dev';
const gameName = args[1] || 'garden';

const VALID_COMMANDS = ['dev', 'build', 'preview'];
const VALID_GAMES = ['garden'];

if (!VALID_COMMANDS.includes(command)) {
  process.exit(1);
}

if (!VALID_GAMES.includes(gameName)) {
  process.exit(1);
}

const env = {
  ...process.env,
  VITE_GAME_NAME: gameName,
};

let viteCommand;
switch (command) {
  case 'dev':
    viteCommand = 'vite';
    break;
  case 'build':
    viteCommand = 'vite build';
    break;
  case 'preview':
    viteCommand = 'vite preview';
    break;
}

const fullCommand = command === 'build' ? `tsc && ${viteCommand}` : viteCommand;

const child = spawn(fullCommand, {
  shell: true,
  stdio: 'inherit',
  env,
  cwd: resolve(__dirname, '..'),
});

child.on('error', (error) => {
  process.exit(1);
});

child.on('exit', (code) => {
  if (code !== 0) {
    process.exit(code);
  }
  process.exit(0);
});
