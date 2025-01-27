import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

const MeterTimeSeriesTable = ({
  currentMeter,
}: {
  currentMeter: {
    readings: {
      timestamp: string;
      consumption: number;
      cost: number;
    }[];
  } | null;
}) => {
  if (!currentMeter) return null;

  return (
    <TableContainer>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Timestamp</TableCell>
            <TableCell>Consumption</TableCell>
            <TableCell>Cost</TableCell>
          </TableRow>
          {currentMeter.readings.map(({ timestamp, consumption, cost }) => (
            <TableRow key={timestamp}>
              <TableCell>{timestamp}</TableCell>
              <TableCell>{consumption}</TableCell>
              <TableCell>{cost}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { MeterTimeSeriesTable };
