export const getCharDir = (CLASS: string, name: string) => `/assets/characters/${CLASS}/${name}`;

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
