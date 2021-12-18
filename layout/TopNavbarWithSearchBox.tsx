import {
  Image,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  BoxProps,
  Button,
  Center,
  CloseButton,
  Flex,
  FlexProps,
  Heading,
  HStack,
  IconButton,
  Link,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
// import Image from "next/image";
import router from "next/router";
import React, { ReactNode, ReactText } from "react";
import { FaGoogle } from "react-icons/fa";
import { FiBell, FiChevronDown } from "react-icons/fi";
import useSWR from "swr";
import SubjectSearch from "../components/SubjectSearch";
import { useAuthContext } from "../state/Authcontext";
import { useAppContext } from "../state/state";
import { supabase } from "../lib/supabaseClient";
import { Subheading } from "../types/myTypes";

const LinkItems: Array<Subheading> = [];

export default function TopNavbarWithSearchBox({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [subheading, setSubheading] = useState(0);
  const shareContext = useAppContext();
  const { signUp, signOut, signIn } = useAuthContext();
  //**************************useSWR******************************************888 */
  // `data` will always be available as it's in `fallback`.
  const { data, error } = useSWR(
    ["/headingId", shareContext.postHeadingId],
    async () =>
      await supabase
        .from<Subheading>("subheadings")
        .select("*")
        .eq("main_topic_id", shareContext.postHeadingId)
  );

  // return <h1>{data.title}</h1>;
  if (error)
    return (
      <Box minH="100vh" bg="white.100">
        <div>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>There is some Problem!</AlertTitle>
            <AlertDescription>
              Please try again after some time.
            </AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" />
          </Alert>
        </div>
      </Box>
    );
  if (!data) return <div>loading...</div>;
  LinkItems.length = 0;
  data.data!.map((x) => {
    LinkItems.push(x);
  });
  return (
    <Box minH="100vh" bg="white.100">
      {/* <Box bg="white" ml={{ base: 0, md: 80 }} p="4"> */}

      <MobileNav onOpen={onOpen} />
      {/* <Center bg="white" mt={"20"} h="75px" color="white">
        <Heading>QLOOK</Heading>
      </Center> */}

      {children}

      {/* </Box> */}
    </Box>
  );
}


interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { signIn, signUp, signOut } = useAuthContext();
  return (
    <Flex
      // ml={{ base: 10, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="16"
      alignItems="center"
      bg={useColorModeValue("#f8f6fa", "#e5e0f1")}
      borderBottomWidth="1px"
      zIndex={1}
      pos="sticky"
      top={0}
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex" }}
      {...rest}
    >

      <LinkBox pt="0">
        <LinkOverlay
          _hover={{
            background: "none",
            color: "white",
          }}
          href="/"
        >
           <Image
            // priority={true}
            loading="eager"
            src="/logo-150x150.png"
            alt="Picture of the author"
            boxSize={{ base : "0px", md: "50px" }}
            // w={{ base : "50", md: "40" }}
            // h={{ base: 50, md: 40 }}
            // layout="fill"
            objectFit="contain"
          />
        </LinkOverlay>
      </LinkBox>
      <Box
        // align="left"
        bg="lavender"
        p="0.5"
        m="2"
        // borderRadius="3xl"
        w="xl"
        // ml="12"
        // h="12"
        // display={{ base: "flex", md: "flex-start" }}
      >
        <SubjectSearch />
      </Box>
      {/* <span></span> */}
      <HStack spacing={{ base: "0", md: "6" }}>
        {/* <button onClick={() => setLanguage("jp")}>sign in</button> */}
        {supabase.auth.session() === null ? (
          <Button
            border="0px"
            colorScheme="google"
            leftIcon={<FaGoogle />}
            variant="ghost"
            onClick={() => signUp("gg", "tt")}
          >
            Sign in
          </Button>
        ) : (
          ""
        )}
        <Flex border="0px" alignItems={"center"}>
          <Menu boundary="clippingParents">
            <MenuButton
              border="0px"
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                {supabase.auth.session() === null ? (
                  <Avatar size={"sm"} src="https://bit.ly/broken-link" />
                ) : (
                  <Avatar size={"sm"} src={"https://bit.ly/broken-link"} />
                )}

                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{useAuthContext().user?.email}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {/* Admin */}
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              border="0px"
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem border="0px">Profile</MenuItem>
              <MenuItem border="0px">Settings</MenuItem>
              {supabase.auth.session() !== null ? (
                <>
                  {" "}
                  <MenuDivider />
                  <MenuItem border="0px" onClick={() => signOut("vv")}>
                    Sign out
                  </MenuItem>
                </>
              ) : (
                ""
              )}
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
