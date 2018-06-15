import { Component, Element } from '@stencil/core';

import { Character } from '../../services/character';

@Component({
  tag: 'madness-labyrinth',
  styleUrl: 'madness-labyrinth.scss'
})
export class MadnessLabyrinth {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  currentSecond: number = 0;
  frameCount: number = 0;
  frameLastSecond: number = 0;
  gameMap: number[] = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 0, 0, 0, 1, 0, 1, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 0, 0,
    0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
    0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
    0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ];
  keysDown: any = {
    37: false,
    38: false,
    39: false,
    40: false
  };
  lastFrameTime: number = 0;
  mapTileWidth: number = 10;
  mapTileHeight: number = 10;
  player: Character;
  tileWidth: number = 40;
  tileHeight: number = 40;
  
  @Element() gameEl: any;

  drawGame() {
    if (this.ctx === null) {
      return;
    }

    var sec = Math.floor(Date.now() / 1000);
    if (sec !== this.currentSecond) {
      this.currentSecond = sec;
      this.frameLastSecond = this.frameCount;
      this.frameCount = 1;
    } else {
      this.frameCount = this.frameCount + 1;
    }

    for (let y = 0; y < this.mapTileHeight; y++) {
      for(let x = 0; x < this.mapTileWidth; x++) {
        switch(this.gameMap[((y*this.mapTileWidth)+x)]) {
          case 0:
            this.ctx.fillStyle = "#999999";
            break;
          default:
            this.ctx.fillStyle = "#eeeeee";
        }

        this.ctx.fillRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);
      }
    }

    this.ctx.fillStyle = '#FF0000';
    this.ctx.fillText(`FPS: ${this.frameLastSecond}`, 10, 20);

    requestAnimationFrame(this.drawGame.bind(this));
  }

  componentDidLoad() {
    this.player = new Character({
      tileWidth: this.tileWidth,
      tileHeight: this.tileHeight
    });
    this.canvas = this.gameEl.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.font = 'bold 10pt sans-serif';
    requestAnimationFrame(this.drawGame.bind(this));
  }

  render() {
    return (
      <canvas width="400" height="400" />
    );
  }
}
