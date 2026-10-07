import { Injectable } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class FormService {
    /**
     * @param control - The control to inspect
     * @param errorCode - The validation error key, e.g. `required`
     * @returns True when the control has been touched and carries that error
     */
    public hasValidationError(control: AbstractControl, errorCode: string): boolean {
        return control.hasError(errorCode) && control.touched;
    }

    /**
     * @param label - The field label
     * @param control - The control behind the field
     * @returns The label with ` *` appended when the control is required
     */
    public requiredLabel(label: string, control: AbstractControl | null | undefined): string {
        return control?.hasValidator(Validators.required) ? `${label} *` : label;
    }
}
