/**********************************************************************************
 * This folder contains organization-related helper functions, such as obtaining  *
 * the overall statistics from each individual user's statistics.                 *
 *********************************************************************************/

/**
 * Takes in the data about contests given by each user and returns
 * the overall statistics of contests given by the organization.
 *
 * @param {Object} userContestsData - The data about contests given by each user
 * @returns {Object} - The overall statistics of contests given by the organization
 */
export const obtainOverallContestsStatistics = async (userContests) => {
  // userContests contains data corresponding to different time periods,
  // each represented by a key of the object. eg. userContests["all_time"]
  // contains the data for all time. We have to do this for each time period.
  const overallStatistics = {};

  // For each user
  Object.keys(userContests).forEach((user) => {
    // For each time period
    Object.keys(userContests[user]).forEach((time) => {
      // If a key for the time period does not exist in overallStatistics, create it
      if (!(time in overallStatistics))
        overallStatistics[time] = {
          best_rank: null,
          worst_rank: null,
          highest_rating_increase: 0,
          highest_rating_decrease: 0,
          total_contests: 0,
        };

      // Best rank
      if (
        overallStatistics[time].best_rank === null ||
        // If the user has not participated in any contests, the best rank will be null
        (userContests[user][time].best_rank !== null &&
          userContests[user][time].best_rank <
            overallStatistics[time].best_rank)
      )
        overallStatistics[time].best_rank = userContests[user][time].best_rank;

      // Worst rank
      if (
        overallStatistics[time].worst_rank === null ||
        // If the user has not participated in any contests, the worst rank will be null
        (userContests[user][time].worst_rank !== null &&
          userContests[user][time].worst_rank >
            overallStatistics[time].worst_rank)
      )
        overallStatistics[time].worst_rank =
          userContests[user][time].worst_rank;

      // Highest rating increase
      if (
        userContests[user][time].highest_rating_increase >
        overallStatistics[time].highest_rating_increase
      )
        overallStatistics[time].highest_rating_increase =
          userContests[user][time].highest_rating_increase;

      // Highest rating decrease
      if (
        userContests[user][time].highest_rating_decrease <
        overallStatistics[time].highest_rating_decrease
      )
        overallStatistics[time].highest_rating_decrease =
          userContests[user][time].highest_rating_decrease;

      // Total contests
      overallStatistics[time].total_contests +=
        userContests[user][time].total_contests;
    });
  });

  // For each time period, we find the top 10 users who:
  // 1. Have participated in the most contests
  // 2. Have the best contest rank
  Object.keys(overallStatistics).forEach((time) => {
    // If no contests have been given, there is no need to find the top 10 users
    if (overallStatistics[time].total_contests > 0) {
      // Sort the users according to the number of contests they have participated in
      overallStatistics[time].most_contests_participated = Object.entries(
        userContests
      )
        .sort((a, b) => {
          return (
            userContests[b[0]][time].total_contests -
            userContests[a[0]][time].total_contests
          );
        })
        .slice(0, 10)
        .map((user) => [user[0], user[1][time].total_contests]);

      // Sort the users according to their best contest rank
      overallStatistics[time].best_contest_ranks = Object.entries(userContests)
        .sort((a, b) => {
          return (
            userContests[a[0]][time].best_rank -
            userContests[b[0]][time].best_rank
          );
        })
        .slice(0, 10)
        .map((user) => [user[0], user[1][time].best_rank]);
    } else {
      overallStatistics[time].most_contests_participated = [];
      overallStatistics[time].best_contest_ranks = [];
    }
  });

  return overallStatistics;
};

/**
 * Takes in the data about problems solved by each user and returns
 * the overall statistics of problems solved by the organization.
 *
 * @param {Object} userProblemsData - The data about problems solved by each user
 * @returns {Object} - The overall statistics of problems solved by the organization
 */
