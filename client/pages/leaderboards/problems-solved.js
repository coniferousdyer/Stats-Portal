// External library components.
import Head from "next/head";
import { useState } from "react";
import PropTypes from "prop-types";
import useSWR from "swr";
import { captureException } from "@sentry/nextjs";

// Internal application components.
import Navbar from "../../components/common/Navbar";
import Heading from "../../components/common/Heading";
import TimePeriodDropdown from "../../components/common/TimePeriodDropdown";
import LeaderboardTable from "../../components/tables/LeaderboardTable";

// CSS styles.
import styles from "../../styles/pages/leaderboards/Leaderboard.module.css";

// Helper functions.
import { getProblemsSolvedPageData } from "../../helpers/swr";

/**
 * Component that renders the problems solved leaderboard page. Corresponds to the URL:
 * "/leaderboards/problems-solved".
 *
 * @prop {string} lastUpdateTime - The string representation of the last database update time.
 * @prop {Object} problemsData - The object containing the problems solved count corresponding
 *                               to each user, for each time period. Must contain a key for each time
 *                              period. The value corresponding to each time period key is an
 *                              array of objects, each of which contains the user's handle, rank
 *                              rating, and number of problems solved in that time period.
 */
const ProblemsSolved = ({ lastUpdateTime, problemsData }) => {
  const [timePeriod, setTimePeriod] = useState("all_time");

  // The data fetched from the backend by SWR is the same as the data passed to the component as props.
  // However, the data fetched by SWR is ensured to be up-to-date. The props act as fallback data to
  // initially render the page as soon as possible.
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data } = useSWR("/api/leaderboards/problems-solved", fetcher, {
    fallbackData: {
      lastUpdateTime: lastUpdateTime,
      problemsData: problemsData,
    },
  });

  return (
    <>
      <Head>
        <title>Stats Portal | Problems Solved</title>
      </Head>

      <Navbar />

      <div className="layout">
        <div className="container">
          {/* Heading */}
          <Heading
            prefixHeading={"leaderboard for"}
            mainHeading={"problems solved"}
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
              title={"Most Problems Solved"}
              dataList={
                timePeriod in data.problemsData
                  ? data.problemsData[timePeriod]
                  : []
              }
              attribute={"total_problems"} // This has to be the same as that supplied to obtainDataCountPerUser in getStaticProps.
              statisticName={"Problems Solved"}
              sortingOrder={"desc"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

ProblemsSolved.propTypes = {
  lastUpdateTime: PropTypes.string.isRequired,
  problemsData: PropTypes.object.isRequired,
};

export default ProblemsSolved;

export const getStaticProps = async () => {
  try {
    const data = await getProblemsSolvedPageData();

    return {
      props: {
        lastUpdateTime: data.lastUpdateTime,
        problemsData: data.problemsData,
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
        lastUpdateTime: "",
        problemsData: {},
      },
      revalidate: parseInt(process.env.ISR_REVALIDATE_TIME) || 3600,
    };
  }
};
