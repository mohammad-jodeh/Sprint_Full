import { Listbox } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

export default function Dropdown({
  value,
  onChange,
  options,
  labelKey = "label",
  valueKey = "value",
  iconKey = "icon",
}) {
  // Helper to get display value for current selection
  const getDisplayValue = () => {
    const option = options.find((o) => 
      valueKey ? o[valueKey] === value : o[labelKey] === value
    );
    return option ? option[labelKey] : value;
  };

  // Helper to get icon for current selection
  const getDisplayIcon = () => {
    const option = options.find((o) => 
      valueKey ? o[valueKey] === value : o[labelKey] === value
    );
    return option ? option[iconKey] : null;
  };

  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          <Listbox.Button className="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 flex justify-between items-center">
            <span className="truncate flex gap-2 items-center">
              {getDisplayIcon()} {getDisplayValue()}
            </span>
            <ChevronDown size={16} />
          </Listbox.Button>

          {open && (
            <Listbox.Options className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg text-sm text-gray-800 dark:text-white max-h-96 overflow-y-auto">
              {options.map((opt) => (
                <Listbox.Option
                  key={valueKey ? opt[valueKey] : opt[labelKey]}
                  value={valueKey ? opt[valueKey] : opt[labelKey]}
                  className={({ active }) =>
                    `px-4 py-2 cursor-pointer ${
                      active ? "bg-gray-100 dark:bg-gray-700" : ""
                    }`
                  }
                >
                  {({ selected }) => (
                    <div className="flex justify-between items-center">
                      <span className="flex gap-2 items-center">
                        {opt[iconKey]} {opt[labelKey]}
                      </span>
                      {selected && <Check size={16} />}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          )}
        </div>
      )}
    </Listbox>
  );
}
