import { AbstractControl, Validators } from '@angular/forms';

export class EmailAddressValidator {
    static validateEmail(control: AbstractControl): { [key: string]: any } {
        //using the pattern from http://emailregex.com/
        // tslint:disable-next-line:max-line-length
        let pattern: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(control.value) ? null : { 'emailFormat': true };
    }
}
