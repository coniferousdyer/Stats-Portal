/*********************************************************************************
 * This file contains SWR-related and backend-related helper functions, such as  *
 * obtaining the overall statistics from each individual user's statistics.      *
 ********************************************************************************/

// External library components.
import axios from "axios";

// Helper functions.
import {
  obtainOverallContestsStatistics,
  obtainOverallProblemsStatistics,
} from "./organization";
import { obtainDataCountPerUser } from "./leaderboards";

/**
 * This function fetches the data required for the home page from the backend and formats it.
 *
 * @returns {Promise<Object>} The data required for the home page.
 */
export const getHomePageData = async () => {
  // The base URL is common to organization information ("/"), users' contests ("/users/contests-participated")
  // and users' problems solved ("/users/problems-solved").
  const baseURL = "http://localhost:5000";

  const organizationInformation = await axios.get(`${baseURL}/organization`);
  const userContests = await axios.get(
    `${baseURL}/users/contests-participated`,
  );
  const userProblems = await axios.get(`${baseURL}/users/problems-solved`);

  const lastUpdateTime = organizationInformation.data.last_update_time;
  const organizationInformationData = organizationInformation.data.organization;
  const userContestsData = userContests.data.contest_statistics;
  const userProblemsData = userProblems.data.problem_statistics;

  // Aggregate the data about contests and problems solved by each user into
  // one object containing the overall statistics of the organization.
  const overallContestsStatistics = await obtainOverallContestsStatistics(
    userContestsData,
  );
  const overallProblemsStatistics = await obtainOverallProblemsStatistics(
    userProblemsData,
  );

  return {
    lastUpdateTime: lastUpdateTime,
    organizationInformation: organizationInformationData,
    overallContests: overallContestsStatistics,
    overallProblems: overallProblemsStatistics,
  };
};

/**
 * This function fetches the data required for the leaderboards home page from the backend and formats it.
 *
 * @returns {Promise<Object>} The data required for the leaderboards home page.
 */
export const getLeaderboardHomePageData = async () => {
  const organizationInformation = await axios.get(
    "http://localhost:5000/organization",
  );

  return {
    organizationName: organizationInformation.data.organization.name,
  };
};

/**
 * This function fetches the data required for the contest ranks leaderboards page from the backend and formats it.
 *
 * @returns {Promise<Object>} The data required for the contest ranks leaderboards page.
 */
export const getBestContestRanksPageData = async () => {
  // The base URL is common to information ("/") and users' contests ("/contests-participated").
  const baseURL = `http://localhost:5000/users`;

  const usersInformation = await axios.get(baseURL);
  const contestsParticipated = await axios.get(
    `${baseURL}/contests-participated`,
  );

  const usersData = usersInformation.data.users;
  const contestsParticipatedData = contestsParticipated.data.contest_statistics;

  // Obtain the data count of the attribute per user.
  const dataCountPerUser = await obtainDataCountPerUser(
    usersData,
    contestsParticipatedData,
    "best_rank",
  );

  return {
    lastUpdateTime: usersInformation.data.last_update_time,
    contestsData: dataCountPerUser,
  };
};

/**
 * This function fetches the data required for the contests participated leaderboards page from the backend and formats it.
 *
 * @returns {Promise<Object>} The data required for the contests participated leaderboards page.
 */
export const getContestsParticipatedPageData = async () => {
  // The base URL is common to information ("/") and users' contests ("/contests-participated").
  const baseURL = `http://localhost:5000/users`;

  const usersInformation = await axios.get(baseURL);
  const contestsParticipated = await axios.get(
    `${baseURL}/contests-participated`,
  );

  const usersData = usersInformation.data.users;
  const contestsParticipatedData = contestsParticipated.data.contest_statistics;

  // Obtain the data count per user.
  const dataCountPerUser = await obtainDataCountPerUser(
    usersData,
    contestsParticipatedData,
    "total_contests",
  );

  return {
    lastUpdateTime: usersInformation.data.last_update_time,
    contestsData: dataCountPerUser,
  };
};

/**
 * This function fetches the data required for the problems solved leaderboards page from the backend and formats it.
 *
 * @returns {Promise<Object>} The data required for the problems solved leaderboards page.
 */
export const getProblemsSolvedPageData = async () => {
  // The base URL is common to information ("/") and users' problems ("/problems-solved").
  const baseURL = `http://localhost:5000/users`;

  const usersInformation = await axios.get(baseURL);
  const problemsSolved = await axios.get(`${baseURL}/problems-solved`);

  const usersData = usersInformation.data.users;
  const problemsSolvedData = problemsSolved.data.problem_statistics;

  // Obtain the data count per user.
  const dataCountPerUser = await obtainDataCountPerUser(
    usersData,
    problemsSolvedData,
    "total_problems",
  );

  return {
    lastUpdateTime: usersInformation.data.last_update_time,
    problemsData: dataCountPerUser,
  };
};

/**
 * This function fetches the data required for the rating increase leaderboards page from the backend and formats it.
 *
 * @returns {Promise<Object>} The data required for the rating increase leaderboards page.
 */
export const getRatingIncreasePageData = async () => {
  // The base URL is common to information ("/") and users' contests ("/contests-participated").
  const baseURL = `http://localhost:5000/users`;

  const usersInformation = await axios.get(baseURL);
  const contestsParticipated = await axios.get(
    `${baseURL}/contests-participated`,
  );

  const usersData = usersInformation.data.users;
  const contestsParticipatedData = contestsParticipated.data.contest_statistics;

  // Obtain the data count per user.
  const dataCountPerUser = await obtainDataCountPerUser(
    usersData,
    contestsParticipatedData,
    "highest_rating_increase",
  );

  return {
    lastUpdateTime: usersInformation.data.last_update_time,
    contestsData: dataCountPerUser,
  };
};
