import { AgePipe } from './age.pipe';

describe('AgePipe', () => {
  it('returns Unknown for null', () => {
    const pipe = new AgePipe();
    expect(pipe.transform(null)).toBe('Unknown');
  });

  it('formats singular', () => {
    const pipe = new AgePipe();
    expect(pipe.transform(1, 'year', 'years', 'Unknown')).toBe('year');
  });

  it('formats plural', () => {
    const pipe = new AgePipe();
    expect(pipe.transform(3, 'year', 'years', 'Unknown')).toBe('3 years');
  });
});
