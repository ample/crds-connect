export class ConfirmationSetup {

    buttonText: string;
    contentBlockName: string;
    goToState: string;

    constructor(buttonText: string, contentBlockName: string, goToState: string) {
        this.buttonText = buttonText;
        this.contentBlockName = contentBlockName;
        this.goToState = goToState;
    }
}