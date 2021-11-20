import {
  Alert,
  AlertIcon,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Center,
  Divider,
  Flex,
  Heading,
  Link,
  ListItem,
  OrderedList,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AuthSession } from "@supabase/supabase-js";
import { Element } from "domhandler/lib/node";
import DOMPurify from "dompurify";
import parse, { attributesToProps, domToReact, HTMLReactParserOptions } from "html-react-parser";
import katex from "katex";
import "katex/dist/katex.min.css";
// import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CurrentAppState, useAppContext } from "../../context/state";
import LayoutWithTopAndSideNavbar from "../../layout/LayoutWithTopAndSideNavbar";
import LayoutWithTopNavbar from "../../layout/LayoutWithTopNavbar";
// import SideNavBar from "../../layout/sideNavBar";
import { Profile } from "../../lib/constants";
import { supabase } from "../../lib/supabaseClient";
import { Headings, Post, SharedPost, Subheading } from "../../types/myTypes";
import PageWithLayoutType from "../../types/pageWithLayout";
import Head from "next/head";
import Script from "next/script";
import SunEditorForRendering from "../../components/SunEditorForRendering";
import useSWR from "swr";
import { usePostContext } from "../../context/PostContext";
import { ArrowBackIcon } from "@chakra-ui/icons";

type ProfileListProps = {
  data: Post[];
};

const Posts: React.FC<ProfileListProps> = ({ data }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userNote, setUserNote] = useState<string | undefined | null>(null);
  const [mounted, setMounted] = useState(false);
  // const [data, setProfiles] = useState<Profile[]>([]);
  const appContext = useAppContext();
  const router = useRouter();
  const { currentSubheadingId, currentSubheading } = usePostContext();
  // const {
  //   query: { currentSubheadingId }
  // } = router;

  // let isSubscribed = true


  const { data: sharedPost, error } = useSWR(
    `/sharedPost/${currentSubheadingId}`,
    async () =>
      await supabase
        .from<SharedPost>("sharedpost")
        .select(
          `
    id,
      created_at,
      updated_at,
      post_id(
        id,post,
        created_by(id,email)
      ),
      shared_with(id,email),
      subheading_id:subheadings!id (
      
      topic,
      main_topic_id:headings!topics_main_topic_id_fkey(id)
    )
    `
        )
        .eq("subheading_id", currentSubheadingId as number)
        .eq("shared_with", supabase.auth.user()?.id as string),
    { refreshInterval: 1000 }
  );
  console.log("shared post data ", sharedPost);
  console.log("shared post error ", error);
  const { data: userposts, error:userposterror} = useSWR(
    mounted ? `/upsc/${currentSubheadingId}/ss` : null,
    async () =>
      await supabase
        .from<Post>("posts")
        .select(
          `
    id,
      created_at,
      updated_at,
      post,
      subheading_id:subheadings!posts_subheading_id_fkey(
      
      topic,
      main_topic_id:headings!topics_main_topic_id_fkey(id)
    )
    `
        )
        .eq("subheading_id", currentSubheadingId as number)
        .eq("created_by", supabase.auth.user()?.id as string)
    // { refreshInterval: 1000 }
  );
  console.log("user post data ", userposts);
  console.log("user post error ", userposterror);

  useEffect(() => {
    setMounted(true);
    console.log("usernotes is ", userNote);
    if (userposts != undefined && userposts?.data?.length != 0 && userposts!.data != null) {
      // console.log("notes is ", data![0].post);
      setUserNote(userposts!.data![0].post);
      appContext.setPostHeadingId(((userposts!.data![0].subheading_id as Subheading).main_topic_id as Headings)!.id);
    } else {
      console.log("use effect is hittin");
      setUserNote(undefined);
    }
    console.log("usernotes is ", userNote);
    // if (data && data.length !== 0) {
    //   appContext.setPostHeadingId(
    //     ((data![1].subheading_id as Subheading).main_topic_id as Headings)!.id
    //   );
    // }
    // return () => isSubscribed = false
  });
  // const [data,error]
  const [value, setValue] = React.useState("");
  const handleChange = (event: any) => {
    setValue(event.target.value);
    console.log("hello hello ", value);
  };
  if (!supabase.auth.session()) {
    return (
      <Alert status="info">
        <AlertIcon />
        Seems your are not logged in, Please login to view content
      </Alert>
    );
  }
  // if (data && data.length !== 0) {

  return (
    <>
      <Button
        variant="outline"
        // colorScheme="purple"
        leftIcon={<ArrowBackIcon />}
        size="xs"
        onClick={() => router.back()}
      >
        Go back
      </Button>
      <h1>{currentSubheading}</h1>

      <div style={{ padding: "50px 25px 50px 25px" }}>
        {sharedPost?.data?.length == 0 ? (
          <div></div>
        ) : (
          sharedPost?.data!.map((x) => {
            const sanitisedPostData = DOMPurify.sanitize((x.post_id as Post).post as string, {
              USE_PROFILES: { svg: true, html: true },
            });
            return (
              <div key={x.id}>
                {/* {postHeader(x, appContext)} */}

                <SunEditorForRendering
                  // postId={x.id}
                  postContent={sanitisedPostData}
                  isSharedPost={true}
                  sharedBy={((x.post_id as Post).created_by as Profile).email}
                />

                {/* <div>
          {parse(
            DOMPurify.sanitize(
              
              x.post
              
              , {
              USE_PROFILES: { svg: true,html: true },
            })
            
            
            ,
            options
          
          )}
       
        </div> */}
                <Divider mt="100" visibility="hidden" />
              </div>
            );
          })
        )}

        {userNote == undefined ? (
          <div>
            <Heading mb="6" fontSize="2xl">
              {" "}
              My Notes on this Topic{" "}
            </Heading>
            <Alert status="info">
              <AlertIcon />
              You Don&apos;t have notes on this Topic Create Notes in Editor
            </Alert>
            <Box zIndex="5000">
              <SunEditorForRendering subHeadingId={currentSubheadingId as number} isNew={true} />
            </Box>
          </div>
        ) : (
          ""
        )}
        {userposts && userposts?.data?.length != 0 && userposts!.data![0] != null ? (
          <SunEditorForRendering
            subHeadingId={currentSubheadingId}
            isNew={false}
            postId={userposts.data![0].id}
            postContent={userposts.data![0].post}
          />
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
  // }
  // return (
  //   <div>
  //     <Link href="../editor">Go to editor</Link>
  //   </div>
  // );
};

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.name === "h1") {
      const props = attributesToProps(domNode.attribs);
      return (
        <Heading as="h2" size="2xl">
          {domToReact(domNode.children, options)}
        </Heading>
      );
    }
    if (domNode instanceof Element && domNode.name === "h2") {
      const props = attributesToProps(domNode.attribs);
      return (
        <Heading as="h1" size="xl">
          {domToReact(domNode.children, options)}
        </Heading>
      );
    }
    if (domNode instanceof Element && domNode.name === "p") {
      const props = attributesToProps(domNode.attribs);
      return (
        <Text as="p" {...props}>
          {domToReact(domNode.children, options)}
        </Text>
      );
    }
    if (domNode instanceof Element && domNode.name === "span") {
      const props = attributesToProps(domNode.attribs);
      return (
        <Text as="span" {...props}>
          {domToReact(domNode.children, options)}
        </Text>
      );
    }
    if (domNode instanceof Element && domNode.name === "ol") {
      const props = attributesToProps(domNode.attribs);
      return (
        <OrderedList backgroundColor="#ff9999" ml={"14"} {...props}>
          {domToReact(domNode.children, options)}
        </OrderedList>
      );
    }
    if (domNode instanceof Element && domNode.name === "li") {
      const props = attributesToProps(domNode.attribs);
      return (
        <ListItem backgroundColor="#ffe5e5" {...props}>
          {domToReact(domNode.children, options)}
        </ListItem>
      );
    }
    if (domNode instanceof Element && domNode.attribs.classssss === "li") {
      const props = attributesToProps(domNode.attribs);
      return (
        <ListItem backgroundColor="#ffe5e5" {...props}>
          {domToReact(domNode.children, options)}
        </ListItem>
      );
    }
    // if (domNode instanceof Element && domNode.name === "blockquote") {
    //   const props = attributesToProps(domNode.attribs);
    //   return (
    //     <ListItem backgroundColor="#ffe5e5" {...props} >
    //       {domToReact(domNode.children, options)}
    //     </ListItem>
    //   );
    // }
  },
};

