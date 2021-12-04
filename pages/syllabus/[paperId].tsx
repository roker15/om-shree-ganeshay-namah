import { Link, Table, TableCaption, Tbody, Td, Th, Thead, Tr, Text } from "@chakra-ui/react";
import { AuthSession } from "@supabase/supabase-js";
import NextLink from "next/link";
import React, { useState } from "react";
import { useAuthContext } from "../../context/Authcontext";
import { usePostContext } from "../../context/PostContext";
import { useAppContext } from "../../context/state";
import LayoutWithTopNavbarWithSearchBox from "../../layout/LayoutWithTopNavbarWithSearchBox";
// import SideNavBar from "../../layout/sideNavBar";
import { Profile } from "../../lib/constants";
import { supabase } from "../../lib/supabaseClient";
import { Headings, Papers, Subheading } from "../../types/myTypes";
import PageWithLayoutType from "../../types/pageWithLayout";

type x = {
  id: number | undefined;
  name: Headings | undefined;
  value: Subheading[] | null;
};
type ProfileListProps = {
  array: x[];
};

const Syllabus: React.FC<ProfileListProps> = ({ array }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  // const [data, setProfiles] = useState<Profile[]>([]);
  const shareContext = useAppContext();
  const authcontext = useAuthContext();
  const postContext = usePostContext();

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
              return (
                <Tr key={entry.name?.id}>
                  <Td value={entry.name?.main_topic}>{entry.name?.main_topic}</Td>
                  <Td value={entry.name?.main_topic}>
                    {entry
                      .value!.sort((a, b) => a.sequence! - b.sequence!)
                      .map((value) => (
                        <Text mb={{ base: "2", md: "0" }} key={value.id}>
                          <NextLink href={`/posts/${encodeURIComponent(value.id)}`} passHref>
                            <Link
                              onClick={() => {
                                postContext.updateCurrentSubheadingId(value.id);
                                postContext.updateCurrentHeadingId((value.main_topic_id as Headings).id);
                                postContext.updateCurrentSubheading(value.topic as string);
                                postContext.updateCurrentPapername(
                                  ((value.main_topic_id as Headings).paper_id as Papers).paper_name as string
                                );
                                postContext.updateCurrentHeadingname((value.main_topic_id as Headings).main_topic as string);
                                postContext.updateCurrentSubheadingProps(value.id,value.topic as string);
                              }}
                              disable="false"
                              color="telegram.600"
                            >
                              {value.topic},
                            </Link>
                          </NextLink>
                        </Text>
                      ))}
                  </Td>
                </Tr>
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
    ],
    fallback: true, // See the "fallback" section below
  };
}
export const getStaticProps = async ({ params }: any) => {
  // Make a request
  const { data, error } = await supabase
    .from<Headings>("headings")
    .select(` id,main_topic,sequence`)
    .eq("paper_id", params.paperId);
  let subheadingsMap = new Map<Headings | undefined, Subheading[] | null>();
  console.log("subheadings are88 ", data?.length);

  for (let index = 0; index < data!.length; index++) {
    const subheading = await supabase
      .from<Subheading>("subheadings")
      .select(
        ` id,topic,sequence,
        main_topic_id:headings!topics_main_topic_id_fkey
        (
          id,main_topic,
          paper_id:papers!mainTopics_paper_id_fkey
          (
            id,
            paper_name
          )
          )
          
          `
      )
      .eq("main_topic_id", data![index].id);
    console.log("  subheading is ", JSON.stringify(subheading.data));
    console.log("  subheading error detail is  ", subheading.error?.details);
    subheadingsMap.set(data![index], subheading.data);
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
