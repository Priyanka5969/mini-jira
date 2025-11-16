import { useState } from "react";

export default function AddTaskModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ title });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded shadow space-y-4 w-80"
      >
        <h2 className="font-bold text-lg">Add Task</h2>

        <input
          type="text"
          placeholder="Task Title"
          className="border p-2 w-full rounded"
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex gap-2 justify-end">
          <button className="px-3 py-1 bg-gray-200 rounded" type="button" onClick={onClose}>Cancel</button>
          <button className="px-3 py-1 bg-indigo-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
}
