import { Input } from "@/components/ui/common/input";
import Departments from "@/components/ui/layout/header/search-bar";

export function Search() {
  return (
    <div className="flex gap-2">
      {/*<Departments />*/}
      <Input
        type="search"
        placeholder="Search..."
        className="md:w-[100px] lg:w-[300px]"
      />
    </div>
  )
}
