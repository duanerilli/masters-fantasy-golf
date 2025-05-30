import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

function Scoreboard() {
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    const fetchDraft = async () => {
      const draftRef = doc(db, "drafts", "current_draft");
      const draftSnap = await getDoc(draftRef);
      if (draftSnap.exists()) {
        setDraft(draftSnap.data());
      }
    };

    fetchDraft();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Draft Results & Live Scoring</h2>

      {draft ? (
        <>
          <h3>Draft Picks</h3>
          {Object.entries(draft.picks).map(([player, picks]) => (
            <div key={player}>
              <h3>{player}</h3>
              <ul>
                {picks.map((golfer, i) => (
                  <li key={i}>{golfer} (Score: {draft.golfer_scores[golfer] || "E"})</li>
                ))}
              </ul>
            </div>
          ))}

          <h3>Golfer Leaderboard</h3>
          <table style={{ margin: "0 auto", borderCollapse: "collapse", width: "50%" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid black" }}>Golfer</th>
                <th style={{ borderBottom: "1px solid black" }}>Score (To Par)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(draft.golfer_scores).map(([golfer, score]) => (
                <tr key={golfer}>
                  <td>{golfer}</td>
                  <td>{score >= 0 ? `+${score}` : score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Loading scores...</p>
      )}
    </div>
  );
}

export default Scoreboard;
