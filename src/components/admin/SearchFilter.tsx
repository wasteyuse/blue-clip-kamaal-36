
import { Input } from "@/components/ui/input";

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function SearchFilter({ searchTerm, onSearchChange }: SearchFilterProps) {
  return (
    <div className="mb-6">
      <Input
        placeholder="Search submissions by user, type or status..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-md"
      />
    </div>
  );
}
