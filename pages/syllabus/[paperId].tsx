import {
  Link, Table,
  TableCaption,
  Tbody,
  Td, Th,
  Thead,
  Tr
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
  name: string | undefined;
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
        <TableCaption>These syllabus are exactly as per UPSC Notificaiton</TableCaption>
        <Thead>
          <Tr>
            <Th>Headings</Th>
            <Th>Topics</Th>
          </Tr>
        </Thead>
        <Tbody>
          {console.log("array is ......", array)}
          {array.map((entry) => {
            return (
              <Tr key={entry.id}>
                <Td value={entry.name}>{entry.name}</Td>
                <Td key={entry.id} value={entry.name}>
                  {entry.value!.map((value) => (
                    // return
                    //  <li>{value.topic}</li>;
                    <>
                      <span>
                        {/* <Box display="flex" color="yellow.400" key={value.id}> */}
                        <NextLink
                          href={`/posts/${encodeURIComponent(value.id)}`}
                          passHref
                        >
                          {/* <a color="teal.500"></a> */}
                          <Link color="teal.500">{value.topic}</Link>
                        </NextLink>
                        {/* </Box> */}
                      </span>

                      <span>,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;     </span>
                    </>
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
    ],
    fallback: true, // See the "fallback" section below
  };
}
export const getStaticProps = async ({ params }: any) => {
  // Make a request
  const { data, error } = await supabase
    .from<Headings>("headings")
    .select(` id,main_topic`)
    .eq("paper_id", params.paperId);
  console.log("getstatic props inside ",params.paperId);
  // let subheadings: Subheading[][] = [];
  let subheadingsMap = new Map<string | undefined, Subheading[] | null>();
  console.log("subheadings are88 ", data?.length);

  for (let index = 0; index < data!.length; index++) {
    const subheading = await supabase
      .from<Subheading>("subheadings")
      .select(` id,topic,sequence`)
      .eq("main_topic_id", data![index].id);
    // subheadings.push(subheading.data!);
    subheadingsMap.set(data![index].main_topic, subheading.data);
  }
  console.log("subheading map is ", subheadingsMap);
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
