export enum BlandPageType { ContentBlock = 1, Text = 2 }
export enum BlandPageCause { Error = 1, Success = 2, SimpleFauxdal = 3 }

export class BlandPageButtons {
    buttonText: string;
    clickFunction: Function;
    cssClass: string

    constructor(
        buttonText: string,
        clickFunction: Function,
        cssClass: string) {
            this.buttonText = buttonText;
            this.clickFunction = clickFunction;
            this.cssClass = cssClass;
        }
}

export class BlandPageDetails {

    content: string;
    goToState: string;
    blandPageType: BlandPageType;
    blandPageCause: BlandPageCause;
    cancelState: string;
    buttons: BlandPageButtons[];

    constructor(content: string, 
                blandPageType: BlandPageType, 
                blandPageCause: BlandPageCause, 
                goToState: string = null, 
                cancelState: string = null,
                buttons: BlandPageButtons[] = null) {
        this.content = content;
        this.blandPageType = blandPageType;
        this.blandPageCause = blandPageCause;
        this.goToState = goToState;
        this.cancelState = cancelState;
        this.buttons = buttons;
        
    }
}