// External library components.
import { withSentry } from "@sentry/nextjs";

// Helper functions.
import { getProblemsSolvedPageData } from "../../../helpers/swr";

/**
 * This function fetches the data required for the problems solved page from the backend. Corresponds to the URL:
 * "/api/leaderboards/problems-solved". It is called by the SWR hook.
 *
 * @returns {Promise<Object>} The data required for the problems solved page, fetched by getProblemsSolvedPageData().
 */
const handler = async (req, res) => {
  const data = await getProblemsSolvedPageData();
  res.status(200).json(data);
};

export default withSentry(handler);
