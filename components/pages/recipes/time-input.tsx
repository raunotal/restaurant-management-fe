import Input from "@/components/ui/input";
import React from "react";

type TimeInputProps = {
  timeInMinutes?: number;
  onChange: (timeInMinutes: number) => void;
};

export default function TimeInput(props: TimeInputProps) {
  const { timeInMinutes = 0, onChange } = props;
  const handleTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "hours" | "minutes"
  ) => {
    const time = Number(e.target.value);

    if (type === "hours") {
      onChange(time * 60 + (timeInMinutes % 60));
    } else {
      onChange(Math.floor(timeInMinutes / 60) * 60 + time);
    }
  };

  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;

  return (
    <div className="flex items-center gap-2">
      <Input
        name="hours"
        type="number"
        value={hours}
        onChange={(e) => handleTimeChange(e, "hours")}
        isField={false}
        className="w-[65px]"
        min={0}
      />
      <span>h</span>
      <span>:</span>
      <Input
        name="minutes"
        type="number"
        value={minutes}
        onChange={(e) => handleTimeChange(e, "minutes")}
        isField={false}
        className="w-[65px]"
        min={0}
      />
      <span>min</span>
    </div>
  );
}
