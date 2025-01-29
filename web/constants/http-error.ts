export const HttpErrorCode = {
    // 4xx
    BadRequest: 400,
    InvalidAuthorization: 401,
    NotFound: 404,

    // 5xx
    ServerError: 500,

    // custom using 4xx
    UsernameAlreadyClaimed: 400,
    EmailAlreadyRegistered: 400,
    EmailOrPasswordIncorrect: 400,
    InvalidCaptcha: 403,

    // unknown object - 10xxx
    UnknownAccount: 10_001,

    // validation issue - 50xxx
    MissingAccess: 50_001
} as const;

export const HttpErrorMessage = {
    // 4xx
    BadRequest: "Bad Request",
    InvalidAuthorization: "Invalid Authorization",
    NotFound: "This route cannot be found or method is not in use",

    // 5xx
    ServerError: "Something went wrong, try again later",

    // custom using 4xx
    UsernameAlreadyClaimed: "Username already claimed",
    EmailAlreadyRegistered: "An account with this email is already registered",
    EmailOrPasswordIncorrect: "Email or password is incorrect",
    InvalidCaptcha: "Complete the CAPTCHA and try again",

    // unknown object - 10xxx
    UnknownAccount: "Unknown account",

    // validation issue - 50xxx
    MissingAccess: "Missing access"
} satisfies Record<keyof typeof HttpErrorCode, string>;

export type HttpErrorEntry = typeof HttpErrorMessage[keyof typeof HttpErrorMessage];