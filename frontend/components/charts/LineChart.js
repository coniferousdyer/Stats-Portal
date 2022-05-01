// External ibrary components
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Material UI components
import Paper from "@mui/material/Paper";

// CSS styles
import styles from "../../styles/components/charts/LineChart.module.css";

// Dynamic import that fixes the "ReferenceError: window is not defined" error
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// dataList is an array of arrays. Each array corresponds to a particular user.
// Each member of the dataList passed in must be of the form [{ x: value_x, y: value_y }, ...]
const LineChart = ({ title, dataList }) => {
  // The data series supplied to the chart
  const [series, setSeries] = useState([]);
  // The chart configuration options
  const [options, setOptions] = useState({
    chart: {
      type: "line",
      zoom: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
      width: 3,
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: {
      type: "datetime",
    },
    responsive: [
      {
        breakpoint: 900,
        options: {
          chart: {
            height: 350,
          },
          stroke: {
            width: 2,
          },
        },
      },
    ],
  });

  // Modify the passed data into a format that ApexCharts can understand
  useEffect(() => {
    const dataSeries = dataList.map((data) => {
      // data is of the form [{ x: value_x, y: value_y }, ...]. While this is a valid
      // format for the line chart, we need to first convert each object to the format
      // { x: (value_x in type datetime), y: value_y } for the time series to be valid.
      const ratingHistory = data.series.map((rating) => ({
        x: new Date(rating.date).getTime(),
        y: rating.rating,
      }));

      return {
        name: data.name,
        data: ratingHistory,
      };
    });

    // Update the series
    setSeries(dataSeries);
  }, [dataList]);

  return (
    <Paper elevation={5} style={{ height: "100%" }}>
      <h1 className={styles.title}>{title.toUpperCase()}</h1>
      {/* height is set to 100% here to limit the height of the chart */}
      <Chart options={options} series={series} type="line" height="100%" />
    </Paper>
  );
};

export default LineChart;
