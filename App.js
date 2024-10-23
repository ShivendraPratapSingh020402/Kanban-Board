import React, { useState, useEffect } from "react";
import "./App.css";
import KanbanBoard from './components/KanbanBoard';
function App() {
  const [tickets, setTickets] = useState([]);
  const [groupBy, setGroupBy] = useState("status");
  const [sortOption, setSortOption] = useState("priority");
  
  // Fetch tickets from API
  useEffect(() => {
    fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then(response => response.json())
      .then(data => setTickets(Array.isArray(data.tickets) ? data.tickets : []))
      .catch(error => console.log(error));
  }, []);

  // Save the user preferences to localStorage
  useEffect(() => {
    const savedGroupBy = localStorage.getItem("groupBy");
    const savedSortOption = localStorage.getItem("sortOption");
    if (savedGroupBy) setGroupBy(savedGroupBy);
    if (savedSortOption) setSortOption(savedSortOption);
  }, []);

  useEffect(() => {
    localStorage.setItem("groupBy", groupBy);
    localStorage.setItem("sortOption", sortOption);
  }, [groupBy, sortOption]);

  // Sorting functions
  const sortTickets = (tickets) => {
    return tickets.sort((a, b) => {
      if(sortOption==="priority"){
        return b.priority-a.priority;

      }else if(sortOption==="title"){
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  // Grouping functions
  const groupTickets = (tickets) => {
    const grouped = {};
    tickets.forEach(ticket => {
      const key = ticket[groupBy] || 'Uncategorised';
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(ticket);
    });
    return grouped;
  };

  const groupedTickets = groupTickets(sortTickets(tickets));

  return (
    <div className="App">
      <h1>Kanban Board</h1>
      
      {/* Group by options */}
      <div>
        <button onClick={() => setGroupBy("status")}>Group by Status</button>
        <button onClick={() => setGroupBy("user")}>Group by User</button>
        <button onClick={() => setGroupBy("priority")}>Group by Priority</button>
      </div>

      {/* Sort by options */}
      <div>
        <button onClick={() => setSortOption("priority")}>Sort by Priority</button>
        <button onClick={() => setSortOption("title")}>Sort by Title</button>
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {Object.keys(groupedTickets).map(group => (
          <div className="kanban-column" key={group}>
            <h2>{group}</h2>
            {groupedTickets[group].map(ticket => (
              <div className="kanban-card" key={ticket.id}>
                <h3>{ticket.title}</h3>
                <p>Status: {ticket.status}</p>
                <p>User: {ticket.user}</p>
                <p>Priority: {ticket.priority}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
