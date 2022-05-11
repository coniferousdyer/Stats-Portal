// Helper functions.
import { getContestsParticipatedPageData } from "../../../helpers/swr";

/**
 * This function fetches the data required for the contests participated page from the backend. Corresponds to the URL:
 * "/api/leaderboards/contests-participated". It is called by the SWR hook.
 *
 * @returns {Promise<Object>} The data required for the contests participated page, fetched by getContestsParticipatedPageData().
 */
export default async function handler(req, res) {
  const data = await getContestsParticipatedPageData();
  res.status(200).json(data);
}
