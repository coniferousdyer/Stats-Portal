import styles from "../../styles/components/common/Heading.module.css";

const Heading = ({ prefixHeading, mainHeading }) => {
  return (
    <div className={styles.heading_container}>
      <h1 className={styles.heading_prefix}>{prefixHeading}</h1>
      <h1 className={styles.heading_name}>{mainHeading}</h1>{" "}
    </div>
  );
};

export default Heading;
