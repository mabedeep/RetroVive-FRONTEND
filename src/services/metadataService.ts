/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameMetadata, SystemConfig } from '../types';

export class MetadataService {
  static async parseGamelist(system: SystemConfig, xmlString: string): Promise<GameMetadata[]> {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const gameNodes = xmlDoc.getElementsByTagName("game");
    const games: GameMetadata[] = [];

    for (let i = 0; i < gameNodes.length; i++) {
      const node = gameNodes[i];
      const path = this.getNodeValue(node, "path");
      const romName = path.split('/').pop()?.replace(/\.[^/.]+$/, "") || "";

      // Construct media paths based on user requirement: media/{system}/{type}/{romName}
      const mediaBase = `/media/${system.folder}`;
      
      games.push({
        id: node.getAttribute("id") || romName,
        path: path,
        name: this.getNodeValue(node, "name") || romName,
        desc: this.getNodeValue(node, "desc"),
        rating: parseFloat(this.getNodeValue(node, "rating") || "0"),
        releasedate: this.getNodeValue(node, "releasedate"),
        developer: this.getNodeValue(node, "developer"),
        publisher: this.getNodeValue(node, "publisher"),
        genre: this.getNodeValue(node, "genre"),
        players: this.getNodeValue(node, "players"),
        media: {
          box2d: `${mediaBase}/box2d/${romName}.png`,
          box3d: `${mediaBase}/box3d/${romName}.png`,
          fanart: `${mediaBase}/fanart/${romName}.jpg`,
          logo: `${mediaBase}/logos/${romName}.png`,
          marquee: `${mediaBase}/marquee/${romName}.png`,
          image: `${mediaBase}/image/${romName}.jpg`,
          video: `${mediaBase}/video/${romName}.mp4`,
        }
      });
    }

    return games;
  }

  private static getNodeValue(parent: Element, tagName: string): string {
    const node = parent.getElementsByTagName(tagName)[0];
    return node ? node.textContent || "" : "";
  }
}
