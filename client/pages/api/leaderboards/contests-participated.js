// External library components.
import { withSentry } from "@sentry/nextjs";

// Helper functions.
import { getContestsParticipatedPageData } from "../../../helpers/swr";

/**
 * This function fetches the data required for the contests participated page from the backend. Corresponds to the URL:
 * "/api/leaderboards/contests-participated". It is called by the SWR hook.
 *
 * @returns {Promise<Object>} The data required for the contests participated page, fetched by getContestsParticipatedPageData().
 */
const handler = async (req, res) => {
  const data = await getContestsParticipatedPageData();
  res.status(200).json(data);
};

export default withSentry(handler);
