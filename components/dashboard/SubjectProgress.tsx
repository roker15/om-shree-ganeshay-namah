import { Flex,Text } from "@chakra-ui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { Database } from "../../lib/database";


export const SubjectProgress = ({ a, b }: { a: number; b: string }) => {
  const supabaseClient = useSupabaseClient<Database>();
    const [count, setCount] = useState<number | undefined>(undefined);
    const getArticleCount = async () => {
      const { data, error, count } = await supabaseClient
        .from("books_articles")
        .select("*", { count: "exact", head: true })
        .match({ books_subheadings_fk: a, created_by: b });
      if (count) {
        setCount(count);
      }
    };
    useEffect(() => {
      getArticleCount();
    }, []);
  
    return <Flex alignItems={"center"}  pl="2"><Text color="crimson" as="label">{count}</Text></Flex>;
  };
  