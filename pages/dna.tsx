import { Box } from "@chakra-ui/layout";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import katex from "katex";
import "katex/dist/katex.min.css";
import "suneditor/dist/css/suneditor.min.css";
import { sunEditorButtonList } from "../lib/constants";
import { supabaseClient, supabaseServerClient, getUser } from "@supabase/auth-helpers-nextjs";
import { definitions } from "../types/supabase";
import { GetServerSideProps } from "next/types";
import { Container } from "@chakra-ui/react";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});
interface hi {
  data: definitions["books_articles"][];
  d: number;
}
function SomePage({ data, d }: hi) {
  const router = useRouter();
  // console.log(data.id+"{}"+d);
  // Call this function whenever you want to
  // refresh props!
  const refreshData = () => {
    router.replace(router.asPath);
  };
  async function handleSubmit() {
    const userData = undefined; /* create an object from the form */
    const res = await fetch("/api/user", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
    // Check that our status code is in the 200s,
    // meaning the request was successful.
    if (res.status < 300) {
      refreshData();
    }
  }
  return (
    <Container maxW="4xl">
      {" "}
      {/* current welcome {props.data[0].id} */}
      {data.map((x) => {
        return (
          <Box key={x.id}>
            <SunEditor
              defaultValue={x.article_english}
              setOptions={{
                mode: "classic",
                katex: katex,
                height: "100%",
                buttonList: sunEditorButtonList,
                resizingBar: false,
                hideToolbar: true,
                formats: ["p", "div", "h1", "h2", "h3"],
              }}
              placeholder="Type Question here"
              // setContents={"hello"}
            />
          </Box>
        );
      })}
    </Container>
  );
}
export default SomePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Database logic here
  const { user } = await getUser(context);
  console.log("user is " + user?.id);
  const { data } = await supabaseServerClient(context)
    .from<definitions["books_articles"]>("books_articles")
    .select("*")
    .eq("created_by", user?.id)
    .limit(30);
  // .single();
  // console.log("article is " + data?.id);
  const d = 5;
  return {
    props: { data, d }, // will be passed to the page component as props
  };
};
