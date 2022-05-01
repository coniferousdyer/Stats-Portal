// External library components
import Head from "next/head";
import { useState } from "react";
import axios from "axios";

// Internal application components
import Heading from "../components/common/Heading";
import Navbar from "../components/common/Navbar";
import KeyValueCard from "../components/common/KeyValueCard";
import TimePeriodDropdown from "../components/common/TimePeriodDropdown";
import InformationTable from "../components/tables/InformationTable";
import PieChart from "../components/charts/PieChart";
import BarChart from "../components/charts/BarChart";
import DescriptorCard from "../components/common/DescriptorCard";

// CSS styles
import styles from "../styles/Home.module.css";

// Helper functions
import {
  formatContestsDataForTable,
  formatProblemsDataForTable,
  obtainOverallContestsStatistics,
  obtainOverallProblemsStatistics,
} from "../helpers/organization";

export default function Home({
  lastUpdateTime,
  organizationInformation,
  overallContests,
  overallProblems,
}) {
  // The time period for which the user wants to view the statistics
  const [timePeriod, setTimePeriod] = useState("all_time");

  return (
    <div className={styles.container}>
      <Head>
        <title>Stats Portal | {organizationInformation.name}</title>
      </Head>

      <Navbar />

      <div className={styles.stats_container}>
        {/* Heading */}
        <Heading
          prefixHeading={"welcome to the stats portal for"}
          mainHeading={organizationInformation.name}
          suffixHeading={`LAST UPDATED AT ${lastUpdateTime}`}
        />

        {/* Organization Information Cards */}
        <div className={styles.user_information_container}>
          <KeyValueCard
            cardKey={"Organization ID"}
            cardValue={organizationInformation["organization_id"]}
            color={"#dc143c"}
          />
          <KeyValueCard
            cardKey={"Global Rank"}
            cardValue={organizationInformation["global_rank"]}
            color={"#2196f3"}
          />
          <KeyValueCard
            cardKey={"Rating"}
            cardValue={organizationInformation["rating"]}
            color={"#32cd32"}
          />
          <KeyValueCard
            cardKey={"Users"}
            cardValue={organizationInformation["number_of_users"]}
            color={"#f39c12"}
          />
        </div>

        <div className={styles.flex_wrap_container}>
          {/* Time Period Select Dropdown */}
          <TimePeriodDropdown
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
          />

          {/* Problems Solved Leaderboard Bar Chart */}
          <div className={styles.one_third_chart_container}>
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
          <div className={styles.one_third_chart_container}>
            <BarChart
              title={`Most Contests Given in ${organizationInformation.name}`}
              horizontal={true}
              dataList={[
                {
                  name: "Contests Participated",
                  series:
                    overallContests[timePeriod].most_contests_participated,
                },
              ]}
              color={"#32cd32"}
              buttonText={"View All >>"}
              buttonLink={"/leaderboards/contests-participated"}
            />
          </div>
          {/* Highest Rank Leaderboard Bar Chart */}
          <div className={styles.one_third_chart_container}>
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
          <div className={styles.half_chart_container}>
            <InformationTable
              title={"Contest Statistics"}
              dataList={[
                formatContestsDataForTable(overallContests[timePeriod]),
              ]}
            />
          </div>
          {/* Problems Statistics Table */}
          <div className={styles.half_chart_container}>
            <InformationTable
              title={"Problem Statistics"}
              dataList={[
                formatProblemsDataForTable(overallProblems[timePeriod]),
              ]}
            />
          </div>
          {/* Language Distribution Chart */}
          <div className={styles.half_chart_container}>
            <PieChart
              title={`Languages Used by ${organizationInformation.name}`}
              donut={true}
              data={overallProblems[timePeriod].languages}
            />
          </div>
          {/* Tag Distribution Donut Chart */}
          <div className={styles.half_chart_container}>
            <PieChart
              title={`Problem Tags Solved by ${organizationInformation.name}`}
              donut={true}
              data={overallProblems[timePeriod].tags}
            />
          </div>
          {/* Index Distribution Bar Chart */}
          <div className={styles.half_chart_container}>
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
          <div className={styles.half_chart_container}>
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

        {/* Sections Heading */}
        <Heading
          prefixHeading={"have a look at the"}
          mainHeading={"other sections"}
        />

        <div className={styles.flex_wrap_container}>
          {/* Leaderboard Section Card */}
          <div className={styles.half_chart_container}>
            <DescriptorCard
              title={"LEADERBOARDS"}
              description={`View the leaderboards for ${organizationInformation["name"]} and see where you stand among ${organizationInformation["name"]}'s elite.`}
              imageLink={"/images/leaderboard_img.png"}
              buttonText={"View Leaderboards >>"}
              buttonLink={"/leaderboards"}
            />
          </div>
          {/* Users Section Card */}
          <div className={styles.half_chart_container}>
            <DescriptorCard
              title={"USER VISUALIZER"}
              description={`View visualized analytics for any user in ${organizationInformation["name"]}.`}
              imageLink={"/images/user_img.png"}
              buttonText={"View User Visualizer >>"}
              buttonLink={"/user"}
            />
          </div>
          {/* Compare Section Card */}
          <div className={styles.half_chart_container}>
            <DescriptorCard
              title={"COMPARE"}
              description={`Compare statistics for any two users in ${organizationInformation["name"]}.`}
              imageLink={"/images/compare_img.png"}
              buttonText={"Compare Users >>"}
              buttonLink={"/compare"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = async () => {
  // Obtain the data about organization and contests and problems solved by each user from the backend
  const organizationInformation = await axios.get(
    "http://localhost:5000/organization"
  );
  const userContests = await axios.get(
    "http://localhost:5000/users/contests-participated"
  );
  const userProblems = await axios.get(
    "http://localhost:5000/users/problems-solved"
  );

  // Retrieve the data from the response
  const lastUpdateTime = organizationInformation.data.last_update_time;
  const organizationInformationData = organizationInformation.data.organization;
  const userContestsData = userContests.data.contest_statistics;
  const userProblemsData = userProblems.data.problem_statistics;

  // Aggregate the data about contests and problems solved by each user into
  // one object containing the overall statistics of the organization
  const overallContestsStatistics = await obtainOverallContestsStatistics(
    userContestsData
  );
  const overallProblemsStatistics = await obtainOverallProblemsStatistics(
    userProblemsData
  );

  // Passing in the statistics to the page component
  return {
    props: {
      lastUpdateTime: lastUpdateTime,
      organizationInformation: organizationInformationData,
      overallContests: overallContestsStatistics,
      overallProblems: overallProblemsStatistics,
    },
    // If a request is made 5 minutes after the page was last generated, the page
    // is regenerated. As the data in the backend remains static for some time,
    // this is not an issue.
    revalidate: 3600,
  };
};
