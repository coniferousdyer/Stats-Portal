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
 * Component that renders the contest participated leaderboard page. Corresponds to the URL:
 * "/leaderboards/contests-participaed".
 *
 * @prop {string} lastUpdateTime - The string representation of the last database update time.
 * @prop {Object} contestData - The object containing the contest count corresponding to each
 *                              user, for each time period. Must contain a key for each time
 *                              period. The value corresponding to each time period key is an
 *                              array of objects, each of which contains the user's handle, rank
 *                              rating, and number of contests given in that time period.
 */
const ContestsParticipated = ({ lastUpdateTime, contestsData }) => {
  const [timePeriod, setTimePeriod] = useState("all_time");

  return (
    <>
      <Head>
        <title>Stats Portal | Contests Participated</title>
      </Head>

      <Navbar />

      <div className="layout">
        <div className="container">
          {/* Heading */}
          <Heading
            prefixHeading={"leaderboard for"}
            mainHeading={"contests participated"}
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
              title={"Most Contests Participated"}
              dataList={contestsData[timePeriod]}
              attribute={"total_contests"} // This has to be the same as that supplied to obtainDataCountPerUser in getStaticProps.
              statisticName={"Contests Participated"} // The column name for the statistic corresponding to the attribute.
              sortingOrder={"desc"} // Either "asc" or "desc".
            />
          </div>
        </div>
      </div>
    </>
  );
};

// Set prop types.
ContestsParticipated.propTypes = {
  lastUpdateTime: PropTypes.string.isRequired,
  contestsData: PropTypes.object.isRequired,
};

export default ContestsParticipated;

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

  // Obtain the data count per user.
  const dataCountPerUser = await obtainDataCountPerUser(
    usersData,
    contestsParticipatedData,
    "total_contests"
  );

  // Pass the data to the component as props.
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
