import '@testing-library/jest-dom';

// Mock ResizeObserver for components that use it (like Radix UI Slider)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Add TextEncoder/TextDecoder polyfill for Node.js environment (required by react-router-dom)
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

