import { cn } from '../utils';

describe('Utils', () => {
  test('cn function combines class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
    expect(cn('class1', undefined, 'class2')).toBe('class1 class2');
    expect(cn('')).toBe('');
  });

  test('cn function handles conditional classes', () => {
    expect(cn('base', { 'conditional': true })).toBe('base conditional');
    expect(cn('base', { 'conditional': false })).toBe('base');
  });
});