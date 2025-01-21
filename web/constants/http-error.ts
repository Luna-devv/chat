export const HttpErrorCode = {
    BadRequest: 400,
    InvalidAuthorization: 401,
    NotFound: 404,

    ServerError: 500,

    InvalidCaptcha: 403,

    UsernameAlreadyClaimed: 1_000,
    EmailAlreadyRegistered: 1_001,
    EmailOrPasswordIncorrect: 1_002
} as const;

export const HttpErrorMessage = {
    BadRequest: "Bad Request",
    InvalidAuthorization: "Invalid Authorization",
    NotFound: "This route cannot be found or method is not in use",

    ServerError: "Something went wrong, try again later",

    InvalidCaptcha: "Complete the CAPTCHA and try again",

    UsernameAlreadyClaimed: "Username already claimed",
    EmailAlreadyRegistered: "An account with this email is already registered",
    EmailOrPasswordIncorrect: "Email or password is incorrect"
} satisfies Record<keyof typeof HttpErrorCode, string>;

export type HttpErrorEntry = typeof HttpErrorCode[keyof typeof HttpErrorCode];