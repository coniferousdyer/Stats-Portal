// External library components.
import Head from "next/head";
import { useState } from "react";
import PropTypes from "prop-types";
import useSWR from "swr";

// Internal application components.
import Navbar from "../../components/common/Navbar";
import Heading from "../../components/common/Heading";
import TimePeriodDropdown from "../../components/common/TimePeriodDropdown";
import LeaderboardTable from "../../components/tables/LeaderboardTable";

// CSS styles.
import styles from "../../styles/pages/leaderboards/Leaderboard.module.css";

// Helper functions.
import { getRatingIncreasePageData } from "../../helpers/swr";

/**
 * Component that renders the rating increase leaderboard page. Corresponds to the URL:
 * "/leaderboards/highest-rating-increase".
 *
 * @prop {string} lastUpdateTime - The string representation of the last database update time.
 * @prop {Object} contestData - The object containing the highest rating increase corresponding
 *                              to each user, for each time period. Must contain a key for each time
 *                              period. The value corresponding to each time period key is an
 *                              array of objects, each of which contains the user's handle, rank
 *                              rating, and highest rating increase in that time period.
 */
const HighestRatingIncrease = ({ lastUpdateTime, contestsData }) => {
  const [timePeriod, setTimePeriod] = useState("all_time");

  // The data fetched from the backend by SWR is the same as the data passed to the component as props.
  // However, the data fetched by SWR is ensured to be up-to-date. The props act as fallback data to
  // initially render the page as soon as possible.
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data } = useSWR(
    "/api/leaderboards/highest-rating-increase",
    fetcher,
    {
      fallbackData: {
        lastUpdateTime: lastUpdateTime,
        contestsData: contestsData,
      },
    },
  );

  return (
    <>
      <Head>
        <title>Stats Portal | Highest Rating Increase</title>
      </Head>

      <Navbar />

      <div className="layout">
        <div className="container">
          {/* Heading */}
          <Heading
            prefixHeading={"leaderboard for"}
            mainHeading={"highest rating increase"}
            suffixHeading={`LAST UPDATED AT ${data.lastUpdateTime}`}
          />

          {/* Time Period Select Dropdown */}
          <TimePeriodDropdown
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
          />

          {/* Leaderboard Table */}
          <div className={styles.table_container}>
            <LeaderboardTable
              title={"Highest Rating Increase"}
              dataList={data.contestsData[timePeriod]}
              attribute={"highest_rating_increase"} // This has to be the same as that supplied to obtainDataCountPerUser in getStaticProps.
              statisticName={"Highest Rating Increase"}
              sortingOrder={"desc"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

HighestRatingIncrease.propTypes = {
  lastUpdateTime: PropTypes.string.isRequired,
  contestsData: PropTypes.object.isRequired,
};

export default HighestRatingIncrease;

export const getStaticProps = async () => {
  const data = await getRatingIncreasePageData();

  return {
    props: {
      lastUpdateTime: data.lastUpdateTime,
      contestsData: data.contestsData,
    },
    // If a request is made ISR_REVALIDATE_TIME seconds after the page was last
    // generated, the page is regenerated. As the data in the backend remains static
    // for some time, this is not an issue.
    revalidate: parseInt(process.env.ISR_REVALIDATE_TIME) || 3600,
  };
};
