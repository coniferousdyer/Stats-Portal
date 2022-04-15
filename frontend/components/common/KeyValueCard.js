import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import styles from "../../styles/components/common/KeyValueCard.module.css";

// The color must be given as a hex code
const KeyValueCard = ({ cardKey, cardValue, color }) => {
  return (
    <div className={styles.card_container}>
      <Card
        elevation={3}
        className={styles.card}
        style={{
          // A gradient is composed from the given color and supplied as background to the card
          backgroundImage: `linear-gradient(to right, ${color}, ${color}8a)`,
          color: "white",
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

export default KeyValueCard;
