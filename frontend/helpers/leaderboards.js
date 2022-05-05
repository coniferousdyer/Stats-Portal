/**********************************************************************************
 * This folder contains leaderboards-related helper functions, such as formatting *
 * each individual user's statistics to a format suitable for the tables.         *
 *********************************************************************************/

/**
 * This function formats the user-related data to a format suitable for
 * the MUI DataTables.
 *
 * @param {Object} userInformation - The users' information.
 * @param {Object} data - The data to be measured in the form of a dictionary.
 * @param {String} attribute - The attribute of `data` to be measured for the leaderboard.
 * @returns {Object} - The formatted users' data in the form of an object having
 *                     an array of objects corresponding to the rows of the table
 *                     for each time period.
 */
export const obtainDataCountPerUser = (usersInformation, data, attribute) => {
  // data contains statistics for different time periods, each represented by
  // a key of the object. eg. userContests["all_time"] contains the data for
  // all time. We have to do this for each time period.
  const resultData = {};

  // For each user.
  usersInformation.forEach((user) => {
    const userData = data[user.handle];

    // For each time period.
    Object.keys(userData).forEach((time) => {
      if (!resultData[time]) {
        resultData[time] = [];
      }

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
