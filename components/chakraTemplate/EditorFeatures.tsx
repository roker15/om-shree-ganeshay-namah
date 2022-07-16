import {
  Container,
  SimpleGrid,
  Image,
  Flex,
  Heading,
  Text,
  Stack,
  StackDivider,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { IoAnalyticsSharp, IoLogoBitcoin, IoSearchSharp } from "react-icons/io5";
import { ReactElement } from "react";
import ImageSlider from "../ImageSlider";
import EditorForFrontPage from "./EditorForFrontPage";

interface FeatureProps {
  text: string;
  iconBg: string;
  icon?: ReactElement;
}

const Feature = ({ text, icon, iconBg }: FeatureProps) => {
  return (
    <Stack direction={"row"} align={"center"}>
      <Flex w={8} h={8} align={"center"} justify={"center"} rounded={"full"} bg={iconBg}>
        {icon}
      </Flex>
      <Text fontWeight={600}>{text}</Text>
    </Stack>
  );
};

export default function SplitWithImage() {
  return (
    <Container maxW={"6xl"} py={12}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <Stack spacing={4}>
          <Text
            textTransform={"uppercase"}
            color={"blue.400"}
            fontWeight={600}
            fontSize={"sm"}
            bg={useColorModeValue("blue.50", "blue.900")}
            p={2}
            alignSelf={"flex-start"}
            rounded={"md"}
          >
            Our Story
          </Text>
          <Heading>Modern Editor to Create Beautiful Notes</Heading>
          <Text color={"gray.500"} fontSize={"md"}>
            A Modern Editor for your digital notes making. All contents will be saved in our cloud and you can access it from anywhere and from any device like Mobile, Tablets or Laptop/PC
          </Text>
          <Stack spacing={4} divider={<StackDivider borderColor={useColorModeValue("gray.100", "gray.700")} />}>
            <Feature
              icon={<Icon as={IoAnalyticsSharp} color={"yellow.500"} w={5} h={5} />}
              iconBg={useColorModeValue("yellow.100", "yellow.900")}
              text={"Text Formatting"}
            />
            <Feature
              icon={<Icon as={IoLogoBitcoin} color={"green.500"} w={5} h={5} />}
              iconBg={useColorModeValue("green.100", "green.900")}
              text={"Image, Maps, charts insert in Notes"}
            />
            <Feature
              icon={<Icon as={IoSearchSharp} color={"purple.500"} w={5} h={5} />}
              iconBg={useColorModeValue("purple.100", "purple.900")}
              text={"Maths and equation Support"}
            />
            <Feature
              icon={<Icon as={IoSearchSharp} color={"purple.500"} w={5} h={5} />}
              iconBg={useColorModeValue("purple.100", "purple.900")}
              text={"Table Support"}
            />
            <Feature
              icon={<Icon as={IoSearchSharp} color={"purple.500"} w={5} h={5} />}
              iconBg={useColorModeValue("purple.100", "purple.900")}
              text={"PDF export of Notes or Printing"}
            />
          </Stack>
        </Stack>
        <Flex alignItems="center">
          <EditorForFrontPage />
          {/* <ImageSlider /> */}
          {/* <Image
            rounded={"md"}
            alt={"feature image"}
            src={
              "https://i.imgur.com/YYziqDC.png"
            }
            objectFit={"contain"}
          /> */}
        </Flex>
      </SimpleGrid>
    </Container>
  );
}
