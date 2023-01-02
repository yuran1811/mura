import { ELEMENTS, FRAME_HEIGHT, FRAME_WIDTH } from '../constants';
import { HeroPackageProps, HeroSprites, SpriteTypes } from '../types';

export const $ = document.querySelector.bind(document);

export const getCharDir = (CLASS: string, name: string) => `/assets/characters/${CLASS}/${name}`;
export const getBGMFile = (type: string, name: string, ext: string = 'mp3') => `/assets/sounds/${type}/${name}.${ext}`;

export const setBGM = (type: string, name: string) => {
  ELEMENTS.bgm.src = getBGMFile(type, name);
  ELEMENTS.bgm.loop = true;
  ELEMENTS.bgm.play();
};

export const setFrameSize = (
  canvas: HTMLCanvasElement,
  opts = { width: FRAME_WIDTH, height: FRAME_HEIGHT, scale: 1 }
) => {
  const { width, height, scale } = opts;

  canvas.width = width * scale;
  canvas.height = height * scale;
};

export const resetBackground = (canvas: HTMLCanvasElement, c: CanvasRenderingContext2D) => {
  c.fillStyle = 'rgba(0, 0, 0, 1)';
  c.fillRect(0, 0, canvas.width, canvas.height);
};

export const rectCollision = (a: any, b: any) => {
  return (
    a.position.x + a.width >= b.position.x &&
    a.position.x <= b.width + b.position.x &&
    a.position.y + a.height >= b.position.y &&
    a.position.y <= b.height + b.position.y
  );
};

export const getSprites = (hero: HeroPackageProps) => {
  const sprites = {} as HeroSprites;

  Object.keys(hero.spritesRaw).forEach((key) => {
    const eachSprite = hero.spritesRaw[key as SpriteTypes];

    eachSprite.forEach((sprite, idx) => {
      sprites[`${key}${!idx ? '' : idx}`] = {
        ...sprite,
        imgSrc: `${hero.resourcesDir}/${sprite.imgSrc}`,
      };
    });
  });

  return sprites;
};
