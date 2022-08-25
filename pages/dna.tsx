import { Box } from "@chakra-ui/layout";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import katex from "katex";
import "katex/dist/katex.min.css";
import "suneditor/dist/css/suneditor.min.css";
import { sunEditorButtonList } from "../lib/constants";
import { Suspense } from "react";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

function SomePage(props: any) {
  const router = useRouter();
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
    <Box>
      {" "}
      current welcome
     
        <Box>
          <SunEditor
            setOptions={{
              mode: "classic",
              katex: katex,
              height: "100%",
              buttonList: sunEditorButtonList,
              resizingBar: false,
              formats: ["p", "div", "h1", "h2", "h3"],
            }}
            placeholder="Type Question here"
            setContents={"hello"}
          />
        </Box>
    </Box>
  );
}
export default SomePage;
export async function getServerSideProps(context: any) {
  // Database logic here
  return {
    props: {}, // will be passed to the page component as props
  };
}
