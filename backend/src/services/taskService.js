import Task from '../models/Task.js';

// -----------------------------------------
// 1) STATS (New / Inprogress / Completed)
// -----------------------------------------
export const getTaskStats = (userId) => {
  return Task.aggregate([
    {
      $match: {
        assignedTo: userId   // FIXED
      }
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);
};


// -----------------------------------------
// 2) GET ALL TASKS FOR LOGGED-IN USER
// -----------------------------------------
export const getAll = (userId, search = "") => {
  return Task.find({
    assignedTo: userId,     // FIXED
    title: { $regex: search, $options: "i" }
  })
  .populate("assignedTo", "name email")
  .populate("createdBy", "name email")
  .sort({ createdAt: -1 });
};


// -----------------------------------------
// 3) CREATE TASK
// -----------------------------------------
export const createTask = (data) => Task.create(data);


// -----------------------------------------
// 4) UPDATE TASK
// -----------------------------------------
export const updateTask = (id, data) =>
  Task.findByIdAndUpdate(id, data, { new: true })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");


// -----------------------------------------
// 5) DELETE TASK
// -----------------------------------------
export const deleteTask = (id) => Task.findByIdAndDelete(id);


// -----------------------------------------
// 6) LAST 7 DAYS ANALYTICS
// -----------------------------------------
export const getTasksLast7Days = (userId) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return Task.aggregate([
    {
      $match: {
        assignedTo: userId,   // FIXED
        createdAt: { $gte: sevenDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        date: "$_id",
        count: 1
      }
    }
  ]);
};
