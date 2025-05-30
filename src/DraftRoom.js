import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function DraftRoom() {
  const [draft, setDraft] = useState(null);
  const [participants, setParticipants] = useState([]); // ✅ FIX: Initialize participants
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedGolfer, setSelectedGolfer] = useState("");
  const availableGolfers = ["Tiger Woods", "Rory McIlroy", "Jon Rahm", "Scottie Scheffler", "Jordan Spieth"];

  useEffect(() => {
    const fetchDraft = async () => {
      const draftRef = doc(db, "drafts", "current_draft");
      const draftSnap = await getDoc(draftRef);
      if (draftSnap.exists()) {
        const draftData = draftSnap.data();
  
        // ✅ Extract unique participant names from `draft_order`
        const uniqueUsers = [...new Set(draftData.draft_order)];

        setDraft(draftData);
        setParticipants(uniqueUsers); // ✅ FIX: Ensure `participants` is correctly set
      }
    };
  
    fetchDraft();
  }, []);

  const makePick = async () => {
    if (!draft || draft.current_pick !== selectedUser || !selectedGolfer) {
      alert("Not your turn or no golfer selected.");
      return;
    }

    try {
      const draftRef = doc(db, "drafts", "current_draft");

      const newPicks = {
        ...draft.picks,
        [selectedUser]: [...(draft.picks[selectedUser] || []), selectedGolfer]
      };

      let nextPickIndex = draft.draft_order.indexOf(selectedUser);
      let nextUser = "";
      let nextRound = draft.round;

      // 🔄 **Fixed Snake Draft Order Logic**
      if (nextRound % 2 === 1) {
        // Normal order (left to right)
        nextPickIndex++;
        if (nextPickIndex >= draft.draft_order.length) {
          nextPickIndex = draft.draft_order.length - 1;
          nextRound++; // Move to next round
        }
      } else {
        // Reverse order (right to left)
        nextPickIndex--;
        if (nextPickIndex < 0) {
          nextPickIndex = 0;
          nextRound++; // Move to next round
        }
      }

      nextUser = draft.draft_order[nextPickIndex];

      console.log(`Round: ${nextRound}, Next Pick Index: ${nextPickIndex}, Next User: ${nextUser}`);

      await updateDoc(draftRef, {
        picks: newPicks,
        current_pick: nextUser,
        round: nextRound
      });

      alert(`${selectedUser} picked ${selectedGolfer}!`);
      setSelectedGolfer("");
      setDraft(prev => ({
        ...prev,
        picks: newPicks,
        current_pick: nextUser,
        round: nextRound
      }));

    } catch (error) {
      console.error("Error updating draft:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Select Your Name</h2>
      <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="">Choose a participant</option>
        {participants.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      {selectedUser && (
        <>
          <h2>Current Turn: {draft?.current_pick || "Loading..."}</h2>
          {draft?.current_pick === selectedUser ? (
            <>
              <h3>Select a Golfer:</h3>
              <select value={selectedGolfer} onChange={(e) => setSelectedGolfer(e.target.value)}>
                <option value="">Choose a golfer</option>
                {availableGolfers.map((golfer, index) => (
                  <option key={index} value={golfer}>
                    {golfer}
                  </option>
                ))}
              </select>
              <button onClick={makePick}>Draft Golfer</button>
            </>
          ) : (
            <h3>Waiting for {draft?.current_pick} to pick...</h3>
          )}
        </>
      )}
    </div>
  );
}

export default DraftRoom;
