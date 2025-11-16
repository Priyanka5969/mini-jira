import { useSelector } from "react-redux";

export default function Analytics() {
  const stats = useSelector((state) => state.tasks.stats);

  return (
    <div className="mb-6 p-4 bg-white rounded-xl shadow flex gap-8">
      <div className="text-center">
        <p className="text-gray-600">New</p>
        <p className="text-xl font-bold">{stats.new || 0}</p>
      </div>
      <div className="text-center">
        <p className="text-gray-600">In Progress</p>
        <p className="text-xl font-bold">{stats.inprogress || 0}</p>
      </div>
      <div className="text-center">
        <p className="text-gray-600">Completed</p>
        <p className="text-xl font-bold">{stats.completed || 0}</p>
      </div>
    </div>
  );
}
