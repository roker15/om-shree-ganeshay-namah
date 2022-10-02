import { Box, Flex, HStack, IconButton, Text, Tooltip } from "@chakra-ui/react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { groupBy } from "lodash";
import React from "react";
import { MdAdd, MdDelete, MdModeEdit } from "react-icons/md";
import { mutate } from "swr";
import { useGetSyllabusByBookId } from "../../customHookes/networkHooks";
import { elog } from "../../lib/mylog";
import { BookResponse, SubheadingQuestionLink } from "../../types/myTypes";
import { definitions } from "../../types/supabase";
import { FormProps } from "./CreateBookSyllabus";
import DeleteAlertDialogue from "./DeleteConfirmation";

interface Props {
  book: BookResponse | undefined;
  changeFormProps: (x: FormProps) => void;
}

const Syllabus: React.FC<Props> = ({ book, changeFormProps }) => {
  const {  supabaseClient } = useSessionContext();
  const { data } = useGetSyllabusByBookId(book ? book.id : undefined);
  const grouped1 = groupBy(data, (x) => [x.heading_sequence, x.heading_id, x.heading]);
  const deleteHeading = async (id: number): Promise<void> => {
    const { data, error } = await supabaseClient.from("books_headings").delete().eq("id", id);
    if (error) {
      elog("Syllabus->deleteHeading", error.message);
      return;
    }
    if (data) {
      mutate([`/book_id_syllabuss/${book?.id}`]);
    }
  };
  const deleteSubheading = async (id: number): Promise<void> => {
    const { data, error } = await supabaseClient
      .from("books_subheadings")
      .delete()
      .eq("id", id);
    if (error) {
      elog("Syllabus->deleteSubheading", error.message);
      return;
    }
    if (data) {
      mutate([`/book_id_syllabuss/${book?.id}`]);
    }
  };
  return (
    <Box>
      {book?.book_name ? (
        <Flex align="end">
          <Text as="b">
            <Text as="u">{book?.book_name}</Text>
          </Text>
          <Tooltip label="Create New heading" fontSize="sm">
            <IconButton
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
              aria-label="Call Sage"
              icon={<MdAdd />}
            />
          </Tooltip>
        </Flex>
      ) : null}
      {Object.entries(grouped1)
        .sort((a, b) => Number(a[0].split(",")[0]) - Number(b[0].split(",")[0]))
        .map(([key, value]) => {
          return (
            <Box key={key}>
              <Flex align="center" justifyContent="left" role="group" my="2">
                <Text align="start" as="address" color=" #FF1493" casing="capitalize">
                  {value[0].heading + " " + "(" + value[0].heading_sequence + ")"}
                </Text>
                {/* <Circle ml="2"  bg="green.100" color="pink"> */}
                <HStack display="none" _groupHover={{ display: "inline" }}>
                  <Tooltip label="Create New Subheading under this heading" fontSize="sm">
                    <IconButton
                      size="xs"
                    
                      aria-label="Call Sage"
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
                  </Tooltip>
                
                  <DeleteAlertDialogue
                    isIconButton={true}
                    dialogueHeader={"Delete Heading"}
                    id={Number(key.split(",")[1])}
                    handleDelete={deleteHeading}
                    display={undefined}
                  />
                  <IconButton
                    size="xs"
                    aria-label="Call Sage"
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
                        dialogueHeader={"Delete Subheading"}
                        id={x.subheading_id}
                        handleDelete={deleteSubheading}
                        display={undefined}
                      />
                      <IconButton
                        size="xs"
                       
                        aria-label="Call Sage"
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
