export const HttpErrorCode = {
    BadRequest: 400,
    InvalidAuthorization: 401,
    NotFound: 404,

    ServerError: 500,

    InvalidCaptcha: 403,

    UsernameAlreadyClaimed: 10_000
} as const;

export const HttpErrorMessage = {
    BadRequest: "Bad Request",
    InvalidAuthorization: "Invalid Authorization",
    NotFound: "This route cannot be found or method is not in use",

    ServerError: "Something went wrong, try again later",

    InvalidCaptcha: "Complete the CAPTCHA and try again",

    UsernameAlreadyClaimed: "Username already claimed"
} satisfies Record<keyof typeof HttpErrorCode, string>;

export type HttpErrorEntry = typeof HttpErrorCode[keyof typeof HttpErrorCode];