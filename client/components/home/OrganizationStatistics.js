// External library components.
import { useState } from "react";
import PropTypes from "prop-types";

// Internal application components.
import Heading from "../common/Heading";
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
 * @prop {string} organizationName - The name of the organization.
 * @prop {Object} overallContests - The object containing the overall contest statistics for the organization.
 * @prop {Object} overallProblems - The object containing the overall problem statistics for the organization.
 */
const OrganizationStatistics = ({
  lastUpdateTime,
  organizationName,
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
        mainHeading={organizationName}
        suffixHeading={`LAST UPDATED AT ${lastUpdateTime}`}
      />

      <div className="flex_wrap_container">
        {/* Time Period Select Dropdown */}
        <TimePeriodDropdown
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
        />

        {/* Problems Solved Leaderboard Bar Chart */}
        <div className="one_third_container">
          <BarChart
            title={`Most Problems Solved in ${organizationName}`}
            horizontal={true}
            dataList={[
              {
                name: "Problems Solved",
                series:
                  timePeriod in overallProblems
                    ? overallProblems[timePeriod].most_problems_solved
                    : {},
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
            title={`Most Contests Given in ${organizationName}`}
            horizontal={true}
            dataList={[
              {
                name: "Contests Participated",
                series:
                  timePeriod in overallProblems
                    ? overallContests[timePeriod].most_contests_participated
                    : {},
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
            title={`Best Contest Ranks in ${organizationName}`}
            horizontal={true}
            dataList={[
              {
                name: "Highest Rank",
                series:
                  timePeriod in overallProblems
                    ? overallContests[timePeriod].best_contest_ranks
                    : {},
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
            dataList={[
              formatContestsDataForTable(
                timePeriod in overallProblems
                  ? overallContests[timePeriod]
                  : {},
              ),
            ]}
          />
        </div>
        {/* Problems Statistics Table */}
        <div className="half_container">
          <InformationTable
            title={"Problem Statistics"}
            dataList={[
              formatProblemsDataForTable(
                timePeriod in overallProblems
                  ? overallProblems[timePeriod]
                  : {},
              ),
            ]}
          />
        </div>
        {/* Language Distribution Chart */}
        <div className="half_container">
          <PieChart
            title={`Languages Used by ${organizationName}`}
            donut={true}
            data={
              timePeriod in overallProblems
                ? overallProblems[timePeriod].languages
                : {}
            }
          />
        </div>
        {/* Tag Distribution Donut Chart */}
        <div className="half_container">
          <PieChart
            title={`Problem Tags Solved by ${organizationName}`}
            donut={true}
            data={
              timePeriod in overallProblems
                ? overallProblems[timePeriod].tags
                : {}
            }
          />
        </div>
        {/* Index Distribution Bar Chart */}
        <div className="half_container">
          <BarChart
            title={`Problem Indexes Solved by ${organizationName}`}
            horizontal={false}
            dataList={[
              {
                name: "Problems Solved",
                series:
                  timePeriod in overallProblems
                    ? overallProblems[timePeriod].indexes
                    : {},
              },
            ]}
            color={"#ff1744"}
          />
        </div>
        {/* Ratings Distribution Bar Chart */}
        <div className="half_container">
          <BarChart
            title={`Problem Ratings Solved by ${organizationName}`}
            horizontal={false}
            dataList={[
              {
                name: "Problems Solved",
                series:
                  timePeriod in overallProblems
                    ? overallProblems[timePeriod].ratings
                    : {},
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
  organizationName: PropTypes.string.isRequired,
  overallContests: PropTypes.object.isRequired,
  overallProblems: PropTypes.object.isRequired,
};

export default OrganizationStatistics;
