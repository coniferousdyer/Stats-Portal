// External library components.
import PropTypes from "prop-types";

// Material UI components.
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// CSS styles.
import styles from "../../styles/components/tables/InformationTable.module.css";

/**
 * Component that renders a table with some specified information (key-value pairs).
 *
 * @prop {string} title - The title of the table.
 * @prop {array[Object]} dataList - The list of key-value pairs to be included in the table.
 *                                  All objects must have the same keys, which will be listed
 *                                  as the first column. The subsequent columns will contain
 *                                  the values of the corresponding keys for each object.
 */
const InformationTable = ({ title, dataList }) => {
  return (
    <TableContainer
      component={Paper}
      className={styles.table_container}
      elevation={5}
    >
      {title && <h1 className={styles.title}>{title.toUpperCase()}</h1>}
      <Table aria-label="simple table">
        <TableBody>
          {Object.keys(dataList[0]).map((key, rowIndex) => (
            <TableRow
              key={key}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                className={styles.table_key_cell}
              >
                {key}
              </TableCell>
              {dataList.map((data, colIndex) => (
                <TableCell
                  key={`${data[key]}-${rowIndex}-${colIndex}`}
                  align="right"
                  className={styles.table_value_cell}
                >
                  {data[key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

InformationTable.propTypes = {
  title: PropTypes.string,
  dataList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default InformationTable;
