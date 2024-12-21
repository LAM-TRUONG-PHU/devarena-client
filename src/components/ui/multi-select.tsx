import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type OptionType = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: OptionType[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  label: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  label,
}: MultiSelectProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const filteredOptions = options.filter(
    (option) =>
      !selected.includes(option.value) &&
      option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (value: string) => {
    onChange([...selected, value]);
    setInputValue("");
  };

  const handleUnselect = (value: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(selected.filter((item) => item !== value));
  };

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "w-full justify-start text-left font-normal h-16",
              !selected.length && "text-muted-foreground"
            )}
          >
            <div className="flex gap-1 flex-wrap items-center">
              {selected.length > 0 ? (
                selected.map((item) => {
                  const option = options.find((o) => o.value === item);
                  return (
                    <Badge key={item} variant="secondary" className="mr-1">
                      {option?.label}
                      <span
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                        onClick={(e) => handleUnselect(item, e)}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </span>
                    </Badge>
                  );
                })
              ) : (
                <span>{placeholder}</span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <div className="px-3 py-2">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-transparent outline-none"
              placeholder="Search..."
            />
          </div>
          <ul className="max-h-60 overflow-auto">
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="px-3 py-2 cursor-pointer hover:bg-accent"
              >
                {option.label}
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
      <label
        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
      >
        {label}
      </label>
    </div>
  );
}
