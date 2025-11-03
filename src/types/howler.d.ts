declare module 'howler' {
  export interface IHowlProperties {
    src: string | string[];
    volume?: number;
    html5?: boolean;
    loop?: boolean;
    preload?: boolean;
    autoplay?: boolean;
    mute?: boolean;
    sprite?: any;
    rate?: number;
    pool?: number;
    format?: string[];
    xhr?: any;
    onload?: () => void;
    onloaderror?: (soundId: number, error: any) => void;
    onplayerror?: (soundId: number, error: any) => void;
    onplay?: (soundId: number) => void;
    onend?: (soundId: number) => void;
    onpause?: (soundId: number) => void;
    onstop?: (soundId: number) => void;
    onmute?: (soundId: number) => void;
    onvolume?: (soundId: number) => void;
    onrate?: (soundId: number) => void;
    onseek?: (soundId: number) => void;
    onfade?: (soundId: number) => void;
  }

  export class Howl {
    constructor(properties: IHowlProperties);
    play(spriteOrId?: string | number): number;
    pause(id?: number): this;
    stop(id?: number): this;
    mute(muted?: boolean, id?: number): this | boolean;
    volume(volume?: number, id?: number): this | number;
    fade(from: number, to: number, duration: number, id?: number): this;
    rate(rate?: number, id?: number): this | number;
    seek(seek?: number, id?: number): this | number;
    loop(loop?: boolean, id?: number): this | boolean;
    playing(id?: number): boolean;
    duration(id?: number): number;
    state(): 'unloaded' | 'loading' | 'loaded';
    load(): this;
    unload(): void;
    on(event: string, callback: Function, id?: number): this;
    off(event?: string, callback?: Function, id?: number): this;
    once(event: string, callback: Function, id?: number): this;
  }

  export class Howler {
    static mute(muted: boolean): void;
    static volume(volume?: number): number | void;
    static stop(): void;
    static unload(): void;
    static codecs(ext: string): boolean;
    static usingWebAudio: boolean;
    static noAudio: boolean;
    static autoUnlock: boolean;
    static html5PoolSize: number;
    static autoSuspend: boolean;
    static ctx: AudioContext;
    static masterGain: GainNode;
  }
}
