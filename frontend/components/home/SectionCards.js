// External library components.
import PropTypes from "prop-types";

// Internal application components.
import Heading from "../common/Heading";
import DescriptorCard from "../common/DescriptorCard";

/**
 * Component that renders the section descriptor cards for the home page. Each card
 * links to a specific section of the application.
 *
 * @prop {string} organizationName - The name of the organization.
 */
const SectionCards = ({ organizationName }) => {
  return (
    <div className="container">
      {/* Sections Heading */}
      <Heading
        prefixHeading={"have a look at the"}
        mainHeading={"other sections"}
      />

      <div className="flex_wrap_container">
        {/* Leaderboard Section Card */}
        <div className="half_container">
          <DescriptorCard
            title={"LEADERBOARDS"}
            description={`View the leaderboards for ${organizationName} and see where you stand among ${organizationName}'s elite.`}
            imageLink={"/images/leaderboard_img.png"}
            buttonText={"View Leaderboards >>"}
            buttonLink={"/leaderboards"}
          />
        </div>
        {/* Users Section Card */}
        <div className="half_container">
          <DescriptorCard
            title={"USER VISUALIZER"}
            description={`View visualized analytics for any user in ${organizationName}.`}
            imageLink={"/images/user_img.png"}
            buttonText={"View User Visualizer >>"}
            buttonLink={"/user"}
          />
        </div>
        {/* Compare Section Card */}
        <div className="half_container">
          <DescriptorCard
            title={"COMPARE"}
            description={`Compare statistics for any two users in ${organizationName}.`}
            imageLink={"/images/compare_img.png"}
            buttonText={"Compare Users >>"}
            buttonLink={"/compare"}
          />
        </div>
      </div>
    </div>
  );
};

// Set prop types.
SectionCards.propTypes = {
  organizationName: PropTypes.string.isRequired,
};

export default SectionCards;
