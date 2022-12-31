import './styles/index.css';

import { FRAME_HEIGHT, FRAME_WIDTH, GRAVITY, MATCH_TIME } from './constants';
import { getCharDir, rectCollision, resetBackground } from './utils';

const $ = document.querySelector.bind(document);

const canvas = $('#app') as HTMLCanvasElement;
const c = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = FRAME_WIDTH;
canvas.height = FRAME_HEIGHT;

const ELEMENTS = {
  statusEle: $('.status') as HTMLDivElement,
  statusMesEle: $('.status .message') as HTMLDivElement,
  timeEle: $('.timer .time') as HTMLDivElement,

  playerHealthIndicator: $('#player-health .indicator') as HTMLDivElement,
  enemyHealthIndicator: $('#enemy-health .indicator') as HTMLDivElement,
};

const KEYS: {
  [key: string]: {
    pressed: number;
    maxPress?: number;
  };
} = {
  a: { pressed: 0 },
  d: { pressed: 0 },
  w: { pressed: 0, maxPress: 2 },
  s: { pressed: 0 },

  arrowleft: { pressed: 0 },
  arrowright: { pressed: 0 },
  arrowup: { pressed: 0, maxPress: 2 },
  arrowdown: { pressed: 0 },
};
const KEY_CONFIG = {
  player: { up: 'w', down: 's', left: 'a', right: 'd', attack: 'j' },
  enemy: { up: 'arrowup', down: 'arrowdown', left: 'arrowleft', right: 'arrowright', attack: '1' },
};

const app: {
  timerId: undefined | number;
  animationId: undefined | number;
} = {
  timerId: undefined,
  animationId: undefined,
};

const setMatchStatus = (status: string) => {
  ELEMENTS.statusEle.style.display = 'flex';
  ELEMENTS.statusMesEle.innerText = status;
  ELEMENTS.timeEle.innerText = '🔅';
};
const winnerDetect = (a: any, b: any) => {
  if (a.health === b.health) setMatchStatus('Tie');
  else if (a.health > b.health) setMatchStatus('Player 1 wins');
  else if (a.health < b.health) setMatchStatus('Player 2 wins');

  clearTimeout(app.timerId);
};
const setMatchTime = (time = MATCH_TIME) => {
  const timer = () => {
    ELEMENTS.timeEle.innerText = time + '';
    if (time > 0) {
      time--;
      app.timerId = setTimeout(timer, 1000);
    } else winnerDetect(player, enemy);
  };

  timer();
};

interface Coor {
  x: number;
  y: number;
}

class Sprite {
  position: Coor;
  width: number;
  height: number;
  offset: Coor;

  frames: number;
  framesCurrent: number;
  framesElapsed: number;
  framesHold: number;

  scale: number;
  image: HTMLImageElement;

  constructor({
    position,
    imgSrc,
    scale = 1,
    frames = 1,
    size: { width, height },
    offset = { x: 0, y: 0 },
  }: {
    position: Coor;
    imgSrc: string;
    scale?: number;
    frames?: number;
    size: { width: number; height: number };
    offset?: Coor;
  }) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.offset = offset;

    this.frames = frames;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 20;

