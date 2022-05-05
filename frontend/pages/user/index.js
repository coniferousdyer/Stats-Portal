// External ibrary components.
import Head from "next/head";
import axios from "axios";
import PropTypes from "prop-types";

// Internal application components.
import Navbar from "../../components/common/Navbar";
import HandleForm from "../../components/user/HandleForm";
import UserStatistics from "../../components/user/UserStatistics";

// Helper functions.
import { validateHandle } from "../../helpers/codeforces";

/**
 * Component that renders the user page. Corresponds to the URL:
 * "/user", or "/user?handle=user1".
 *
 * @prop {boolean} handleProvided - If set to true, a valid handle was provided for visualization.
 * @prop {string} lastUpdateTime - The string representation of the last database update time.
 * @prop {array[string]} error - The error message for the handle. eg. "Handle not found".
 *                               "error" is only supplied if there was an error in the handle.
 * @prop {Object} userInformation - The object containing the user information.
 * @prop {Object} userContests - The object containing the contest statistics for the user.
 * @prop {Object} userProblems - The object containing the problem statistics for the user.
 */
const User = ({
  handleProvided,
  lastUpdateTime,
  error,
  userInformation,
  userContests,
  userProblems,
}) => {
  return (
    <>
      <Head>
        <title>
          Stats Portal |{" "}
          {handleProvided ? userInformation.handle : "User Visualizer"}
        </title>
      </Head>

      <Navbar />

      <div className="layout">
        {!handleProvided ? (
          <HandleForm error={error} />
        ) : (
          <UserStatistics
            lastUpdateTime={lastUpdateTime}
            userInformation={userInformation}
            userContests={userContests}
            userProblems={userProblems}
          />
        )}
      </div>
    </>
  );
};

User.propTypes = {
  handleProvided: PropTypes.bool.isRequired,
  lastUpdateTime: PropTypes.string,
  error: PropTypes.string,
  userInformation: PropTypes.object,
  userContests: PropTypes.object,
  userProblems: PropTypes.object,
};

export default User;

export const getServerSideProps = async (context) => {
  // Enables SSR Caching. The page is considered fresh if a request is made within
  // 5 minutes of the initial one, and a repopulation of the cache is triggered if
  // the request is made within 1 hour of the initial one.
  context.res.setHeader(
    "Cache-Control",
    `public, s-maxage=${
      process.env.CACHE_FRESH_TIME || 300
    }, stale-while-revalidate=${process.env.CACHE_REVALIDATE_TIME || 3600}`
  );

  let handle = context.query.handle;

  // Check if an array of handles is provided. We account for the case where
  // the user enters a URL like "/user?handle=user1&handle=user2". If so, we
  // choose the first handle only.
  handle = Array.isArray(handle) ? handle[0] : handle;

  // Fetch user information if and only if the handle is provided.
  if (handle !== undefined) {
    try {
      handle = handle.trim();

      if (handle === "") {
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

      const userInformation = await axios.get(baseURL);
      const userContests = await axios.get(`${baseURL}/contests-participated`);
      const userProblems = await axios.get(`${baseURL}/problems-solved`);

      // handleProvided is set to true only if a handle was provided and it is valid.
      return {
        props: {
          handleProvided: true,
          lastUpdateTime: userInformation.data.last_update_time,
          userInformation: userInformation.data.user,
          userContests: userContests.data.contest_statistics,
          userProblems: userProblems.data.problem_statistics,
        },
      };
    } catch (error) {
      let errorMessage;

      // If even one of the requests returns a 404, this means the user does not exist in the backend.
      if (error.response && error.response.status === 404) {
        errorMessage = `User with handle ${handle} not found`;
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = "An unknown error occurred";
      }

      return {
        props: {
          handleProvided: false,
          error: errorMessage,
        },
      };
    }
  }

  // If the handle is not provided, we return the props with the handleProvided set to false.
  return {
    props: {
      handleProvided: false,
    },
  };
};
