// External library components.
import Link from "next/link";
import Image from "next/image";

// Material UI components.
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// External testing library components.
import TestRenderer from "react-test-renderer";

// Internal application components to be tested.
import DescriptorCard from "../../components/common/DescriptorCard";
import Heading from "../../components/common/Heading";
import KeyValueCard from "../../components/common/KeyValueCard";
import TimePeriodDropdown from "../../components/common/TimePeriodDropdown";

// DescriptorCard tests.
describe("DescriptorCard", () => {
  it("renders correctly", () => {
    const descriptorCard = TestRenderer.create(
      <DescriptorCard
        title="Test Title"
        description="Test Description"
        imageLink="/images/user_img.png"
        buttonText="Test Button Text"
        buttonLink="/"
      />,
    );

    expect(descriptorCard.toJSON()).toMatchSnapshot();
    expect(
      descriptorCard.root.findAllByType(Typography)[0].props.children,
    ).toBe("Test Title");
    expect(
      descriptorCard.root.findAllByType(Typography)[1].props.children,
    ).toBe("Test Description");
    expect(descriptorCard.root.findAllByType(Image).length).toBe(1);
    expect(descriptorCard.root.findByType(Link).props.href).toBe("/");
    expect(descriptorCard.root.findByType(Button).props.children).toBe(
      "Test Button Text",
    );
  });

  it("renders correctly with no button", () => {
    const descriptorCard = TestRenderer.create(
      <DescriptorCard
        title="Test Title"
        description="Test Description"
        imageLink="/images/user_img.png"
      />,
    );

    expect(descriptorCard.toJSON()).toMatchSnapshot();
    expect(
      descriptorCard.root.findAllByType(Typography)[0].props.children,
    ).toBe("Test Title");
    expect(
      descriptorCard.root.findAllByType(Typography)[1].props.children,
    ).toBe("Test Description");
    expect(descriptorCard.root.findAllByType(Image).length).toBe(1);
    expect(descriptorCard.root.findAllByType(Link).length).toBe(0);
    expect(descriptorCard.root.findAllByType(Button).length).toBe(0);
  });
});

// Heading tests.
describe("Heading", () => {
  it("renders correctly", () => {
    const heading = TestRenderer.create(
      <Heading
        prefixHeading="Test Prefix Heading"
        mainHeading="Test Main Heading"
        suffixHeading="Test Suffix Heading"
      />,
    );

    expect(heading.toJSON()).toMatchSnapshot();
    expect(heading.root.findAllByType("h1")[0].children[0]).toBe(
      "Test Prefix Heading",
    );
    expect(heading.root.findAllByType("h1")[1].children[0]).toBe(
      "Test Main Heading",
    );
    expect(heading.root.findAllByType("h3")[0].children[0]).toBe(
      "Test Suffix Heading",
    );
  });

  it("renders correctly with no suffix heading", () => {
    const heading = TestRenderer.create(
      <Heading
        prefixHeading="Test Prefix Heading"
        mainHeading="Test Main Heading"
      />,
    );

    expect(heading.toJSON()).toMatchSnapshot();
    expect(heading.root.findAllByType("h1")[0].children[0]).toBe(
      "Test Prefix Heading",
    );
    expect(heading.root.findAllByType("h1")[1].children[0]).toBe(
      "Test Main Heading",
    );
    expect(heading.root.findAllByType("h3").length).toBe(0);
  });

  it("renders correctly with no prefix heading", () => {
    const heading = TestRenderer.create(
      <Heading
        mainHeading="Test Main Heading"
        suffixHeading="Test Suffix Heading"
      />,
    );

    expect(heading.toJSON()).toMatchSnapshot();
    expect(heading.root.findAllByType("h1")[0].children[0]).toBe(
      "Test Main Heading",
    );
    expect(heading.root.findAllByType("h1").length).toBe(1);
    expect(heading.root.findAllByType("h3")[0].children[0]).toBe(
      "Test Suffix Heading",
    );
  });
});

describe("KeyValueCard", () => {
  it("renders correctly", () => {
    const keyValueCard = TestRenderer.create(
      <KeyValueCard
        cardKey="Test Key"
        cardValue="Test Value"
        color="#000000"
        textColor="#ffffff"
      />,
    );

    expect(keyValueCard.toJSON()).toMatchSnapshot();
    expect(
      keyValueCard.root.findByProps({ className: "card_key" }).children[0],
    ).toBe("Test Key");
    expect(
      keyValueCard.root.findByProps({ className: "card_value" }).children[0],
    ).toBe("Test Value");
    expect(keyValueCard.root.findByType(Card).props.style.backgroundImage).toBe(
      "linear-gradient(to right, #000000, #0000008a)",
    );
    expect(keyValueCard.root.findByType(Card).props.style.color).toBe(
      "#ffffff",
    );
  });

  it("renders correctly with no background color", () => {
    const keyValueCard = TestRenderer.create(
      <KeyValueCard
        cardKey="Test Key"
        cardValue="Test Value"
        textColor="#ffffff"
      />,
    );

    expect(keyValueCard.toJSON()).toMatchSnapshot();
    expect(
      keyValueCard.root.findByProps({ className: "card_key" }).children[0],
    ).toBe("Test Key");
    expect(
      keyValueCard.root.findByProps({ className: "card_value" }).children[0],
    ).toBe("Test Value");
    expect(keyValueCard.root.findByType(Card).props.style.color).toBe(
      "#ffffff",
    );
  });

  it("renders correctly with no text color", () => {
    const keyValueCard = TestRenderer.create(
      <KeyValueCard
        cardKey="Test Key"
        cardValue="Test Value"
        color="#000000"
      />,
    );

    expect(keyValueCard.toJSON()).toMatchSnapshot();
    expect(
      keyValueCard.root.findByProps({ className: "card_key" }).children[0],
    ).toBe("Test Key");
    expect(
      keyValueCard.root.findByProps({ className: "card_value" }).children[0],
    ).toBe("Test Value");
    expect(keyValueCard.root.findByType(Card).props.style.backgroundImage).toBe(
      "linear-gradient(to right, #000000, #0000008a)",
    );
  });
});

describe("TimePeriodDropdown", () => {
  it("renders correctly", () => {
    let timePeriod = "all_time",
      setTimePeriod = (value) => {
        timePeriod = value;
      };

    const timePeriodDropdown = TestRenderer.create(
      <TimePeriodDropdown
        timePeriod={timePeriod}
        setTimePeriod={setTimePeriod}
      />,
    );

    expect(timePeriodDropdown.toJSON()).toMatchSnapshot();
    expect(timePeriodDropdown.root.findAllByType(Select).length).toBe(1);
    expect(timePeriodDropdown.root.findAllByType(MenuItem).length).toBe(0); // The menu items are hidden initially.
  });
});
