// External library components.
import { useState } from "react";

// Internal application components.
import Heading from "../../components/common/Heading";
import TimePeriodDropdown from "../../components/common/TimePeriodDropdown";
import InformationTable from "../../components/tables/InformationTable";
import BarChart from "../../components/charts/BarChart";
import LineChart from "../../components/charts/LineChart";

// CSS styles.
import styles from "../../styles/components/compare/UserStatisticsComparison.module.css";

// Helper functions.
import {
  formatInformationDataForTable,
  formatContestsDataForTable,
  formatProblemsDataForTable,
} from "../../helpers/organization";

/**
 * Component that renders the statistics comparison visualization for the compare page.
 *
 * @prop {string} lastUpdateTime - The string representation of the last database update time.
 * @prop {array[Object]} usersList - The array of objects corresponding to each user. Each object
 *                                   contains the user information, contest statistics and problem
 *                                   statistics obtained from the backend and formatted.
 */
const UserStatisticsComparison = ({ lastUpdateTime, usersList }) => {
  // The time period for which the user wants to view the statistics.
  const [timePeriod, setTimePeriod] = useState("all_time");

  return (
    <div className={styles.stats_container}>
      {/* Heading */}
      <Heading
        prefixHeading={"comparison between"}
        mainHeading={usersList
          .map((user) => user.information.handle)
          .join(", ")}
        suffixHeading={`LAST UPDATED AT ${lastUpdateTime}`}
      />

      <div className={styles.flex_wrap_container}>
        {/* Time Period Select Dropdown */}
        <TimePeriodDropdown
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
        />

        {/* User Information Comparison Table */}
        <div className={styles.user_information_container}>
          <InformationTable
            dataList={usersList.map((user) =>
              formatInformationDataForTable(user.information)
            )}
          />
        </div>

        {/* Contests Statistics Table */}
        <div className={styles.full_chart_container}>
          <InformationTable
            title={"Contest Statistics"}
            dataList={usersList.map((user) =>
              formatContestsDataForTable(user.contests[timePeriod])
            )}
          />
        </div>
        {/* Problems Statistics Table */}
        <div className={styles.full_chart_container}>
          <InformationTable
            title={"Problem Statistics"}
            dataList={usersList.map((user) =>
              formatProblemsDataForTable(user.problems[timePeriod])
            )}
          />
        </div>
        {/* Problem Tags Comparison Bar Chart */}
        <div className={styles.full_chart_container}>
          <BarChart
            title={"Problem Tags"}
            horizontal={false}
            dataList={usersList.map((user) => {
              return {
                name: user.information.handle,
                series: user.problems[timePeriod].tags,
              };
            })}
          />
        </div>
        {/* Problem Indexes Comparison Bar Chart */}
        <div className={styles.full_chart_container}>
          <BarChart
            title={"Problem Indexes"}
            horizontal={false}
            dataList={usersList.map((user) => {
              return {
                name: user.information.handle,
                series: user.problems[timePeriod].indexes,
              };
            })}
          />
        </div>
        {/* Problem Ratings Comparison Bar Chart */}
        <div className={styles.full_chart_container}>
          <BarChart
            title={"Problem Ratings"}
            horizontal={false}
            dataList={usersList.map((user) => {
              return {
                name: user.information.handle,
                series: user.problems[timePeriod].ratings,
              };
            })}
          />
        </div>
        {/* Rating History Line Chart */}
        <div className={styles.full_chart_container}>
          <LineChart
            title={"Rating History"}
            dataList={usersList.map((user) => {
              return {
                name: user.information.handle,
                series: user.contests[timePeriod].rating_history,
              };
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default UserStatisticsComparison;
