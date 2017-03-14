export enum BlandPageType { ContentBlock = 1, Text = 2 }
export enum BlandPageCause { Error = 1, Success = 2 }

export class BlandPageDetails {

    buttonText: string;
    content: string;
    goToState: string;
    blandPageType: BlandPageType;
    blandPageCause: BlandPageCause;

    constructor(buttonText: string, content: string, goToState: string, blandPageType: BlandPageType, blandPageCause: BlandPageCause) {
        this.buttonText = buttonText;
        this.content = content;
        this.goToState = goToState;
        this.blandPageType = blandPageType;
        this.blandPageCause = blandPageCause;
    }
}