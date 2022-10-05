import {
  Button,
  Center,
  Container,
  Input,
  VStack,
  Text,
  Heading,
  Highlight,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  ListItem,
  OrderedList,
} from "@chakra-ui/react";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import PageWithLayoutType from "../types/pageWithLayout";

type Inputs = {
  name: string;
  mobile: string;
};


const Events: React.FunctionComponent = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  console.log(watch("name")); // watch input value by passing the name of it
  return (
    <Container maxW="5xl" py="14">
      {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
      <Center pb="10">
        <Text fontSize="lg" lineHeight="tall" bg="brand.500" p="2" color="white">
          <Highlight query="5000/" styles={{ px: "2", py: "1", rounded: "full", bg: "red.100" }}>
            Jionote Notes Making competition, Win Cash prize worth 5000/
          </Highlight>
        </Text>
      </Center>
      <Center>
        {" "}
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack minWidth="80" gap="4">
            {/* register your input into the hook by invoking the "register" function */}
            <Input variant="filled" {...register("name", { required: true })} placeholder="Name" />
            {errors.name && <span>This field is required</span>}
            {/* include validation with required or other standard HTML validation rules */}
            <Input variant="filled" {...register("mobile", { required: true })} placeholder="Mobile" />
            {/* errors will return when field validation fails  */}
            {errors.mobile && <span>This field is required</span>}
            <Button colorScheme={"brand"} type="submit">
              Register
            </Button>
          </VStack>
        </form>
      </Center>
      {/* <Center> */}
      <Faq></Faq>
      {/* </Center> */}
    </Container>
  );
};

// export default Events;
(Events as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default Events;

function Faq() {
  return (
    <Accordion defaultIndex={[1]} allowMultiple pt="8">
      <AccordionItem>
        <h2>
          <AccordionButton bg="brand.100">
            <Box flex="1" textAlign="left">
              Click Here to See Rules
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <OrderedList >
            <ListItem>How to make Notes?</ListItem>
            <Text>Click Select Syllabus at top → Then Select Topic → Start Notes making in JIONOTE editor </Text> <ListItem>What is the last date for Registration?</ListItem>
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
