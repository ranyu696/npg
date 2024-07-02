declare module 'hls.js' {
  export default class Hls {
    static Events: any;
    static isSupported(): boolean;
    static default: typeof Hls;
    constructor(config?: any);
    loadSource(source: string): void;
    attachMedia(media: HTMLMediaElement): void;
    on(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback: (...args: any[]) => void): void;
    destroy(): void;
  }
}
