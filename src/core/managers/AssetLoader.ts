import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TextureLoader, Object3D, Mesh } from "three";
import { Assets, Texture as PixiTexture } from "pixi.js";
import { Howl } from "howler";

export class AssetLoader {
  private gltfLoader: GLTFLoader;
  private textureLoader: TextureLoader;
  private loadedAssets: Map<string, any>;
  private pixiTextures: Map<string, PixiTexture>;
  private sounds: Map<string, Howl>;
  private music: Map<string, Howl>;
  private loadingProgress: Map<string, number>;
  private totalAssets: number;
  private loadedCount: number;
  private gltfObjects: Map<string, Object3D>;
  public animations: any[] = [];

  constructor() {
    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new TextureLoader();
    this.loadedAssets = new Map();
    this.pixiTextures = new Map();
    this.sounds = new Map();
    this.music = new Map();
    this.loadingProgress = new Map();
    this.gltfObjects = new Map();
    this.totalAssets = 0;
    this.loadedCount = 0;
  }

  async loadGLTF(path: string): Promise<any> {
    if (this.loadedAssets.has(path)) {
      return this.loadedAssets.get(path);
    }

    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        path,
        (gltf) => {
          this.loadedAssets.set(path, gltf);
          if (gltf.animations && gltf.animations.length > 0) {
            this.animations = gltf.animations;
          }
          this.extractGLTFObjects(gltf, path);
          this.loadedCount++;
          this.updateProgress(path, 1);
          resolve(gltf);
        },
        (progress) => {
          if (progress.total > 0) {
            this.updateProgress(path, progress.loaded / progress.total);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  private extractGLTFObjects(gltf: any, path: string): void {
    if (!gltf.scene) return;

    gltf.scene.traverse((child: Object3D) => {
      if (child.name && child.name !== "") {
        if (child.name === "Scene") return;

        const existing = this.gltfObjects.get(child.name);
        if (existing) {
          this.gltfObjects.delete(child.name);
        }
        this.gltfObjects.set(child.name, child);
      }
    });
  }

  getGLTFObject(name: string): Object3D | undefined {
    return this.gltfObjects.get(name);
  }

  async loadTexture(path: string): Promise<THREE.Texture> {
    if (this.loadedAssets.has(path)) {
      return this.loadedAssets.get(path);
    }

    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        path,
        (texture) => {
          this.loadedAssets.set(path, texture);
          this.loadedCount++;
          this.updateProgress(path, 1);
          resolve(texture);
        },
        (progress) => {
          if (progress.total > 0) {
            this.updateProgress(path, progress.loaded / progress.total);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async loadPixiImage(name: string, path: string): Promise<PixiTexture> {
    if (this.pixiTextures.has(name)) {
      return this.pixiTextures.get(name)!;
    }

    try {
      const texture = await Assets.load<PixiTexture>(path);
      this.pixiTextures.set(name, texture);
      this.loadedCount++;
      this.updateProgress(path, 1);
      return texture;
    } catch (error) {
      throw new Error(`Failed to load Pixi image: ${path} - ${error}`);
    }
  }

  async loadPixiImages(
    images: { name: string; path: string }[]
  ): Promise<void> {
    this.totalAssets += images.length;
    const promises = images.map(({ name, path }) =>
      this.loadPixiImage(name, path)
    );
    await Promise.all(promises);
  }

  async loadSound(
    id: string,
    path: string,
    volume: number = 1.0
  ): Promise<Howl> {
    if (this.sounds.has(id)) {
      return this.sounds.get(id)!;
    }

    return new Promise((resolve, reject) => {
      const sound = new Howl({
        src: [path],
        volume: volume,
        onload: () => {
          this.sounds.set(id, sound);
          this.loadedCount++;
          this.updateProgress(path, 1);
          resolve(sound);
        },
        onloaderror: (_, error) => {
          reject(new Error(`Failed to load sound: ${id} - ${error}`));
        },
      });
    });
  }

  async loadMusic(
    id: string,
    path: string,
    volume: number = 0.7
  ): Promise<Howl> {
    if (this.music.has(id)) {
      return this.music.get(id)!;
    }

    return new Promise((resolve, reject) => {
      const music = new Howl({
        src: [path],
        volume: volume,
        loop: true,
        onload: () => {
          this.music.set(id, music);
          this.loadedCount++;
          this.updateProgress(path, 1);
          resolve(music);
        },
        onloaderror: (_, error) => {
          reject(new Error(`Failed to load music: ${id} - ${error}`));
        },
      });
    });
  }

  async loadSounds(
    sounds: { id: string; path: string; volume?: number }[]
  ): Promise<void> {
    this.totalAssets += sounds.length;
    const promises = sounds.map(({ id, path, volume }) =>
      this.loadSound(id, path, volume)
    );
    await Promise.all(promises);
  }

  async loadMusicTracks(
    tracks: { id: string; path: string; volume?: number }[]
  ): Promise<void> {
    this.totalAssets += tracks.length;
    const promises = tracks.map(({ id, path, volume }) =>
      this.loadMusic(id, path, volume)
    );
    await Promise.all(promises);
  }

  async loadFromConfig(assetsConfig: {
    images?: { name: string; path: string }[];
    sounds?: { id: string; path: string; volume?: number }[];
    music?: { id: string; path: string; volume?: number }[];
  }): Promise<void> {
    const promises: Promise<any>[] = [];

    if (assetsConfig.images && assetsConfig.images.length > 0) {
      promises.push(this.loadPixiImages(assetsConfig.images));
    }

    if (assetsConfig.sounds && assetsConfig.sounds.length > 0) {
      promises.push(this.loadSounds(assetsConfig.sounds));
    }

    if (assetsConfig.music && assetsConfig.music.length > 0) {
      promises.push(this.loadMusicTracks(assetsConfig.music));
    }

    await Promise.all(promises);
  }

  async loadAll(assets: {
    gltf?: string[];
    textures?: string[];
    audio?: string[];
  }): Promise<void> {
    const promises: Promise<any>[] = [];

    if (assets.gltf) {
      this.totalAssets += assets.gltf.length;
      assets.gltf.forEach((path) => promises.push(this.loadGLTF(path)));
    }

    if (assets.textures) {
      this.totalAssets += assets.textures.length;
      assets.textures.forEach((path) => promises.push(this.loadTexture(path)));
    }

    await Promise.all(promises);
  }

  getAsset(path: string): any {
    return this.loadedAssets.get(path);
  }

  getTexture(name: string): PixiTexture | undefined {
    return this.pixiTextures.get(name);
  }

  getSound(id: string): Howl | undefined {
    return this.sounds.get(id);
  }

  getMusic(id: string): Howl | undefined {
    return this.music.get(id);
  }

  getAllSounds(): Map<string, Howl> {
    return this.sounds;
  }

  getAllMusic(): Map<string, Howl> {
    return this.music;
  }

  getProgress(): number {
    if (this.totalAssets === 0) return 0;
    return this.loadedCount / this.totalAssets;
  }

  private updateProgress(path: string, progress: number): void {
    this.loadingProgress.set(path, progress);
  }

  dispose(): void {
    this.loadedAssets.forEach((asset) => {
      if (asset.dispose) {
        asset.dispose();
      }
    });
    this.pixiTextures.forEach((texture) => {
      texture.destroy(true);
    });
    this.sounds.forEach((sound) => {
      sound.unload();
    });
    this.music.forEach((music) => {
      music.unload();
    });
    this.loadedAssets.clear();
    this.pixiTextures.clear();
    this.sounds.clear();
    this.music.clear();
    this.gltfObjects.clear();
    this.loadingProgress.clear();
    this.totalAssets = 0;
    this.loadedCount = 0;
  }
}
