import { $ } from '../utils';

export const ELEMENTS = {
  canvas: $('#app') as HTMLCanvasElement,

  statusEle: $('.status') as HTMLDivElement,
  statusMesEle: $('.status .message') as HTMLDivElement,
  timeEle: $('.timer .time') as HTMLDivElement,

  playerHealthIndicator: $('#player-health .indicator') as HTMLDivElement,
  enemyHealthIndicator: $('#enemy-health .indicator') as HTMLDivElement,
};
