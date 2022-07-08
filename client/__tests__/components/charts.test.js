// For components imported using "next/dynamic".
import preloadAll from "jest-next-dynamic";

// External library components.
import Link from "next/link";
import Chart from "react-apexcharts";

// Material UI components.
import Button from "@mui/material/Button";

// External testing library components.
import TestRenderer from "react-test-renderer";

// Internal application components to be tested.
import BarChart from "../../components/charts/BarChart";
import LineChart from "../../components/charts/LineChart";
import PieChart from "../../components/charts/PieChart";

beforeAll(async () => {
  await preloadAll();
});

// BarChart tests.
describe("BarChart", () => {
  it("renders correctly with vertical bar chart", () => {
    const barChart = TestRenderer.create(
      <BarChart
        title="Test Title"
        horizontal={false}
        dataList={[
          {
            name: "Test Series 1",
            series: {
              A: 10,
              B: 20,
              C: 30,
            },
          },
          {
            name: "Test Series 2",
            series: {
              A: 10,
              B: 20,
              C: 30,
            },
          },
        ]}
        color="#ff1744"
        buttonText="Test Button Text"
        buttonLink="/"
      />,
    );

    expect(barChart.toJSON()).toMatchSnapshot();
    expect(barChart.root.findByType("h1").children[0]).toBe("TEST TITLE");
    expect(barChart.root.findAllByType(Chart).length).toBe(1);
    expect(barChart.root.findByType(Link).props.href).toBe("/");
    expect(barChart.root.findByType(Button).props.children).toBe(
      "Test Button Text",
    );
  });

  it("renders correctly with horizontal bar chart", () => {
    const barChart = TestRenderer.create(
      <BarChart
        title="Test Title"
        horizontal={true}
        dataList={[
          {
            name: "Test Series 1",
            series: {
              A: 10,
              B: 20,
              C: 30,
            },
          },
          {
            name: "Test Series 2",
            series: {
              A: 10,
              B: 20,
              C: 30,
            },
          },
        ]}
        color="#ff1744"
        buttonText="Test Button Text"
        buttonLink="/"
      />,
    );

    expect(barChart.toJSON()).toMatchSnapshot();
    expect(barChart.root.findByType("h1").children[0]).toBe("TEST TITLE");
    expect(barChart.root.findAllByType(Chart).length).toBe(1);
    expect(barChart.root.findByType(Link).props.href).toBe("/");
    expect(barChart.root.findByType(Button).props.children).toBe(
      "Test Button Text",
    );
  });

  it("renders correctly with no title", () => {
    const barChart = TestRenderer.create(
      <BarChart
        title={null}
        horizontal={false}
        dataList={[
          {
            name: "Test Series 1",
            series: {
              A: 10,
              B: 20,
              C: 30,
            },
          },
          {
            name: "Test Series 2",
            series: {
              A: 10,
              B: 20,
              C: 30,
            },
          },
        ]}
        color="#ff1744"
        buttonText="Test Button Text"
        buttonLink="/"
      />,
    );

    expect(barChart.toJSON()).toMatchSnapshot();
    expect(barChart.root.findAllByType("h1")).toHaveLength(0);
    expect(barChart.root.findAllByType(Chart).length).toBe(1);
    expect(barChart.root.findByType(Link).props.href).toBe("/");
    expect(barChart.root.findByType(Button).props.children).toBe(
      "Test Button Text",
    );
  });

  it("renders correctly with no button", () => {
    const barChart = TestRenderer.create(
      <BarChart
        title="Test Title"
        horizontal={false}
        dataList={[
          {
            name: "Test Series 1",
            series: {
              A: 10,
              B: 20,
              C: 30,
            },
          },
          {
            name: "Test Series 2",
            series: {
              A: 10,
              B: 20,
              C: 30,
            },
          },
        ]}
        color="#ff1744"
        buttonText={null}
        buttonLink="/"
      />,
    );

    expect(barChart.toJSON()).toMatchSnapshot();
    expect(barChart.root.findByType("h1").children[0]).toBe("TEST TITLE");
    expect(barChart.root.findAllByType(Chart).length).toBe(1);
    expect(barChart.root.findAllByType(Link)).toHaveLength(0);
    expect(barChart.root.findAllByType(Button)).toHaveLength(0);
  });
});

// LineChart tests.
describe("LineChart", () => {
  it("renders correctly with timeseries", () => {
    const lineChart = TestRenderer.create(
      <LineChart
        title="Test Title"
        dataList={[
          {
            name: "Test Series 1",
            series: [
              { x: "2019-01-01", y: 10 },
              { x: "2019-01-02", y: 20 },
              { x: "2019-01-03", y: 30 },
            ],
          },
          {
            name: "Test Series 2",
            series: [
              { x: "2019-01-01", y: 30 },
              { x: "2019-01-02", y: 10 },
              { x: "2019-01-03", y: 20 },
            ],
          },
        ]}
      />,
    );

    expect(lineChart.toJSON()).toMatchSnapshot();
    expect(lineChart.root.findByType("h1").children[0]).toBe("TEST TITLE");
    expect(lineChart.root.findAllByType(Chart).length).toBe(1);
  });
});

// PieChart tests.
describe("PieChart", () => {
  it("renders correctly with pie chart", () => {
    const pieChart = TestRenderer.create(
      <PieChart
        title="Test Title"
        donut={false}
        data={{
          A: 10,
          B: 20,
          C: 30,
        }}
      />,
    );

    expect(pieChart.toJSON()).toMatchSnapshot();
    expect(pieChart.root.findByType("h1").children[0]).toBe("TEST TITLE");
    expect(pieChart.root.findAllByType(Chart).length).toBe(1);
  });

  it("renders correctly with donut chart", () => {
    const pieChart = TestRenderer.create(
      <PieChart
        title="Test Title"
        donut={true}
        data={{
          A: 10,
          B: 20,
          C: 30,
        }}
      />,
    );

    expect(pieChart.toJSON()).toMatchSnapshot();
    expect(pieChart.root.findByType("h1").children[0]).toBe("TEST TITLE");
    expect(pieChart.root.findAllByType(Chart).length).toBe(1);
  });
});
