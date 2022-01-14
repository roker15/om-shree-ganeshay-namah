import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Container,
  Heading,
  Link,
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
import Dropzone from "react-dropzone";
import { FaTelegram, FaWhatsapp } from "react-icons/fa";
import { MyDropzone } from "../components/MyDropzone";
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
  const { profile } = useAuthContext();

  const navigateTo = (pathname: string) => {
    router.push({
      pathname: pathname,
      // query: { postId: postId,subHeadingId:subHeadingId,isNew:isNew },
    });
  };

  if (data && data.length !== 0) {
    return (
      <Container maxW="container.lg" pt="2" align="center">
        <Text color="gray.600">
          <Text as="b">8000+</Text> UPSC Students Using Qlook For making{" "}
          <Text bg="blue.50" p="0.5" as="span" fontWeight="medium">
            online
          </Text>{" "}
          Notes 📝{" "}
        </Text>
        <Text as="span" color="gray.600">
          💬 Interact With Us At{" "}
        </Text>
        <ButtonGroup size="sm" isAttached variant="solid  " mx="2" mt="2" mb="2">
          <Button w="28" variant="solid" colorScheme="whatsapp" leftIcon={<FaWhatsapp />}>
            WhatsApp
          </Button>
          <Button colorScheme="whatsapp" variant="solid">
            958-8701-073
          </Button>
        </ButtonGroup>
        <ButtonGroup size="sm" isAttached variant="solid" mb="8" mt="2">
          <Button w="28" variant="solid" colorScheme="telegram" leftIcon={<FaTelegram />}>
            Telegram
          </Button>
          <Button variant="solid" colorScheme="telegram">
            958-8701-073
          </Button>
        </ButtonGroup>
        <Tabs orientation="horizontal" align="start" variant="enclosed-colored">
          <TabList>
            <Tab>Online Notes Making</Tab>
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
                  <Box>
                    {" "}
                    <ButtonGroup size="sm" isAttached variant="outline">
                      <Button onClick={() => navigateTo("./createHeading")}>Create New Heading</Button>
                      <Button onClick={() => navigateTo("./createSubheading")}>Create New Subheading</Button>
                      <Button onClick={() => navigateTo("./createQuestionBank")}>Create Question Bank</Button>
                    </ButtonGroup>
                    <MyDropzone/>
                  </Box>
                ) : null}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    );
  }
  return <div>no data</div>;
};

export const getServerSideProps = async () => {
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
      <Text fontSize={"2xl"} mt="8" color="gray.600" fontFamily={"Comic Sans MS"}>
        Select Exam Paper → Select Syllabus Topic → Make Notes
        <Text as="span" color="gray.400">
          📝
        </Text>{" "}
        online in Editor
      </Text>
      <Text fontSize={"medium"}  mb="24" color="gray.600">
        (Strictly as per Syllabus)
      </Text>

      <Box>
        <Stack>
          <Select
            my="8"
            size="sm"
            w={{ base: "-moz-fit-content", md: "2xl" }}
            placeholder="Select UPSC paper"
            variant="filled"
            onChange={handleChange}
          >
            {data!.map((x) => {
              return (
                <option key={x.id} value={x.id}>
                  {x.paper_name}
                </option>
              );
            })}
          </Select>
        </Stack>
      </Box>
      <Text bg="blue.50" p="4">
        Click Youtube{" "}
        <Link color="blue.600" isExternal fontWeight="bold" href="https://www.youtube.com/watch?v=iZFosT2a9m8">
          Video Link{" "}
        </Link>
        to Learn How to make online notes
      </Text>
    </VStack>
  );
}
