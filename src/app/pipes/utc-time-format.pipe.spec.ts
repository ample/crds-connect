import { UtcTimeFormatPipe } from './utc-time-format.pipe';

describe('UtcTimeFormatPipe', () => {
  const pipe = new UtcTimeFormatPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should use the UTC time of an offset date', () => {
    const result = pipe.transform('2015-03-25T12:00:00-06:30');
    expect(result).toBe('6:30 pm');
  });

  it('should use the UTC time of UTC date', () => {
    const result = pipe.transform('2015-03-25T12:00:00Z');
    expect(result).toBe('12:00 pm');
  });

  it('should return null if blank string is passed in', () => {
    const result = pipe.transform('');
    expect(result).toBeNull();
  });

  it('should return null if null is passed in', () => {
    expect(pipe.transform(null)).toBeNull();
  });

  it('should return time string if time is passed in', () => {
    expect(pipe.transform('5:30 pm')).toBe('5:30 pm');
  });
});
