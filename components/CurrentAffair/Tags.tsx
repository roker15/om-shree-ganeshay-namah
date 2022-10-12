import {
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter, DrawerOverlay,
  Flex, Text,
  useDisclosure
} from "@chakra-ui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import { MdSwitchRight } from "react-icons/md";
import Sticky from "react-sticky-el";
import { currentAffairTags } from "../../lib/constants";
import { Database } from "../../lib/database";
import { useAuthContext } from "../../state/Authcontext";
import { useNoteContext } from "../../state/NoteContext";
import { definitions } from "../../types/supabase";

const Tags: React.FC = () => {
  const { tagsArray, setTagsArray } = useNoteContext();
  const { profile } = useAuthContext();
  return (
    <Box borderRight={"1px"} borderRightColor="gray.100">
      <Flex flexDirection={"column"} maxW="400px" alignItems="start">
        {currentAffairTags.map((value) => (
          <Flex key={value.id} >
            <Checkbox
              alignItems="baseline"
              px="2"
              colorScheme={"gray"}
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
      </Flex>
    </Box>
  );
};
export default Tags;

export const ArticleCounterByTag = ({ tagId, creatorId }: { tagId: number; creatorId: string }) => {
  
  const  supabaseClient  = useSupabaseClient<Database>();
  const [count, setCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    const getArticleCount = async () => {
      const { data, error, count } = await supabaseClient
        .from("books_articles")
        .select("*", { count: "exact", head: true })
        .eq("created_by", creatorId)
        .contains("current_affair_tags", [tagId]);
      if (count) {
        setCount(count);
      }
    };
    getArticleCount();
  }, [creatorId, tagId]);

  return (
    <Flex alignItems={"center"} px="2">
      <Text color="crimson" as="label">
        {count}
      </Text>
    </Flex>
  );
};

export function TagsDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef(null);

  return (
    <>
      <Sticky>
        <Button
          aria-label="syllabus"
          variant="ghost"
          size="sm"
          leftIcon={<MdSwitchRight />}
          ref={btnRef}
          colorScheme="gray"
          onClick={onOpen}
        >
          Open Tags
        </Button>
      </Sticky>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          {/* <DrawerHeader>Create your account</DrawerHeader> */}

          <DrawerBody>
            <Tags></Tags>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
