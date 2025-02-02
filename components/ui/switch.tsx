"use client";

import { Switch as SwitchComponent } from "@headlessui/react";
import { useState } from "react";

export default function Switch() {
  const [enabled, setEnabled] = useState(false);

  return (
    <SwitchComponent
      checked={enabled}
      onChange={setEnabled}
      className="group inline-flex h-5 w-9 items-center rounded-full bg-gray-300 data-[checked]:bg-green-600 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
    >
      <span className="size-4 translate-x-[2px] rounded-full bg-white transition group-data-[checked]:translate-x-[18px] shadow-sm" />
    </SwitchComponent>
  );
}