    this.scale = scale;
    this.image = new Image();
    this.image.src = imgSrc;
  }

  draw() {
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
class Hero extends Sprite {
  velocity: Coor;
  keyConfig: any;
  color: string;
  health: number;
  dead: boolean;
  lastKey: string | undefined;
  isAttacking: boolean;
  attackBox: any;
  sprites: any;

  constructor({
    position,
    velocity,
    color,
    size,
    offset = { x: 0, y: 0 },
    keyConfig,
    imgSrc,
    scale = 1,
    frames = 1,
    sprites,
    attackBox = { offset: { x: 0, y: 0 }, width: undefined, height: undefined },
  }: {
    position: Coor;
    velocity: Coor;
    color: string;
    imgSrc: string;
    scale: number;
    frames: number;
    size: { width: number; height: number };
    offset: Coor;
    keyConfig: any;
    sprites: any;
    attackBox: {
      offset: Coor;
      width: number | undefined;
      height: number | undefined;
    };
  }) {
    super({ position, imgSrc, frames, scale, offset, size });

    this.velocity = velocity;
    this.keyConfig = keyConfig;
    this.color = color;

    this.health = 1;
    this.dead = false;

    this.lastKey = '';
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
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imgSrc;
    }
  }

  isBound() {
    return this.position.x + this.width + this.velocity.x > canvas.width ? 1 : this.position.x < this.width ? -1 : 0;
  }
  isOnGround() {
    return this.position.y + this.height + this.velocity.y > canvas.height - 97;
  }

  attack() {
    // if (this.isAttacking) return;

    this.switchSprite('attack1');
    this.isAttacking = true;
  }
  takeHit(hitToTake: number) {
    this.health -= hitToTake;

    if (this.health <= 0) {
      this.switchSprite('death');
    } else this.switchSprite('takeHit');
  }

  switchSprite(sprite: string) {
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.frames - 1) this.dead = true;
      return;
    }

    // Overiding others animations
    if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.frames - 1) return;
    if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.frames - 1) return;

    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.frames = this.sprites.idle.frames;
          this.framesCurrent = 0;
        }
        break;
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.frames = this.sprites.run.frames;
          this.framesCurrent = 0;
        }
        break;
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.frames = this.sprites.jump.frames;
          this.framesCurrent = 0;
        }
        break;

      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.frames = this.sprites.fall.frames;
          this.framesCurrent = 0;
        }
        break;

      case 'attack1':
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.frames = this.sprites.attack1.frames;
          this.framesCurrent = 0;
        }
        break;

      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.frames = this.sprites.takeHit.frames;
          this.framesCurrent = 0;
        }
        break;

      case 'death':
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.frames = this.sprites.death.frames;
          this.framesCurrent = 0;
        }
        break;
    }
  }

  drawSkeleton() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    if (this.isAttacking) {
      c.fillStyle = 'yellow';
      c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
    }
  }

  update() {
    this.draw();
    this.drawSkeleton();

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

const BACKGROUND = new Sprite({
  position: { x: 0, y: 0 },
  size: { height: 50, width: 250 },
  imgSrc: './assets/background.png',
});
const SHOP = new Sprite({
  position: { x: 630, y: 127 },
  size: { height: 50, width: 250 },
  imgSrc: './assets/shop.png',
  scale: 2.75,
  frames: 6,
});
const OBJECTS = [BACKGROUND, SHOP];

const player = new Hero({
  position: { x: 150, y: 0 },
  velocity: { x: 0, y: 10 },
  size: { width: 50, height: 150 },
  offset: { x: 215, y: 154 },
  keyConfig: KEY_CONFIG.player,
  color: 'red',
  imgSrc: './assets/characters/assassins/Kenji/Idle.png',
  frames: 8,
  scale: 2.5,
  attackBox: {
    offset: { x: 40, y: 0 },
    width: 160,
    height: 150,
  },
  sprites: {
    idle: { imgSrc: `${getCharDir('assassins', 'Kenji')}/Idle.png`, frames: 8 },
    run: { imgSrc: `${getCharDir('assassins', 'Kenji')}/Run.png`, frames: 8 },
    jump: { imgSrc: `${getCharDir('assassins', 'Kenji')}/Jump.png`, frames: 2 },
    fall: { imgSrc: `${getCharDir('assassins', 'Kenji')}/Fall.png`, frames: 2 },
    takeHit: { imgSrc: `${getCharDir('assassins', 'Kenji')}/TakeHit2.png`, frames: 4 },
    death: { imgSrc: `${getCharDir('assassins', 'Kenji')}/Death.png`, frames: 6 },
    attack1: { imgSrc: `${getCharDir('assassins', 'Kenji')}/Attack1.png`, frames: 6 },
    attack2: { imgSrc: `${getCharDir('assassins', 'Kenji')}/Attack2.png`, frames: 6 },
  },
});
const enemy = new Hero({
  position: { x: 250, y: 0 },
  velocity: { x: 0, y: 10 },
  size: { height: 150, width: 50 },
  offset: { x: 280, y: 268 },
  keyConfig: KEY_CONFIG.enemy,
  color: 'blue',
  imgSrc: './assets/characters/assassins/Doko/Idle.png',
  frames: 4,
  scale: 2.5,
  attackBox: {
    offset: { x: 70, y: -70 },
    width: 150,
    height: 150,
  },
  sprites: {
    idle: { imgSrc: `${getCharDir('wizards', 'evolin')}/Idle.png`, frames: 8 },
    run: { imgSrc: `${getCharDir('wizards', 'evolin')}/Run.png`, frames: 8 },
    jump: { imgSrc: `${getCharDir('wizards', 'evolin')}/Jump.png`, frames: 2 },
    fall: { imgSrc: `${getCharDir('wizards', 'evolin')}/Fall.png`, frames: 2 },
    takeHit: { imgSrc: `${getCharDir('wizards', 'evolin')}/TakeHit.png`, frames: 3 },
    death: { imgSrc: `${getCharDir('wizards', 'evolin')}/Death.png`, frames: 7 },
    attack1: { imgSrc: `${getCharDir('wizards', 'evolin')}/Attack1.png`, frames: 8 },
    attack2: { imgSrc: `${getCharDir('wizards', 'evolin')}/Attack2.png`, frames: 8 },
  },
});

// offset: { x: 220, y: 170 },
// sprites: {
//   idle: { imgSrc: `${getCharDir('wizards', 'evolin')}/Idle.png`, frames: 4 },
//   run: { imgSrc: `${getCharDir('wizards', 'evolin')}/Run.png`, frames: 8 },
//   jump: { imgSrc: `${getCharDir('wizards', 'evolin')}/Jump.png`, frames: 2 },
//   fall: { imgSrc: `${getCharDir('wizards', 'evolin')}/Fall.png`, frames: 2 },
//   takeHit: { imgSrc: `${getCharDir('wizards', 'evolin')}/TakeHit.png`, frames: 3 },
//   death: { imgSrc: `${getCharDir('wizards', 'evolin')}/Death.png`, frames: 7 },
//   attack1: { imgSrc: `${getCharDir('wizards', 'evolin')}/Attack1.png`, frames: 4 },
//   attack2: { imgSrc: `${getCharDir('wizards', 'evolin')}/Attack2.png`, frames: 4 },
// },

setMatchTime(30);

addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();

  [player, enemy].forEach((item) => {
    if (item.dead) return;

    switch (key) {
      case item.keyConfig.left:
        KEYS[key].pressed = 1;
        item.lastKey = key;
        break;
      case item.keyConfig.right:
        KEYS[key].pressed = 1;
        item.lastKey = key;
        break;
      case item.keyConfig.up:
        if (++KEYS[key].pressed <= (KEYS[key]?.maxPress || 1)) {
          item.velocity.y = -15;
        }
        break;
      case item.keyConfig.attack:
        item.attack();
        break;
    }
  });
});
addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();

  [player, enemy].forEach((item) => {
    switch (key) {
      case item.keyConfig.left:
      case item.keyConfig.right:
        KEYS[key].pressed = 0;
        break;
    }
  });
});
oncontextmenu = (e) => {
  e.preventDefault();
};

