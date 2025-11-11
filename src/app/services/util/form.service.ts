import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  constructor() {}

  public hasValidationError(control: FormControl, errorCode: string): boolean {
    return control.hasError(errorCode) && control.touched;
  }

  public requiredLabel(label: string, control: any): string {
    let validators;
    try {
      validators = control?.validator('');
    } catch (error) {
      return label;
    }
    if (validators?.required) {
      return `${label} *`;
    } else {
      return label;
    }
  }
}
