import { Component, Element, Listen } from '@stencil/core';

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
    0, 0, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 0, 0, 0, 0, 0, 1, 0,
    0, 1, 0, 0, 0, 0, 0, 0, 1, 0,
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

  @Listen('body:keydown')
  onKeyDown(event) {
    if (event.keyCode >= 37 && event.keyCode <= 40) {
      this.keysDown[event.keyCode] = true;
    }
  }

  @Listen('body:keyup')
  onKeyUp(event) {
    if (event.keyCode >= 37 && event.keyCode <= 40) {
      this.keysDown[event.keyCode] = false;
    }
  }

  drawGame() {
    if (this.ctx === null) {
      return;
    }

    var currentFrameTime = Date.now();
    //var timeElapsed = currentFrameTime = this.lastFrameTime;

    var sec = Math.floor(Date.now() / 1000);
    if (sec !== this.currentSecond) {
      this.currentSecond = sec;
      this.frameLastSecond = this.frameCount;
      this.frameCount = 1;
    } else {
      this.frameCount = this.frameCount + 1;
    }

    if (!this.player.processMovement(currentFrameTime)) {
      if (
        this.keysDown[38] && this.player.tileFrom[1] > 0 
        && this.gameMap[this.toIndex(this.player.tileFrom[0], this.player.tileFrom[1] - 1)] === 1
      ) {
        this.player.tileTo[1] -= 1;
      } else if (
        this.keysDown[40] && this.player.tileFrom[1] < (this.mapTileHeight - 1)
        && this.gameMap[this.toIndex(this.player.tileFrom[0], this.player.tileFrom[1] + 1)] === 1
      ) {
        this.player.tileTo[1] += 1;
      } else if (
        this.keysDown[37] && this.player.tileFrom[0] > 0
        && this.gameMap[this.toIndex(this.player.tileFrom[0] - 1, this.player.tileFrom[1])] === 1
      ) {
        this.player.tileTo[0] -= 1;
      } else if (
        this.keysDown[39] && this.player.tileFrom[0] < (this.mapTileWidth - 1)
        && this.gameMap[this.toIndex(this.player.tileFrom[0] + 1, this.player.tileFrom[1] + 1)] === 1
      ) {
        this.player.tileTo[0] += 1;
      }

      if (this.player.tileFrom[0] !== this.player.tileTo[0] || this.player.tileFrom[1] !== this.player.tileTo[1]) {
        this.player.timeMoved = currentFrameTime;
      }
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

    this.ctx.fillStyle = "#00FF00";
    this.ctx.fillRect(this.player.position[0], this.player.position[1], this.player.dimensions[0], this.player.dimensions[1]);

    this.ctx.fillStyle = '#FF0000';
    this.ctx.fillText(`FPS: ${this.frameLastSecond}`, 10, 20);

    this.lastFrameTime = currentFrameTime;
    requestAnimationFrame(this.drawGame.bind(this));
  }

  toIndex(x: number, y: number) {
    return ((y * this.mapTileWidth) + x);
  }

  componentDidLoad() {
    this.player = new Character({
      tileWidth: this.tileWidth,
      tileHeight: this.tileHeight,
      mapTileWidth: this.mapTileWidth,
      mapTileHeight: this.mapTileHeight
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
