import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

const RoomsTimeSeriesTable = ({
  currentRoom,
}: {
  currentRoom: {
    readings: {
      timestamp: string;
      humidity: number;
      temperature: number;
    }[];
  } | null;
}) => {
  if (!currentRoom) return null;

  return (
    <TableContainer>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Timestamp</TableCell>
            <TableCell>Humidity</TableCell>
            <TableCell>Temperature</TableCell>
          </TableRow>
          {currentRoom.readings.map(({ timestamp, humidity, temperature }) => (
            <TableRow key={timestamp}>
              <TableCell>{timestamp}</TableCell>
              <TableCell>{humidity}</TableCell>
              <TableCell>{temperature}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { RoomsTimeSeriesTable };
