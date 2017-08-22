import {AbstractControl} from '@angular/forms';

export class PasswordValidation {
    static MatchPassword(ac: AbstractControl) {
        let password = ac.get('NewPassword').value;
        let confirmPassword = ac.get('ConfirmPassword').value;

        if (password != confirmPassword) {
            ac.get('ConfirmPassword').setErrors({ MatchPassword: true });
        }
        else {
            return null;
        }
    }
}

export class EmailValidation {
    static MatchEmail(ac: AbstractControl) {
        let email = ac.get('Email').value;
        let confirmEmail = ac.get('ConfirmEmail').value;

        if (email != confirmEmail) {
            ac.get('ConfirmEmail').setErrors({ MatchEmail: true });
        }
        else {
            return null;
        }
    }
}