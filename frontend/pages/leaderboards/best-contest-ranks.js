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
import { getBestContestRanksPageData } from "../../helpers/swr";

/**
 * Component that renders the contest ranks leaderboard page. Corresponds to the URL:
 * "/leaderboards/best-contest-ranks".
 *
 * @prop {string} lastUpdateTime - The string representation of the last database update time.
 * @prop {Object} contestData - The object containing the contest ranks corresponding to each
 *                              user, for each time period. Must contain a key for each time
 *                              period. The value corresponding to each time period key is an
 *                              array of objects, each of which contains the user's handle, rank
 *                              rating, and highest contest rank in that time period.
 */
const BestContestRanks = ({ lastUpdateTime, contestsData }) => {
  const [timePeriod, setTimePeriod] = useState("all_time");

  // The data fetched from the backend by SWR is the same as the data passed to the component as props.
  // However, the data fetched by SWR is ensured to be up-to-date. The props act as fallback data to
  // initially render the page as soon as possible.
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data } = useSWR("/api/leaderboards/best-contest-ranks", fetcher, {
    fallbackData: {
      lastUpdateTime: lastUpdateTime,
      contestsData: contestsData,
    },
  });

  return (
    <>
      <Head>
        <title>Stats Portal | Best Contest Ranks</title>
      </Head>

      <Navbar />

      <div className="layout">
        <div className="container">
          {/* Heading */}
          <Heading
            prefixHeading={"leaderboard for"}
            mainHeading={"best contest ranks"}
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
              title={"Best Contest Ranks"}
              dataList={data.contestsData[timePeriod]}
              attribute={"best_rank"} // This has to be the same as that supplied to obtainDataCountPerUser in getStaticProps.
              statisticName={"Best Contest Rank"}
              sortingOrder={"asc"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

BestContestRanks.propTypes = {
  lastUpdateTime: PropTypes.string.isRequired,
  contestsData: PropTypes.object.isRequired,
};

export default BestContestRanks;

export const getStaticProps = async () => {
  const data = await getBestContestRanksPageData();

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
