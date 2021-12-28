import {
  Avatar,
  Button,
  ButtonGroup,
  Container,
  Heading,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { SupabaseClient } from "@supabase/supabase-js";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { FaTelegram, FaWhatsapp } from "react-icons/fa";
import QuestionBanks from "../components/QuestionBank";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { myInfoLog } from "../lib/mylog";
import { supabase } from "../lib/supabaseClient";
import { useAuthContext } from "../state/Authcontext";
import { useAppContext } from "../state/state";
import { Papers } from "../types/myTypes";
import PageWithLayoutType from "../types/pageWithLayout";

type ProfileListProps = {
  data: Papers[];
};

const Home: React.FC<ProfileListProps> = ({ data }) => {
  const router = useRouter();
  const appContext = useAppContext();

  const handleChange = (event: any) => {
    // event.preventDefault();
    appContext.setPaperId(event.target.value);
    const href = `/syllabus/${encodeURIComponent(event.target.value)}`;
    router.push(href);
    myInfoLog("index->handlechange selected id is ", event.target.value);
  };
  const { profile} = useAuthContext();

  const navigateTo = (pathname: string) => {
    router.push({
      pathname: pathname,
      // query: { postId: postId,subHeadingId:subHeadingId,isNew:isNew },
    });
  };

  if (data && data.length !== 0) {
    return (
      <Container maxW="container.lg" pt="14">
        <Tabs orientation="horizontal" align="start" variant="enclosed-colored">
          <TabList>
            <Tab >Online Notes Making</Tab>
            <Tab>Question Bank</Tab>
            {supabase.auth.session() && profile?.role == "MODERATOR" ? <Tab>Admin</Tab> : null}
          </TabList>
          <TabPanels>
            {/* initially mounted */}
            <TabPanel>{tab1Ui(handleChange, data)}</TabPanel>
            {/* initially not mounted */}
            <TabPanel>
              <QuestionBanks />
            </TabPanel>
            <TabPanel>
              <VStack>
                {/* <SlateEdit/> */}
                {supabase.auth.session() && profile?.role == "MODERATOR" ? (
                  <ButtonGroup size="sm" isAttached variant="outline">
                    <Button onClick={() => navigateTo("./createHeading")}>Create New Heading</Button>
                    <Button onClick={() => navigateTo("./createSubheading")}>Create New Subheading</Button>
                    <Button onClick={() => navigateTo("./createQuestionBank")}>Create Question Bank</Button>
                  </ButtonGroup>
                ) : null}
                <Text as="b" color="">
                  Interact With Us At{" "}
                </Text>
                <ButtonGroup size="sm" isAttached variant="outline" mt="16">
                  <Button w="32" variant="outline" colorScheme="whatsapp" leftIcon={<FaWhatsapp />}>
                    WhatsApp
                  </Button>
                  <Button colorScheme="whatsapp">958-8701-073</Button>
                </ButtonGroup>
                <ButtonGroup size="sm" isAttached variant="outline">
                  <Button w="32" variant="outline" colorScheme="telegram" leftIcon={<FaTelegram />}>
                    Telegram
                  </Button>
                  <Button colorScheme="telegram">958-8701-073</Button>
                </ButtonGroup>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    );
  }
  return <div>no data</div>;
};

export const getStaticProps = async () => {
  // Make a request
  let { data, error } = await supabase.from<Papers>("papers").select(`
 id,paper_name
 
`);

  // const res = await fetch("https://.../data");
  console.log("data is inside index ", data);
  return {
    props: {
      data,
    },
  };
};

(Home as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default Home;

function tab1Ui(handleChange: (event: any) => void, data: Papers[]) {
  return (
    <VStack>
      <Heading as="h3" size="lg" mt="8" color="blue.300">
        Make Your UPSC notes online
      </Heading>
      <Heading as="h3" size="md" mb="24" color="gray.600">
        (Strictly as per Syllabus)
      </Heading>

      <div className="container" style={{ padding: "10px 0 50px 0" }}>
        <Stack>
          <Select placeholder="Select UPSC paper" variant="outline" onChange={handleChange}>
            {data!.map((x) => {
              return (
                <option key={x.id} value={x.id}>
                  {x.paper_name}
                </option>
              );
            })}
          </Select>
        </Stack>
      </div>
    </VStack>
  );
}
