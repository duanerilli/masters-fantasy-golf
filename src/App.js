import React, { useState } from "react";
import DraftRoom from "./DraftRoom"; // New component for draft room
import Scoreboard from "./Scoreboard"; // New component for checking scores

function App() {
  const [page, setPage] = useState("home");

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Masters Fantasy Golf</h1>

      {page === "home" && (
        <>
          <button onClick={() => setPage("draft")}>Enter Draft</button>
          <button onClick={() => setPage("scores")}>Check Scores</button>
        </>
      )}

      {page === "draft" && <DraftRoom />}
      {page === "scores" && <Scoreboard />}
      
      {page !== "home" && <button onClick={() => setPage("home")}>Back to Home</button>}
    </div>
  );
}

export default App;
