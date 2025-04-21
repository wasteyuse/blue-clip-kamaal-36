
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionType } from "@/types/transactions";

interface TransactionFiltersProps {
  searchUser: string;
  setSearchUser: (value: string) => void;
  filterType: TransactionType | 'all';
  setFilterType: (value: TransactionType | 'all') => void;
}

export function TransactionFilters({
  searchUser,
  setSearchUser,
  filterType,
  setFilterType
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Input
        placeholder="Search by name"
        value={searchUser}
        onChange={(e) => setSearchUser(e.target.value)}
        className="max-w-md"
      />
      <Select value={filterType} onValueChange={(val: TransactionType | 'all') => setFilterType(val)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Transaction Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="earning">Earnings</SelectItem>
          <SelectItem value="affiliate">Affiliate</SelectItem>
          <SelectItem value="payout">Payout</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
