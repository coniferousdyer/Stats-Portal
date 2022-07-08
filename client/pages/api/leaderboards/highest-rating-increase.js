// External library components.
import { withSentry } from "@sentry/nextjs";

// Helper functions.
import { getRatingIncreasePageData } from "../../../helpers/swr";

/**
 * This function fetches the data required for the highest rating increase page from the backend. Corresponds to the URL:
 * "/api/leaderboards/highest-rating-increase". It is called by the SWR hook.
 *
 * @returns {Promise<Object>} The data required for the highest rating increase page, fetched by getRatingIncreasePageData().
 */
const handler = async (req, res) => {
  const data = await getRatingIncreasePageData();
  res.status(200).json(data);
};

export default withSentry(handler);
