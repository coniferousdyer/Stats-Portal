/**********************************************************************************
 * This folder contains leaderboards-related helper functions, such as formatting *
 * each individual user's statistics to a format suitable for the tables.         *
 *********************************************************************************/

/**
 * This function maps a Codeforces rank to its corresponding color.
 *
 * @param {number} rank - The Codeforces rank of the user.
 * @returns {string} The hex code of the color corresponding to the rank.
 */
export const getRankColor = (rank) => {
  switch (rank) {
    case "newbie":
      return "#918f8e";
    case "pupil":
      return "#087515";
    case "specialist":
      return "#1af2f2";
    case "expert":
      return "#1300f9";
    case "candidate master":
      return "#b936ee";
    case "master":
    case "international master":
      return "#eebb36";
    case "grandmaster":
    case "international grandmaster":
    case "legendary grandmaster":
      return "#ff0000";
    default:
      return "#000000";
  }
};

/**
 * This function formats the user-related data to a format suitable for
 * the MUI DataTables.
 *
 * @param {Object} userInformation - The users' information
 * @param {Object} data - The data to be measured in the form of a dictionary
 * @param {String} attribute - The attribute of `data` to be measured for the leaderboard
 * @returns {Object} - The formatted users' data in the form of an object having
 *                     an array of objects corresponding to the rows of the table
 *                     for each time period
 */
export const obtainDataCountPerUser = (usersInformation, data, attribute) => {
  // data contains statistics for different time periods, each represented by
  // a key of the object. eg. userContests["all_time"] contains the data for
  // all time. We have to do this for each time period.
  const resultData = {};

  // For each user
  usersInformation.forEach((user) => {
    // Obtain the corresponding data for the user
    const userData = data[user.handle];

    // For each time period
    Object.keys(userData).forEach((time) => {
      // If the time period is not yet in the resultData object, create it
      if (!resultData[time]) {
        resultData[time] = [];
      }

      // Add the user's data to the resultData
      resultData[time].push({
        handle: user.handle,
        rank: user.rank,
        rating: user.rating,
        [attribute]: userData[time][attribute],
      });
    });
  });

  return resultData;
};
