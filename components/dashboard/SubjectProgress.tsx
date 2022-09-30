import { Flex,Text } from "@chakra-ui/react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { definitions } from "../../types/supabase";

export const SubjectProgress = ({ a, b }: { a: number; b: string }) => {
  const {  supabaseClient } = useSessionContext();
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
  