// Internal application components.
import KeyValueCard from "../../components/common/KeyValueCard";

// CSS styles.
import styles from "../../styles/components/user/InformationCards.module.css";

/**
 * Component that renders the information cards for the user page.
 *
 * @prop {Object} userInformation - The object containing the user information.
 *                                  Each key corresponds to a specific card.
 */
const InformationCards = ({ userInformation }) => {
  return (
    <div className={styles.user_information_container}>
      <KeyValueCard
        cardKey={"User Since"}
        // We convert the string to this format: "Weekday, Day Month Year",
        // eg. "Monday, 1 Jan 2020 00:00:00.000000" becomes "Monday, 1 Jan 2020".
        cardValue={userInformation.creation_date
          .split(" ")
          .splice(0, 4)
          .join(" ")}
        color={"#dc143c"}
        textColor={"#ffffff"}
      />
      <KeyValueCard
        cardKey={"Rank"}
        cardValue={userInformation.rank}
        color={"#2196f3"}
        textColor={"#ffffff"}
      />
      <KeyValueCard
        cardKey={"Rating"}
        cardValue={userInformation.rating}
        color={"#32cd32"}
        textColor={"#ffffff"}
      />
      <KeyValueCard
        cardKey={"Maximum Rating"}
        cardValue={userInformation.max_rating}
        color={"#f39c12"}
        textColor={"#ffffff"}
      />
    </div>
  );
};

export default InformationCards;
