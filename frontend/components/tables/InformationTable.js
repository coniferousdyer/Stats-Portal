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
      style={{ marginTop: "1vw" }}
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
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
              >
                {key}
              </TableCell>
              {dataList.map((data, colIndex) => (
                <TableCell
                  key={`${data[key]}-${rowIndex}-${colIndex}`}
                  align="right"
                  style={{ fontFamily: "Poppins, sans-serif" }}
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

export default InformationTable;
