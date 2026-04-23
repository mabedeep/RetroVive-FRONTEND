/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GameMetadata {
  id: string;
  path: string;
  name: string;
  desc: string;
  rating: number;
  releasedate: string;
  developer: string;
  publisher: string;
  genre: string;
  players: string;
  media: {
    box2d: string;
    box3d?: string;
    fanart?: string;
    logo?: string;
    marquee?: string;
    image?: string;
    video?: string;
  };
}

export interface SystemConfig {
  id: string;
  name: string;
  fullname: string;
  manufacturer: string;
  releaseYear: number;
  logo: string;
  background: string;
  folder: string;
  type: 'arcade' | 'console' | 'handheld';
}

export type NavAction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'SELECT' | 'BACK' | 'MENU';

export interface AppSettings {
  theme: string;
  volume: number;
  bgmEnabled: boolean;
  bgmVolume: number;
  controllerMapping: Record<NavAction, number>;
  analogSensitivity: number;
  analogDeadZone: number;
  systemBackgrounds: Record<string, string>;
}
