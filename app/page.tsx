"use client";

import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import buildings from "./data/buildings.json";
import meters from "./data/meters.json";
import rooms from "./data/rooms.json";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { RoomsTimeSeriesTable } from "./components/RoomsTimeSeriesTable";
import { MeterTimeSeriesTable } from "./components/MeterTimeSeriesTable";
import { DateList } from "./components/DateList";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import {
  Room as RoomIcon,
  ElectricMeter as ElectricMeterIcon,
} from "@mui/icons-material";
import { useDateSelection } from "./hooks/useDateSelection";
import { handleFakeRequest } from "./utils/handleFakeRequest";

type SelectionValue = {
  id: string;
  label: string;
} | null;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Home() {
  const [selectedBuilding, setSelectedBuilding] =
    useState<SelectionValue>(null);
  const [selectedMeter, setSelectedMeter] = useState<SelectionValue>(null);
  const [selectedRoom, setSelectedRoom] = useState<SelectionValue>(null);
  const [availableMeters, setAvailableMeters] = useState<typeof meters.meters>(
    []
  );
  const [availableRooms, setAvailableRooms] = useState<typeof rooms.rooms>([]);
  const [tabValue, setTabValue] = useState(0);
  const [roomsInputValue, setRoomsInputValue] = useState("");
  const [meterInputValue, setMeterInputValue] = useState("");

  const { selectedDates, setSelectedDates, handleDateSelect } =
    useDateSelection();

  const [modalIsOpen, setModalOpen] = useState(false);
  const [snackBarIsOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequest = () =>
    handleFakeRequest({
      onSuccess: () => setModalOpen(true),
      onFail: () => setSnackbarOpen(true),
      setLoading: () => setLoading(true),
    });

  useEffect(() => {
    setLoading(false);
  }, [snackBarIsOpen, modalIsOpen]);

  useEffect(() => {
    const filteredMeters = meters.meters.filter(
      ({ buildingId }) => selectedBuilding?.id === buildingId
    );
    const filteredRooms = rooms.rooms.filter(
      ({ buildingId }) => selectedBuilding?.id === buildingId
    );
    setAvailableMeters(filteredMeters);
    setAvailableRooms(filteredRooms);
    setRoomsInputValue("");
    setMeterInputValue("");
    setSelectedRoom(null);
    setSelectedMeter(null);
    setSelectedDates([]);
  }, [selectedBuilding]);

  useEffect(() => {
    setSelectedDates([]);
  }, [tabValue]);

  const currentMeter =
    availableMeters.find(({ id }) => selectedMeter?.id === id) ?? null;
  const currentRoom =
    availableRooms.find(({ id }) => selectedRoom?.id === id) ?? null;
  const buttonEnabled =
    (selectedMeter ?? selectedRoom) && selectedDates.length === 2;

  return (
    <div className="w-100 flex flex-col items-center px-6 mt-8">
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          maxWidth: "420px",
          padding: "8px 24px 16px",
          margin: "0 auto",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Tabs
            variant="fullWidth"
            onChange={(_, newValue) => setTabValue(newValue)}
            value={tabValue}
            aria-label="Tabs where selection follows focus"
            selectionFollowsFocus
          >
            <Tab
              icon={<ElectricMeterIcon fontSize="large" />}
              label="Electricity meters"
            />
            <Tab icon={<RoomIcon fontSize="large" />} label="Rooms" />
          </Tabs>
        </Box>

        <div className="py-2 mt-2">
          <Autocomplete
            disablePortal
            options={buildings.buildings.map(({ name, id }) => ({
              label: name,
              id,
            }))}
            onChange={(_, value) => {
              setSelectedBuilding(value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Select as building"
              />
            )}
          />
        </div>

        {tabValue === 0 && (
          <div>
            <div className="py-2 mt-2">
              <Autocomplete
                disablePortal
                disabled={!selectedBuilding}
                options={availableMeters.map(({ name, id }) => ({
                  label: name,
                  id,
                }))}
                onChange={(_, value) => {
                  setSelectedMeter(value);
                }}
                onInputChange={(event, newInputValue) => {
                  setMeterInputValue(newInputValue);
                }}
                value={selectedMeter}
                inputValue={selectedBuilding ? meterInputValue : ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Select electricity meter"
                  />
                )}
              />
            </div>

            <DateList
              dates={
                currentMeter?.readings.map(({ timestamp }) => timestamp) ?? []
              }
              onDateSelect={handleDateSelect}
              selectedDates={selectedDates}
            />

            <Modal
              open={modalIsOpen}
              onClose={() => setModalOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Here is your time series data!
                </Typography>
                {Boolean(selectedDates && selectedDates.length === 2) && (
                  <MeterTimeSeriesTable
                    currentMeter={{
                      ...currentMeter,
                      readings:
                        currentMeter?.readings.filter((_, index) => {
                          if (selectedDates[0] && selectedDates[1]) {
                            const isIncluded =
                              selectedDates[0].index <= index &&
                              selectedDates[1].index >= index;
                            return isIncluded;
                          } else return false;
                        }) ?? [],
                    }}
                  />
                )}
              </Box>
            </Modal>
          </div>
        )}

        {tabValue === 1 && (
          <>
            <div className="py-2 mt-2">
              <Autocomplete
                disablePortal
                disabled={!selectedBuilding}
                options={availableRooms.map(({ name, id }) => ({
                  label: name,
                  id,
                }))}
                onChange={(event, value) => {
                  setSelectedRoom(value);
                }}
                onInputChange={(event, newInputValue) => {
                  setRoomsInputValue(newInputValue);
                }}
                value={selectedRoom}
                inputValue={selectedBuilding ? roomsInputValue : ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Select a room"
                  />
                )}
              />
            </div>

            <DateList
              dates={
                currentRoom?.readings.map(({ timestamp }) => timestamp) ?? []
              }
              onDateSelect={handleDateSelect}
              selectedDates={selectedDates}
            />

            <Modal
              open={modalIsOpen}
              onClose={() => setModalOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Here is your time series data!
                </Typography>
                {Boolean(selectedDates && selectedDates.length === 2) && (
                  <RoomsTimeSeriesTable
                    currentRoom={{
                      ...currentRoom,
                      readings:
                        currentRoom?.readings.filter((_, index) => {
                          if (selectedDates[0] && selectedDates[1]) {
                            const isIncluded =
                              selectedDates[0].index <= index &&
                              selectedDates[1].index >= index;
                            return isIncluded;
                          } else return false;
                        }) ?? [],
                    }}
                  />
                )}
              </Box>
            </Modal>
          </>
        )}
        <div className="mt-2">
          <Button
            onClick={handleRequest}
            disabled={!buttonEnabled}
            fullWidth
            variant="contained"
            loading={loading}
          >
            Download Time Series
          </Button>
        </div>
      </Paper>

      <Snackbar
        open={snackBarIsOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        message="Reqest problem"
      />
    </div>
  );
}
