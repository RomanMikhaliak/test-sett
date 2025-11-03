import { Howl, Howler } from "howler";
import { AssetLoader } from "./AssetLoader";
import { CONFIG } from "@config";

export class AudioManager {
  private sounds: Map<string, Howl>;
  private music: Map<string, Howl>;
  private currentMusic: Howl | null;
  private isMuted: boolean;
  private masterVolume: number;
  private musicVolume: number;
  private sfxVolume: number;

  constructor() {
    this.sounds = new Map();
    this.music = new Map();
    this.currentMusic = null;
    this.isMuted = false;
    this.masterVolume = CONFIG.audio.masterVolume;
    this.musicVolume = CONFIG.audio.musicVolume;
    this.sfxVolume = CONFIG.audio.sfxVolume;

    Howler.volume(this.masterVolume);
  }

  async init(assetLoader: AssetLoader): Promise<void> {
    this.sounds = assetLoader.getAllSounds();
    this.music = assetLoader.getAllMusic();

    return Promise.resolve();
  }

  playSound(id: string, volume?: number): void {
    if (this.isMuted) return;

    const sound = this.sounds.get(id);
    if (sound) {
      if (volume !== undefined) {
        sound.volume(volume * this.sfxVolume);
      }
      sound.play();
    }
  }

  playMusic(id: string, loop: boolean = true): void {
    if (this.currentMusic) {
      this.currentMusic.stop();
    }

    const music = this.music.get(id);
    if (music) {
      music.loop(loop);
      if (!this.isMuted) {
        music.play();
      }
      this.currentMusic = music;
    }
  }

  stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  pauseMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.pause();
    }
  }

  resumeMusic(): void {
    if (this.currentMusic && !this.isMuted) {
      this.currentMusic.play();
    }
  }

  setMute(muted: boolean): void {
    this.isMuted = muted;
    Howler.mute(muted);
  }

  toggleMute(): void {
    this.setMute(!this.isMuted);
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    Howler.volume(this.masterVolume);
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.music.forEach((music) => music.volume(this.musicVolume));
    if (this.currentMusic) {
      this.currentMusic.volume(this.musicVolume);
    }
  }

  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach((sound) => sound.volume(this.sfxVolume));
  }

  getMasterVolume(): number {
    return this.masterVolume;
  }

  getMusicVolume(): number {
    return this.musicVolume;
  }

  getSFXVolume(): number {
    return this.sfxVolume;
  }

  isMusicPlaying(): boolean {
    return this.currentMusic !== null && this.currentMusic.playing();
  }

  dispose(): void {
    this.stopMusic();
    this.sounds.forEach((sound) => sound.unload());
    this.music.forEach((music) => music.unload());
    this.sounds.clear();
    this.music.clear();
  }
}
