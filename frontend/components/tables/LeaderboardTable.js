// External library components.
import PropTypes from "prop-types";

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
  const columns = [
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
    {
      name: "handle",
      label: "Handle",
      options: {
        filter: false,
        sort: true,
      },
    },
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
    {
      name: "rating",
      label: "Rating",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: attribute,
      label: statisticName ? statisticName : attribute,
      options: {
        filter: false,
        sort: true,
      },
    },
  ];

  const options = {
    rowsPerPageOptions: [10, 25, 50, 100],
    searchPlaceholder: `Search by handle, rank, rating, or ${
      statisticName ? statisticName.toLowerCase() : attribute
    }`,
    sortOrder: {
      name: attribute,
      direction: sortingOrder,
    },
  };

  return (
    <MUIDataTable
      title={title}
      data={dataList}
      columns={columns}
      options={options}
    />
  );
};

LeaderboardTable.defaultProps = {
  sortingOrder: "desc",
};

LeaderboardTable.propTypes = {
  title: PropTypes.string.isRequired,
  dataList: PropTypes.arrayOf(
    PropTypes.shape({
      handle: PropTypes.string.isRequired,
      rank: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      [PropTypes.string]: PropTypes.number,
    }),
  ).isRequired,
  attribute: PropTypes.string.isRequired,
  statisticName: PropTypes.string,
  sortingOrder: PropTypes.oneOf(["asc", "desc"]),
};

export default LeaderboardTable;
