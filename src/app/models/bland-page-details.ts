export enum BlandPageType { ContentBlock = 1, Text = 2 }
export enum BlandPageCause { Error = 1, Success = 2, SimpleFauxdal = 3 }

export class BlandPageDetails {

  buttonText: string;
  content: string;
  goToState: string;
  blandPageType: BlandPageType;
  blandPageCause: BlandPageCause;
  cancelState: string;

  constructor(buttonText?: string, content?: string, blandPageType?: BlandPageType,
  blandPageCause?: BlandPageCause, goToState?: string, cancelState?: string) {
    this.buttonText = buttonText;
    this.content = content;
    this.blandPageType = blandPageType;
    this.blandPageCause = blandPageCause;
    this.goToState = goToState;
    this.cancelState = cancelState;
  }
};
