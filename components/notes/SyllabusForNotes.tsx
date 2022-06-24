import { Box, Flex, IconButton, Link, Text } from "@chakra-ui/react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { groupBy } from "lodash";
import React, { useEffect, useState } from "react";
import { MdAdd, MdDelete, MdLightMode } from "react-icons/md";
import { useGetSyllabusByBookId } from "../../customHookes/networkHooks";
import { useAuthContext } from "../../state/Authcontext";
import { BookResponse, BookSyllabus } from "../../types/myTypes";
import { definitions } from "../../types/supabase";

interface Props {
  book: BookResponse | undefined;
  changeParentProps: (x: BookSyllabus) => void;
}

const Syllabus: React.FC<Props> = ({ book, changeParentProps }) => {
  const { data, isLoading } = useGetSyllabusByBookId(book ? book.id : undefined);
  const [toggle, setToogle] = useState(-100);
  const [selectedSubheading, setSelectedSubheading] = useState<number | undefined>();
  const { profile } = useAuthContext();
  const grouped = groupBy(data, (x) => [x.heading_sequence, x.heading_id, x.heading]);

  const handleSyllabusClick = (x: BookSyllabus) => {
    setSelectedSubheading(x.subheading_id);
    changeParentProps(x);
  };

  useEffect(() => {
    setSelectedSubheading(undefined);
  }, [book]);
  return (
    <Box>
      {book?.book_name ? (
        <Flex align="end">
          <Text bg="orange.100" as="b">
            <Text>{book?.book_name}</Text>
          </Text>
        </Flex>
      ) : null}
      {isLoading ? <Text>Loading...</Text> : null}
      {Object.entries(grouped)
        .sort((a, b) => Number(a[0].split(",")[0]) - Number(b[0].split(",")[0]))
        .map(([key, value]) => {
          return (
            <Box key={key}>
              <Flex align="baseline" justifyContent="left" role="group" my="2">
                <IconButton
                  size="14px"
                  color={toggle === value[0].heading_id ? "green.400" : "green.400"}
                  variant="ghost"
                  mr="0.5"
                  mt="2"
                  aria-label="Call Sage"
                  onClick={() => {
                    toggle === value[0].heading_id ? setToogle(-100) : setToogle(value[0].heading_id);
                  }}
                  fontSize="16px"
                  icon={toggle === value[0].heading_id ? <MdLightMode /> : <MdAdd />}
                />
                <Text align="start" as="address" color=" #FF1493" casing="capitalize">
                  {/* {value[0].heading + " " + "(" + value[0].heading_sequence + ")"} */}
                  {value[0].heading}
                </Text>
              </Flex>
              {value
                .sort((a, b) => a.subheading_sequence - b.subheading_sequence)
                .map((x) => (
                  <Flex
                    alignItems="center"
                    my="2"
                    ml="4"
                    key={x.subheading_id}
                    role={"group"}
                    display={toggle === x.heading_id ? "flex" : "none"}
                  >
                    {/* <Button variant="unstyled"> */}
                    <Text
                      color={selectedSubheading === x.subheading_id ? "white" : "null"}
                      bg={selectedSubheading === x.subheading_id ? "green.400" : "null"}
                      onClick={() => handleSyllabusClick(x)}
                      // align="start"
                      casing="capitalize"
                      as="label"
                      fontSize="14px"
                    >
                      <Link>{x.subheading}</Link>
                    </Text>
                    {/* </Button> */}
                    {profile && profile.id ? <ArticleCounter subheadingId={x.subheading_id} creatorId={profile.id} /> : null}
                  </Flex>
                ))}
            </Box>
          );
        })}
    </Box>
  );
};
export default Syllabus;

export const ArticleCounter = ({ subheadingId, creatorId }: { subheadingId: number; creatorId: string }) => {
  const [count, setCount] = useState<number | undefined>(undefined);
  const getArticleCount = async () => {
    const { data, error, count } = await supabaseClient
      .from<definitions["books_articles"]>("books_articles")
      .select("*", { count: "exact", head: true })
      .match({ books_subheadings_fk: subheadingId, created_by: creatorId });
    if (count) {
      setCount(count);
    }
  };
  useEffect(() => {
    getArticleCount();
  }, []);

  return (
    <Flex alignItems={"center"} pl="2">
      <Text color="crimson" as="label">
        {count}
      </Text>
    </Flex>
  );
};

