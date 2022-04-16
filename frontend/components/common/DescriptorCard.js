import Link from "next/link";
import Image from "next/image";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import styles from "../../styles/components/common/DescriptorCard.module.css";

const DescriptorCard = ({
  title,
  description,
  imageLink,
  buttonText,
  buttonLink,
}) => {
  return (
    <Card elevation={5}>
      <CardMedia component="img" image={imageLink} alt={title} />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          className={styles.title}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className={styles.description}
        >
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Link href={buttonLink} passHref>
          <Button variant="contained" className={styles.button} fullWidth>
            {buttonText}
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default DescriptorCard;
