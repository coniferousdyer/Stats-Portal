// External ibrary components.
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useEffect } from "react";

// Material UI components.
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

// CSS styles.
import styles from "../../styles/components/charts/BarChart.module.css";

// Dynamic import that fixes the "ReferenceError: window is not defined" error.
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

/**
 * Component that renders a bar chart (either horizontal or vertical, dpending on the props).
 *
 * @prop {string} title - The title of the chart. Optional.
 * @prop {boolean} horizontal - If true, the chart is rendered as a horizontal bar chart, else as a vertical bar chart.
 * @prop {array[Object]} dataList - An array of objects that contain the data to be rendered in the chart. Each object
 *                                 corresponds to a single series in the chart.
 *                                 Each object must have the following properties:
 *                                 - name: The name of the data series, eg. "Problems Solved by Index".
 *                                 - series: The data series, which is an array of objects that are of the form:
 *                                   {"A": 10, "B": 20, "C": 30, "D": 40, "E": 50, ...} and so on. The key-value pairs
 *                                   represent the labels and the values of the data series.
 * @prop {string} color - The color of the data series. Has to be supplied as a hex code, eg. "#ff1744". If not supplied, defaults to blue.
 * @prop {string} buttonText - The text of the button that is rendered at the bottom of the chart. If not supplied, no button is rendered.
 * @prop {string} buttonLink - The link of the button that is rendered at the bottom of the chart. Only useful if buttonText is supplied.
 */
const BarChart = ({
  title,
  horizontal,
  dataList,
  color,
  buttonText,
  buttonLink,
}) => {
  // The data series supplied to the chart. Obtained from the dataList prop.
  const [series, setSeries] = useState([]);
  // The chart configuration options.
  const [options, setOptions] = useState({
    chart: {
      type: "bar",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: horizontal,
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 750,
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
        },
      },
    ],
  });

  // Modify the passed data into a format that ApexCharts can understand.
  useEffect(() => {
    // Obtain all the possible unique labels from all the data series.
    let names = [];
    names = [
      ...new Set(...names, ...dataList.map((data) => Object.keys(data.series))),
    ];

    // Create the series from the dataList prop. We convert each data series into an array of objects,
    // of the form: [{name: "A", value: 10}, {name: "B", value: 20}, ...] and so on. If a the key for
    // a label is not present in the data series, we set the value to 0.
    const dataSeries = dataList.map((data) => {
      return {
        name: data.name,
        data: names.map((name) => data.series[name] || 0),
      };
    });

    // Update the series
    setSeries(dataSeries);

    // Update the chart configuration with the new names and color, if defined.
    setOptions({
      ...options,
      ...(color && { colors: color }),
      xaxis: {
        categories: names,
      },
    });
  }, [dataList]);

  return (
    <Paper elevation={5} style={{ height: "100%" }}>
      {title && <h1 className={styles.title}>{title.toUpperCase()}</h1>}
      <Chart options={options} series={series} type="bar" />
      {buttonText && (
        <div className={styles.button_container}>
          <Link href={buttonLink ? buttonLink : ""} passHref>
            <Button variant="contained" className={styles.button}>
              {buttonText}
            </Button>
          </Link>
        </div>
      )}
    </Paper>
  );
};

export default BarChart;