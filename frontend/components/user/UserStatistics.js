// External library components.
import { useState } from "react";

// Internal application components.
import Heading from "../../components/common/Heading";
import TimePeriodDropdown from "../../components/common/TimePeriodDropdown";
import InformationTable from "../../components/tables/InformationTable";
import InformationCards from "./InformationCards";
import PieChart from "../../components/charts/PieChart";
import BarChart from "../../components/charts/BarChart";
import LineChart from "../../components/charts/LineChart";

// Helper functions.
import {
  formatContestsDataForTable,
  formatProblemsDataForTable,
} from "../../helpers/organization";

/**
 * Component that renders the statistics comparison visualization for the compare page.
 *
 * @prop {string} lastUpdateTime - The string representation of the last database update time.
 * @prop {Object} userInformation - The object containing the user information.
 * @prop {Object} userContests - The object containing the contest statistics for the user.
 * @prop {Object} userProblems - The object containing the problem statistics for the user.
 */
const UserStatistics = ({
  lastUpdateTime,
  userInformation,
  userContests,
  userProblems,
}) => {
  // The time period for which the user wants to view the statistics.
  const [timePeriod, setTimePeriod] = useState("all_time");

  return (
    <div className="container">
      {/* Heading */}
      <Heading
        prefixHeading={"statistics for"}
        mainHeading={userInformation.handle}
        suffixHeading={`LAST UPDATED AT ${lastUpdateTime}`}
      />

      {/* User Information Cards */}
      <InformationCards userInformation={userInformation} />

      <div className="flex_wrap_container">
        {/* Time Period Select Dropdown */}
        <TimePeriodDropdown
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
        />

        {/* Contests Statistics Table */}
        <div className="half_container">
          <InformationTable
            title={"Contest Statistics"}
            dataList={[formatContestsDataForTable(userContests[timePeriod])]}
          />
        </div>
        {/* Problems Statistics Table */}
        <div className="half_container">
          <InformationTable
            title={"Problem Statistics"}
            dataList={[formatProblemsDataForTable(userProblems[timePeriod])]}
          />
        </div>
        {/* Language Distribution Chart */}
        <div className="half_container">
          <PieChart
            title={`Languages Used by ${userInformation.handle}`}
            donut={true}
            data={userProblems[timePeriod].languages}
          />
        </div>
        {/* Tag Distribution Donut Chart */}
        <div className="half_container">
          <PieChart
            title={`Problem Tags Solved by ${userInformation.handle}`}
            donut={true}
            data={userProblems[timePeriod].tags}
          />
        </div>
        {/* Index Distribution Bar Chart */}
        <div className="half_container">
          <BarChart
            title={`Problem Indexes Solved by ${userInformation.handle}`}
            horizontal={false}
            dataList={[
              {
                name: "Problems Solved",
                series: userProblems[timePeriod].indexes,
              },
            ]}
            color={"#ff1744"}
          />
        </div>
        {/* Ratings Distribution Bar Chart */}
        <div className="half_container">
          <BarChart
            title={`Problem Ratings Solved by ${userInformation.handle}`}
            horizontal={false}
            dataList={[
              {
                name: "Problems Solved",
                series: userProblems[timePeriod].ratings,
              },
            ]}
            color={"#2196f3"}
          />
        </div>
        {/* Rating History Line Chart */}
        <div className="full_container">
          <LineChart
            title={`Rating History for ${userInformation.handle}`}
            dataList={[
              {
                name: "Rating",
                series: userContests[timePeriod].rating_history,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default UserStatistics;
