// External ibrary components
import Head from "next/head";
import { useState } from "react";
import axios from "axios";

// Material UI components
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";

// Internal application components
import Heading from "../../components/common/Heading";
import Navbar from "../../components/common/Navbar";
import TimePeriodDropdown from "../../components/common/TimePeriodDropdown";
import InformationTable from "../../components/tables/InformationTable";
import BarChart from "../../components/charts/BarChart";
import LineChart from "../../components/charts/LineChart";

// CSS styles
import styles from "../../styles/pages/compare/Compare.module.css";

// Helper functions
import {
  formatInformationDataForTable,
  formatContestsDataForTable,
  formatProblemsDataForTable,
} from "../../helpers/organization";

const Compare = ({ handlesProvided, lastUpdateTime, errors, usersList }) => {
  // The time period for which the user wants to view the statistics
  const [timePeriod, setTimePeriod] = useState("all_time");
  // The values of the handles entered by the user in the fields (if handlesProvided is false).
  // If no handles were provided, we start with 2 handles, but the user can add more.
  // If some error happened after the handles were provided (for eg. a user was not found),
  // we start with the number of handles provided. "errors" is only supplied if there were errors,
  // and is of the same length as the number of handles.
  const [handles, setHandles] = useState(
    errors ? Array.from(Array(errors.length), () => "") : ["", ""]
  );
  // The error messages to be displayed in the fields (if errors is provided)
  const [handleErrors, setHandleErrors] = useState(errors ? errors : ["", ""]);

  // Handle changes in the handle input fields
  const handleChange = (event, errorIndex) => {
    if (handleErrors[errorIndex]) {
      setHandleErrors(
        handleErrors.map((error, index) => (index === errorIndex ? "" : error))
      );
    }

    setHandles(
      handles.map((handle, index) =>
        index === errorIndex ? event.target.value : handle
      )
    );
  };

  // Handle the addition of a new handle field
  const addHandleField = () => {
    setHandles([...handles, ""]);
    setHandleErrors([...handleErrors, ""]);
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // We merge all the handles together. for eg. ["user1", "user2"] -> "user1;user2".
    const mergedHandles = handles
      .filter((handle) => handle.trim() !== "")
      .join(";");

    // Then we redirect to "/user?handles=<mergedHandles>"
    window.location.href = `/compare?handles=${mergedHandles}`;
  };

  // The user handles input component
  const HandleForm = () => {
    return (
      <div className={styles.stats_container}>
        {/* Heading */}
        <Heading
          prefixHeading={"compare user statistics with the"}
          mainHeading={"compare tool"}
        />

        {/* Handle Input Fields */}
        <div className={styles.half_chart_container}>
          <Box component="form" className={styles.form_container}>
            {handles.map((handle, index) => {
              return (
                <FormControl
                  key={index}
                  variant="outlined"
                  required
                  fullWidth
                  error={handleErrors[index] ? true : false}
                >
                  <InputLabel
                    htmlFor={`handle-input-${index}`}
                    className={styles.handle_input}
                    required={false}
                  >
                    Enter handle of user {index + 1}
                  </InputLabel>
                  <OutlinedInput
                    id={`handle-input-${index}`}
                    className={styles.handle_input}
                    label={`Enter handle of user ${index + 1}`}
                    value={handle}
                    onChange={(event) => handleChange(event, index)}
                  />
                  {handleErrors[index] && (
                    <FormHelperText id="handle-input">
                      {handleErrors[index]}
                    </FormHelperText>
                  )}
                </FormControl>
              );
            })}
            <Button
              variant="outlined"
              className={styles.button}
              fullWidth
              onClick={addHandleField}
            >
              Add another handle
            </Button>
            {/* Submit Button */}
            <Button
              variant="contained"
              color="primary"
              className={styles.button}
              fullWidth
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </div>
      </div>
    );
  };

  // The user statistics comparison component
  const UserStatsComparison = () => {
    return (
      <div className={styles.stats_container}>
        {/* Heading */}
        <Heading
          prefixHeading={"comparison between"}
          mainHeading={usersList
            .map((user) => user.information.handle)
            .join(", ")}
          suffixHeading={`LAST UPDATED AT ${lastUpdateTime}`}
        />

        <div className={styles.flex_wrap_container}>
          {/* Time Period Select Dropdown */}
          <TimePeriodDropdown
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
          />

          {/* User Information Comparison Table */}
          <div className={styles.user_information_container}>
            <InformationTable
              dataList={usersList.map((user) =>
                formatInformationDataForTable(user.information)
              )}
            />
          </div>

          {/* Contests Statistics Table */}
          <div className={styles.full_chart_container}>
            <InformationTable
              title={"Contest Statistics"}
              dataList={usersList.map((user) =>
                formatContestsDataForTable(user.contests[timePeriod])
              )}
            />
          </div>
          {/* Problems Statistics Table */}
          <div className={styles.full_chart_container}>
            <InformationTable
              title={"Problem Statistics"}
              dataList={usersList.map((user) =>
                formatProblemsDataForTable(user.problems[timePeriod])
              )}
            />
          </div>
          {/* Problem Tags Comparison Bar Chart */}
          <div className={styles.full_chart_container}>
            <BarChart
              title={"Problem Tags"}
              horizontal={false}
              dataList={usersList.map((user) => {
                return {
                  name: user.information.handle,
                  series: user.problems[timePeriod].tags,
                };
              })}
            />
          </div>
          {/* Problem Indexes Comparison Bar Chart */}
          <div className={styles.full_chart_container}>
            <BarChart
              title={"Problem Indexes"}
              horizontal={false}
              dataList={usersList.map((user) => {
                return {
                  name: user.information.handle,
                  series: user.problems[timePeriod].indexes,
                };
              })}
            />
          </div>
          {/* Problem Ratings Comparison Bar Chart */}
          <div className={styles.full_chart_container}>
            <BarChart
              title={"Problem Ratings"}
              horizontal={false}
              dataList={usersList.map((user) => {
                return {
                  name: user.information.handle,
                  series: user.problems[timePeriod].ratings,
                };
              })}
            />
          </div>
          {/* Rating History Line Chart */}
          <div className={styles.full_chart_container}>
            <LineChart
              title={"Rating History"}
              dataList={usersList.map((user) => {
                return {
                  name: user.information.handle,
                  series: user.contests[timePeriod].rating_history,
                };
              })}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
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

      {!handlesProvided ? HandleForm() : UserStatsComparison()}
    </div>
  );
};

export default Compare;

export const getServerSideProps = async (context) => {
  // Extracting handles from URL, separated by ";", eg. ?handles="user1;user2;user3"
  let handles = context.query.handles;

  // Check if an array of handles is provided. We account for the case where
  // the user enters a URL like "/user?handle=user1&handle=user2". If so, we
  // choose the first handle only.
  handles = Array.isArray(handles) ? handles[0] : handles;

  // Dictionary to track the errors in the handles
  const errors = {};

  if (handles) {
    // We format the handles to an array of strings, trimming the whitespace and
    // removing empty strings.
    handles = handles
      .split(";")
      .map((handle) => handle.trim())
      .filter((handle) => handle !== "");

    let lastUpdateTime = null;

    // The array of user data
    const users = await Promise.all(
      handles.map(async (handle) => {
        try {
          // We check for errors in the provided handle that may interfere with
          // the URL to which the API call to the backend is made. We simply have
          // to check if the handle contains only letters, digits, underscores and
          // hyphens.
          if (!/^[a-zA-Z0-9_-]+$/.test(handle)) {
            throw new Error(
              "Handle can only contain letters, digits, underscores and hyphens"
            );
          }

          // The base URL is common to information ("/"), user's contests ("/contests-participated")
          // and user's problems solved ("/problems-solved")
          const baseURL = `http://localhost:5000/users/${handle}`;

          // Getting the required statistics from the backend
          const userInformation = await axios.get(baseURL);
          const userContests = await axios.get(
            `${baseURL}/contests-participated`
          );
          const userProblems = await axios.get(`${baseURL}/problems-solved`);

          // We update the last update time if it is set to null
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
          if (error.response && error.response.status === 404) {
            errors[handle] = `User with handle ${handle} not found`;
          } else if (
            error.message &&
            error.message ===
              "Handle can only contain letters, digits, underscores and hyphens"
          ) {
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

    // If there were no errors, we return the users data
    if (Object.keys(errors).length === 0) {
      // Passing in the statistics as props to the page component
      return {
        props: {
          handlesProvided: true,
          lastUpdateTime: lastUpdateTime,
          usersList: users,
        },
      };
    } else {
      // If there were errors, we return an array of errors corresponding to the handles
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
