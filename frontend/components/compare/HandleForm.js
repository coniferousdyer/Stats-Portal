// External library components.
import { useState } from "react";
import PropTypes from "prop-types";

// Internal application components.
import Heading from "../../components/common/Heading";

// Material UI components.
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

// CSS styles.
import styles from "../../styles/components/compare/HandleForm.module.css";

/**
 * Component that handles the form for the compare page.
 *
 * @prop {array[string]} errors - The error corresponding to each handle, if an error occurred for
 *                                that handle, eg. ["error1", "", "error2"].
 */
const HandleForm = ({ errors }) => {
  // The values of the handles entered by the user in the fields. If no handles were provided,
  // we start with 2 handles, but the user can add more. If some error happened after the handles
  // were provided (for eg. a user was not found), we start with the number of handles provided.
  // "errors" is only supplied if there were errors for any handle.
  const [handles, setHandles] = useState(
    errors ? Array.from(Array(errors.length), () => "") : ["", ""]
  );
  // The error messages to be displayed in the fields (if errors is provided).
  const [handleErrors, setHandleErrors] = useState(errors ? errors : ["", ""]);

  // Handle changes in the handle input fields.
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

  // Handle the addition of a new handle field.
  const addHandleField = () => {
    setHandles([...handles, ""]);
    setHandleErrors([...handleErrors, ""]);
  };

  // Handle the removal of a handle field.
  const removeHandleField = (index) => {
    setHandles(handles.filter((handle, handleIndex) => handleIndex !== index));
    setHandleErrors(
      handleErrors.filter((error, errorIndex) => errorIndex !== index)
    );
  };

  return (
    <div className="container">
      {/* Heading */}
      <Heading
        prefixHeading={"compare user statistics with the"}
        mainHeading={"compare tool"}
      />

      {/* Handle Input Fields */}
      <div className="half_container">
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
                  name="handle"
                  className={styles.handle_input}
                  label={`Enter handle of user ${index + 1}`}
                  value={handle}
                  onChange={(event) => handleChange(event, index)}
                  endAdornment={
                    // The delete button would only be present if there are more than 2 handle fields.
                    // This is because 2 or more handles are required to compare.
                    index > 1 && (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="delete"
                          onClick={() => removeHandleField(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
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
            type="submit"
            variant="contained"
            color="primary"
            className={styles.button}
            fullWidth
          >
            Submit
          </Button>
        </Box>
      </div>
    </div>
  );
};

// Set prop types.
HandleForm.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string),
};

export default HandleForm;
