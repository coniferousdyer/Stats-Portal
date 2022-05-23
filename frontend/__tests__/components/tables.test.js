// Material UI components.
import MUIDataTable from "mui-datatables";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

// External testing library components.
import TestRenderer from "react-test-renderer";

// Internal application components to be tested.
import InformationTable from "../../components/tables/InformationTable";
import LeaderboardTable from "../../components/tables/LeaderboardTable";

// InformationTable tests.
describe("InformationTable", () => {
  it("renders correctly", () => {
    const informationTable = TestRenderer.create(
      <InformationTable
        title="Test Title"
        dataList={[
          {
            A: "1",
            B: "2",
          },
          {
            A: "3",
            B: "4",
          },
        ]}
      />,
    );

    expect(informationTable.toJSON()).toMatchSnapshot();
    expect(informationTable.root.findByType("h1").children[0]).toBe(
      "TEST TITLE",
    );
    expect(informationTable.root.findAllByType(Table).length).toBe(1);
    expect(informationTable.root.findAllByType(TableRow).length).toBe(2);
    expect(informationTable.root.findAllByType(TableCell).length).toBe(6);
    expect(
      informationTable.root.findAllByType(TableCell)[0].props.children,
    ).toBe("A");
    expect(
      informationTable.root.findAllByType(TableCell)[1].props.children,
    ).toBe("1");
    expect(
      informationTable.root.findAllByType(TableCell)[2].props.children,
    ).toBe("3");
    expect(
      informationTable.root.findAllByType(TableCell)[3].props.children,
    ).toBe("B");
    expect(
      informationTable.root.findAllByType(TableCell)[4].props.children,
    ).toBe("2");
    expect(
      informationTable.root.findAllByType(TableCell)[5].props.children,
    ).toBe("4");
  });

  it("renders correctly with no title", () => {
    const informationTable = TestRenderer.create(
      <InformationTable
        dataList={[
          {
            A: "1",
            B: "2",
          },
          {
            A: "3",
            B: "4",
          },
        ]}
      />,
    );

    expect(informationTable.toJSON()).toMatchSnapshot();
    expect(informationTable.root.findAllByType("h1").length).toBe(0);
    expect(informationTable.root.findAllByType(Table).length).toBe(1);
    expect(informationTable.root.findAllByType(TableRow).length).toBe(2);
    expect(informationTable.root.findAllByType(TableCell).length).toBe(6);
    expect(
      informationTable.root.findAllByType(TableCell)[0].props.children,
    ).toBe("A");
    expect(
      informationTable.root.findAllByType(TableCell)[1].props.children,
    ).toBe("1");
    expect(
      informationTable.root.findAllByType(TableCell)[2].props.children,
    ).toBe("3");
    expect(
      informationTable.root.findAllByType(TableCell)[3].props.children,
    ).toBe("B");
    expect(
      informationTable.root.findAllByType(TableCell)[4].props.children,
    ).toBe("2");
    expect(
      informationTable.root.findAllByType(TableCell)[5].props.children,
    ).toBe("4");
  });
});

// LeaderboardTable tests.
describe("LeaderboardTable", () => {
  it("renders correctly with descending order", () => {
    const leaderboardTable = TestRenderer.create(
      <LeaderboardTable
        title="Test Title"
        dataList={[
          {
            handle: "testHandle",
            rank: "grandmaster",
            rating: 2700,
            testAttribute: "testValue",
          },
          {
            handle: "testHandle2",
            rank: "master",
            rating: 2600,
            testAttribute: "testValue2",
          },
        ]}
        attribute="testAttribute"
        statisticName="Test Statistic"
        sortingOrder="desc"
      />,
    );

    // We do not perform a snapshot test here because the table is rendered with
    // a different ID each time.
    expect(leaderboardTable.root.findByType("h6").children[0]).toBe(
      "Test Title",
    );
    expect(leaderboardTable.root.findAllByType(MUIDataTable).length).toBe(1);
  });

  it("renders correctly with ascending order", () => {
    const leaderboardTable = TestRenderer.create(
      <LeaderboardTable
        title="Test Title"
        dataList={[
          {
            handle: "testHandle",
            rank: "grandmaster",
            rating: 2700,
            testAttribute: "testValue",
          },
          {
            handle: "testHandle2",
            rank: "master",
            rating: 2600,
            testAttribute: "testValue2",
          },
        ]}
        attribute="testAttribute"
        statisticName="Test Statistic"
        sortingOrder="asc"
      />,
    );

    // We do not perform a snapshot test here because the table is rendered with
    // a different ID each time.
    expect(leaderboardTable.root.findByType("h6").children[0]).toBe(
      "Test Title",
    );
    expect(leaderboardTable.root.findAllByType(MUIDataTable).length).toBe(1);
  });

  it("renders correctly with no statistic name", () => {
    const leaderboardTable = TestRenderer.create(
      <LeaderboardTable
        title="Test Title"
        dataList={[
          {
            handle: "testHandle",
            rank: "grandmaster",
            rating: 2700,
            testAttribute: "testValue",
          },
          {
            handle: "testHandle2",
            rank: "master",
            rating: 2600,
            testAttribute: "testValue2",
          },
        ]}
        attribute="testAttribute"
        sortingOrder="asc"
      />,
    );

    // We do not perform a snapshot test here because the table is rendered with
    // a different ID each time.
    expect(leaderboardTable.root.findByType("h6").children[0]).toBe(
      "Test Title",
    );
    expect(leaderboardTable.root.findAllByType(MUIDataTable).length).toBe(1);
  });
});
