import { Box, Flex, HStack, IconButton, Text, toast } from "@chakra-ui/react";
import { groupBy } from "lodash";
import React from "react";
import { MdAdd, MdDelete, MdModeEdit } from "react-icons/md";
import { mutate } from "swr";
import { useGetSyllabusByBookId } from "../../customHookes/networkHooks";
import { supabase } from "../../lib/supabaseClient";
import { BookResponse, SubheadingQuestionLink } from "../../types/myTypes";
import { definitions } from "../../types/supabase";
import { FormProps } from "./CreateBookSyllabus";
import DeleteAlertDialogue from "./DeleteConfirmation";

interface Props {
  book: BookResponse | undefined;
  changeFormProps: (x: FormProps) => void;
}

const Syllabus: React.FC<Props> = ({ book, changeFormProps }) => {
  const { data } = useGetSyllabusByBookId(book ? book.id : undefined);

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

  const grouped = groupBy(cars, (x) => x.make);
  console.log(console.log("car group entries", Object.entries(grouped)));
  console.log(console.log("car group", grouped));
  const grouped1 = groupBy(data, (x) => [x.heading_sequence, x.heading_id, x.heading]);
  console.log(console.log("syllabus group entries", Object.entries(grouped1)));
  console.log(console.log("syllabus group", grouped1));
  const deleteHeading = async (id: number): Promise<void> => {
    const { data, error } = await supabase.from<definitions["books_headings"]>("books_headings").delete().eq("id", id);
    if (data) {
      //   mutate(`/book_id_syllabus/${x?.book_id}`);
      mutate([`/book_id_syllabuss/${book?.id}`]);
    }
  };
  const deleteSubheading = async (id: number): Promise<void> => {
    const { data, error } = await supabase.from<definitions["books_subheadings"]>("books_subheadings").delete().eq("id", id);
    if (data) {
      //   mutate(`/book_id_syllabus/${x?.book_id}`);
      mutate([`/book_id_syllabuss/${book?.id}`]);
    }
  };
  return (
    <Box>
      {book?.book_name ? (
        <Flex align="end">
          <Text>{book?.book_name}</Text>
          <IconButton
            // _groupHover={{ size: "" }}

            _hover={{ color: " #FF1493", fontSize: "30px" }}
            size="auto"
            ml="2"
            onClick={() =>
              changeFormProps({
                formMode: "CREATE_HEADING",
                book_id: book?.id,
                book_name: book?.book_name,
                heading_id: undefined,
                heading: undefined,
                heading_sequence: undefined,
              })
            }
            borderRadius={"full"}
            variant="outline"
            colorScheme="linkedin"
            aria-label="Call Sage"
            fontSize="25px"
            icon={<MdAdd />}
          />
        </Flex>
      ) : null}
      {Object.entries(grouped1)
        .sort((a, b) => Number(a[0].split(",")[0]) - Number(b[0].split(",")[0]))
        .map(([key, value]) => {
          return (
            <Box key={key} maxW="80">
              <Flex align="center" justifyContent="left" role="group" my="2">
                <Text align="start" as="address" color=" #FF1493" casing="capitalize">
                  {value[0].heading_sequence + " " + value[0].heading}
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
                    onClick={() =>
                      changeFormProps({
                        formMode: "CREATE_SUBHEADING",
                        book_id: book?.id,
                        book_name: book?.book_name,
                        heading_id: Number(key.split(",")[1]),
                        heading: key.split(",")[2],
                        heading_sequence: Number(key.split(",")[0]),
                      })
                    }
                    icon={<MdAdd />}
                  />
                  {/* <IconButton
                    _hover={{ color: "pink", fontSize: "22px" }}
                    size="xs"
                    ml="2"
                    borderRadius={"full"}
                    variant="outline"
                    colorScheme="pink"
                    aria-label="Call Sage"
                    fontSize="20px"
                    icon={<MdDelete />}
                  /> */}
                  <DeleteAlertDialogue
                    isIconButton={true}
                    dialogueHeader={"Delete Heading"}
                    isDisabled={false}
                    id={Number(key.split(",")[1])}
                    handleDelete={deleteHeading}
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
                    onClick={() =>
                      changeFormProps({
                        formMode: "UPDATE_HEADING",
                        book_id: book?.id,
                        book_name: book?.book_name,
                        heading_id: Number(key.split(",")[1]),
                        heading: key.split(",")[2],
                        heading_sequence: Number(key.split(",")[0]),
                      })
                    }
                    icon={<MdModeEdit />}
                  />
                </HStack>
                {/* </Circle> */}
              </Flex>
              {value
                .sort((a, b) => a.subheading_sequence - b.subheading_sequence)
                .map((x) => (
                  <Flex my="2" ml="4" key={x.subheading_id} role={"group"}>
                    <Text align="start" casing="capitalize">
                      {x.subheading}
                    </Text>
                    <HStack display="none" _groupHover={{ display: "inline" }}>
                      <DeleteAlertDialogue
                        isIconButton={true}
                        dialogueHeader={"Delete Heading"}
                        isDisabled={false}
                        id={x.subheading_id}
                        handleDelete={deleteSubheading}
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
                        onClick={() =>
                          changeFormProps({
                            formMode: "UPDATE_SUBHEADING",
                            book_id: book?.id,
                            book_name: book?.book_name,
                            heading_id: x.heading_id,
                            heading: x.heading,
                            heading_sequence: x.heading_sequence,
                            subheading_id: x.subheading_id,
                            subheading: x.subheading,
                            subheading_sequence: x.subheading_sequence,
                          })
                        }
                        icon={<MdModeEdit />}
                      />
                    </HStack>
                  </Flex>
                ))}
            </Box>
          );
        })}
    </Box>
  );
};
export default Syllabus;
