// External library components.
import PropTypes from "prop-types";

// Material UI components.
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// CSS styles.
import styles from "../../styles/components/common/TimePeriodDropdown.module.css";

/**
 * Component that renders a dropdown menu that allows the user to select a time period.
 *
 * @prop {string} timePeriod - A state variable of the parent component that is supplied to the
 *                             component as a prop. Only data of a particular time period is supplied
 *                             to the charts and tables.
 * @prop {function} setTimePeriod - A function of the parent component that is supplied to the
 *                                  component as a prop. This function is used to update the state of
 *                                  the parent component, i.e. the time period state variable.
 */
const TimePeriodDropdown = ({ timePeriod, setTimePeriod }) => {
  return (
    <div className={styles.time_period_select_container}>
      <FormControl>
        <InputLabel id="select-label">Time Period</InputLabel>
        <Select
          labelId="time-period-select-label"
          id="time-period-select"
          value={timePeriod}
          label="Time Period"
          onChange={(event) => setTimePeriod(event.target.value)}
          className={styles.time_period_select}
        >
          <MenuItem value={"all_time"} className={styles.time_period_select}>
            All Time
          </MenuItem>
          <MenuItem value={"this_month"} className={styles.time_period_select}>
            This Month
          </MenuItem>
          <MenuItem value={"this_week"} className={styles.time_period_select}>
            This Week
          </MenuItem>
          <MenuItem value={"today"} className={styles.time_period_select}>
            Today
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

TimePeriodDropdown.propTypes = {
  timePeriod: PropTypes.string.isRequired,
  setTimePeriod: PropTypes.func.isRequired,
};

export default TimePeriodDropdown;
