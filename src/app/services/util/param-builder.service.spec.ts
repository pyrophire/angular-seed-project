import { TestBed } from '@angular/core/testing';
import { ParamBuilderService } from './param-builder.service';

describe('ParamBuilderService', () => {
    let service: ParamBuilderService;

    beforeEach(() => (service = TestBed.inject(ParamBuilderService)));

    it('joins the values into a query string', () => {
        expect(service.buildParams({ name: 'eli', page: 2, active: false })).toBe('name=eli&page=2&active=false');
    });

    it('skips null, undefined, and blank values', () => {
        expect(service.buildParams({ a: null, b: undefined, c: '', d: '   ', e: 'kept' })).toBe('e=kept');
    });

    it('encodes reserved characters', () => {
        expect(service.buildParams({ 'full name': 'a&b=c' })).toBe('full%20name=a%26b%3Dc');
    });

    it('returns an empty string for an empty object', () => {
        expect(service.buildParams({})).toBe('');
    });
});
