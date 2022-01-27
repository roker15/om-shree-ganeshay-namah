import { Box, Select } from "@chakra-ui/react";
import React from "react";
import { useGetBooks, useGetSyllabusByBookId } from "../../customHookes/networkHooks";
import { BookResponse } from "../../types/myTypes";
import { definitions } from "../../types/supabase";

const Syllabus: React.FC<{ book: BookResponse | undefined }> = ({ book }) => {
  const { data } = useGetSyllabusByBookId(1);
  return (
    // <Box>
      <Select
        variant={"filled"}
        size="sm"
        id="paper"
        placeholder="Select Book"
        onChange={(e) => {
        //   setParentProps(data?.find((item) => item.id === Number(e.target.value)));
        }}
      >
        {data?.map((x) => {
          return (
            <option key={x.subheading_id} value={x.subheading_id}>
              {x.book_name}
            </option>
          );
        })}
      </Select>
    // </Box>
  );
};
export default Syllabus;
