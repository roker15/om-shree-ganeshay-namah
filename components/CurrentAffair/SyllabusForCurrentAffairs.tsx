import { Box, Divider, Flex, IconButton, Link, Stack, Text } from "@chakra-ui/react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { groupBy } from "lodash";
import React, { useEffect, useState } from "react";
import { MdAdd, MdDelete, MdLightMode } from "react-icons/md";
import { useGetSyllabusByBookId } from "../../customHookes/networkHooks";
import { useAuthContext } from "../../state/Authcontext";
import { BookResponse, BookSyllabus } from "../../types/myTypes";
import { definitions } from "../../types/supabase";
import useSWR from "swr";
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

  useEffect(() => {
    const x = localStorage.getItem("selected-sub-syllabus");
    if (x && x !== "undefined") {
      const items = JSON.parse(x);
      setSelectedSubheading(items);
    }
  }, []);
  useEffect(() => {
    const x = localStorage.getItem("toogle-syllabus");
    if (x && x !== "undefined") {
      const items = JSON.parse(x);
      setToogle(items);
    }
  }, []);
  useEffect(() => {
    if (profile && profile.id && selectedSubheading) {
      localStorage.setItem("selected-sub-syllabus", JSON.stringify(selectedSubheading));
    }
  }, [profile, selectedSubheading]);

  useEffect(() => {
    if (profile && profile.id && toggle && toggle !== -100) {
      localStorage.setItem("toogle-syllabus", JSON.stringify(toggle));
    }
  }, [profile, toggle]);
  // useEffect(() => {
  //   alert("sub heading is "+selectedSubheading);
  // });
  return (
    <Box pb="6" minW="full">
      {book?.book_name && (
        <Flex bg="brand.100" p="2" borderTopRadius="md">
          <Text fontWeight={"normal"} casing={"capitalize"}>
            {book?.book_name}
          </Text>
        </Flex>
      )}

      <Box>
        {isLoading && <Text>Loading...</Text>}
        {Object.entries(grouped)
          .sort((a, b) => Number(a[0].split(",")[0]) - Number(b[0].split(",")[0]))
          .map(([key, value]) => {
            return (
              <Box key={key}>
                <Flex
                  align="baseline"
                  justifyContent="left"
                  role="group"
                  my="2"
                  onClick={() => {
                    toggle === value[0].heading_id ? setToogle(-100) : setToogle(value[0].heading_id);
                  }}
                  _hover={{ cursor: "pointer" }}
                >
                  <IconButton
                    color={"brand.500"}
                    variant="icong"
                    aria-label="Call Sage"
                    fontSize="16px"
                    icon={toggle === value[0].heading_id ? <MdLightMode /> : <MdAdd />}
                  />
                  <Text align="start" as="address" color=" #FF1493" casing="capitalize" pr="1">
                    {/* {value[0].heading + " " + "(" + value[0].heading_sequence + ")"} */}
                    {value[0].heading}
                  </Text>
                </Flex>
                {value
                  .sort((a, b) => a.subheading_sequence - b.subheading_sequence)
                  .map((x) => (
                    <Flex
                      alignItems="center"
                      my="4"
                      ml="10"
                      key={x.subheading_id}
                      // role={"group"}
                      display={toggle === x.heading_id ? "flex" : "none"}
                    >
                      <Text
                        color={selectedSubheading === x.subheading_id ? "white" : "gray.600"}
                        bg={selectedSubheading === x.subheading_id ? "brand.500" : "white"}
                        onClick={() => handleSyllabusClick(x)}
                        casing="capitalize"
                        as="label"
                        fontSize="14px"
                      >
                        <Link>{x.subheading}</Link>
                      </Text>
                      {/* </Button> */}
                      {profile && profile.id && toggle === x.heading_id && (
                        <ArticleCounter subheadingId={x.subheading_id} creatorId={profile.id} />
                      )}
                    </Flex>
                  ))}
              </Box>
            );
          })}
      </Box>
    </Box>
  );
};
export default Syllabus;

export const ArticleCounter = ({ subheadingId, creatorId }: { subheadingId: number; creatorId: string }) => {
  const getArticleCount = async () =>
    await supabaseClient
      .from("books_articles")
      // .throwOnError()
      .select("*", { count: "exact", head: true })
      .match({ books_subheadings_fk: subheadingId, created_by: creatorId });

  const { data, error } = useSWR(
    creatorId ? `/api/usergetarticlecountbyid/${subheadingId}/${creatorId}` : null,
    getArticleCount
  );

  if (error) {
    // alert("error is "+error.message)
    console.log("counter error " + error);
  }
  return (
    <Flex alignItems={"center"} px="2">
      <Text color="brand.500" as={"label" && "b"} fontSize="12px">
        {data && data.count && data.count !== 0 ? data?.count : ""}
      </Text>
    </Flex>
  );
};
