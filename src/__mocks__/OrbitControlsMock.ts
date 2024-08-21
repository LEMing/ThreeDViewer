export const OrbitControls = jest.fn().mockImplementation(() => ({
  enableDamping: false,
  dampingFactor: 0,
  enableZoom: false,
  update: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));
