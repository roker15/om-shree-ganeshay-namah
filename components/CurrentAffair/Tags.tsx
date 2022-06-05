import { Box, Checkbox, Flex, Text } from "@chakra-ui/react";
import { groupBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useGetSyllabusByBookId } from "../../customHookes/networkHooks";
import { currentAffairTags } from "../../lib/constants";
import { supabase } from "../../lib/supabaseClient";
import { useAuthContext } from "../../state/Authcontext";
import { useNoteContext } from "../../state/NoteContext";
import { BookResponse, BookSyllabus } from "../../types/myTypes";
import { definitions } from "../../types/supabase";

interface Props {
  book?: BookResponse | undefined;
  changeParentProps?: (x: BookSyllabus) => void;
}

const Tags: React.FC<Props> = ({ book, changeParentProps }) => {
  const { tagsArray, setTagsArray } = useNoteContext();
  const { profile } = useAuthContext();
  return (
    <Box>
      <Flex flexDirection={"column"} maxW="400px">
        {currentAffairTags.map((value) => (
          <Flex>
            <Checkbox
              px="2"
              colorScheme={"blue"}
              isChecked={tagsArray?.includes(value.id) ? true : false}
              size="sm"
              type="checkbox"
              value={value.id}
              onChange={(e) => {
                if (e.target.checked) {
                  setTagsArray!([...tagsArray!, value.id]);
                } else {
                  setTagsArray!(tagsArray!.filter((v) => v !== value.id));
                }
              }}
            >
              <Text casing="capitalize" as="label">
                {value.tag}
              </Text>
            </Checkbox>
            <ArticleCounterByTag tagId={value.id} creatorId={profile?.id!} />
          </Flex>
        ))}
        ;
      </Flex>
    </Box>
  );
};
export default Tags;

export const ArticleCounterByTag = ({ tagId, creatorId }: { tagId: number; creatorId: string }) => {
  const [count, setCount] = useState<number | undefined>(undefined);
  const getArticleCount = async () => {
    const { data, error, count } = await supabase
      .from<definitions["books_articles"]>("books_articles")
      .select("*", { count: "exact", head: true })
      .eq("created_by", creatorId)
      .contains("current_affair_tags", [tagId]);
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