(function animation() {
  app.animationId = requestAnimationFrame(animation);

  resetBackground(canvas, c);
  OBJECTS.forEach((item) => item.update());

  [player, enemy].forEach((item) => {
    item.update();

    item.velocity.x =
      KEYS[item.keyConfig.left]?.pressed && item.lastKey === item.keyConfig.left && item.isBound() !== -1
        ? -10
        : KEYS[item.keyConfig.right]?.pressed && item.lastKey === item.keyConfig.right && item.isBound() !== 1
        ? 10
        : 0;
    item.isOnGround() && (KEYS[item.keyConfig.up].pressed = 0);

    if (KEYS[item.keyConfig.left]?.pressed || KEYS[item.keyConfig.right]?.pressed) {
      item.switchSprite('run');
    } else {
      item.switchSprite('idle');
    }

    if (item.velocity.y < 0) item.switchSprite('jump');
    if (item.velocity.y > 0) item.switchSprite('fall');
  });

  if (rectCollision(player.attackBox, enemy) && player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;

    if (enemy.health > 0) {
      enemy.takeHit(0.1);
      ELEMENTS.enemyHealthIndicator.style.width = `${Math.floor(enemy.health * 100)}%`;
    }
  }
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  if (rectCollision(enemy.attackBox, player) && enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;

    if (player.health > 0) {
      player.takeHit(0.1);
      ELEMENTS.playerHealthIndicator.style.width = `${Math.floor(player.health * 100)}%`;
    }
  }
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  if (enemy.health <= 0 || player.health <= 0) {
    winnerDetect(player, enemy);
  }
})();
