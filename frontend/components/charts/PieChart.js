// External library components
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Material UI components
import Paper from "@mui/material/Paper";

// CSS styles
import styles from "../../styles/components/charts/PieChart.module.css";

// Dynamic import that fixes the "ReferenceError: window is not defined" error
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// The data passed in, i.e. "data", must be of the form { name_1: value_1, name_2: value_2, ... }
const PieChart = ({ title, donut, data }) => {
  // The data series supplied to the chart
  const [series, setSeries] = useState([]);
  // The chart configuration options
  const [options, setOptions] = useState({
    chart: {
      type: donut ? "donut" : "pie",
    },
    legend: {
      show: true,
      onItemHover: {
        highlightDataSeries: true,
      },
      onItemClick: {
        toggleDataSeries: true,
      },
    },
    stroke: {
      width: 0,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          plotOptions: {
            pie: {
              customScale: 1.5,
              offsetY: 50,
            },
          },
          dataLabels: {
            enabled: false,
          },
          legend: {
            position: "bottom",
            offsetY: 50,
          },
        },
      },
    ],
  });

  // Modify the passed data into a format that ApexCharts can understand
  useEffect(() => {
    // data is of the form {name: value}. We need to sort this dictionary
    // by the count and then convert it into 2 arrays: names and values.
    const names = Object.keys(data).sort((a, b) => data[b] - data[a]);
    const values = Object.values(data).sort((a, b) => b - a);

    // Update the series
    setSeries(values);

    // Add the newly created labels to the configuration options
    setOptions({
      ...options,
      labels: names,
    });
  }, [data]);

  return (
    <Paper elevation={5} style={{ height: "100%" }}>
      <h1 className={styles.title}>{title.toUpperCase()}</h1>
      <Chart options={options} series={series} type={donut ? "donut" : "pie"} />
    </Paper>
  );
};

export default PieChart;
