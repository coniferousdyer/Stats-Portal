// External library components.
import Head from "next/head";
import axios from "axios";

// Internal application components.
import Heading from "../../components/common/Heading";
import Navbar from "../../components/common/Navbar";
import DescriptorCard from "../../components/common/DescriptorCard";

/**
 * Component that renders the main leaderboards page. Corresponds to the URL:
 * "/leaderboards".
 *
 * @prop {string} organizationName - The organization name.
 */
const Leaderboards = ({ organizationName }) => {
  return (
    <div className="layout">
      <Head>
        <title>Stats Portal | Leaderboards</title>
      </Head>

      <Navbar />

      <div className="container">
        {/* Heading */}
        <Heading
          prefixHeading={`view ${organizationName}'s`}
          mainHeading={"leaderboards"}
        />

        {/* Creating a descriptor card for each of the leaderboards in the leaderboards array */}
        <div className="flex_wrap_container">
          {/* Most Problems Solved Leaderboards Card */}
          <div className="half_container">
            <DescriptorCard
              title={"MOST PROBLEMS SOLVED"}
              description={`Leaderboard for the most problems solved by the users of ${organizationName}.`}
              imageLink={"/images/problems_solved_img.png"}
              buttonText={"View Leaderboard >>"}
              buttonLink={"/leaderboards/problems-solved"}
            />
          </div>
          <div className="half_container">
            <DescriptorCard
              title={"HIGHEST RATING INCREASE"}
              description={`Leaderboard for the highest rating increase obtained by users of ${organizationName}.`}
              imageLink={"/images/rating_increase_img.png"}
              buttonText={"View Leaderboard >>"}
              buttonLink={"/leaderboards/highest-rating-increase"}
            />
          </div>
          <div className="half_container">
            <DescriptorCard
              title={"MOST CONTESTS PARTICIPATED"}
              description={`Leaderboard for the most contests participated by users of ${organizationName}.`}
              imageLink={"/images/contests_participated_img.png"}
              buttonText={"View Leaderboard >>"}
              buttonLink={"/leaderboards/contests-participated"}
            />
          </div>
          <div className="half_container">
            <DescriptorCard
              title={"BEST CONTEST RANKS"}
              description={`Leaderboard for the highest contest ranks achieved by users of ${organizationName}.`}
              imageLink={"/images/contest_rank_img.png"}
              buttonText={"View Leaderboard >>"}
              buttonLink={"/leaderboards/best-contest-ranks"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboards;

export const getStaticProps = async () => {
  // Obtain the data about the organization from the backend.
  const organizationInformation = await axios.get(
    "http://localhost:5000/organization"
  );

  // Passing the organization name as a prop to the page component. The name is the only information we require on this page.
  return {
    props: {
      organizationName: organizationInformation.data.organization.name,
    },
  };
};
