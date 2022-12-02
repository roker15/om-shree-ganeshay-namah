import { Box, Select } from "@chakra-ui/react";
import React from "react";
import { useGetBooks } from "../../customHookes/networkHooks";
import { BookResponse } from "../../types/myTypes";


const BookList: React.FC<{ setParentProps: (x: BookResponse | undefined) => void }> = ({ setParentProps }) => {
  const { data } = useGetBooks(1);
  return (
    // <Box>
      <Select
        variant={"filled"}
        size="sm"
        id="paper"
        placeholder="Select Book"
        onChange={(e) => {
          setParentProps(data?.find((item) => item.id === Number(e.target.value)));
        }}
      >
        {data?.map((x) => {
          return (
            <option key={x.id} value={x.id}>
              {x.book_name}
            </option>
          );
        })}
      </Select>
    // </Box>
  );
};
export default BookList;
