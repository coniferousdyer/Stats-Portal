// Helper functions.
import { getProblemsSolvedPageData } from "../../../helpers/swr";

/**
 * This function fetches the data required for the problems solved page from the backend. Corresponds to the URL:
 * "/api/leaderboards/problems-solved". It is called by the SWR hook.
 *
 * @returns {Promise<Object>} The data required for the problems solved page, fetched by getProblemsSolvedPageData().
 */
export default async function handler(req, res) {
  const data = await getProblemsSolvedPageData();
  res.status(200).json(data);
}
