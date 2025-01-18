export const Config = {
    secret: process.env.SECRET!,
    captcha_secret: process.env.CAPTCHA_SECRET!,

    username_constraint: /^(?![_.])(?!.*[_.]{2})[a-z0-9._]{2,32}(?<![_.])$/,
    nickname_constraint: /^.{1,32}$/,
    password_constraint: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
};