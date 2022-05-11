// Helper functions.
import { getBestContestRanksPageData } from "../../../helpers/swr";

/**
 * This function fetches the data required for the best contest ranks page from the backend. Corresponds to the URL:
 * "/api/leaderboards/best-contest-ranks". It is called by the SWR hook.
 *
 * @returns {Promise<Object>} The data required for the best contest ranks page, fetched by getBestContestRanksPageData().
 */
export default async function handler(req, res) {
  const data = await getBestContestRanksPageData();
  res.status(200).json(data);
}
