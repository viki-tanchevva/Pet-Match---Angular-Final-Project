import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  it('returns same string when below max', () => {
    const pipe = new TruncatePipe();
    expect(pipe.transform('abc', 5)).toBe('abc');
  });

  it('truncates and appends suffix', () => {
    const pipe = new TruncatePipe();
    expect(pipe.transform('abcdefghij', 5, '...')).toBe('abcde...');
  });
});
