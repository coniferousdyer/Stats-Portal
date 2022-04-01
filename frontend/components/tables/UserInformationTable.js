import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// Both primaryUser and secondaryUser have the user information dictionaries passed in.
// primaryUser is always supplied. secondaryUser is null if the table is for the
// information of one user, and supplied if for two users (like in the compare page).
const UserInformationTable = ({ primaryUser, secondaryUser }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableBody>
          {/* Creation date */}
          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell component="th" scope="row">
              User Since
            </TableCell>
            <TableCell align="right">{primaryUser["creation_date"]}</TableCell>
          </TableRow>
          {/* Rank */}
          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell component="th" scope="row">
              Rank
            </TableCell>
            <TableCell align="right">{primaryUser["rank"]}</TableCell>
          </TableRow>
          {/* Rating */}
          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell component="th" scope="row">
              Rating
            </TableCell>
            <TableCell align="right">{primaryUser["rating"]}</TableCell>
          </TableRow>
          {/* Max rating */}
          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell component="th" scope="row">
              Maximum Rating
            </TableCell>
            <TableCell align="right">{primaryUser["max_rating"]}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserInformationTable;
