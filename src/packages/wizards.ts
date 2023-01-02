import { BasicObject, HeroPackageProps, HeroProps } from '../types';
import { getCharDir, getSprites } from '../utils';

const evolin: HeroPackageProps = {
  id: 'evolin',
  displayName: 'Evolin',
  resourcesDir: `${getCharDir('wizards', 'evolin')}`,
  properties: {
    size: { height: 150, width: 50 },
    offset: { x: 280, y: 268 },
    imgSrc: '',
    frames: 4,
    scale: 2.5,
    attackBox: {
      offset: { x: 80, y: -100 },
      offsetOrigin: { x: 80, y: -100 },
      width: 180,
      height: 180,
    },
  },
  spritesRaw: {
    idle: [{ id: 1, imgSrc: `Idle.png`, frames: 8 }],
    run: [{ id: 1, imgSrc: `Run.png`, frames: 8 }],
    jump: [{ id: 1, imgSrc: `Jump.png`, frames: 2 }],
    fall: [{ id: 1, imgSrc: `Fall.png`, frames: 2 }],
    takeHit: [{ id: 1, imgSrc: `TakeHit.png`, frames: 3 }],
    death: [{ id: 1, imgSrc: `Death.png`, frames: 7 }],
    attack: [
      { id: 1, imgSrc: `Attack1.png`, frames: 8 },
      { id: 2, imgSrc: `Attack2.png`, frames: 8 },
    ],
  },
};

const WIZARDS: BasicObject<HeroProps> = [evolin].reduce((heroes, hero) => {
  heroes[hero.id] = { ...hero.properties, sprites: getSprites(hero) };
  return heroes;
}, {} as any);

export default WIZARDS;
