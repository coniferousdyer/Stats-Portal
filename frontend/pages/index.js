// External library components.
import Head from "next/head";
import PropTypes from "prop-types";
import useSWR from "swr";

// Internal application components.
import Navbar from "../components/common/Navbar";
import OrganizationStatistics from "../components/home/OrganizationStatistics";
import SectionCards from "../components/home/SectionCards";

// Helper functions.
import { getHomePageData } from "../helpers/swr";

/**
 * Component that renders the home page. Corresponds to the URL:
 * "/".
 *
 * @prop {string} lastUpdateTime - The string representation of the last database update time.
 * @prop {Object} organizationInformation - The object containing the organization information.
 * @prop {Object} overallContests - The object containing the overall contest statistics for the organization.
 * @prop {Object} overallProblems - The object containing the overall problem statistics for the organization.
 */
export default function Home({
  lastUpdateTime,
  organizationInformation,
  overallContests,
  overallProblems,
}) {
  // The data fetched from the backend by SWR is the same as the data passed to the component as props.
  // However, the data fetched by SWR is ensured to be up-to-date. The props act as fallback data to
  // initially render the page as soon as possible.
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data } = useSWR("/api", fetcher, {
    fallbackData: {
      lastUpdateTime: lastUpdateTime,
      organizationInformation: organizationInformation,
      overallContests: overallContests,
      overallProblems: overallProblems,
    },
  });

  return (
    <>
      <Head>
        <title>Stats Portal | {data.organizationInformation.name}</title>
      </Head>

      <Navbar />

      <div className="layout">
        {/* Organization Statistics */}
        <OrganizationStatistics
          lastUpdateTime={data.lastUpdateTime}
          organizationInformation={data.organizationInformation}
          overallContests={data.overallContests}
          overallProblems={data.overallProblems}
        />

        {/* Section Cards */}
        <SectionCards organizationName={data.organizationInformation.name} />
      </div>
    </>
  );
}

Home.propTypes = {
  lastUpdateTime: PropTypes.string.isRequired,
  organizationInformation: PropTypes.object.isRequired,
  overallContests: PropTypes.object.isRequired,
  overallProblems: PropTypes.object.isRequired,
};

export const getStaticProps = async () => {
  const data = await getHomePageData();

  return {
    props: {
      lastUpdateTime: data.lastUpdateTime,
      organizationInformation: data.organizationInformation,
      overallContests: data.overallContests,
      overallProblems: data.overallProblems,
    },
    // If a request is made ISR_REVALIDATE_TIME seconds after the page was last
    // generated, the page is regenerated. As the data in the backend remains static
    // for some time, this is not an issue.
    revalidate: parseInt(process.env.ISR_REVALIDATE_TIME) || 3600,
  };
};
