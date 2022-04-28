import styles from "../../styles/components/common/Heading.module.css";

const Heading = ({ prefixHeading, mainHeading }) => {
  return (
    <div className={styles.heading_container}>
      <h1 className={styles.heading_prefix} align="center">{prefixHeading}</h1>
      <h1 className={styles.heading_name} align="center">{mainHeading}</h1>{" "}
    </div>
  );
};

export default Heading;
