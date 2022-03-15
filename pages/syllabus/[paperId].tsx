import { Link, Table, TableCaption, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import LayoutWithTopNavbarWithSearchBox from "../../layout/LayoutWithTopNavbarWithSearchBox";
import { supabase } from "../../lib/supabaseClient";
import { usePostContext } from "../../state/PostContext";
import { useAppContext } from "../../state/state";
import { Headings, Papers, Subheading } from "../../types/myTypes";
import PageWithLayoutType from "../../types/pageWithLayout";
import { definitions } from "../../types/supabase";

type x = {
  id: number | undefined;
  name: Headings | undefined;
  value: Subheading[] | null;
};
type ProfileListProps = {
  array: x[];
};

const Syllabus: React.FC<ProfileListProps> = ({ array }) => {
  const appContext = useAppContext();
  const postContext = usePostContext();
  const router = useRouter();
  const { paperId } = router.query;
  useEffect(() => {
    appContext.setPaperId(paperId as string);
  }, [appContext, paperId]);

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {/* <Heading>Subject Name</Heading> */}
      <Table size="sm" variant="striped">
        <TableCaption>These syllabus are exactly as per UPSC Notificaiton</TableCaption>
        <Thead>
          <Tr>
            <Th>Headings</Th>
            <Th>Topics</Th>
          </Tr>
        </Thead>
        <Tbody>
          {/* {console.log("array sorted ......", array.sort((a, b) => a.name!.sequence! - b.name!.sequence!))} */}
          {array
            .sort((a, b) => a.name!.sequence! - b.name!.sequence!)
            .map((entry) => {
              return (<>
              </>
                // <Tr key={entry.name?.id}>
                //   <Td value={entry.name?.main_topic}>{entry.name?.main_topic}</Td>
                //   <Td value={entry.name?.main_topic}>
                //     {entry
                //       .value!.sort((a, b) => a.sequence! - b.sequence!)
                //       .map((value) => (
                //         <Text mb={{ base: "2", md: "0" }} key={value.id}>
                //           <NextLink href={`/posts/${encodeURIComponent(value.id)}`} passHref>
                //             <Link
                //               onClick={() => {
                //                 postContext.updateCurrentSubheadingId(value.id);
                //                 postContext.updateCurrentHeadingId((value.main_topic_id as Headings).id);
                //                 postContext.updateCurrentSubheading(value.topic as string);
                //                 postContext.updateCurrentPapername(
                //                   ((value.main_topic_id as Headings).paper_id as Papers).paper_name as string
                //                 );
                //                 postContext.updateCurrentHeadingname((value.main_topic_id as Headings).main_topic as string);
                //                 postContext.updateCurrentSubheadingProps(value.id, value.topic as string);
                //               }}
                //               disable="false"
                //               color="telegram.600"
                //             >
                //               {value.topic},
                //             </Link>
                //           </NextLink>
                //         </Text>
                //       ))}
                //   </Td>
                // </Tr>
              );
            })}
        </Tbody>
      </Table>
    </div>
  );
};
export async function getStaticPaths() {
  return {
    paths: [
      { params: { paperId: "1" } }, // See the "paths" section below
      { params: { paperId: "2" } }, // See the "paths" section below
      { params: { paperId: "3" } }, // See the "paths" section below
      { params: { paperId: "4" } }, // See the "paths" section below
      { params: { paperId: "5" } }, // See the "paths" section below
      { params: { paperId: "6" } }, // See the "paths" section below
      { params: { paperId: "7" } }, // See the "paths" section below
      { params: { paperId: "8" } }, // See the "paths" section below
      { params: { paperId: "9" } }, // See the "paths" section below
      { params: { paperId: "10" } }, // See the "paths" section below
      { params: { paperId: "11" } }, // See the "paths" section below
      { params: { paperId: "12" } }, // See the "paths" section below
      { params: { paperId: "13" } }, // See the "paths" section below
      { params: { paperId: "14" } }, // See the "paths" section below
      { params: { paperId: "15" } }, // See the "paths" section below
      { params: { paperId: "16" } }, // See the "paths" section below
      { params: { paperId: "17" } }, // See the "paths" section below
      { params: { paperId: "18" } }, // See the "paths" section below
      { params: { paperId: "19" } }, // See the "paths" section below
      { params: { paperId: "20" } }, // See the "paths" section below
      { params: { paperId: "21" } }, // See the "paths" section below
      { params: { paperId: "22" } }, // See the "paths" section below
      { params: { paperId: "23" } }, // See the "paths" section below
      { params: { paperId: "24" } }, // See the "paths" section below
      { params: { paperId: "25" } }, // See the "paths" section below
      { params: { paperId: "26" } }, // See the "paths" section below
      { params: { paperId: "27" } }, // See the "paths" section below
      { params: { paperId: "28" } }, // See the "paths" section below
      { params: { paperId: "29" } }, // See the "paths" section below
      { params: { paperId: "30" } }, // See the "paths" section below
      { params: { paperId: "31" } }, // See the "paths" section below
      { params: { paperId: "32" } }, // See the "paths" section below
      { params: { paperId: "33" } }, // See the "paths" section below
      { params: { paperId: "34" } }, // See the "paths" section below
      { params: { paperId: "35" } }, // See the "paths" section below
      { params: { paperId: "36" } }, // See the "paths" section below
      { params: { paperId: "36" } }, // See the "paths" section below
    ],
    fallback: true, // See the "fallback" section below
  };
}
export const getStaticProps = async ({ params }: any) => {
  //get whole syllabus

  let { data: syllabus, error: syllabus_error } = await supabase
    .rpc("getSyllabusFromPaperId", {
      paperid: 1,
    })
    .eq("subid", 72);

  if (syllabus_error) console.error(syllabus_error);

  // Make a request
  const { data, error } = await supabase
    .from<Headings>("headings")
    .select(` id,main_topic,sequence`)
    .eq("paper_id", params.paperId);
  let subheadingsMap = new Map<Headings | undefined, Subheading[] | null>();

  for (let index = 0; index < data!.length; index++) {
    //USING OPENAPI TYPES
    const { data: subheading, error } = await supabase
      .from<definitions["subheadings"]>("subheadings")
      .select(
        ` id,topic,sequence,
      main_topic_id:headings!topics_main_topic_id_fkey
      (
        id,main_topic,
        paper_id
        (
          id,
          paper_name
        )
        )
         `
      )
      .eq("main_topic_id", data![index].id);

    //MANUAL QUERY
    // const subheading = await supabase
    //   .from<Subheading>("subheadings")
    //   .select(
    //     ` id,topic,sequence,
    //     main_topic_id:headings!topics_main_topic_id_fkey
    //     (
    //       id,main_topic,
    //       paper_id:papers!mainTopics_paper_id_fkey
    //       (
    //         id,
    //         paper_name
    //       )
    //       )
    //        `
    //   )
    //   .eq("main_topic_id", data![index].id);
    if (error) {
      console.log("error is ", error);
    }
    subheadingsMap.set(data![index], subheading);
  }
  const array = Array.from(subheadingsMap, ([name, value]) => ({
    name,
    value,
  }));
  console.log(" array of heading subheading is ", array);
  return {
    props: {
      array,
    },
  };
};

(Syllabus as PageWithLayoutType).layout = LayoutWithTopNavbarWithSearchBox;
export default Syllabus;
