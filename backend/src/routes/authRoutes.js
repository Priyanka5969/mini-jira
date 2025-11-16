import express from 'express';
import { register, login, logout, me, userslist } from "../controllers/authController.js";
import auth from "../middleware/authMiddleware.js";
import {loginRateLimiter} from '../middleware/rateLimiter.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", loginRateLimiter, login);
router.get("/logout", logout);
router.get("/me", auth, me);
router.get("/users", auth, userslist);
  

export default router;