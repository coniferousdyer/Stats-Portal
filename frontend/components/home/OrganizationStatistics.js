// External library components.
import { useState } from "react";
import PropTypes from "prop-types";

// Internal application components.
import Heading from "../common/Heading";
import InformationCards from "./InformationCards";
import TimePeriodDropdown from "../common/TimePeriodDropdown";
import InformationTable from "../tables/InformationTable";
import PieChart from "../charts/PieChart";
import BarChart from "../charts/BarChart";

// Helper functions.
import {
  formatContestsDataForTable,
  formatProblemsDataForTable,
} from "../../helpers/organization";

/**
 * Component that renders the organization statistics visualization for the home page.
 *
 * @prop {string} lastUpdateTime - The string representation of the last database update time.
 * @prop {Object} organizationInformation - The object containing the organization information.
 * @prop {Object} overallContests - The object containing the overall contest statistics for the organization.
 * @prop {Object} overallProblems - The object containing the overall problem statistics for the organization.
 */
const OrganizationStatistics = ({
  lastUpdateTime,
  organizationInformation,
  overallContests,
  overallProblems,
}) => {
  // The time period for which the user wants to view the statistics.
  const [timePeriod, setTimePeriod] = useState("all_time");

  return (
    <div className="container">
      {/* Heading */}
      <Heading
        prefixHeading={"welcome to the stats portal for"}
        mainHeading={organizationInformation.name}
        suffixHeading={`LAST UPDATED AT ${lastUpdateTime}`}
      />

      {/* Organization Information Cards */}
      <InformationCards organizationInformation={organizationInformation} />

      <div className="flex_wrap_container">
        {/* Time Period Select Dropdown */}
        <TimePeriodDropdown
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
        />

        {/* Problems Solved Leaderboard Bar Chart */}
        <div className="one_third_container">
          <BarChart
            title={`Most Problems Solved in ${organizationInformation.name}`}
            horizontal={true}
            dataList={[
              {
                name: "Problems Solved",
                series: overallProblems[timePeriod].most_problems_solved,
              },
            ]}
            color={"#2196f3"}
            buttonText={"View All >>"}
            buttonLink={"/leaderboards/problems-solved"}
          />
        </div>
        {/* Contests Given Leaderboard Bar Chart */}
        <div className="one_third_container">
          <BarChart
            title={`Most Contests Given in ${organizationInformation.name}`}
            horizontal={true}
            dataList={[
              {
                name: "Contests Participated",
                series: overallContests[timePeriod].most_contests_participated,
              },
            ]}
            color={"#32cd32"}
            buttonText={"View All >>"}
            buttonLink={"/leaderboards/contests-participated"}
          />
        </div>
        {/* Highest Rank Leaderboard Bar Chart */}
        <div className="one_third_container">
          <BarChart
            title={`Best Contest Ranks in ${organizationInformation.name}`}
            horizontal={true}
            dataList={[
              {
                name: "Highest Rank",
                series: overallContests[timePeriod].best_contest_ranks,
              },
            ]}
            color={"#dc143c"}
            buttonText={"View All >>"}
            buttonLink={"/leaderboards/contest-ranks"}
          />
        </div>
        {/* Contests Statistics Table */}
        <div className="half_container">
          <InformationTable
            title={"Contest Statistics"}
            dataList={[formatContestsDataForTable(overallContests[timePeriod])]}
          />
        </div>
        {/* Problems Statistics Table */}
        <div className="half_container">
          <InformationTable
            title={"Problem Statistics"}
            dataList={[formatProblemsDataForTable(overallProblems[timePeriod])]}
          />
        </div>
        {/* Language Distribution Chart */}
        <div className="half_container">
          <PieChart
            title={`Languages Used by ${organizationInformation.name}`}
            donut={true}
            data={overallProblems[timePeriod].languages}
          />
        </div>
        {/* Tag Distribution Donut Chart */}
        <div className="half_container">
          <PieChart
            title={`Problem Tags Solved by ${organizationInformation.name}`}
            donut={true}
            data={overallProblems[timePeriod].tags}
          />
        </div>
        {/* Index Distribution Bar Chart */}
        <div className="half_container">
          <BarChart
            title={`Problem Indexes Solved by ${organizationInformation.name}`}
            horizontal={false}
            dataList={[
              {
                name: "Problems Solved",
                series: overallProblems[timePeriod].indexes,
              },
            ]}
            color={"#ff1744"}
          />
        </div>
        {/* Ratings Distribution Bar Chart */}
        <div className="half_container">
          <BarChart
            title={`Problem Ratings Solved by ${organizationInformation.name}`}
            horizontal={false}
            dataList={[
              {
                name: "Problems Solved",
                series: overallProblems[timePeriod].ratings,
              },
            ]}
            color={"#2196f3"}
          />
        </div>
      </div>
    </div>
  );
};

OrganizationStatistics.propTypes = {
  lastUpdateTime: PropTypes.string.isRequired,
  organizationInformation: PropTypes.object.isRequired,
  overallContests: PropTypes.object.isRequired,
  overallProblems: PropTypes.object.isRequired,
};

export default OrganizationStatistics;
