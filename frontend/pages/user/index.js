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
import KeyValueCard from "../../components/common/KeyValueCard";
import TimePeriodDropdown from "../../components/common/TimePeriodDropdown";
import InformationTable from "../../components/tables/InformationTable";
import PieChart from "../../components/charts/PieChart";
import BarChart from "../../components/charts/BarChart";
import LineChart from "../../components/charts/LineChart";

// CSS styles
import styles from "../../styles/pages/user/User.module.css";

// Helper functions
import {
  formatContestsDataForTable,
  formatProblemsDataForTable,
} from "../../helpers/organization";

const User = ({
  handleProvided,
  lastUpdateTime,
  error,
  userInformation,
  userContests,
  userProblems,
}) => {
  // The time period for which the user wants to view the statistics
  const [timePeriod, setTimePeriod] = useState("all_time");
  // The value of the handle entered by the user in the field (if handleProvided is false)
  const [handle, setHandle] = useState("");
  // The error message to be displayed in the field (if error is provided)
  const [handleError, setHandleError] = useState(error ? error : "");

  // Handle changes in the handle input field
  const handleChange = (event) => {
    if (handleError) {
      setHandleError("");
    }

    setHandle(event.target.value);
  };

  // The user handle input component
  const HandleForm = () => {
    return (
      <div className={styles.stats_container}>
        {/* Heading */}
        <Heading
          prefixHeading={"view individual statistics with the"}
          mainHeading={"user visualizer"}
        />

        {/* Handle Input Field */}
        <div className={styles.half_chart_container}>
          <Box component="form" className={styles.form_container}>
            <FormControl
              variant="outlined"
              required
              fullWidth
              error={handleError ? true : false}
            >
              <InputLabel
                htmlFor="handle-input"
                className={styles.handle_input}
                required={false}
              >
                Enter handle of user whose statistics you want to view
              </InputLabel>
              <OutlinedInput
                id="handle-input"
                name="handle"
                className={styles.handle_input}
                label="Enter handle of user whose statistics you want to view"
                value={handle}
                onChange={handleChange}
              />
              {handleError && (
                <FormHelperText id="handle-input">{handleError}</FormHelperText>
              )}
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={styles.submit_button}
            >
              Submit
            </Button>
          </Box>
        </div>
      </div>
    );
  };

  // The user statistics component
  const UserStats = () => {
    return (
      <div className={styles.stats_container}>
        {/* Heading */}
        <Heading
          prefixHeading={"statistics for"}
          mainHeading={userInformation.handle}
          suffixHeading={`LAST UPDATED AT ${lastUpdateTime}`}
        />

        {/* User Information Cards */}
        <div className={styles.user_information_container}>
          <KeyValueCard
            cardKey={"User Since"}
            // We convert the string to this format: "Weekday, Day Month Year"
            cardValue={userInformation["creation_date"]
              .split(" ")
              .splice(0, 4)
              .join(" ")}
            color={"#dc143c"}
          />
          <KeyValueCard
            cardKey={"Rank"}
            cardValue={userInformation["rank"]}
            color={"#2196f3"}
          />
          <KeyValueCard
            cardKey={"Rating"}
            cardValue={userInformation["rating"]}
            color={"#32cd32"}
          />
          <KeyValueCard
            cardKey={"Maximum Rating"}
            cardValue={userInformation["max_rating"]}
            color={"#f39c12"}
          />
        </div>

        <div className={styles.flex_wrap_container}>
          {/* Time Period Select Dropdown */}
          <TimePeriodDropdown
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
          />

          {/* Contests Statistics Table */}
          <div className={styles.half_chart_container}>
            <InformationTable
              title={"Contest Statistics"}
              dataList={[formatContestsDataForTable(userContests[timePeriod])]}
            />
          </div>
          {/* Problems Statistics Table */}
          <div className={styles.half_chart_container}>
            <InformationTable
              title={"Problem Statistics"}
              dataList={[formatProblemsDataForTable(userProblems[timePeriod])]}
            />
          </div>
          {/* Language Distribution Chart */}
          <div className={styles.half_chart_container}>
            <PieChart
              title={`Languages Used by ${userInformation.handle}`}
              donut={true}
              data={userProblems[timePeriod].languages}
            />
          </div>
          {/* Tag Distribution Donut Chart */}
          <div className={styles.half_chart_container}>
            <PieChart
              title={`Problem Tags Solved by ${userInformation.handle}`}
              donut={true}
              data={userProblems[timePeriod].tags}
            />
          </div>
          {/* Index Distribution Bar Chart */}
          <div className={styles.half_chart_container}>
            <BarChart
              title={`Problem Indexes Solved by ${userInformation.handle}`}
              horizontal={false}
              dataList={[
                {
                  name: "Problems Solved",
                  series: userProblems[timePeriod].indexes,
                },
              ]}
              color={"#ff1744"}
            />
          </div>
          {/* Ratings Distribution Bar Chart */}
          <div className={styles.half_chart_container}>
            <BarChart
              title={`Problem Ratings Solved by ${userInformation.handle}`}
              horizontal={false}
              dataList={[
                {
                  name: "Problems Solved",
                  series: userProblems[timePeriod].ratings,
                },
              ]}
              color={"#2196f3"}
            />
          </div>
          {/* Rating History Line Chart */}
          <div className={styles.full_chart_container}>
            <LineChart
              title={`Rating History for ${userInformation.handle}`}
              dataList={[
                {
                  name: "Rating",
                  series: userContests[timePeriod].rating_history,
                },
              ]}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>
          Stats Portal |{" "}
          {handleProvided ? userInformation.handle : "User Visualizer"}
        </title>
      </Head>

      <Navbar />

      {!handleProvided ? HandleForm() : UserStats()}
    </div>
  );
};

export default User;

export const getServerSideProps = async (context) => {
  // Extracting handle from URL
  let handle = context.query.handle;

  // Check if an array of handles is provided. We account for the case where
  // the user enters a URL like "/user?handle=user1&handle=user2". If so, we
  // choose the first handle only.
  handle = Array.isArray(handle) ? handle[0] : handle;

  // Fetch user information if and only if the handle is provided
  if (handle) {
    // Trimming the handle to remove any whitespace
    handle = handle.trim();

    // The base URL is common to information ("/"), user's contests ("/contests-participated")
    // and user's problems solved ("/problems-solved")
    const baseURL = `http://localhost:5000/users/${handle}`;

    // Getting the required statistics from the backend
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

      const userInformation = await axios.get(baseURL);
      const userContests = await axios.get(`${baseURL}/contests-participated`);
      const userProblems = await axios.get(`${baseURL}/problems-solved`);

      // Passing in the statistics as props to the page component
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
      // We return a 404 error to the frontend.
      if (error.response && error.response.status === 404) {
        errorMessage = `User with handle ${handle} not found`;
      } else if (
        error.message &&
        error.message ===
          "Handle can only contain letters, digits, underscores and hyphens"
      ) {
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

  // If the handle is not provided, we return the props with the handleProvided set to false
  return {
    props: {
      handleProvided: false,
    },
  };
};
