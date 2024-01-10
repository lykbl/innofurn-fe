import { Button, BUTTON_STYLES } from "@/components/ui/common/button";
import { IoIosArrowDown } from "react-icons/io";
import BasicInput from "@/components/ui/common/input";
import { BiSearchAlt } from "react-icons/bi";

function SearchBar() {
  return (
    <>
      <Button
        style={BUTTON_STYLES.BLUE}
        className='flex items-center min-w-max rounded-sm rounded-r-none'
      >
        <p>All Departments...</p>
        <IoIosArrowDown className='stroke-white' />
      </Button>
      <BasicInput
        className='w-full'
        placeholder='Find Anything Home...'
      />
      <Button
        style={BUTTON_STYLES.BLUE}
        className='rounded-sm rounded-l-none'
      >
        <BiSearchAlt
          size={24}
          className='stroke-white'
        />
      </Button>
    </>
  );
}

export default SearchBar;
