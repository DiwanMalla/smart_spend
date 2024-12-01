import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover } from "@/components/ui/popover";
import { TransactionType } from "@/lib/types";
import { Category } from "@prisma/client";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";

import { useState } from "react";
import CreateCategoryDialog from "./CreateCategoryDialog";

interface Props {
  type: TransactionType;
}
const CategoryPicker = ({ type }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: async () => {
      const res = await fetch(`/api/categories?type=${type}`);
      const data = await res.json();

      return data;
    },
  });

  const selectedCategory = categoriesQuery.data?.find(
    (category: Category) => category.name === value
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            "Select Category"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput placeholder="Search category..." />
          <CreateCategoryDialog type={type} />
          <CommandEmpty>
            <p>Category not found</p>
            <p className="text-xs text-muted-foreground">
              Tip: Create a new category
            </p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {categoriesQuery.data &&
                categoriesQuery.data.map((category: Category) => {
                  return (
                    <CommandItem
                      key={category.name}
                      onSelect={(currentValue) => {
                        setValue(currentValue);
                        setOpen((prev) => !prev);
                      }}
                    >
                      <CategoryRow category={category} />
                    </CommandItem>
                  );
                })}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryPicker;
const CategoryRow = ({ category }: { category: Category }) => {
  return (
    <div>
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
};
