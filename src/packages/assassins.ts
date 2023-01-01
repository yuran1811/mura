import { BasicObject, HeroPackageProps, HeroProps } from '../types';
import { getCharDir, getSprites } from '../utils';

const kenji: HeroPackageProps = {
  id: 'kenji',
  displayName: 'Kenji',
  resourcesDir: `${getCharDir('assassins', 'kenji')}`,
  properties: {
    size: { height: 150, width: 50 },
    offset: { x: 215, y: 154 },
    imgSrc: '',
    frames: 8,
    scale: 2.5,
    attackBox: {
      offset: { x: 40, y: 0 },
      width: 160,
      height: 150,
    },
  },
  spritesRaw: {
    idle: [{ id: 1, imgSrc: `Idle.png`, frames: 8 }],
    run: [{ id: 1, imgSrc: `Run.png`, frames: 8 }],
    jump: [{ id: 1, imgSrc: `Jump.png`, frames: 2 }],
    fall: [{ id: 1, imgSrc: `Fall.png`, frames: 2 }],
    takeHit: [{ id: 1, imgSrc: `TakeHit2.png`, frames: 4 }],
    death: [{ id: 1, imgSrc: `Death.png`, frames: 6 }],
    attack: [
      { id: 1, imgSrc: `Attack1.png`, frames: 6 },
      { id: 2, imgSrc: `Attack2.png`, frames: 6 },
    ],
  },
};

const doko: HeroPackageProps = {
  id: 'doko',
  displayName: 'Doko',
  resourcesDir: `${getCharDir('assassins', 'doko')}`,
  properties: {
    size: { height: 150, width: 50 },
    offset: { x: 220, y: 170 },
    imgSrc: '',
    frames: 8,
    scale: 2.5,
    attackBox: {
      offset: { x: 40, y: 0 },
      width: 160,
      height: 150,
    },
  },
  spritesRaw: {
    idle: [{ id: 1, imgSrc: `Idle.png`, frames: 4 }],
    run: [{ id: 1, imgSrc: `Run.png`, frames: 8 }],
    jump: [{ id: 1, imgSrc: `Jump.png`, frames: 2 }],
    fall: [{ id: 1, imgSrc: `Fall.png`, frames: 2 }],
    takeHit: [{ id: 1, imgSrc: `TakeHit.png`, frames: 3 }],
    death: [{ id: 1, imgSrc: `Death.png`, frames: 7 }],
    attack: [
      { id: 1, imgSrc: `Attack1.png`, frames: 4 },
      { id: 2, imgSrc: `Attack2.png`, frames: 4 },
    ],
  },
};

const ASSASSINS: BasicObject<HeroProps> = [kenji, doko].reduce((heroes, hero) => {
  heroes[hero.id] = { ...hero.properties, sprites: getSprites(hero) };
  return heroes;
}, {} as any);

export default ASSASSINS;
