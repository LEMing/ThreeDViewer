const mockContext = {
  fillStyle: '',
  fillRect: jest.fn(),
  getImageData: () => ({
    data: new Uint8ClampedArray(10),
  }),
  putImageData: jest.fn(),
  drawImage: jest.fn(),
  createRadialGradient: () => ({
    addColorStop: jest.fn(),
  }),
}

export {mockContext}
