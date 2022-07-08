// External library components.
import { withSentry } from "@sentry/nextjs";

// Helper functions.
import { getBestContestRanksPageData } from "../../../helpers/swr";

/**
 * This function fetches the data required for the best contest ranks page from the backend. Corresponds to the URL:
 * "/api/leaderboards/best-contest-ranks". It is called by the SWR hook.
 *
 * @returns {Promise<Object>} The data required for the best contest ranks page, fetched by getBestContestRanksPageData().
 */
const handler = async (req, res) => {
  const data = await getBestContestRanksPageData();
  res.status(200).json(data);
};

export default withSentry(handler);
