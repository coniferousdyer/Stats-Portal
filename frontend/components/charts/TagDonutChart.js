import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import styles from "../../styles/components/charts/TagDonutChart.module.css";

// Dynamic import that fixes the "ReferenceError: window is not defined" error
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// The data passed in, i.e. tags, must be of the form { name_1: value_1, name_2: value_2, ... }
const TagDonutChart = ({ title, tags }) => {
  // The data series supplied to the chart
  const [series, setSeries] = useState([]);
  // The chart configuration options
  const [options, setOptions] = useState({
    chart: {
      type: "donut",
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
    // responsive: [
    //   {
    //     breakpoint: 480,
    //     options: {
    //       plotOptions: {
    //         pie: {
    //           customScale: 1.5,
    //           offsetY: 50,
    //         },
    //       },
    //       dataLabels: {
    //         enabled: false,
    //       },
    //       legend: {
    //         position: "bottom",
    //         offsetY: 50,
    //       },
    //     },
    //   },
    // ],
  });

  // Modify the passed data into a format that ApexCharts can understand
  useEffect(() => {
    // tags is of the form {tag: count}. We need to sort this dictionary
    // by the count and then convert it into 2 arrays: tag_names and counts.
    const tag_names = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);
    const counts = Object.values(tags).sort((a, b) => b - a);

    // Remove "handle" from tag_names and the handle from counts. These are merely
    // record identifiers and should not be displayed on the chart.
    tag_names.splice(tag_names.indexOf("handle"), 1);
    counts.splice(counts.indexOf(tags["handle"]), 1);

    // Update the series
    setSeries(counts);

    // Add the newly created labels to the configuraion options
    setOptions({
      ...options,
      labels: tag_names,
    });
  }, []);

  return (
    <div className={styles.container}>
      <Paper elevation={5}>
        <h1 className={styles.title}>{title.toUpperCase()}</h1>
        <Chart options={options} series={series} type="donut" />
      </Paper>
    </div>
  );
};

export default TagDonutChart;
