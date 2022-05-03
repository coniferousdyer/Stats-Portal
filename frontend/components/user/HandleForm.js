// External library components.
import { useState } from "react";

// Material UI components.
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";

// Internal application components.
import Heading from "../../components/common/Heading";

// CSS styles.
import styles from "../../styles/components/user/HandleForm.module.css";

/**
 * Component that handles the form for the user page.
 *
 * @prop {string} error - The error message for the handle. eg. "Handle not found".
 *                        "error" is only supplied if there was an error in the handle.
 */
const HandleForm = ({ error }) => {
  // The value of the handle entered by the user in the field.
  const [handle, setHandle] = useState("");
  // The error message to be displayed in the field (if error is provided).
  const [handleError, setHandleError] = useState(error ? error : "");

  // Handle changes in the handle input field.
  const handleChange = (event) => {
    if (handleError) {
      setHandleError("");
    }

    setHandle(event.target.value);
  };

  return (
    <div className="container">
      {/* Heading */}
      <Heading
        prefixHeading={"view individual statistics with the"}
        mainHeading={"user visualizer"}
      />

      {/* Handle Input Field */}
      <div className="half_container">
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
            className={styles.button}
          >
            Submit
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default HandleForm;
