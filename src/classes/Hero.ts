import { ELEMENTS, GRAVITY } from '../constants';
import { c } from '../core/main';
import { Coor, HeroSprites, Size, SpriteTypes } from '../types';
import { Sprite } from './Sprite';

export class Hero extends Sprite {
  keyConfig: any;
  lastKey: string | undefined;
  velocity: Coor;
  health: number;
  dead: boolean;
  isAttacking: boolean;
  attackBox: any;
  sprites: HeroSprites;

  constructor({
    keyConfig,
    position,
    size,
    velocity,
    imgSrc,
    scale = 1,
    frames = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: { x: 0, y: 0 }, width: undefined, height: undefined },
  }: {
    keyConfig: any;
    position: Coor;
    size: Size;
    velocity: Coor;
    imgSrc: string;
    scale: number;
    frames: number;
    offset: Coor;
    sprites: HeroSprites;
    attackBox: {
      offset: Coor;
    } & Partial<Size>;
  }) {
    super({ position, size, imgSrc, scale, frames, offset });

    this.keyConfig = keyConfig;
    this.lastKey = '';
    this.velocity = velocity;

    this.health = 1;
    this.dead = false;

    this.isAttacking = false;
    this.attackBox = {
      position,
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };

    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      sprites[sprite as SpriteTypes].image = new Image();
      // @ts-ignore
      sprites[sprite as SpriteTypes].image.src = sprites[sprite as SpriteTypes].imgSrc;
    }
  }

  isBound() {
    return this.position.x + this.width + this.velocity.x > ELEMENTS.canvas.width
      ? 1
      : this.position.x < this.width
      ? -1
      : 0;
  }
  isOnGround() {
    return this.position.y + this.height + this.velocity.y > ELEMENTS.canvas.height - 97;
  }

  attack() {
    // if (this.isAttacking) return;
    this.switchSprite('attack');
    this.isAttacking = true;
  }
  takeHit(hitToTake: number) {
    this.health -= hitToTake;

    if (this.health <= 0) {
      this.switchSprite('death');
    } else this.switchSprite('takeHit');
  }

  switchSprite(sprite: string, spriteId?: number) {
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.frames - 1) this.dead = true;
      return;
    }

    // Overiding others animations
    if (this.image === this.sprites.attack.image && this.framesCurrent < this.sprites.attack.frames - 1) return;
    if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.frames - 1) return;

    switch (sprite) {
      case 'idle':
      case 'run':
      case 'jump':
      case 'fall':
      case 'takeHit':
      case 'death':
        if (this.image !== this.sprites[sprite].image) {
          this.image = this.sprites[sprite].image;
          this.frames = this.sprites[sprite].frames;
          this.framesCurrent = 0;
        }
        break;
      case 'attack':
        console.log(spriteId);
        if (this.image !== this.sprites[sprite].image) {
          this.image = this.sprites[sprite].image;
          this.frames = this.sprites[sprite].frames;
          this.framesCurrent = 0;
        }
        break;
    }
  }

  drawSkeleton() {
    c.fillStyle = 'red';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    if (this.isAttacking) {
      c.fillStyle = 'yellow';
      c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
    }
  }

  update() {
    this.draw();
    // this.drawSkeleton();

    !this.dead && this.animate();

    this.attackBox.position = {
      x: this.position.x + this.attackBox.offset.x,
      y: this.position.y + this.attackBox.offset.y,
    };

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.isOnGround()) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else this.velocity.y += GRAVITY;
  }
}
