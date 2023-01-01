export * from './hero';
export * from './keys';

export interface BasicObject<Type> {
  [key: string]: Type;
}

export interface Coor {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}
