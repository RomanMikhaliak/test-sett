import type { App } from "@app";

export interface GameModule {
  name: string;
  load: (app: App) => Promise<void>;
}

export const GAME_REGISTRY: Record<string, () => Promise<GameModule>> = {
  garden: async () => {
    const { GardenGame } = await import("./garden/GardenGame");
    return {
      name: "Garden Makeover",
      load: async (app: App) => {
        const game = new GardenGame(app);
        game.init();
        game.start();
        app.setGame(game);
      },
    };
  },
};

export async function loadGame(gameName: string, app: App): Promise<void> {
  const gameLoader = GAME_REGISTRY[gameName];

  if (!gameLoader) {
    const availableGames = Object.keys(GAME_REGISTRY).join(", ");
    throw new Error(
      `Game "${gameName}" not found. Available games: ${availableGames}`
    );
  }

  const gameModule = await gameLoader();

  await gameModule.load(app);
}
