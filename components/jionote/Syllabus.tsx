import { Box, Circle, Flex, HStack, IconButton, Link, Select, Text } from "@chakra-ui/react";
import _, { groupBy } from "lodash";
import React from "react";
import { MdAdd, MdDelete, MdModeEdit, MdPlusOne } from "react-icons/md";
import { useGetBooks, useGetSyllabusByBookId } from "../../customHookes/networkHooks";
import { BookResponse } from "../../types/myTypes";
import { definitions } from "../../types/supabase";

const Syllabus: React.FC<{ book?: BookResponse | undefined }> = ({ book }) => {
  const { data } = useGetSyllabusByBookId(1);

  const cars = [
    {
      make: "audi",
      model: "r8",
      year: "2012",
    },
    {
      make: "audi",
      model: "rr8",
      year: "2013",
    },
    {
      make: "ford",
      model: "mustang",
      year: "2012",
    },
    {
      make: "ford",
      model: "fusion",
      year: "2015",
    },
    {
      make: "kia",
      model: "optima",
      year: "2012",
    },
  ];
  const grouped = groupBy(cars, (car) => car.make);
  console.log(grouped);
  return (
    <Box>
      {Object.entries(grouped)
        .reverse()
        .map(([key, value]) => {
          return (
            <Box key={key} maxW="auto">
              <Flex align="center" role="group" my="2" py="4">
                <Text as="address" color=" #FF1493" casing="capitalize">
                  {value[0].model}
                </Text>
                {/* <Circle ml="2"  bg="green.100" color="pink"> */}
                <HStack display="none" _groupHover={{ display: "inline" }}>
                  <IconButton
                    // _groupHover={{ size: "" }}
                    _hover={{ color: "pink", fontSize: "22px" }}
                    size="xs"
                    ml="2"
                    borderRadius={"full"}
                    variant="outline"
                    colorScheme="pink"
                    aria-label="Call Sage"
                    fontSize="20px"
                    icon={<MdAdd />}
                  />
                  <IconButton
                    _hover={{ color: "pink", fontSize: "22px" }}
                    size="xs"
                    ml="2"
                    borderRadius={"full"}
                    variant="outline"
                    colorScheme="pink"
                    aria-label="Call Sage"
                    fontSize="20px"
                    icon={<MdDelete />}
                  />
                  <IconButton
                    _hover={{ color: "pink", fontSize: "22px" }}
                    size="xs"
                    ml="2"
                    borderRadius={"full"}
                    variant="outline"
                    colorScheme="orange"
                    aria-label="Call Sage"
                    fontSize="20px"
                    icon={<MdModeEdit />}
                  />
                </HStack>
                {/* </Circle> */}
              </Flex>
              {value.map((x) => (
                <Flex as="span" ml="4" key={x.model}>
                  <Text casing="capitalize">{x.model}</Text>
                </Flex>
              ))}
            </Box>
          );
        })}
    </Box>
  );
};
export default Syllabus;
