import { UtcTimeFormatPipe } from './utc-time-format.pipe';

describe('UtcTimeFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new UtcTimeFormatPipe();
    expect(pipe).toBeTruthy();
  });
});
