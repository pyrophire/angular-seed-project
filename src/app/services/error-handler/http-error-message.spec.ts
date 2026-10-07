import { HttpErrorResponse } from '@angular/common/http';
import { extractHttpErrorMessage } from './http-error-message';

/** Builds a failed response with the given body. */
const errorWith = (body: unknown, status = 400, statusText = 'Bad Request'): HttpErrorResponse =>
    new HttpErrorResponse({ error: body, status, statusText, url: '/api/items' });

describe('extractHttpErrorMessage', () => {
    it.each([
        ['TransactionResult', { success: false, message: 'Name is taken', results: null }, 'Name is taken'],
        ['ASP.NET Web API 2 HttpError', { Message: 'The request is invalid.' }, 'The request is invalid.'],
        ['Web API 2 with detail only', { MessageDetail: 'No action was found' }, 'No action was found'],
        ['Web API 2 exception', { ExceptionMessage: 'Object reference not set', ExceptionType: 'System.NullReferenceException' }, 'Object reference not set'],
        ['ProblemDetails with detail', { type: 'about:blank', title: 'Conflict', status: 409, detail: 'Already scheduled' }, 'Already scheduled'],
        ['ProblemDetails with title only', { title: 'Not Found', status: 404 }, 'Not Found'],
        ['OAuth error', { error: 'invalid_grant', error_description: 'Bad password' }, 'Bad password'],
        ['error as a string', { error: 'Something broke' }, 'Something broke'],
        ['nested error object', { error: { code: 5, message: 'Inner message' } }, 'Inner message'],
        ['plain text', 'Plain text failure', 'Plain text failure'],
        ['JSON delivered as text', '{"Message":"From a string"}', 'From a string']
    ])('reads the message from %s', (_shape, body, expected) => {
        expect(extractHttpErrorMessage(errorWith(body))).toBe(expected);
    });

    it('appends ProblemDetails validation errors to the title', () => {
        const body = { title: 'One or more validation errors occurred.', errors: { Name: ['Name is required.'], Age: ['Age must be positive.'] } };
        expect(extractHttpErrorMessage(errorWith(body))).toBe('One or more validation errors occurred. Name is required. Age must be positive.');
    });

    it('appends Web API 2 ModelState errors to the message', () => {
        const body = { Message: 'The request is invalid.', ModelState: { 'model.Name': ['The Name field is required.'] } };
        expect(extractHttpErrorMessage(errorWith(body))).toBe('The request is invalid. The Name field is required.');
    });

    it.each([
        ['null', null],
        ['an empty string', ''],
        ['an HTML error page', '<!DOCTYPE html><html><body>IIS 500</body></html>'],
        ['an object with no known property', { code: 17 }],
        ['a blank message', { message: '   ' }],
        ['a Blob', new Blob(['x'])]
    ])('falls back to the status message when the body is %s', (_shape, body) => {
        expect(extractHttpErrorMessage(errorWith(body, 404, 'Not Found'))).toBe('Resource not found');
    });

    it('falls back to the status code and text for a status without a message', () => {
        expect(extractHttpErrorMessage(errorWith(null, 418, 'Teapot'))).toBe('Error 418: Teapot');
    });

    it('reports a network failure without reading the ProgressEvent body', () => {
        const error = errorWith(new ProgressEvent('error'), 0, 'Unknown Error');
        expect(extractHttpErrorMessage(error)).toBe('Unable to reach the server. Check your network connection.');
    });
});
