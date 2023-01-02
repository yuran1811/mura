import { BasicObject } from '../types';

export * from './elements';

export const FRAME_WIDTH = 1024;
export const FRAME_HEIGHT = 576;

export const MATCH_TIME = 10;

export const GRAVITY = 0.8;

export const KEY_CONFIG_DEFAULT: BasicObject<{
  up: string;
  down: string;
  left: string;
  right: string;
  attack: string;
  dash: string;
}> = {
  player: { up: 'w', down: 's', left: 'a', right: 'd', attack: 'j', dash: 'l' },
  enemy: { up: 'arrowup', down: 'arrowdown', left: 'arrowleft', right: 'arrowright', attack: '1', dash: '3' },
};
