export const HttpErrorCode = {
    BadRequest: 400,
    InvalidAuthorization: 401,
    NotFound: 404,

    UsernameAlreadyClaimed: 10_000
} as const;

export const HttpErrorMessage = {
    BadRequest: "Bad Request",
    InvalidAuthorization: "Invalid Authorization",
    NotFound: "This route cannot be found or method is not in use",

    UsernameAlreadyClaimed: "Username already claimed"
} satisfies Record<keyof typeof HttpErrorCode, string>;