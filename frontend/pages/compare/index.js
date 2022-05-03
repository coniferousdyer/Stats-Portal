// External ibrary components.
import Head from "next/head";
import axios from "axios";

// Internal application components.
import Navbar from "../../components/common/Navbar";
import HandleForm from "../../components/compare/HandleForm";
import UserStatisticsComparison from "../../components/compare/UserStatisticsComparison";

// Helper functions.
import { validateHandle } from "../../helpers/codeforces";

/**
 * Component that renders the compare page. Corresponds to the URL:
 * "/compare", or "/compare?handles=user1;user2;user3".
 *
 * @prop {boolean} handlesProvided - If set to true, valid handles were provided for comparison.
 * @prop {string} lastUpdateTime - The string representation of the last database update time.
 * @prop {array[string]} errors - The error corresponding to each handle, if an error occurred for
 *                                that handle, eg. ["error1", "", "error2"].
 * @prop {array[Object]} usersList - The array of objects corresponding to each user. Each object
 *                                   contains the user information, contest statistics and problem
 *                                   statistics obtained from the backend and formatted.
 */
const Compare = ({ handlesProvided, lastUpdateTime, errors, usersList }) => {
  return (
    <div className="layout">
      <Head>
        {/* Joining all the handles together to form a comma separated string */}
        <title>
          Stats Portal | Compare{" "}
          {handlesProvided
            ? usersList.map((user) => user.information.handle).join(", ")
            : "Users"}
        </title>
      </Head>

      <Navbar />

      {/* If valid handles were provided, render the user statistics comparison.
          Else, render the handle input form. */}
      {!handlesProvided ? (
        <HandleForm errors={errors} />
      ) : (
        <UserStatisticsComparison
          lastUpdateTime={lastUpdateTime}
          usersList={usersList}
        />
      )}
    </div>
  );
};

export default Compare;

export const getServerSideProps = async (context) => {
  // Extracting handles from URL. handles would be an array of strings,
  // eg. "/compare?handle=user1&handle=user2" would give ["user1", "user2"].
  let handles = context.query.handle;

  if (handles !== undefined) {
    // If only one handle was provided, handles would be a string, eg. "/compare?handle=user1".
    // So we convert it to an array. Even though there is no comparison, we do not treat it as an error.
    handles = typeof handles === "string" ? [handles] : handles;

    // Dictionary to track the errors in the handles.
    const errors = {};
    // Variable to store the last database update time, if found.
    let lastUpdateTime = null;

    // The array of user data.
    const users = await Promise.all(
      handles.map(async (handle, index) => {
        try {
          // Trimming the handle to remove leading and trailing whitespace.
          handle = handle.trim();

          // If the handle is empty, we do 2 things:
          // 1. Throw an error.
          // 2. Modify the handle to be a whitespace string of length (index + 1). This is
          //    because empty strings cannot be keys in the errors dictionary, and
          //    (index + 1)-length strings are guaranteed to be unique keys in this case.
          if (handle === "") {
            handles[index] = handle = " ".repeat(index + 1);
            throw new Error("Handle cannot be empty.");
          }

          // We check for errors in the provided handle that may interfere with
          // the URL to which the API call to the backend is made. We check if the
          // handle is valid. If not, we throw an error.
          if (!validateHandle(handle)) {
            throw new Error(
              "Handle can only contain letters, digits, underscores and hyphens"
            );
          }

          // The base URL is common to information ("/"), user's contests ("/contests-participated")
          // and user's problems solved ("/problems-solved").
          const baseURL = `http://localhost:5000/users/${handle}`;

          // Getting the required statistics from the backend.
          const userInformation = await axios.get(baseURL);
          const userContests = await axios.get(
            `${baseURL}/contests-participated`
          );
          const userProblems = await axios.get(`${baseURL}/problems-solved`);

          // We update the last update time if it is set to null.
          if (lastUpdateTime === null) {
            lastUpdateTime = userInformation.data.last_update_time;
          }

          return {
            information: userInformation.data.user,
            contests: userContests.data.contest_statistics,
            problems: userProblems.data.problem_statistics,
          };
        } catch (error) {
          // If there was an error, we add the error message to the errors dictionary
          // for the corresponding handle.
          if (error.response && error.response.status === 404) {
            errors[handle] = `User with handle ${handle} not found`;
          } else if (error.message) {
            errors[handle] = error.message;
          } else {
            errors[handle] = "An unknown error occurred";
          }

          return {
            information: null,
            contests: null,
            problems: null,
          };
        }
      })
    );

    // If there were no errors, we return the users data.
    if (Object.keys(errors).length === 0) {
      // Passing in the statistics as props to the page component.
      // handlesProvided is set to true if all handles provided were valid.
      return {
        props: {
          handlesProvided: true,
          lastUpdateTime: lastUpdateTime,
          usersList: users,
        },
      };
    } else {
      // If there were errors, we return an array of errors corresponding to the handles.
      return {
        props: {
          handlesProvided: false,
          errors: handles.map((handle) =>
            errors[handle] ? errors[handle] : ""
          ),
        },
      };
    }
  } else {
    return {
      props: {
        handlesProvided: false,
      },
    };
  }
};
