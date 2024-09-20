export const get2DContext = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2d context is not supported');
  return ctx
}
