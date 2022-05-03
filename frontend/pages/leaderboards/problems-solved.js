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

  return (
    <div className="layout">
      <Head>
        <title>Stats Portal | Problems Solved</title>
      </Head>

      <Navbar />

      <div className="container">
        {/* Heading */}
        <Heading
          prefixHeading={"leaderboard for"}
          mainHeading={"problems solved"}
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
            title={"Most Problems Solved"}
            dataList={problemsData[timePeriod]}
            attribute={"total_problems"} // This has to be the same as that supplied to obtainDataCountPerUser in getStaticProps.
            statisticName={"Problems Solved"} // The column name for the statistic corresponding to the attribute.
            sortingOrder={"desc"} // Either "asc" or "desc".
          />
        </div>
      </div>
    </div>
  );
};

export default ProblemsSolved;

export const getStaticProps = async () => {
  // The base URL is common to information ("/") and users' problems ("/problems-solved").
  const baseURL = `http://localhost:5000/users`;

  // Obtain the data about information of users in the organization and problems solved
  // by the organization.
  const usersInformation = await axios.get(baseURL);
  const problemsSolved = await axios.get(`${baseURL}/problems-solved`);

  // Retrieve the data from the response.
  const usersData = usersInformation.data.users;
  const problemsSolvedData = problemsSolved.data.problem_statistics;

  // Obtain the data count per user.
  const dataCountPerUser = await obtainDataCountPerUser(
    usersData,
    problemsSolvedData,
    "total_problems"
  );

  // Pass the data to the component as props.
  return {
    props: {
      lastUpdateTime: usersInformation.data.last_update_time,
      problemsData: dataCountPerUser,
    },
    // If any request is made an hour after the last one, the page will be regenerated.
    // Only the requested page is regenerated, not the whole application.
    revalidate: 3600,
  };
};
