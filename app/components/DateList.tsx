import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

const DateList = ({
  dates,
  onDateSelect,
  selectedDates,
}: {
  dates: string[];
  onDateSelect: (date: string, index: number) => void;
  selectedDates: { date: string; index: number; status: "from" | "to" }[];
}) => {
  console.log("selectedDates", selectedDates);
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {dates.map((date, index) => {
        const selected = selectedDates.find(
          ({ date: selectedDate }) => date === selectedDate
        );
        const secondaryText = selected
          ? selected?.status === "from"
            ? "From"
            : "To"
          : "";
        return (
          <ListItem
            sx={selected ? { background: "#f0f0f0" } : {}}
            key={date}
            disablePadding
          >
            <ListItemButton onClick={() => onDateSelect(date, index)}>
              <ListItemText primary={date} secondary={secondaryText} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export { DateList };
