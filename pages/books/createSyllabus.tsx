import { Box, Select } from "@chakra-ui/react";
import React from "react";
import { useGetBooks } from "../../customHookes/networkHooks";

const CreateBookheading = () => {
  const { data } = useGetBooks(1);
  return (
    <Box>
      <Select id="paper" placeholder="Select Exam Paper" >
        {data?.map((x) => {
          return (
            <option key={x.id} value={x.id} onChange={(e) =>{window.alert("e.target")}}>
              {x.book_name}
            </option>
          );
        })}
      </Select>
    </Box>
  );
};
export default CreateBookheading;
