// External ibrary components
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useEffect } from "react";

// Material UI components
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

// CSS styles
import styles from "../../styles/components/charts/BarChart.module.css";

// Dynamic import that fixes the "ReferenceError: window is not defined" error
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// The data passed in, i.e. "data", must be of the form [[name_1, object_1], [name_2, object_2], ...]
const BarChart = ({
  title,
  horizontal,
  dataList,
  color,
  buttonText,
  buttonLink,
}) => {
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

  // Modify the passed data into a format that ApexCharts can understand
  useEffect(() => {
    // Obtain the sorted set of all keys in the data
    let names = [];
    names = [
      ...new Set(...names, ...dataList.map((data) => Object.keys(data.series))),
    ];

    const dataSeries = dataList.map((data) => {
      return {
        name: data.name,
        data: names.map((name) => data.series[name] || 0),
      };
    });

    // Update the series
    setSeries(dataSeries);

    // Update the chart configuration with the new names and color, if defined
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
      <h1 className={styles.title}>{title.toUpperCase()}</h1>
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
