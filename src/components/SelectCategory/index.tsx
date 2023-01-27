import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

export const Categories = [
  { value: "ALL", label: "All", color: "bg-gray-400" },
  { value: "COMP_SCI", label: "Computer Science", color: "bg-purple-400" },
  { value: "JS", label: "JavaScript", color: "bg-yellow-400" },
  { value: "TS", label: "TypeScript", color: "bg-blue-700" },
  { value: "REACT", label: "React", color: "bg-blue-400" },
] as const;

export type CategoriesEnum = typeof Categories[number]["value"];

type SelectCategoryProps = {
  onValueChange: Parameters<typeof Select.Root>[0]["onValueChange"];
  className?: string;
};

export function SelectCategory({
  onValueChange,
  className,
}: SelectCategoryProps) {
  return (
    <Select.Root onValueChange={onValueChange}>
      <Select.Trigger
        className={`inline-flex items-center rounded-md rounded-l-md border border-gray-800   px-4 py-2  text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-200 ${
          className?.includes("bg-") ? className : "bg-gray-900"
        }`}
        aria-label="Category"
      >
        <Select.Value placeholder="Filter a category" />
        <Select.Icon className="ml-4">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="w-56 rounded-[13px] border  border-gray-800 bg-gray-900 shadow-lg">
          <Select.ScrollUpButton className="SelectScrollButton">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-2">
            {Categories.map(({ value, label }, index) => (
              <Select.Item
                key={index}
                value={value}
                className="flex items-center rounded-lg px-4 py-2 text-sm text-gray-400  hover:bg-gray-800 hover:text-gray-300"
              >
                <Select.ItemText>{label}</Select.ItemText>
                <Select.ItemIndicator className="ml-auto inline-block rounded-full bg-green-900 p-1">
                  <CheckIcon />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="SelectScrollButton">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
