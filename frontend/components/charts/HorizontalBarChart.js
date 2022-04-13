import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import styles from "../../styles/components/charts/HorizontalBarChart.module.css";

// Dynamic import that fixes the "ReferenceError: window is not defined" error
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// The data passed in, i.e. "data", must be of the form [[name_1, object_1], [name_2, object_2], ...]
const HorizontalBarChart = ({ title, data, color, dataName }) => {
  // The data series supplied to the chart
  const [series, setSeries] = useState([]);
  // The chart configuration options
  const [options, setOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: [color],
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
  });

  // Modify the passed data into a format that ApexCharts can understand
  useEffect(() => {
    // data is of the form [[name_1, object_1], [name_2, object_2], ...]. We need
    // to convert into 2 arrays: names and values.
    const names = data.map((item) => item[0]);
    const values = data.map((item) => item[1]);
    console.log(data);

    // Update the series and options
    setSeries([{ name: dataName, data: values }]);
    setOptions({
      ...options,
      xaxis: {
        categories: names,
      },
    });
  }, []);

  return (
    <Paper elevation={5} style={{ height: "100%" }}>
      <h1 className={styles.title}>{title.toUpperCase()}</h1>
      <Chart options={options} series={series} type="bar" />
    </Paper>
  );
};

export default HorizontalBarChart;