export const obtainOverallProblemsStatistics = async (userProblems) => {
  // userProblems contains data corresponding to different time periods,
  // each represented by a key of the object. eg. userProblems["all_time"]
  // contains the data for all time. We have to do this for each time period.
  const overallStatistics = {};

  // For each user
  Object.keys(userProblems).forEach((user) => {
    // For each time period
    Object.keys(userProblems[user]).forEach((time) => {
      // If a key for the time period does not exist in overallStatistics, create it
      if (!(time in overallStatistics)) overallStatistics[time] = {};
      // For each category of problems solved ("rating", "tags", etc.)
      Object.keys(userProblems[user][time]).forEach((category) => {
        if (category !== "total_problems") {
          // If a key for the category does not exist in overallStatistics, create it
          if (!(category in overallStatistics[time]))
            overallStatistics[time][category] = {};

          // For each type of problem belonging to the category (eg. if category is "rating", type would be 800)
          Object.keys(userProblems[user][time][category]).forEach((type) => {
            // If a key for the type does not exist in overallStatistics, create it
            if (!(type in overallStatistics[time][category]))
              overallStatistics[time][category][type] = 0;

            // Add the number of problems solved of the type to the overall statistics
            overallStatistics[time][category][type] +=
              userProblems[user][time][category][type];
          });
        } else {
          // If a key for the category does not exist in overallStatistics, create it
          if (!("total_problems" in overallStatistics[time]))
            overallStatistics[time].total_problems = 0;

          // Add the number of problems solved to the overall statistics
          overallStatistics[time].total_problems +=
            userProblems[user][time].total_problems;
        }
      });
    });
  });

  // For each time period, we now find the top 10 users who have solved the most problems
  Object.keys(overallStatistics).forEach((time) => {
    // If no problems have been solved, there is no need to find the top 10 users
    if (overallStatistics[time].total_problems > 0) {
      // Sort the users by the number of problems solved in the time period and get the top 10
      overallStatistics[time].most_problems_solved = Object.entries(
        userProblems
      )
        .sort((a, b) => {
          return (
            userProblems[b[0]][time].total_problems -
            userProblems[a[0]][time].total_problems
          );
        })
        .slice(0, 10)
        .map((user) => [user[0], user[1][time].total_problems]);
    } else {
      overallStatistics[time].most_problems_solved = [];
    }
  });

  return overallStatistics;
};

/**
 * Takes in the data about contests given by the organization and returns
 * the formatted data as a dictionary to give to the contests table.
 *
 * @param {Object} contestsData - The data about contests given by the organization
 * @returns {Object} - The formatted data as a dictionary to give to the contests table
 */
export const formatContestsDataForTable = (contestsData) => {
  return {
    "Total Contests Participated": contestsData.total_contests,
    "Best Rank": contestsData.best_rank,
    "Worst Rank": contestsData.worst_rank,
    "Highest Rating Increase": contestsData.highest_rating_increase,
    "Highest Rating Decrease": contestsData.highest_rating_decrease,
  };
};

/**
 * Takes in the data about problems solved by the organization and returns
 * the formatted data as a dictionary to give to the problems table.
 *
 * @param {Object} problemsData - The data about problems solved by the organization
 * @param {Object} - The formatted data as a dictionary to give to the problems table
 */
export const formatProblemsDataForTable = (problemsData) => {
  return {
    "Total Problems Solved": problemsData.total_problems,
    "Preferred Language": Object.keys(problemsData.languages).reduce((a, b) =>
      problemsData.languages[a] > problemsData.languages[b] ? a : b
    ),
    "Rating Most Solved": Object.keys(problemsData.ratings).reduce((a, b) =>
      problemsData.ratings[a] > problemsData.ratings[b] ? a : b
    ),
    "Tag Most Solved": Object.keys(problemsData.tags).reduce((a, b) =>
      problemsData.tags[a] > problemsData.tags[b] ? a : b
    ),
    "Index Most Solved": Object.keys(problemsData.indexes).reduce((a, b) =>
      problemsData.indexes[a] > problemsData.indexes[b] ? a : b
    ),
  };
};