// const DynamicComponentWithNoSSR = dynamic(
//   () => import("../../components/Account"),
//   { ssr: false }
// );

// export async function getStaticPaths() {
//   let { data, error } = await supabase.from<Subheading>("subheadings").select(
//     `
//   id
// `
//   );
//   // Get the paths we want to pre-render based on posts
//   const paths = data!.map((post) => ({
//     params: { currentSubheadingId: post.id.toString() },
//   }));

//   return {
//     paths,

//     fallback: true, // See the "fallback" section below
//   };
// }
// export const getStaticProps = async ({ params }: any) => {
//   console.log(`Building slug: ${params.currentSubheadingId}`);
//   // Make a request
//   let { data, error } = await supabase
//     .from<Post>("posts")
//     .select(
//       `
//   id,
//     created_at,
//     updated_at,
//     post,
//     subheading_id (

//     topic,
//     main_topic_id(id)
//   )
// `
//     )
//     .eq("subheading_id", params.currentSubheadingId);

//   // const res = await fetch("https://.../../data");
//   console.log("data is inside currentSubheadingId ", data);
//   return {
//     props: {
//       data,
//     },
//   };
// };
if (!supabase.auth.session()) {
  (Posts as PageWithLayoutType).layout = LayoutWithTopNavbar;
} else {
  (Posts as PageWithLayoutType).layout = LayoutWithTopAndSideNavbar;
}

export default Posts;

// pages/index.js

//*****************Following example two network call made and both passed as
//**************parameter to component *********** nice exmaples */ * /
// function Homepage({ newestContent, popularContent }) {
//   // Both props are arrays of objects, with post metadata.
//   // I can map through them, and render a React component
//   // for each one.
// }
// export async function getStaticProps() {
//   // This code runs at compile-time!
//   // The stuff I return will be passed as props to
//   // my Homepage component.
//   const newestContent = await getLatestContent({ limit: 20 });
//   const popularContent = await getPopularContent({ limit: 10 });
//   return {
//     props: { newestContent, popularContent },
//   };
// }
