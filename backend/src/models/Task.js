import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ["new", "inprogress", "completed"],
        default: "new",
    },
      // user who CREATED the task
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
  
      // user to whom the task is ASSIGNED
      assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      }
},{
    timestamps: true
});

export default mongoose.model("Task", taskSchema);