/**
 * Encodes an object as an unpadded base64url segment, as used in a JWT.
 *
 * @param value - The object to encode
 * @returns The encoded segment
 */
function encodeSegment(value: object): string {
    return btoa(JSON.stringify(value)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Builds an unsigned JWT for tests.
 *
 * @param secondsUntilExpiry - Lifetime from now; negative for an already-expired token
 * @param tag - Any value, used to make two tokens distinguishable
 * @returns The encoded token
 */
export function makeTestJwt(secondsUntilExpiry = 3600, tag = 'a'): string {
    const payload = { exp: Math.floor(Date.now() / 1000) + secondsUntilExpiry, tag };
    return `${encodeSegment({ alg: 'none' })}.${encodeSegment(payload)}.signature`;
}
