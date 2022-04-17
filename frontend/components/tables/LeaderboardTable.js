import MUIDataTable from "mui-datatables";
import { getRankColor } from "../../helpers/leaderboards";

// data must be of the form [{"handle": handle, "rating": rating, "rank": rank, "data_name": value}, ...]
const LeaderboardTable = ({
  title,
  data,
  attribute,
  statisticName,
  sortingOrder,
}) => {
  // The column titles
  const columns = [
    // Position of user in the standings
    {
      name: "",
      label: "Position",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, update) => {
          let rowIndex = Number(tableMeta.rowIndex) + 1;
          return <span>{rowIndex}</span>;
        },
      },
    },
    // Handle
    {
      name: "handle",
      label: "Handle",
      options: {
        filter: false,
        sort: true,
      },
    },
    // Rank
    {
      name: "rank",
      label: "Rank",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, update) => {
          return (
            <span
              style={{
                color: getRankColor(value),
                fontWeight: "bold",
              }}
            >
              {value}
            </span>
          );
        },
      },
    },
    // Rating
    {
      name: "rating",
      label: "Rating",
      options: {
        filter: false,
        sort: true,
      },
    },
    // Statistic
    {
      name: attribute,
      label: statisticName,
      options: {
        filter: false,
        sort: true,
      },
    },
  ];

  // The options for the table
  const options = {
    rowsPerPageOptions: [10, 25, 50, 100],
    searchPlaceholder: `Search by handle, rank, rating, or ${statisticName.toLowerCase()}`,
    sortOrder: {
      name: attribute,
      direction: sortingOrder,
    },
  };

  return (
    // The core element of the leaderboard is an MUI DataTable. We abstract away the
    // common configuration for the leaderboards, and only the data and attribute have
    // to be supplied to generate the entire leaderboard.
    <MUIDataTable
      title={title}
      data={data}
      columns={columns}
      options={options}
    />
  );
};

export default LeaderboardTable;
