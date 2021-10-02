import {
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
  VStack
} from "@chakra-ui/react";
import { AuthSession } from "@supabase/supabase-js";
import { Element } from "domhandler/lib/node";
import DOMPurify from "dompurify";
import parse, {
  attributesToProps,
  domToReact,
  HTMLReactParserOptions
} from "html-react-parser";
import "katex/dist/katex.min.css";
import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CurrentAppState, useAppContext } from "../../context/state";
import LayoutWithTopAndSideNavbar from "../../layout/LayoutWithTopAndSideNavbar";
// import SideNavBar from "../../layout/sideNavBar";
import { Profile } from "../../lib/constants";
import { supabase } from "../../lib/supabaseClient";
import { Headings, Post, Subheading } from "../../types/myTypes";
import PageWithLayoutType from "../../types/pageWithLayout";
type ProfileListProps = {
  data: Post[];
};

const Posts: React.FC<ProfileListProps> = ({ data }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  // const [data, setProfiles] = useState<Profile[]>([]);
  const appContext = useAppContext();
  const router = useRouter();
  useEffect(() => {
    if (data && data.length !== 0) {
      appContext.setPostHeadingId(((data![1].subheading_id as Subheading).main_topic_id as Headings)!.id);
    }
  },);

  const [value, setValue] = React.useState("");
  const handleChange = (event: any) => {
    setValue(event.target.value);
    console.log("hello hello ", value);
  };
  
  if (data && data.length !== 0) {
    return (
      <>
      
        {/* <Head>
        </Head> */}

        <h1>{(data[0].subheading_id as Subheading).topic}</h1>
        <Link href="../editor">Go to editor</Link>
        <div className="container" style={{ padding: "50px 0 50px 0" }}>
          {data!.map((x) => {
            return (
              <div key={x.id}>
                {postHeader(x, appContext)}
                <div>
                  {parse(
                    DOMPurify.sanitize(x.post, {
                      USE_PROFILES: { html: true },
                    }),
                    options
                    // {
                    //   replace: domNode => {
                    //     console.dir(domNode, { depth: null });
                    //   }
                    // }............
                  )}
                </div>
                <Divider mt="100" />
              </div>
            );
          })}
        </div>
      </>
    );
  }
  return <div><Link href="../editor">Go to editor</Link></div>;
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
        <Heading as="h1"size="xl" >
          {domToReact(domNode.children, options)}
        </Heading>
      );
    }
    if (domNode instanceof Element && domNode.name === "p") {
      const props = attributesToProps(domNode.attribs);
      return (
        <Text as ="p" {...props} >
          {domToReact(domNode.children, options)}
        </Text>
      );
    }
    if (domNode instanceof Element && domNode.name === "span") {
      const props = attributesToProps(domNode.attribs);
      return (
        <Text as ="span" {...props} >
          {domToReact(domNode.children, options)}
        </Text>
      );
    }
    if (domNode instanceof Element && domNode.name === "ol") {
      const props = attributesToProps(domNode.attribs);
      return (
        <OrderedList backgroundColor="#ff9999" ml={"14"} {...props} >
          {domToReact(domNode.children, options)}
        </OrderedList>
      );
    }
    if (domNode instanceof Element && domNode.name === "li") {
      const props = attributesToProps(domNode.attribs);
      return (
        <ListItem backgroundColor="#ffe5e5" {...props} >
          {domToReact(domNode.children, options)}
        </ListItem>
      );
    }
    if (domNode instanceof Element && domNode.attribs.classssss === "li") {
      const props = attributesToProps(domNode.attribs);
      return (
        <ListItem backgroundColor="#ffe5e5" {...props} >
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

const handleEditPostOrCreateNewPost = (
  post: Post,
  context: CurrentAppState
) => {
  context.setPostForEdit(post);
  context.setIsNew(false);
  router.push({
    pathname: "../editor",
    // query: { postId: postId,subHeadingId:subHeadingId,isNew:isNew },
  });
};

const postHeader = (post: Post, context: CurrentAppState) => {
  return (
    <Flex mb="4">
      <Box p="4">
        <VStack spacing="1">
          <Avatar
            bg="red.500"
            name="Rajiv Kumar"
            src="https://bit.ly/dan-abramov"
          />
          <Text as="cite">Rajiv kumar</Text>
        </VStack>
      </Box>
      <Spacer />
      <Center>
        <Text as="em">Posted on 13/2/2021</Text>
      </Center>
      <Spacer />
      <Center>
        <ButtonGroup size="sm" isAttached variant="outline">
          <Button onClick={() => handleEditPostOrCreateNewPost(post, context)}>
            Edit
          </Button>
          <Button>Cancel</Button>
        </ButtonGroup>
      </Center>
    </Flex>
  );
};

export async function getStaticPaths() {
  let { data, error } = await supabase.from<Subheading>("subheadings").select(
    `
  id
`
  );
  // Get the paths we want to pre-render based on posts
  const paths = data!.map((post) => ({
    params: { subheadingId: post.id.toString() },
  }));

  return {
    paths,

    fallback: false, // See the "fallback" section below
  };
}
export const getStaticProps = async ({ params }: any) => {



  console.log(`Building slug: ${params.subheadingId}`)
  // Make a request
  let { data, error } = await supabase
    .from<Post>("posts")
    .select(
      `
  id,
    created_at,
    updated_at,
    post,
    subheading_id (
    
    topic,
    main_topic_id(id)
  )
`
    )
    .eq("subheading_id", params.subheadingId);

  // const res = await fetch("https://.../../data");
  console.log("data is inside subheadingId ", data);
  return {
    props: {
      data,
    },
  };
};

(Posts as PageWithLayoutType).layout = LayoutWithTopAndSideNavbar;
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
