export function createStatsToggleHandler(
  onToggle: () => void,
  key: string = "h"
): (e: KeyboardEvent) => void {
  return (e: KeyboardEvent) => {
    if (e.key === key || e.key === key.toUpperCase()) {
      onToggle();
    }
  };
}

export function toggleStatsDisplay(show?: boolean): void {
  const statsElement = document.getElementById("stats");
  if (!statsElement) return;

  if (show !== undefined) {
    statsElement.style.display = show ? "block" : "none";
  } else {
    const isVisible = statsElement.style.display !== "none";
    statsElement.style.display = isVisible ? "none" : "block";
  }
}

export function setupFPSMonitor(
  Stats: any,
  pixiRenderer: any,
  key: string = "h"
): { stats: any; handler: (e: KeyboardEvent) => void } {
  const stats = new Stats(pixiRenderer);
  toggleStatsDisplay(false);

  const handler = createStatsToggleHandler(() => toggleStatsDisplay(), key);
  window.addEventListener("keydown", handler);

  return { stats, handler };
}
