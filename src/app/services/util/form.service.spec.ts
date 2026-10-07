import { TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { FormService } from './form.service';

describe('FormService', () => {
    let service: FormService;

    beforeEach(() => (service = TestBed.inject(FormService)));

    it('marks the label of a required control', () => {
        expect(service.requiredLabel('Name', new FormControl('', Validators.required))).toBe('Name *');
    });

    it('leaves the label of an optional or missing control alone', () => {
        expect(service.requiredLabel('Name', new FormControl(''))).toBe('Name');
        expect(service.requiredLabel('Name', null)).toBe('Name');
    });

    it('reports a validation error only after the control is touched', () => {
        const control = new FormControl('', Validators.required);
        expect(service.hasValidationError(control, 'required')).toBe(false);
        control.markAsTouched();
        expect(service.hasValidationError(control, 'required')).toBe(true);
    });
});
