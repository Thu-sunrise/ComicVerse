import { describe, it, expect } from 'vitest';
import { Button } from '../components/Button';

describe('Button UI Component', () => {
  it('should be a defined React component function', () => {
    expect(Button).toBeDefined();
    expect(typeof Button).toBe('function');
  });
});
