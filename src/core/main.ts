import '../styles/index.css';

import { Hero, Sprite } from '../classes';
import { ELEMENTS, KEY_CONFIG_DEFAULT, MATCH_TIME } from '../constants';
import { ASSASSINS } from '../packages';
import { KeyProps } from '../types';
import { rectCollision, resetBackground, setFrameSize } from '../utils';
import { activateInteractives } from './interactive';

setFrameSize(ELEMENTS.canvas);

export const c = ELEMENTS.canvas.getContext('2d') as CanvasRenderingContext2D;

export const app: {
  timerId: undefined | number;
  animationId: undefined | number;
  isStart: boolean;
} = {
  timerId: undefined,
  animationId: undefined,
  isStart: false,
};

const KEYS: KeyProps = {
  a: { pressed: 0 },
  d: { pressed: 0 },
  w: { pressed: 0, maxPress: 2 },
  s: { pressed: 0 },
  l: { pressed: 0 },

  arrowleft: { pressed: 0 },
  arrowright: { pressed: 0 },
  arrowup: { pressed: 0, maxPress: 2 },
  arrowdown: { pressed: 0 },
  3: { pressed: 0 },
};

export const setMatchStatus = (status: string) => {
  ELEMENTS.statusEle.style.display = 'flex';
  ELEMENTS.statusMesEle.innerText = status;
  ELEMENTS.timeEle.innerText = '';
};
export const winnerDetect = (a: any, b: any) => {
  if (a.health === b.health) setMatchStatus('Tie');
  else if (a.health > b.health) setMatchStatus('Player 1 wins');
  else if (a.health < b.health) setMatchStatus('Player 2 wins');

  clearTimeout(app.timerId);
};
export const setMatchTime = (time = MATCH_TIME) => {
  const timer = () => {
    ELEMENTS.timeEle.innerText = time + '';
    if (time > 0) {
      time--;
      app.timerId = setTimeout(timer, 1000);
    } else winnerDetect(player, enemy);
  };

  timer();
};

const BACKGROUND = new Sprite({
  position: { x: 0, y: 0 },
  size: { height: 50, width: 250 },
  imgSrc: '/assets/background.png',
});
const SHOP = new Sprite({
  position: { x: 630, y: 127 },
  size: { height: 50, width: 250 },
  frames: 6,
  imgSrc: '/assets/shop.png',
  scale: 2.75,
});
const OBJECTS = [BACKGROUND, SHOP];

const player = new Hero({
  ...ASSASSINS['kenji'],
  position: { x: 250, y: 0 },
  velocity: { x: 1, y: 12 },
  keyConfig: KEY_CONFIG_DEFAULT.player,
});
const enemy = new Hero({
  ...ASSASSINS['doko'],
  position: { x: 750, y: 0 },
  velocity: { x: -1, y: 12 },
  keyConfig: KEY_CONFIG_DEFAULT.enemy,
});
const heroes = [player, enemy];

activateInteractives();

addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();

  [player, enemy].forEach((item) => {
    if (item.dead) return;

    switch (key) {
      case item.keyConfig.left:
        item.prevVelocity = -1;
        KEYS[key].pressed = 1;
        item.lastKey = key;
        break;
      case item.keyConfig.right:
        item.prevVelocity = 1;
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
      case item.keyConfig.dash:
        KEYS[key].pressed = 1;
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
      case item.keyConfig.dash:
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

  resetBackground(ELEMENTS.canvas, c);
  OBJECTS.forEach((item) => item.update());

  heroes.forEach((item) => {
    item.update();

    if (KEYS[item.keyConfig.left]?.pressed && item.isBound() !== -1) {
      if (item.lastKey === item.keyConfig.left) item.velocity.x = -5;

      item.position.x -= KEYS[item.keyConfig.dash]?.pressed ? 25 : 0;
    } else if (KEYS[item.keyConfig.right]?.pressed && item.isBound() !== 1) {
      if (item.lastKey === item.keyConfig.right) item.velocity.x = 5;

      item.position.x += KEYS[item.keyConfig.dash]?.pressed ? 25 : 0;
    } else {
      item.velocity.x = 0;
    }

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
    } else {
      enemy.switchSprite('death');
    }
  }
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  // rectCollision(enemy.attackBox, player) && enemy.restoreHP(0.1);

  if (rectCollision(enemy.attackBox, player) && enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;

    if (player.health > 0) {
      player.takeHit(0.1);
      ELEMENTS.playerHealthIndicator.style.width = `${Math.floor(player.health * 100)}%`;
    } else {
      player.switchSprite('death');
    }
  }
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  if (enemy.health <= 0.001 || player.health <= 0.001) {
    winnerDetect(player, enemy);
  }
})();
