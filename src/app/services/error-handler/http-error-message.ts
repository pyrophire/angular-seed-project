import { HttpErrorResponse } from '@angular/common/http';

const STATUS_MESSAGES: Readonly<Record<number, string>> = {
    0: 'Unable to reach the server. Check your network connection.',
    400: 'Bad request',
    401: 'You are not authorized to access this resource',
    403: 'You do not have permission to access this resource',
    404: 'Resource not found',
    409: 'Conflict with current state',
    422: 'Validation failed',
    500: 'Server error occurred. Please try again later.',
    503: 'Service unavailable. Please try again later.'
};

/**
 * Body properties that carry the human-readable message, in order of preference.
 * Lookups are case-insensitive, so `message` also matches the `Message` sent by older ASP.NET Web API services.
 *
 * - `message`: TransactionResult and most custom payloads; `HttpError` in ASP.NET Web API 2
 * - `detail`, `title`: RFC 7807 ProblemDetails (ASP.NET Core)
 * - `messagedetail`, `exceptionmessage`: ASP.NET Web API 2 `HttpError`
 * - `error_description`: OAuth token endpoints
 * - `error`: services that return `{ error: "text" }`
 */
const MESSAGE_KEYS: readonly string[] = ['message', 'detail', 'title', 'messagedetail', 'exceptionmessage', 'error_description', 'error'];
/** Body properties that carry per-field validation errors: ProblemDetails `errors`, Web API 2 `ModelState`. */
const VALIDATION_KEYS: readonly string[] = ['errors', 'modelstate'];

/**
 * @param value - Any value
 * @returns True when the value is a plain key/value object
 */
function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Blob) && !(value instanceof ArrayBuffer);
}

/**
 * @param value - Any value
 * @returns The trimmed string, or null when the value is not a non-empty string
 */
function toText(value: unknown): string | null {
    return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

/**
 * Reads a property without caring about its casing.
 *
 * @param body - The parsed error body
 * @param lowerCaseKey - The property name in lower case
 * @returns The property value, or undefined when absent
 */
function getIgnoringCase(body: Record<string, unknown>, lowerCaseKey: string): unknown {
    const actualKey = Object.keys(body).find((key) => key.toLowerCase() === lowerCaseKey);
    return actualKey === undefined ? undefined : body[actualKey];
}

/**
 * Flattens per-field validation errors into one line.
 *
 * @param body - The parsed error body
 * @returns The joined validation messages, or null when the body has none
 */
function readValidationErrors(body: Record<string, unknown>): string | null {
    for (const key of VALIDATION_KEYS) {
        const fieldErrors = getIgnoringCase(body, key);
        if (!isRecord(fieldErrors)) {
            continue;
        }
        const messages = Object.values(fieldErrors)
            .flat()
            .map(toText)
            .filter((message): message is string => message !== null);
        if (messages.length > 0) {
            return messages.join(' ');
        }
    }
    return null;
}

/**
 * Finds the first usable message property in an error body.
 *
 * @param body - The parsed error body
 * @returns The message, or null when no known property holds text
 */
function readMessageProperty(body: Record<string, unknown>): string | null {
    for (const key of MESSAGE_KEYS) {
        const value = getIgnoringCase(body, key);
        // Some services nest the payload: { error: { message: "..." } }
        const text = isRecord(value) ? readMessageProperty(value) : toText(value);
        if (text !== null) {
            return text;
        }
    }
    return null;
}

/**
 * Turns a string body into a message. JSON delivered as text is parsed; HTML error pages are ignored.
 *
 * @param body - The raw text body
 * @returns The message, or null when the text is not suitable for display
 */
function readTextBody(body: string): string | null {
    const text = body.trim();
    if (text.length === 0 || text.startsWith('<')) {
        return null;
    }
    if (text.startsWith('{')) {
        try {
            return readBody(JSON.parse(text));
        } catch {
            // Not JSON after all; fall through and show the text as sent.
        }
    }
    return text;
}

/**
 * @param body - The error body in whatever shape the server sent
 * @returns The message, or null when the body holds nothing displayable
 */
function readBody(body: unknown): string | null {
    if (typeof body === 'string') {
        return readTextBody(body);
    }
    if (!isRecord(body)) {
        return null;
    }
    const message = readMessageProperty(body);
    const validationErrors = readValidationErrors(body);
    if (message !== null && validationErrors !== null) {
        return `${message} ${validationErrors}`;
    }
    return message ?? validationErrors;
}

/**
 * Builds display text for a failed HTTP request.
 *
 * Understands the error bodies sent by the different API generations in use: TransactionResult
 * (`message`), ASP.NET Core ProblemDetails (`title` / `detail` / `errors`), ASP.NET Web API 2
 * (`Message` / `MessageDetail` / `ModelState`), plain text, and JSON delivered as text.
 * Falls back to a message for the status code when the body has nothing usable.
 *
 * @param error - The failed response
 * @returns Text suitable for showing to the user; never empty
 *
 * @example
 * http.get(url).subscribe({ error: (e: HttpErrorResponse) => toast.error(extractHttpErrorMessage(e)) });
 */
export function extractHttpErrorMessage(error: HttpErrorResponse): string {
    // Status 0 bodies are browser ProgressEvents, never server text.
    const bodyMessage = error.status === 0 ? null : readBody(error.error);
    return bodyMessage ?? STATUS_MESSAGES[error.status] ?? `Error ${error.status}: ${error.statusText}`;
}
