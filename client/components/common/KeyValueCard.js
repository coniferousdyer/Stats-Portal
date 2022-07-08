// Material UI components.
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import PropTypes from "prop-types";

// CSS styles.
import styles from "../../styles/components/common/KeyValueCard.module.css";

/**
 * Component that renders a small card with a key-value pair. Used to indicate a small
 * piece of information or a particular statistic, eg. ("Number of users", 60).
 *
 * @prop {string} cardKey - The key of the key-value pair (displayed in smaller text).
 * @prop {string} cardValue - The value of the key-value pair (displayed in bigger text).
 * @prop {string} cardColor - The color of the card. Must be supplied as a hex code.
 *                            If not supplied, defaults to white.
 * @prop {string} textColor - The color of the text. If not supplied, defaults to black.
 */
const KeyValueCard = ({ cardKey, cardValue, color, textColor }) => {
  return (
    <div className={styles.card_container}>
      <Card
        elevation={3}
        className={styles.card}
        style={{
          // A gradient is composed from the given color and supplied as background to the card.
          backgroundImage: `linear-gradient(to right, ${color}, ${color}8a)`,
          color: textColor,
        }}
      >
        <CardContent>
          <div className={styles.card_key}>{cardKey}</div>
          <div className={styles.card_value}>{cardValue}</div>
        </CardContent>
      </Card>
    </div>
  );
};

KeyValueCard.defaultProps = {
  color: "#ffffff",
  textColor: "#000000",
};

KeyValueCard.propTypes = {
  cardKey: PropTypes.string.isRequired,
  cardValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  color: PropTypes.string,
  textColor: PropTypes.string,
};

export default KeyValueCard;
