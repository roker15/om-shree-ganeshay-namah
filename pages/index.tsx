import {
  Button,
  ButtonGroup,
  Container,
  Select,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import React from "react";
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
          {role !== "MODERATOR" ? null : (
            <ButtonGroup size="sm" isAttached variant="outline">
              <Button onClick={() => goToCreateHeading()}>
                Create New Heading
              </Button>
              <Button onClick={() => goToCreateSubeading()}>
                Create New Subheading
              </Button>
            </ButtonGroup>
          )}
          

          <div className="container" style={{ padding: "10px 0 100px 0" }}>
            <Stack>
              <Select
                placeholder="Select UPSC paper"
                variant="outline"
                onChange={handleChange}
              >
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
