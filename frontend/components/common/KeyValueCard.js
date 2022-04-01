import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import styles from "../../styles/components/common/KeyValueCard.module.css";

const KeyValueCard = ({ cardKey, cardValue }) => {
  return (
    <div className={styles.card_container}>
      <Card elevation={3} className={styles.card}>
        <CardContent>
          <div className={styles.card_key}>{cardKey}</div>
          <div className={styles.card_value}>{cardValue}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyValueCard;
