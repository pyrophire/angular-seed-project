export class TLCJwtToken {
    exp: string;
    iat: string;
    iss: string;
    nbf: string;
    role: string;
    unique_name: string;
}

/** Body returned by the authenticate endpoint. */
export interface JwtAuthenticationResponse {
    token: string;
}
