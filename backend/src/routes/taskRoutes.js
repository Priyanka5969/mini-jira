import express from 'express';
import { stats, getTasks, create, update, remove, last7Days } from "../controllers/taskController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(auth);

router.get("/stats", stats);
router.get("/", getTasks);
router.post("/",create);
router.put("/:id", update);
router.delete("/:id", remove);
router.get("/last7days", last7Days);

export default router;