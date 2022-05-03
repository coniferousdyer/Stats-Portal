// External library components.
import Head from "next/head";
import axios from "axios";

// Internal application components.
import Navbar from "../components/common/Navbar";
import OrganizationStatistics from "../components/home/OrganizationStatistics";
import SectionCards from "../components/home/SectionCards";

// CSS styles.
import styles from "../styles/Home.module.css";

// Helper functions.
import {
  obtainOverallContestsStatistics,
  obtainOverallProblemsStatistics,
} from "../helpers/organization";

/**
 * Component that renders the home page. Corresponds to the URL:
 * "/".
 *
 * @prop {string} lastUpdateTime - The string representation of the last database update time.
 * @prop {Object} organizationInformation - The object containing the organization information.
 * @prop {Object} overallContests - The object containing the overall contest statistics for the organization.
 * @prop {Object} overallProblems - The object containing the overall problem statistics for the organization.
 */
export default function Home({
  lastUpdateTime,
  organizationInformation,
  overallContests,
  overallProblems,
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Stats Portal | {organizationInformation.name}</title>
      </Head>

      <Navbar />

      {/* Organization Statistics */}
      <OrganizationStatistics
        lastUpdateTime={lastUpdateTime}
        organizationInformation={organizationInformation}
        overallContests={overallContests}
        overallProblems={overallProblems}
      />

      {/* Section Cards */}
      <SectionCards organizationName={organizationInformation.name} />
    </div>
  );
}

export const getStaticProps = async () => {
  // The base URL is common to organization information ("/"), users' contests ("/users/contests-participated")
  // and users' problems solved ("/users/problems-solved").
  const baseURL = "http://localhost:5000";

  // Obtain the data about organization and contests and problems solved by each user from the backend.
  const organizationInformation = await axios.get(`${baseURL}/organization`);
  const userContests = await axios.get(
    `${baseURL}/users/contests-participated`
  );
  const userProblems = await axios.get(`${baseURL}/users/problems-solved`);

  // Retrieve the data from the response.
  const lastUpdateTime = organizationInformation.data.last_update_time;
  const organizationInformationData = organizationInformation.data.organization;
  const userContestsData = userContests.data.contest_statistics;
  const userProblemsData = userProblems.data.problem_statistics;

  // Aggregate the data about contests and problems solved by each user into
  // one object containing the overall statistics of the organization.
  const overallContestsStatistics = await obtainOverallContestsStatistics(
    userContestsData
  );
  const overallProblemsStatistics = await obtainOverallProblemsStatistics(
    userProblemsData
  );

  // Passing in the statistics to the page component.
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
