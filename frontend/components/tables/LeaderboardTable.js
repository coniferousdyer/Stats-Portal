// Material UI components.
import MUIDataTable from "mui-datatables";

// Helper functions.
import { getRankColor } from "../../helpers/codeforces";

/**
 * Component that renders a leaderboard table with various tools based on the supplied data.
 *
 * @prop {string} title - The title of the table.
 * @prop {array[Object]} dataList - The array of objects representing each row of the table.
 *                                  Each object must have the following properties:
 *                                  - handle: The handle of the user, eg. "tourist".
 *                                  - rank: The Codeforces rank of the user. eg. "grandmaster".
 *                                  - rating: The Codeforces rating of the user, eg. "3900".
 *                                  - [attribute]: The value of the attribute supplied to this component as a prop.
 *                                    eg. If the attribute is "best_rank", the value could be 1.
 * @prop {string} attribute - The name of the attribute to be displayed in the table. Each object in dataList must
 *                            necessarily have this attribute. This is the attribute that the rows will initially
 *                            be sorted by.
 * @prop {string} statisticName - The name of the column in the table for the supplied attribute. If not supplied,
 *                                the attribute name will be used as the column name.
 * @prop {string} sortingOrder - The sorting order of the table. Should be either "asc" or "desc". If not supplied,
 *                               defaults to "desc".
 */
const LeaderboardTable = ({
  title,
  dataList,
  attribute,
  statisticName,
  sortingOrder,
}) => {
  // The column titles.
  const columns = [
    // Position of user in the standings.
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
    // Handle.
    {
      name: "handle",
      label: "Handle",
      options: {
        filter: false,
        sort: true,
      },
    },
    // Rank.
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
    // Rating.
    {
      name: "rating",
      label: "Rating",
      options: {
        filter: false,
        sort: true,
      },
    },
    // Statistic.
    {
      name: attribute,
      label: statisticName ? statisticName : attribute,
      options: {
        filter: false,
        sort: true,
      },
    },
  ];

  // The options for the table.
  const options = {
    rowsPerPageOptions: [10, 25, 50, 100],
    searchPlaceholder: `Search by handle, rank, rating, or ${statisticName.toLowerCase()}`,
    sortOrder: {
      name: attribute,
      direction: sortingOrder ? sortingOrder : "desc",
    },
  };

  return (
    // The core element of the leaderboard is an MUI DataTable. We abstract away the
    // common configuration for the leaderboards, and only the data and attribute have
    // to be supplied to generate the entire leaderboard.
    <MUIDataTable
      title={title}
      data={dataList}
      columns={columns}
      options={options}
    />
  );
};

export default LeaderboardTable;
