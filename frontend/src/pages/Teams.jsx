import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [showAddMember, setShowAddMember] = useState(null);
  const [newMemberUsername, setNewMemberUsername] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user"))?.username;

  const fetchTeams = () => {
    api.get("/teams/").then((res) => setTeams(res.data));
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const createTeam = async () => {
    if (!newTeamName) return;
    try {
      await api.post("/teams/", { name: newTeamName });
      setNewTeamName("");
      fetchTeams();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTeam = async (id) => {
    if (!window.confirm("Delete this team?")) return;
    try {
      await api.delete(`/teams/${id}/`);
      fetchTeams();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete team");
    }
  };

  const addMember = async (teamId) => {
    try {
      await api.post(`/teams/${teamId}/add_member/`, { username: newMemberUsername });
      setNewMemberUsername("");
      setShowAddMember(null);
      alert("Member added!");
      fetchTeams();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add member");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6 md:p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Teams</h1>
          <p className="text-gray-500 mt-1">Collaborate with your colleagues</p>
        </header>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-10 flex gap-4">
          <input
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="New Team Name"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700" onClick={createTeam}>
            Create Team
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">{team.name}</h2>
                {team.owner_name === currentUser && (
                  <button onClick={() => deleteTeam(team.id)} className="text-gray-400 hover:text-red-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-4 grow">
                {team.members_names?.map((name) => (
                  <span key={name} className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded">
                    {name}
                  </span>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Owner: {team.owner_name}</span>
                {team.owner_name === currentUser && (
                  <button className="text-blue-600 text-xs font-bold hover:underline" onClick={() => setShowAddMember(team.id)}>
                    + Add Member
                  </button>
                )}
              </div>

              {showAddMember === team.id && (
                <div className="mt-4 flex gap-2">
                  <input
                    className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 outline-none"
                    placeholder="Username"
                    value={newMemberUsername}
                    onChange={(e) => setNewMemberUsername(e.target.value)}
                  />
                  <button className="bg-green-600 text-white text-xs px-3 py-2 rounded-lg font-bold" onClick={() => addMember(team.id)}>Add</button>
                  <button className="text-gray-400 text-xs px-1" onClick={() => setShowAddMember(null)}>Cancel</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Teams;
