// External ibrary components.
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Material UI components.
import Paper from "@mui/material/Paper";

// CSS styles.
import styles from "../../styles/components/charts/LineChart.module.css";

// Dynamic import that fixes the "ReferenceError: window is not defined" error.
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

/**
 * Component that renders a line chart (specifically, a time series chart).
 *
 * @prop {string} title - The title of the chart. Optional.
 * @prop {array[Object]} dataList - An array of objects that contain the data to be rendered in the chart. Each object
 *                                  corresponds to a single series in the chart.
 *                                  Each object must have the following properties:
 *                                  - name: The name of the data series, eg. "Rating of User".
 *                                  - series: The data series, which is an array of objects that are of the form:
 *                                   {"x": "2019-01-01", "y": 10} (x is the date, y is the value).
 */
const LineChart = ({ title, dataList }) => {
  // The data series supplied to the chart. Obtained from the dataList prop.
  const [series, setSeries] = useState([]);
  // The chart configuration options.
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

  // Modify the passed data into a format that ApexCharts can understand.
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

    setSeries(dataSeries);
  }, [dataList]);

  return (
    <Paper elevation={5} className="paper_container">
      {title && <h1 className={styles.title}>{title.toUpperCase()}</h1>}
      {/* height is set to 100% here to limit the height of the chart */}
      <Chart options={options} series={series} type="line" height="100%" />
    </Paper>
  );
};

LineChart.propTypes = {
  title: PropTypes.string,
  dataList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      series: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.string,
          y: PropTypes.number,
        }),
      ),
    }),
  ).isRequired,
};

export default LineChart;
