// Internal application components.
import KeyValueCard from "../common/KeyValueCard";

// CSS styles.
import styles from "../../styles/components/home/InformationCards.module.css";

/**
 * Component that renders the information cards for the home page.
 *
 * @prop {Object} organizationInformation - The object containing the organization information.
 *                                          Each key corresponds to a specific card.
 */
const InformationCards = ({ organizationInformation }) => {
  return (
    <div className={styles.user_information_container}>
      <KeyValueCard
        cardKey={"Organization ID"}
        cardValue={organizationInformation["organization_id"]}
        color={"#dc143c"}
        textColor={"#ffffff"}
      />
      <KeyValueCard
        cardKey={"Global Rank"}
        cardValue={organizationInformation["global_rank"]}
        color={"#2196f3"}
        textColor={"#ffffff"}
      />
      <KeyValueCard
        cardKey={"Rating"}
        cardValue={organizationInformation["rating"]}
        color={"#32cd32"}
        textColor={"#ffffff"}
      />
      <KeyValueCard
        cardKey={"Users"}
        cardValue={organizationInformation["number_of_users"]}
        color={"#f39c12"}
        textColor={"#ffffff"}
      />
    </div>
  );
};

export default InformationCards;
