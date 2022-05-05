// External library components.
import Head from "next/head";
import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

// Internal application components.
import Navbar from "../../components/common/Navbar";
import Heading from "../../components/common/Heading";
import TimePeriodDropdown from "../../components/common/TimePeriodDropdown";
import LeaderboardTable from "../../components/tables/LeaderboardTable";

// CSS styles.
import styles from "../../styles/pages/leaderboards/Leaderboard.module.css";

// Helper functions.
import { obtainDataCountPerUser } from "../../helpers/leaderboards";

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
            suffixHeading={`LAST UPDATED AT ${lastUpdateTime}`}
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
              dataList={contestsData[timePeriod]}
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
  // The base URL is common to information ("/") and users' contests ("/contests-participated").
  const baseURL = `http://localhost:5000/users`;

  const usersInformation = await axios.get(baseURL);
  const contestsParticipated = await axios.get(
    `${baseURL}/contests-participated`
  );

  const usersData = usersInformation.data.users;
  const contestsParticipatedData = contestsParticipated.data.contest_statistics;

  // Obtain the data count per user.
  const dataCountPerUser = await obtainDataCountPerUser(
    usersData,
    contestsParticipatedData,
    "highest_rating_increase"
  );

  return {
    props: {
      lastUpdateTime: usersInformation.data.last_update_time,
      contestsData: dataCountPerUser,
    },
    // If a request is made ISR_REVALIDATE_TIME seconds after the page was last
    // generated, the page is regenerated. As the data in the backend remains static
    // for some time, this is not an issue.
    revalidate: parseInt(process.env.ISR_REVALIDATE_TIME) || 3600,
  };
};
