import { Box, Divider, Flex, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import { Profile } from "../../lib/constants";
import { definitions } from "../../types/supabase";

export const UserTrack = () => {
  const [users, setUsers] = useState<Profile[] | undefined>(undefined);
  const getArticleCount = async () => {
    const { data, error, count } = await supabaseClient
      .from<Profile>("profiles")
      .select("*")
      .order("last_login", { ascending: false })
      .limit(20);
    if (data) {
      setUsers(data);
    }
  };
  useEffect(() => {
    getArticleCount();
  }, []);

  return (
    <SimpleGrid columns={1} spacing={4} mt="16">
      {users?.map((x) => {
        return (
          <>
            <Flex key={x.id}  w="full" px="16" wrap={"wrap"}>
              <Box w="340px"><Text >{x.username}</Text></Box>
              <Box w="340px"><Text w="250px">{x.email}</Text></Box>
              <Box w="250px"><Text w="200px">{isoToLocaldate(x.last_login)}</Text></Box>
            </Flex>
            <Divider />
          </>
        );
      })}
    </SimpleGrid>
  );
};
function isoToLocaldate(isoDate: string) {
  let date = new Date(isoDate);

  const withPmAm = date.toLocaleTimeString("en-US", {
    // en-US can be set to 'default' to use user's browser settings
    hour: "2-digit",
    minute: "2-digit",
  });
  return date.getDate() + "- " + (date.getMonth() + 1) + "-" + date.getFullYear() + ", " + withPmAm;
}
