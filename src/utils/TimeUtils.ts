export class TimeUtils {
  private static startTime: number = Date.now();

  static getTimestamp(): number {
    return Date.now();
  }

  static getElapsedTime(): number {
    return Date.now() - TimeUtils.startTime;
  }

  static resetTimer(): void {
    TimeUtils.startTime = Date.now();
  }

  static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  static formatMS(milliseconds: number): string {
    return TimeUtils.formatTime(milliseconds / 1000);
  }
}
