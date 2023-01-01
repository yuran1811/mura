import { c } from '../core/main';
import { Coor, Size } from '../types';

export class Sprite {
  position: Coor;
  width: number;
  height: number;

  frames: number;
  framesCurrent: number;
  framesElapsed: number;
  framesHold: number;

  image: HTMLImageElement | undefined;
  scale: number;
  offset: Coor;

  constructor({
    position,
    size: { width, height },
    imgSrc,
    frames = 1,
    scale = 1,
    offset = { x: 0, y: 0 },
  }: {
    position: Coor;
    size: Size;
    frames?: number;
    imgSrc: string;
    scale?: number;
    offset?: Coor;
  }) {
    this.position = position;
    this.width = width;
    this.height = height;

    this.frames = frames;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 18;

    this.image = new Image();
    this.image.src = imgSrc;
    this.scale = scale;
    this.offset = offset;
  }

  draw() {
    if (!this?.image) return;

    c.drawImage(
      this.image,

      this.framesCurrent * (this.image.width / this.frames),
      0,
      this.image.width / this.frames,
      this.image.height,

      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.frames) * this.scale,
      this.image.height * this.scale
    );
  }

  animate() {
    if (++this.framesElapsed % this.framesHold === 0) {
      this.framesCurrent = (this.framesCurrent + 1) % this.frames;
    }
  }

  update() {
    this.draw();
    this.animate();
  }
}
