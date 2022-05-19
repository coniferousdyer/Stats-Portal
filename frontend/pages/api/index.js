// External library components.
import { withSentry } from "@sentry/nextjs";

// Helper functions.
import { getHomePageData } from "../../helpers/swr";

/**
 * This function fetches the data required for the home page from the backend. Corresponds to the URL:
 * "/api". It is called by the SWR hook.
 *
 * @returns {Promise<Object>} The data required for the home page, fetched by getHomePageData().
 */
const handler = async (req, res) => {
  const data = await getHomePageData();
  res.status(200).json(data);
};

export default withSentry(handler);
