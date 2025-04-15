"use client";

import {
  Combobox as HeadlessCombobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Field,
  Label,
  ComboboxButton,
} from "@headlessui/react";
import classNames from "classnames";
import { useState } from "react";
import { ComboboxElement } from "./combobox";
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDownIcon";

interface ComboboxProps {
  data: ComboboxElement[];
  label?: string;
  placeholder?: string;
  selected: ComboboxElement[];
  hasError?: boolean;
  isField?: boolean;
  multiple?: boolean;
  onChange: (value: ComboboxElement[]) => void;
  className?: string;
}

export default function MultiCombobox(props: ComboboxProps) {
  const {
    data,
    label,
    placeholder,
    selected,
    isField = true,
    hasError,
    onChange,
    className,
  } = props;
  const [query, setQuery] = useState("");

  const filteredData =
    query === ""
      ? data
      : data.filter((element) => {
          return element.value.toLowerCase().includes(query.toLowerCase());
        });

  const inputClass = classNames(
    "py-1.5 px-3 text-sm outline-gray-300 -outline-offset-1 outline-1 outline-solid focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 text-gray-900 py-1.5 px3 bg-white rounded-md w-full placeholder:text-gray-400",
    hasError && "outline-red-500"
  );

  const handleRemoveItem = (itemToRemove: ComboboxElement) => {
    onChange(selected.filter((item) => item.key !== itemToRemove.key));
  };

  return (
    <Field
      className={classNames("flex flex-col", className, isField && "mt-4")}
    >
      <Label className="text-gary-900 font-medium text-sm">{label}</Label>
      <HeadlessCombobox
        value={selected}
        onChange={onChange}
        onClose={() => setQuery("")}
        multiple
        immediate
      >
        <div className={classNames("relative", isField && "mt-2")}>
          <ComboboxInput
            className={inputClass}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder={placeholder}
          />
          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            <ChevronDownIcon className="size-4" />
          </ComboboxButton>
        </div>
        
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selected.map((element) => (
              <span 
                key={element.key} 
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-md bg-indigo-100 text-indigo-800"
              >
                {element.value}
                <button 
                  type="button" 
                  onClick={() => handleRemoveItem(element)}
                  className="text-indigo-600 hover:text-indigo-800 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        
        <ComboboxOptions
          anchor="bottom start"
          transition
          className={classNames(
            "w-[var(--input-width)] rounded-md empty:invisible",
            "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0",
            "mt-1 py-1 max-h-60 bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow"
          )}
        >
          {filteredData.map((element) => (
            <ComboboxOption
              key={`autocomplete-${element.key}`}
              value={element}
              className="py-2 pl-3 pr-9 text-sm hover:bg-indigo-600 hover:text-white cursor-pointer"
            >
              {element.value}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </HeadlessCombobox>
    </Field>
  );
}
