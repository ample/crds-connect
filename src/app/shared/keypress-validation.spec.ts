import { KeypressValidation } from './keypress-validation';

describe('Shared: Key Press Validation', () => {

  beforeEach(() => {
  });

  it('should replace full width characters', () => {
    expect(KeypressValidation.replaceFullWidthChars(null)).toBe('');

    let str = '０１２３４５６７８９';
    expect(KeypressValidation.replaceFullWidthChars(str)).toBe('0123456789');
  });

  it('should detect ctrl keypress events', () => {
      let e = {
          ctrlKey: true
      };
      expect(KeypressValidation.isNonValidationKeypress(e)).toBe(true);
  });

  it('should detect command (mac) keypress events', () => {
      let e = {
          metaKey: true
      };
      expect(KeypressValidation.isNonValidationKeypress(e)).toBe(true);
  });

  it('should pass validation keypress events', () => {
      let e = {
          which: 35
      };
      expect(KeypressValidation.isNonValidationKeypress(e)).toBe(false);
  });

});

