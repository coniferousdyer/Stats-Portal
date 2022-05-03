// CSS styles.
import styles from "../../styles/components/common/Heading.module.css";

/**
 * Component that renders a heading, with optional prefix and suffix text.
 *
 * @prop {string} prefixHeading - The text to be displayed before the main heading. Optional.
 * @prop {string} mainHeading - The text to be displayed in the main heading.
 * @prop {string} suffixHeading - The text to be displayed after the main heading. Optional.
 */
const Heading = ({ prefixHeading, mainHeading, suffixHeading }) => {
  return (
    <div className={styles.heading_container}>
      {prefixHeading && (
        <h1 className={styles.heading_prefix} align="center">
          {prefixHeading}
        </h1>
      )}
      <h1 className={styles.heading_name} align="center">
        {mainHeading}
      </h1>{" "}
      {suffixHeading && (
        <h3 className={styles.heading_suffix} align="center">
          {suffixHeading}
        </h3>
      )}
    </div>
  );
};

export default Heading;
