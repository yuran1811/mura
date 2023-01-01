export interface KeyProps {
  [key: string]: {
    pressed: number;
    maxPress?: number;
  };
}
