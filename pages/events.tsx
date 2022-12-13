import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Highlight,
  Input,
  Link,
  ListItem,
  OrderedList,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { customToast } from "../componentv2/CustomToast";
import { LoginCard } from "../componentv2/LoginCard";
import { AvatarMenu } from "../layout/AvatarMenu";
import { BASE_URL } from "../lib/constants";
import { Database } from "../lib/database";
import { useAuthContext } from "../state/Authcontext";

type Inputs = {
  name: string;
  mobile: string;
};

const Events: React.FunctionComponent = () => {
  const { profile } = useAuthContext();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const supabaseClient = useSupabaseClient<Database>();
  const [loading, setLoading] = useState(false);
  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    setLoading(true);
    const { data: d, error: e } = await supabaseClient
      .from("events_registration")
      .select(`*`)
      .eq("event", 1)
      .eq("profile_fk", profile?.id);

    if (d && d.length > 0) {
      customToast({ title: "Already registered!", status: "info" });
      setLoading(false);
      return;
    }
    const { error } = await supabaseClient
      .from("events_registration")
      .insert({ event: "1", name: formData.name, mobile: formData.mobile, profile_fk: profile?.id });
    if (error) {
      customToast({ title: "Error! try again", status: "error" });
      setLoading(false);
      return;
    }
    customToast({ title: "Registered Sycessfully!", status: "success" });
    setLoading(false);
  };

  return (
    <>
      <Flex boxShadow={"md"} h="12" px="2" bg="gray.900" justify="space-between" align="center">
        <Link href="/">
          <Text color="white" cursor="pointer">
            Home
          </Text>
        </Link>
        {profile && <AvatarMenu />}
        {/* <SignIn /> */}
      </Flex>
      <Container maxW="5xl" py="14">
        {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
        <Center pb="14">
          <Heading fontWeight="black">Jionote Events</Heading>{" "}
        </Center>
        <Center>
          <Text fontSize="lg" lineHeight="tall" bg="brand.500" p="2" color="white">
            <Highlight query="10,000/" styles={{ px: "2", py: "1", rounded: "full", bg: "red.100" }}>
              Notes Making competition, Win Cash prize 10,000/
            </Highlight>
          </Text>
        </Center>
        <br />
        {profile ? (
          <Center>
            {" "}
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack minWidth="80" gap="4">
                {/* register your input into the hook by invoking the "register" function */}
                <Input
                  variant="filled"
                  {...register("name", {
                    required: "This field is required",
                    minLength: { value: 3, message: "Can not be less than 3 characters" },
                    maxLength: { value: 40, message: "Can not exceed 40 characters" },
                  })}
                  placeholder="Name"
                />
                {errors.mobile && <Text color="red">{errors.name?.message}</Text>}
                {/* include validation with required or other standard HTML validation rules */}
                <Input
                  variant="filled"
                  type="number"
                  {...register("mobile", {
                    // required: "This field is required",
                    // minLength: { value: 10, message: "Can not be less than 10 digit" },
                    maxLength: { value: 10, message: "Can not exceed 10 digit" },
                  })}
                  placeholder="Mobile"
                />
                {/* errors will return when field validation fails  */}
                {errors.mobile && <Text color="red">{errors.mobile?.message}</Text>}
                {/* <FormErrorMessage>{errors.mobile?.message}</FormErrorMessage> */}
                <Button colorScheme={"brand"} type="submit" size="md" isLoading={loading}>
                  Register
                </Button>
              </VStack>
            </form>
          </Center>
        ) : (
          <Center h="24">
            <Text px="2" color="facebook">
              Please login to register!
            </Text>
            <LoginCard redirect={`${BASE_URL}/events`} />
          </Center>
        )}
        {/* <Center> */}
        <Faq></Faq>
        {/* </Center> */}
      </Container>
    </>
  );
};

// export default Events;
// (Events as PageWithLayoutType).layout = LayoutWithTopNavbarForNotes;
export default Events;

function Faq() {
  return (
    <Accordion defaultIndex={[1]} allowMultiple pt="8">
      <AccordionItem>
        <h2>
          <AccordionButton bg="brand.100">
            <Text flex="1" textAlign="left" fontWeight="black">
              Click Here To See Guidelines/ Rules
            </Text>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <OrderedList spacing={"3"}>
            <ListItem>How to make Notes?</ListItem>
            <Text>
              Click <Tag>Select Syllabus</Tag> at top → Then Select Topic → Start Notes making in JIONOTE editor{" "}
            </Text>{" "}
            <ListItem>What is the last date for Registration?</ListItem>
            <Text>15-10-22</Text>
            <ListItem>What is the last date of Notes Sharing?</ListItem>
            <Text>15-10-22</Text>
            <ListItem>Declaration of Winners</ListItem>
            <Text>17-10-22</Text>
            <ListItem>Facilisis in pretium nisl aliquet</ListItem>
          </OrderedList>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
