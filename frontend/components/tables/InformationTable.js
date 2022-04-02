import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styles from "../../styles/components/tables/InformationTable.module.css";

// "data" will be of the form {name: value}. All key-value pairs will be listed as rows in the table.
const InformationTable = ({ title, data }) => {
  return (
    <TableContainer component={Paper} style={{ marginTop: "1vw" }} elevation={5}>
      <h1 className={styles.title}>{title.toUpperCase()}</h1>
      <Table aria-label="simple table">
        <TableBody>
          {Object.keys(data).map((key) => (
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
              <TableCell
                align="right"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {data[key]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InformationTable;
