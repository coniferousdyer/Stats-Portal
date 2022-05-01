// Material UI components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// CSS styles
import styles from "../../styles/components/tables/InformationTable.module.css";

// dataList is an array of objects, all having the same keys. For each key, there will be
// a row in the table, and the values of each object will be the values of the row.
// Each member of "dataList" will be of the form {name: value, ...}. All key-value pairs
// will be listed as rows in the table.
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
