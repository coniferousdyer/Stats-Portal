import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import styles from "../../styles/components/charts/ProblemBarChart.module.css";

// Dynamic import that fixes the "ReferenceError: window is not defined" error
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// The data passed in, i.e. "data", must be of the form { name_1: value_1, name_2: value_2, ... }
const ProblemBarChart = ({ title, data, color }) => {
  // The data series supplied to the chart
  const [series, setSeries] = useState([]);
  // The chart configuration options
  const [options, setOptions] = useState({
    chart: {
      type: "bar",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: [color],
    // responsive: [
    //   {
    //     breakpoint: 480,
    //     options: {
    //       plotOptions: {
    //         bar: {
    //           horizontal: true,
    //         },
    //       },
    //       title: {
    //         text: "Problem Ratings Solved",
    //       },
    //     },
    //   },
    // ],
  });

  // Modify the passed data into a format that ApexCharts can understand
  useEffect(() => {
    // data is of the form { name: value }. We need to sort this dictionary according
    // to keys and convert it into 2 arrays: names and values.
    const sorted_data = {};
    Object.keys(data)
      .sort()
      .forEach((key) => {
        sorted_data[key] = data[key];
      });

    // Splitting the object into 2 arrays
    const names = Object.keys(sorted_data);
    const values = Object.values(sorted_data);

    // Remove "handle" from tag_names and the handle from counts. These are merely
    // record identifiers and should not be displayed on the chart.
    names.splice(names.indexOf("handle"), 1);
    values.splice(values.indexOf(data["handle"]), 1);

    // Update the series
    setSeries([{ name: "Problems Solved", data: values }]);

    // Update the chart configuration with the new names and values
    setOptions({
      ...options,
      xaxis: {
        categories: names,
      },
    });
  }, []);

  return (
    <div className={styles.container}>
      <Paper elevation={5}>
        <h1 className={styles.title}>{title.toUpperCase()}</h1>
        <Chart options={options} series={series} type="bar" />
      </Paper>
    </div>
  );
};

export default ProblemBarChart;
