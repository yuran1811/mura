import { BasicObject, Coor, Size } from '.';

export type SpriteTypes = 'idle' | 'run' | 'jump' | 'fall' | 'attack' | 'takeHit' | 'death';

export interface SpriteRawProps {
  id: number;
  imgSrc: string;
  frames: number;
}

export interface SpriteProps extends SpriteRawProps {
  image?: HTMLImageElement;
}

export type HeroSpritesRaw = {
  [key in SpriteTypes]: SpriteRawProps[];
};

export type HeroSprites = BasicObject<SpriteProps>;

export interface HeroProps {
  size: Size;
  offset: Coor;
  imgSrc: string;
  frames: number;
  scale: number;
  attackBox: {
    offset: Coor;
    offsetOrigin: Coor;
  } & Size;
  sprites: HeroSprites;
}

export interface HeroPackageProps {
  id: string;
  displayName: string;
  resourcesDir: string;
  properties: Omit<HeroProps, 'sprites'>;
  spritesRaw: HeroSpritesRaw;
}
