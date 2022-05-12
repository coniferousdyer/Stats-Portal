// External ibrary components.
import Head from "next/head";
import dynamic from "next/dynamic";
import axios from "axios";
import PropTypes from "prop-types";

// Internal application components.
import Navbar from "../../components/common/Navbar";
const HandleForm = dynamic(() => import("../../components/compare/HandleForm"));
const UserStatisticsComparison = dynamic(() =>
  import("../../components/compare/UserStatisticsComparison"),
);

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
    <>
      <Head>
        <title>
          Stats Portal | Compare{" "}
          {handlesProvided
            ? usersList.map((user) => user.information.handle).join(", ")
            : "Users"}
        </title>
      </Head>

      <Navbar />

      <div className="layout">
        {!handlesProvided ? (
          <HandleForm errors={errors} />
        ) : (
          <UserStatisticsComparison
            lastUpdateTime={lastUpdateTime}
            usersList={usersList}
          />
        )}
      </div>
    </>
  );
};

Compare.propTypes = {
  handlesProvided: PropTypes.bool.isRequired,
  lastUpdateTime: PropTypes.string,
  errors: PropTypes.arrayOf(PropTypes.string),
  usersList: PropTypes.arrayOf(
    PropTypes.shape({
      information: PropTypes.object.isRequired,
      contests: PropTypes.object.isRequired,
      problems: PropTypes.object.isRequired,
    }),
  ),
};

export default Compare;

export const getServerSideProps = async (context) => {
  // Enables SSR Caching. The page is considered fresh if a request is made within
  // 5 minutes of the initial one, and a repopulation of the cache is triggered if
  // the request is made within 1 hour of the initial one.
  context.res.setHeader(
    "Cache-Control",
    `public, s-maxage=${
      process.env.CACHE_FRESH_TIME || 300
    }, stale-while-revalidate=${process.env.CACHE_REVALIDATE_TIME || 3600}`,
  );

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

    const users = await Promise.all(
      handles.map(async (handle, index) => {
        try {
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
              "Handle can only contain letters, digits, periods, underscores and hyphens",
            );
          }

          // The base URL is common to information ("/"), user's contests ("/contests-participated")
          // and user's problems solved ("/problems-solved").
          const baseURL = `http://localhost:5000/users/${handle}`;

          const userInformation = await axios.get(baseURL);
          const userContests = await axios.get(
            `${baseURL}/contests-participated`,
          );
          const userProblems = await axios.get(`${baseURL}/problems-solved`);

          if (lastUpdateTime === null) {
            lastUpdateTime = userInformation.data.last_update_time;
          }

          return {
            information: userInformation.data.user,
            contests: userContests.data.contest_statistics,
            problems: userProblems.data.problem_statistics,
          };
        } catch (error) {
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
      }),
    );

    // If there were no errors, we return the users data.
    if (Object.keys(errors).length === 0) {
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
            errors[handle] ? errors[handle] : "",
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
