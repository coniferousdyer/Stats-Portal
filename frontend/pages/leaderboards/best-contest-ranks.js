// External library components.
import Head from "next/head";
import { useState } from "react";
import axios from "axios";

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

  return (
    <div className="layout">
      <Head>
        <title>Stats Portal | Best Contest Ranks</title>
      </Head>

      <Navbar />

      <div className="container">
        {/* Heading */}
        <Heading
          prefixHeading={"leaderboard for"}
          mainHeading={"best contest ranks"}
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
            title={"Best Contest Ranks"}
            dataList={contestsData[timePeriod]}
            attribute={"best_rank"} // This has to be the same as that supplied to obtainDataCountPerUser in getStaticProps.
            statisticName={"Best Contest Rank"} // The column name for the statistic corresponding to the attribute.
            sortingOrder={"asc"} // either "asc" or "desc".
          />
        </div>
      </div>
    </div>
  );
};

export default BestContestRanks;

export const getStaticProps = async () => {
  // The base URL is common to information ("/") and users' contests ("/contests-participated").
  const baseURL = `http://localhost:5000/users`;

  // Obtain the data about information of users in the organization and contests participated
  // by the organization.
  const usersInformation = await axios.get(baseURL);
  const contestsParticipated = await axios.get(
    `${baseURL}/contests-participated`
  );

  // Retrieve the data from the response.
  const usersData = usersInformation.data.users;
  const contestsParticipatedData = contestsParticipated.data.contest_statistics;

  // Obtain the data count of the attribute per user.
  const dataCountPerUser = await obtainDataCountPerUser(
    usersData,
    contestsParticipatedData,
    "best_rank"
  );

  // Pass the data to the component as props.
  return {
    props: {
      lastUpdateTime: usersInformation.data.last_update_time,
      contestsData: dataCountPerUser,
    },
    // If any request is made an hour after the last one, the page will be regenerated.
    // Only the requested page is regenerated, not the whole application.
    revalidate: 3600,
  };
};
