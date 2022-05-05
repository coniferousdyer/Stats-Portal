// Internal application components.
import KeyValueCard from "../common/KeyValueCard";
import PropTypes from "prop-types";

/**
 * Component that renders the information cards for the home page.
 *
 * @prop {Object} organizationInformation - The object containing the organization information.
 *                                          Each key corresponds to a specific card.
 */
const InformationCards = ({ organizationInformation }) => {
  return (
    <div className="information_container">
      <KeyValueCard
        cardKey={"Organization ID"}
        cardValue={organizationInformation.organization_id}
        color={"#dc143c"}
        textColor={"#ffffff"}
      />
      <KeyValueCard
        cardKey={"Global Rank"}
        cardValue={organizationInformation.global_rank}
        color={"#2196f3"}
        textColor={"#ffffff"}
      />
      <KeyValueCard
        cardKey={"Rating"}
        cardValue={organizationInformation.rating}
        color={"#32cd32"}
        textColor={"#ffffff"}
      />
      <KeyValueCard
        cardKey={"Users"}
        cardValue={organizationInformation.number_of_users}
        color={"#f39c12"}
        textColor={"#ffffff"}
      />
    </div>
  );
};

InformationCards.propTypes = {
  organizationInformation: PropTypes.shape({
    organization_id: PropTypes.number.isRequired,
    global_rank: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    number_of_users: PropTypes.number.isRequired,
  }).isRequired,
};

export default InformationCards;
