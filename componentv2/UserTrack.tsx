import { Box, Divider, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { Profile } from "../lib/constants";
import { Database } from "../lib/database";

export const UserTrack = () => {
  const supabaseClient = useSupabaseClient<Database>();
  const [users, setUsers] = useState<Profile[] | undefined>(undefined);

  useEffect(() => {
    const getArticleCount = async () => {
      const { data, error, count } = await supabaseClient
        .from("profiles")
        .select("*")
        .order("last_login", { ascending: false, nullsFirst: false })
        .limit(25);
      if (data) {
        setUsers(data);
      }
    };
    getArticleCount();
  }, [supabaseClient]);

  return (
    <SimpleGrid columns={1} spacing={4} mt="16">
      {users?.map((x) => {
        return (
          <Flex key={x.id} w="full" px="16" wrap={"wrap"}>
            <Box w="340px">
              <Text>{x.username}</Text>
            </Box>
            <Box w="340px">
              <Text w="250px">{x.email}</Text>
            </Box>
            <Box w="250px">
              <Text w="200px">{isoToLocaldate(x.last_login as string)}</Text>
              <Divider />
            </Box>
          </Flex>
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
