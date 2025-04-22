
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserSearchFilterProps {
  onSearch: (term: string) => void;
  onFilterChange: (filter: string, value: string) => void;
  filters: {
    status: string;
    kyc: string;
    role: string;
  };
}

export function UserSearchFilter({ onSearch, onFilterChange, filters }: UserSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search by name, email or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pr-10"
          />
          {searchTerm && (
            <button
              className="absolute right-10 top-0 h-full px-2 text-muted-foreground"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full rounded-l-none"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[180px]">
          <Select 
            value={filters.status} 
            onValueChange={(value) => onFilterChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[180px]">
          <Select 
            value={filters.kyc} 
            onValueChange={(value) => onFilterChange("kyc", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="KYC Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All KYC Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[180px]">
          <Select 
            value={filters.role} 
            onValueChange={(value) => onFilterChange("role", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="creator">Creator</SelectItem>
              <SelectItem value="user">Regular User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
