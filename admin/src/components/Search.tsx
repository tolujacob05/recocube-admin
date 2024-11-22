import { useState } from "react";
import { Input } from "./ui/input";

interface SearchProps {
  onSearch: (searchTerm: string) => void;
}

const SearchTable: React.FC<SearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(searchTerm); // Trigger the search when "Enter" is pressed
    }
  };

  return (
    <Input
      type="text"
      value={searchTerm}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown} // Add keydown event listener here
      placeholder="Search product categories..."
      className="w-96 p-2 rounded-md dark:text-[#F4F6FF]"
    />
  );
};

export default SearchTable;
