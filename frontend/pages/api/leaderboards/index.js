// Helper functions.
import { getLeaderboardHomePageData } from "../../../helpers/swr";

/**
 * This function fetches the data required for the leaderboard home page from the backend. Corresponds to the URL:
 * "/api/leaderboards". It is called by the SWR hook.
 *
 * @returns {Promise<Object>} The data required for the leaderboard home page, fetched by getLeaderboardHomePageData().
 */
export default async function handler(req, res) {
  const data = await getLeaderboardHomePageData();
  res.status(200).json(data);
}
