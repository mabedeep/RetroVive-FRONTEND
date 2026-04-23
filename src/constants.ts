/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SystemConfig } from './types';

export const SYSTEMS: SystemConfig[] = [
  {
    id: 'mame',
    name: 'MAME',
    fullname: 'Multiple Arcade Machine Emulator',
    manufacturer: 'Various',
    releaseYear: 1997,
    logo: 'mame_logo.png',
    background: 'mame_bg.jpg',
    folder: 'mame',
    type: 'arcade',
  },
  {
    id: 'neogeo',
    name: 'Neo Geo',
    fullname: 'SNK Neo Geo AES',
    manufacturer: 'SNK',
    releaseYear: 1990,
    logo: 'neogeo_logo.png',
    background: 'neogeo_bg.jpg',
    folder: 'neogeo',
    type: 'arcade',
  },
  {
    id: 'snes',
    name: 'SNES',
    fullname: 'Super Nintendo Entertainment System',
    manufacturer: 'Nintendo',
    releaseYear: 1990,
    logo: 'snes_logo.png',
    background: 'snes_bg.jpg',
    folder: 'snes',
    type: 'console',
  },
];

export const THEMES = [
  { id: 'default', name: 'Retro Dark' },
  { id: 'classic', name: 'Classic Blue' },
  { id: 'modern', name: 'Modern Glass' },
];
