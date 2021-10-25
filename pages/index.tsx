import {
  Box,
  Text,
  Button,
  ButtonGroup,
  Container,
  HStack,
  Select,
  Stack,
  VStack,
  IconButton,
  InputRightAddon,
  Heading,
} from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { FaFacebook, FaTelegram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { useAuthContext } from "../context/Authcontext";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { supabase } from "../lib/supabaseClient";
import { Papers } from "../types/myTypes";
import PageWithLayoutType from "../types/pageWithLayout";

type ProfileListProps = {
  data: Papers[];
};

const Home: React.FC<ProfileListProps> = ({ data }) => {
  const [value, setValue] = React.useState("");
  const router = useRouter();

  const handleChange = (event: any) => {
    // event.preventDefault();
    setValue(event.target.value);
    const href = `/syllabus/${encodeURIComponent(event.target.value)}`;
    router.push(href);
    console.log("hello hello ", value);
  };
  const { user, role } = useAuthContext();
  const goToCreateHeading = () => {
    router.push({
      pathname: "./createHeading",
      // query: { postId: postId,subHeadingId:subHeadingId,isNew:isNew },
    });
  };
  const goToCreateSubeading = () => {
    router.push({
      pathname: "./createSubheading",
      // query: { postId: postId,subHeadingId:subHeadingId,isNew:isNew },
    });
  };

  if (data && data.length !== 0) {
    return (
      <Container maxW="container.md" pt="14">
        <VStack>
          <Heading as="h3" size="lg">
            Make Your UPSC notes online
          </Heading>
          {/* <SlateEdit/> */}
          {role !== "MODERATOR" ? null : (
            <ButtonGroup size="sm" isAttached variant="outline">
              <Button onClick={() => goToCreateHeading()}>Create New Heading</Button>
              <Button onClick={() => goToCreateSubeading()}>Create New Subheading</Button>
            </ButtonGroup>
          )}
          {/* <HStack> */}

          {/* </HStack> */}

          <div className="container" style={{ padding: "10px 0 10px 0" }}>
            <Stack>
              <Select placeholder="Select UPSC paper" variant="outline" onChange={handleChange}>
                {data!.map((number) => {
                  console.log("ho raha haw ");
                  return (
                    <option key={number.id} value={number.id}>
                      {number.paper_name}
                    </option>
                  );
                })}
              </Select>
            </Stack>
          </div>
          <Text as="b" color="">
            Get latest updates and Interact with us at{" "}
          </Text>
          <ButtonGroup size="sm" isAttached variant="outline">
            <Button w="40" variant="outline" colorScheme="whatsapp" leftIcon={<FaWhatsapp />}>
              WhatsApp
            </Button>
            <Button colorScheme="whatsapp">958-8701-073</Button>
          </ButtonGroup>
          <ButtonGroup size="sm" isAttached variant="outline">
            <Button w="40" variant="outline" colorScheme="telegram" leftIcon={<FaTelegram />}>
              Telegram
            </Button>
            <Button colorScheme="telegram">958-8701-073</Button>
          </ButtonGroup>
        </VStack>
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
