import { getTaskStats, getAll, createTask, updateTask, deleteTask, getTasksLast7Days } from "../services/taskService.js";

export const stats = async(req,res,next) => {
    try {
        const result = await getTaskStats(req.user._id);
        /*[
            { _id: "new", count: 2 },
            { _id: "inprogress", count: 1 },
            { _id: "completed", count: 2 }
        ]*/

        const stats = { new: 0, inprogress: 0, completed: 0 };

        result.forEach(r => {
            stats[r._id] = r.count;
        });
        /*
            r._id = "new"
            r.count = 2
            stats["new"] = 2
        */

        res.json(stats);
    } catch (error) {
        
    }
}

export const getTasks = async(req,res,next) => {
    try {
        const {search} = req.query;
        const tasks = await getAll(req.user._id, search);

        res.json(tasks);
    } catch (error) {
        next(error);
    }
};

export const create = async(req,res,next) => {
  try {
    const task = await createTask({
      ...req.body,
      createdBy: req.user._id,
      assignedTo: req.user._id,
  });


    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
    try {
      const task = await updateTask(req.params.id, req.body);
      res.json(task);
    } catch (err) {
      next(err);
    }
};

export const remove = async (req, res, next) => {
    try {
      await deleteTask(req.params.id);
      res.json({ message: "Deleted" });
    } catch (err) {
      next(err);
    }
};

export const last7Days = async (req, res, next) => {
  try {
    const result = await getTasksLast7Days(req.user._id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
