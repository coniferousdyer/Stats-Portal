// External library components.
import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";

// Material UI components.
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

// CSS styles.
import styles from "../../styles/components/common/DescriptorCard.module.css";

/**
 * Component that renders a card with an image, title, description and a button. Generally
 * used as a way to add a link to a page with information about it.
 *
 * @prop {string} title - The title of the card.
 * @prop {string} description - The description of the card.
 * @prop {string} image - A URL to the image to be displayed in the card, eg. "/images/logo.png".
 * @prop {string} buttonText - The text of the button that is rendered at the bottom of the card. If not supplied, no button is rendered.
 * @prop {string} buttonLink - The link of the button that is rendered at the bottom of the card. Only useful if buttonText is supplied.
 */
const DescriptorCard = ({
  title,
  description,
  imageLink,
  buttonText,
  buttonLink,
}) => {
  return (
    <Card elevation={5}>
      <CardMedia>
        <Image src={imageLink} alt={title} width={"1000%"} height={500} />
      </CardMedia>
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
      {buttonText && (
        <CardActions>
          <Link href={buttonLink} passHref>
            <Button variant="contained" className={styles.button} fullWidth>
              {buttonText}
            </Button>
          </Link>
        </CardActions>
      )}
    </Card>
  );
};

DescriptorCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageLink: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  buttonLink: PropTypes.string,
};

export default DescriptorCard;
