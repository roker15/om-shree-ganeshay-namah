import {
  Link,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from "@chakra-ui/react";
import { AuthSession } from "@supabase/supabase-js";
import NextLink from "next/link";
import React, { useState } from "react";
import { useAuthContext } from "../../context/Authcontext";
import { useAppContext } from "../../context/state";
import LayoutWithTopNavbarWithSearchBox from "../../layout/LayoutWithTopNavbarWithSearchBox";
// import SideNavBar from "../../layout/sideNavBar";
import { Profile } from "../../lib/constants";
import { supabase } from "../../lib/supabaseClient";
import { Headings, Subheading } from "../../types/myTypes";
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

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {/* <Heading>Subject Name</Heading> */}
      <Table size="sm" variant="striped">
        <TableCaption>
          These syllabus are exactly as per UPSC Notificaiton
        </TableCaption>
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
                  <Td value={entry.name?.main_topic}>
                    {entry.name?.main_topic}
                  </Td>
                  <Td value={entry.name?.main_topic}>
                    {entry
                      .value!.sort((a, b) => a.sequence! - b.sequence!)
                      .map((value) => (
                        // return
                        //  <li>{value.topic}</li>;;
                        <div key={value.id}>
                          <Text
                            color="teal.500"
                            _hover={{
                              background: "gray.600",
                              color: "white",
                            }}
                          >
                            {value.topic}
                            <Text as="b">,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>

                            {/* Following is for future implementation */}
                            {/* <NextLink
                          href={`/posts/${encodeURIComponent(value.id)}`}
                          passHref
                        >
                          <Link disable="true" color="telegram.600">{value.topic}</Link>
                        </NextLink> */}
                          </Text>
                        </div>
                      ))}
                  </Td>
                </Tr>
              );
            })}

          {/* <Td>inches</Td>
            <Td>millimetres (mm)</Td>
            <Td isNumeric>25.4</Td> */}
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
  console.log("getstatic props inside ", params.paperId);
  // let subheadings: Subheading[][] = [];
  let subheadingsMap = new Map<Headings | undefined, Subheading[] | null>();
  console.log("subheadings are88 ", data?.length);

  for (let index = 0; index < data!.length; index++) {
    const subheading = await supabase
      .from<Subheading>("subheadings")
      .select(` id,topic,sequence`)
      .eq("main_topic_id", data![index].id);
    // subheadings.push(subheading.data!);
    subheadingsMap.set(data![index], subheading.data);
  }
  // console.log("subheading map is ", subheadingsMap);
  const array = Array.from(subheadingsMap, ([name, value]) => ({
    name,
    value,
  }));

  return {
    props: {
      array,
    },
  };
};

(Syllabus as PageWithLayoutType).layout = LayoutWithTopNavbarWithSearchBox;
export default Syllabus;
