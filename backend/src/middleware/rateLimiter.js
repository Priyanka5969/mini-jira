import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5,                 // 5 login attempts allowed
    message: {
      message: "Too many login attempts. Try again after 5 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});