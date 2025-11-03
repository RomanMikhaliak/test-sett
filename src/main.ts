import { App } from "@app";
import { loadGame } from "./games/registry";

async function main() {
  const gameName = __GAME_NAME__;

  try {
    const app = new App();
    await app.init();
    await loadGame(gameName, app);
  } catch (error) {
    throw error;
  }
}

main().catch((error) => {
  document.body.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #1a1a1a;
      color: #ff4444;
      font-family: monospace;
      flex-direction: column;
      padding: 20px;
    ">
      <h1>Failed to load application</h1>
      <pre style="background: #000; padding: 20px; border-radius: 8px; max-width: 800px; overflow: auto;">
${error.stack || error.message}
      </pre>
    </div>
  `;
});
