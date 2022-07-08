/**********************************************************************************
 * This file contains Codeforces-related helper functions, such as validating a   *
 * Codeforces handle, mapping the rank to its corresponding color, etc.           *
 *********************************************************************************/

/**
 * This function validates a Codeforces handle.
 *
 * @param {string} handle - The Codeforces handle to be validated.
 * @returns {boolean} - True if the handle is valid, false otherwise.
 */
export const validateHandle = (handle) => {
  if (handle === "") {
    return false;
  } else if (/[^a-zA-Z0-9_\-\.]/.test(handle)) {
    // If the string contains any non-alphanumeric characters other than
    // underscores, dots and hyphens, it is not a valid handle.
    return false;
  } else {
    return true;
  }
};

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
