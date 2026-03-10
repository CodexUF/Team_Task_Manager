import { useState, useEffect } from "react";
import api from "../services/api";

function TaskModal({ closeModal, refreshTasks, taskToEdit = null }) {
  const [title, setTitle] = useState(taskToEdit?.title || "");
  const [description, setDescription] = useState(taskToEdit?.description || "");
  const [teamId, setTeamId] = useState(taskToEdit?.team || "");
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    api.get("/teams/").then((res) => setTeams(res.data));
  }, []);

  const saveTask = async () => {
    try {
      const payload = {
        title,
        description,
        team: teamId || null,
      };

      if (taskToEdit) {
        await api.put(`/tasks/${taskToEdit.id}/`, payload);
      } else {
        await api.post("/tasks/", payload);
      }
      
      refreshTasks();
      closeModal();
    } catch (error) {
      console.error("Failed to save task", error);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={closeModal}></div>

      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl animate-in zoom-in duration-300">
        <div className="p-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">
            {taskToEdit ? "Update Task" : "Create New Task"}
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50 min-h-100px"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Team</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
              >
                <option value="">No Team</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button className="flex-1 px-6 py-3 rounded-xl font-bold bg-gray-100" onClick={closeModal}>Cancel</button>
              <button className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-blue-600 shadow-lg shadow-blue-200" onClick={saveTask}>
                {taskToEdit ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
