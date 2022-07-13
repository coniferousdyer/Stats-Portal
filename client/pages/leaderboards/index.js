// External library components.
import Head from "next/head";
import PropTypes from "prop-types";
import useSWR from "swr";
import { captureException } from "@sentry/nextjs";

// Internal application components.
import Heading from "../../components/common/Heading";
import Navbar from "../../components/common/Navbar";
import DescriptorCard from "../../components/common/DescriptorCard";

// Helper functions.
import { getLeaderboardHomePageData } from "../../helpers/swr";

/**
 * Component that renders the main leaderboards page. Corresponds to the URL:
 * "/leaderboards".
 *
 * @prop {string} organizationName - The organization name.
 */
const Leaderboards = ({ organizationName }) => {
  // The data fetched from the backend by SWR is the same as the data passed to the component as props.
  // However, the data fetched by SWR is ensured to be up-to-date. The props act as fallback data to
  // initially render the page as soon as possible.
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data } = useSWR("/api/leaderboards", fetcher, {
    fallbackData: {
      organizationName: organizationName,
    },
  });

  return (
    <>
      <Head>
        <title>Stats Portal | Leaderboards</title>
      </Head>

      <Navbar />

      <div className="layout">
        <div className="container">
          {/* Heading */}
          <Heading
            prefixHeading={`view ${data.organizationName}'s`}
            mainHeading={"leaderboards"}
          />

          {/* Creating a descriptor card for each of the leaderboards in the leaderboards array */}
          <div className="flex_wrap_container">
            {/* Most Problems Solved Leaderboards Card */}
            <div className="half_container">
              <DescriptorCard
                title={"MOST PROBLEMS SOLVED"}
                description={`Leaderboard for the most problems solved by the users of ${data.organizationName}.`}
                imageLink={"/images/problems_solved_img.png"}
                buttonText={"View Leaderboard >>"}
                buttonLink={"/leaderboards/problems-solved"}
              />
            </div>
            <div className="half_container">
              <DescriptorCard
                title={"HIGHEST RATING INCREASE"}
                description={`Leaderboard for the highest rating increase obtained by users of ${data.organizationName}.`}
                imageLink={"/images/rating_increase_img.png"}
                buttonText={"View Leaderboard >>"}
                buttonLink={"/leaderboards/highest-rating-increase"}
              />
            </div>
            <div className="half_container">
              <DescriptorCard
                title={"MOST CONTESTS PARTICIPATED"}
                description={`Leaderboard for the most contests participated by users of ${data.organizationName}.`}
                imageLink={"/images/contests_participated_img.png"}
                buttonText={"View Leaderboard >>"}
                buttonLink={"/leaderboards/contests-participated"}
              />
            </div>
            <div className="half_container">
              <DescriptorCard
                title={"BEST CONTEST RANKS"}
                description={`Leaderboard for the highest contest ranks achieved by users of ${data.organizationName}.`}
                imageLink={"/images/contest_rank_img.png"}
                buttonText={"View Leaderboard >>"}
                buttonLink={"/leaderboards/best-contest-ranks"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Leaderboards.propTypes = {
  organizationName: PropTypes.string.isRequired,
};

export default Leaderboards;

export const getStaticProps = async () => {
  try {
    const data = await getLeaderboardHomePageData();

    return {
      props: {
        organizationName: data.organizationName,
      },
      // If a request is made ISR_REVALIDATE_TIME seconds after the page was last
      // generated, the page is regenerated. As the data in the backend remains static
      // for some time, this is not an issue.
      revalidate: parseInt(process.env.ISR_REVALIDATE_TIME) || 3600,
    };
  } catch (error) {
    // Log the error to Sentry.
    captureException(error);

    return {
      props: {
        organizationName: "",
      },
      revalidate: parseInt(process.env.ISR_REVALIDATE_TIME) || 3600,
    };
  }
};
