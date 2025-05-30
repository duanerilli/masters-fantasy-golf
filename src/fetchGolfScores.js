import { db } from "./firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

const API_KEY = "5e04a58a3a9249ea9822914fd6721b72"; // ✅ Fixed: API Key should be a string
const TOURNAMENT_ID = "YOUR_TOURNAMENT_ID"; // ✅ Replace with the actual tournament ID

export const updateGolferScores = async () => {
  try {
    // ✅ Fetch leaderboard data from SportsData.io
    const response = await fetch(
      `https://api.sportsdata.io/api/golf/v2/json/TournamentLeaderboard/${TOURNAMENT_ID}?key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch golf scores");
    }

    const data = await response.json();

    if (!data || !data.Players) {
      console.error("Invalid API response:", data);
      return;
    }

    // ✅ Extract golfer scores from API (relative to par)
    const newScores = {};
    data.Players.forEach((player) => {
      newScores[player.Name] = player.Score; // ✅ "Score" is already relative to par
    });

    console.log("Updated Golf Scores:", newScores);

    // ✅ Update Firestore with the new scores
    const draftRef = doc(db, "drafts", "current_draft");
    await updateDoc(draftRef, {
      golfer_scores: newScores
    });

  } catch (error) {
    console.error("Error updating golf scores:", error);
  }
};
