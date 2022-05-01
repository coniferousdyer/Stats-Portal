// Material UI components
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// CSS styles
import styles from "../../styles/components/common/TimePeriodDropdown.module.css";

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

export default TimePeriodDropdown;
