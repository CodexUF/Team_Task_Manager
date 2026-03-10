import {useEffect,useState} from "react"
import api from "../services/api"
import Navbar from "../components/Navbar";
import TaskModal from "../components/TaskModel";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");

  const fetchTasks = () => {
    api.get("/tasks/").then((res) => setTasks(res.data));
  };

  const fetchTeams = () => {
    api.get("/teams/").then((res) => setTeams(res.data));
  };

  useEffect(() => {
    fetchTasks();
    fetchTeams();
  }, []);

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}/`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setShowModal(true);
  };

  const filtered = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesTeam = selectedTeam === "" || t.team?.toString() === selectedTeam;
    return matchesSearch && matchesTeam;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6 md:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Tasks</h1>
            <p className="text-gray-500 mt-1">Manage and track your team's progress</p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 transform"
            onClick={() => { setTaskToEdit(null); setShowModal(true); }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create New Task
          </button>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              className="w-full bg-white border border-gray-200 pl-11 pr-4 py-4 rounded-2xl shadow-sm outline-none transition-all placeholder-gray-400"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select 
            className="bg-white border border-gray-200 px-4 py-4 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="">All Teams</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((task) => (
            <div key={task.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {task.team_name || "Personal"}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(task)} className="text-gray-400 hover:text-blue-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 grow">{task.description}</p>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-4 border-t border-gray-50">
                Assignee: {task.assigned_to_name}
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <TaskModal 
            closeModal={() => { setShowModal(false); setTaskToEdit(null); }} 
            refreshTasks={fetchTasks} 
            taskToEdit={taskToEdit}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
