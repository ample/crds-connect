export class KeypressValidation {

  public static isNonValidationKeypress(e): boolean {
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    let keypress = e.which;
    if (!keypress && e.charCode) {
      keypress = e.charCode;
    }
    if (keypress === 32) {
      return false;
    }
    if (keypress < 33) {
      return true;
    }
    return false;
  }

  public static replaceFullWidthChars(str) {
    if (str === null) {
      str = '';
    }

    let chr,
    idx,
    fullWidth = '\uff10\uff11\uff12\uff13\uff14\uff15\uff16\uff17\uff18\uff19',
    halfWidth = '0123456789',
    value = '',
    chars = str.split('');

    for (let i = 0; i < chars.length; i++) {
      chr = chars[i];
      idx = fullWidth.indexOf(chr);
      if (idx > -1) {
        chr = halfWidth[idx];
      }
      value += chr;
    }
    return value;
  }
}
