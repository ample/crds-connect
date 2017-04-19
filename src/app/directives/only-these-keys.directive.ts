import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[onlyTheseKeys]'
})

export class OnlyTheseKeysDirective {

  public target;
  public regex: RegExp = new RegExp('[0-9a-zA-Z]');
  public custom: string;

  @Input('onlyTheseKeys') onlyTheseKeys: any;

  constructor(private el: ElementRef) {
    this.target = this.el.nativeElement;
  }

  @HostListener('keypress', ['$event']) onKeypress(e) {

    let input;
    let keypress = e.which;
    if (!keypress && e.charCode) {
      keypress = e.charCode;
    }

    if (e.metaKey || e.ctrlKey) {
      return true;
    }

    if (keypress === 0) {
      return true;
    }
    if (keypress < 33) {
      return true;
    }

    if (this.onlyTheseKeys && !this.custom) {
      this.custom = this.onlyTheseKeys;
      this.regex = new RegExp(this.custom);
    }

    input = String.fromCharCode(keypress);
    return this.regex.test(input);

  }

}
