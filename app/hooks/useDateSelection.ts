import { useState } from "react";

const useDateSelection = () => {
  const [selectedDates, setSelectedDates] = useState<
    {
      date: string;
      index: number;
      status: "from" | "to";
    }[]
  >([]);

  const handleDateSelect = (date: string, index: number) => {
    if (!selectedDates.length)
      setSelectedDates([{ date, index, status: "from" }]);
    else if (selectedDates.length === 1) {
      if (selectedDates[0].index > index) {
        setSelectedDates([
          { date, index, status: "from" },
          { ...selectedDates[0], status: "to" },
        ]);
      } else if (selectedDates[0].index === index) {
        setSelectedDates([]);
      } else if (selectedDates[0].index < index) {
        setSelectedDates([...selectedDates, { date, index, status: "to" }]);
      }
    } else if (selectedDates.length === 2) {
      setSelectedDates([]);
    }
  };

  return {
    selectedDates,
    setSelectedDates,
    handleDateSelect,
  };
};

export { useDateSelection };
