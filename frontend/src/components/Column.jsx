import TaskCard from "./TaskCard";

export default function Column({ title, tasks, onStatusChange, onEdit }) {
  return (
    <div className="w-1/3">
      <h2 className="font-bold text-lg mb-2">{title}</h2>

      {tasks.map((t) => (
        <TaskCard
          key={t._id}
          task={t}
          onStatusChange={(status) => onStatusChange(t._id, status)}
          onEdit={() => onEdit(t)}   // <-- IMPORTANT
        />
      ))}
    </div>
  );
}
