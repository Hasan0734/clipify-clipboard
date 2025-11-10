"use client";
import { Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { useClipboardStore } from "@/store/useClipboardStore";

const SearchBar = () => {
  const { handleSearch, items } = useClipboardStore((state) => state);

  return (
    <div className="">
      <InputGroup>
        <InputGroupInput
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search..."
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          {items.length} results
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

export default SearchBar;
