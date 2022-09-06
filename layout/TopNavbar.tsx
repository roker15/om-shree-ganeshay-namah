import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Flex,
  FlexProps,
  HStack,
  IconButton,
  Image,
  Link as L,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  StackDivider,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { FaTelegram } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { CustomDrawerWithButton } from "../components/CustomChakraUi";
import BookFilter from "../components/syllabus/BookFilter";
import { useAuthContext } from "../state/Authcontext";
import { BookResponse } from "../types/myTypes";

// const LinkItems: Array<Subheading> = [];

export default function TopNavbar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    //overflowx = hidden is because body was visible in mobile view. test is again and then
    // finalize
    <Box  >
      <MobileNav onOpen={onOpen} />
      <Box >{children}</Box>
    </Box>
  );
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  // const [scrolling, setScrolling] = useState();
  const { signInWithgoogle, signOut, profile } = useAuthContext();
  return (
    <Flex
      // ml={{ base: 10, md: 60 }}
      px={{ base: "1", md: 4 }}
      height="16"
      alignItems="center"
      // bg={useColorModeValue("#f8f6fa", "#e5e0f1")}
      bg="white"
      // bg="#f0f2f5"
      borderBottomWidth="0px"
      borderBottomColor={"gray.100"}
      // shadow="sm"
      // zIndex={"tooltip"}
      // pos="fixed"
      top={"0"}
      w="full"
      alignSelf={"flex-start"}
      // boxShadow="md"
      // borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex" }}
      {...rest}
    >
      <HStack>
        <Box display={{ base: "block", md: "none" }}>
          <CustomMenu />
        </Box>
        <Text fontWeight="bold"display={{ base: "block", md: "none" }}>Jionote</Text>
        <LinkBox alignItems="center" display={{ base: "none", md: "flex" }}>
          <LinkOverlay
            _hover={{
              background: "none",
              // color: "white",
            }}
            href="/"
          ></LinkOverlay>
          <Image
            // p="2"
            // bg="blackAlpha.100"
            // priority={true}
            loading="eager"
            src="/logo-blue.png"
            alt="Logo"
            w="90px"
            // w={{ base: "35px", md: "100px" }}
          />
        </LinkBox>
      </HStack>
      <Box display={{ base: "none", md: "block" }}>
        <GotoQuestion />
      </Box>
      {/* <Box display={{ base: "none", sm: "initial" }}> */}
      {/* </Box> */}

      <HStack spacing={{ base: "0", md: "6" }}>
        {!profile ? (
          <HStack>{JoinTelegram}</HStack>
        ) : (
          <Flex border="0px" alignItems={"center"}>
            {JoinTelegram}
            <Menu boundary="clippingParents">
              <MenuButton border="0px" py={2} transition="all 0.3s" _focus={{ boxShadow: "none" }}>
                <HStack>
                  {!profile ? (
                    <Avatar size={"sm"} src="https://bit.ly/broken-link" />
                  ) : (
                    <Avatar
                      size={"sm"}
                      src={
                        profile.avatar_url // change this to url from database avatar
                      }
                    />
                  )}

                  <VStack display={{ base: "none", md: "flex" }} alignItems="flex-start" spacing="1px" ml="2">
                    {profile ? <Text fontSize="sm">{profile?.username}</Text> : null}
                    <Text fontSize="xs" color="gray.600">
                      {/* Admin */}
                    </Text>
                  </VStack>
                  <Box display={{ base: "none", md: "flex" }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList border="1px" bg={"gray.50"} borderColor={"gray.100"}>
                <MenuItem border="0px">Profile</MenuItem>
                <MenuItem border="0px">Settings</MenuItem>
                {profile ? (
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
        )}
      </HStack>
    </Flex>
  );
};

const JoinTelegram = (
  <HStack alignItems={"center"} mx="2" px="2" py="0.5" bg="telegram.300">
    {" "}
    <L color="white" href="https://t.me/+Rhiv7nfLc_pkZDM1" isExternal>
      Join Telegram
    </L>
    <FaTelegram color="white" />
  </HStack>
);

export function GotoQuestion() {
  const router = useRouter();
  const [book, setBook] = useState<BookResponse | undefined>(undefined);
  const ROUTE_POST_ID = "/notes/[bookid]";
  const navigateTo = (bookid: string) => {
    router.push({
      pathname: ROUTE_POST_ID,
      query: { bookid },
    });
  };

  useEffect(() => {
    if (book) {
      sessionStorage.setItem("book", JSON.stringify(book));
      sessionStorage.setItem("selected-subheading", "undefined");
      sessionStorage.setItem("selected-syllabus", "undefined");
      navigateTo(book.id.toString());
    }
  }, [book]); // do not bring navigate to dependency.. it brings infinite loop

  const updateBookProps = (x: BookResponse | undefined) => {
    setBook(x);
  };
  return (
    <Flex
      direction={"row"}
      justifyContent={"center"}
      alignItems="left"
      columnGap={{ base: "1", md: "6" }}
      // divider={<StackDivider borderColor={{ base: "gray.50", sm: "white" }} />}
      borderColor="gray.200"
      display={{ base: "none", sm: "flex" }}
    >
      <Text
        color="gray.600"
        fontWeight="semibold"
        fontSize={{ base: "small", md: "small", lg: "md" }}
        display={router.pathname === "/" ? "none" : "block"}
      >
        <Link href="/">
          <a>Home</a>
        </Link>
      </Text>
      <Text
        color="gray.600"
        fontWeight="semibold"
        fontSize={{ base: "small", md: "small", lg: "md" }}
        display={router.pathname === "/questionBanks" ? "none" : "block"}
      >
        <Link href="/questionBanks">
          <a>Question Bank</a>
        </Link>
      </Text>
      <Text
        color="gray.600"
        fontWeight="semibold"
        fontSize={{ base: "small", md: "small", lg: "md" }}
        display={router.pathname === "/reviseCurrentAffair" ? "none" : "block"}
      >
        <Link href="/reviseCurrentAffair">
          <a>Current Affairs</a>
        </Link>
      </Text>
      <Box>
        <CustomDrawerWithButton>
          <BookFilter setParentProps={updateBookProps}></BookFilter>
        </CustomDrawerWithButton>
      </Box>
    </Flex>
  );
}
export function CustomMenu() {
  const router = useRouter();
  const [book, setBook] = useState<BookResponse | undefined>(undefined);
  const ROUTE_POST_ID = "/notes/[bookid]";
  const navigateTo = (bookid: string) => {
    router.push({
      pathname: ROUTE_POST_ID,
      query: { bookid },
    });
  };

  useEffect(() => {
    if (book) {
      sessionStorage.setItem("book", JSON.stringify(book));
      sessionStorage.setItem("selected-subheading", "undefined");
      sessionStorage.setItem("selected-syllabus", "undefined");
      navigateTo(book.id.toString());
    }
  }, [book]); // do not bring navigate to dependency.. it brings infinite loop

  const updateBookProps = (x: BookResponse | undefined) => {
    setBook(x);
  };
  return (
    <Menu >
      <MenuButton as={IconButton} aria-label="Options" icon={<HamburgerIcon />} variant="ghost" />
      <MenuList bg="gray.50">
        <MenuItem minH="48px" display={router.pathname === "/" ? "none" : ""}>
          <Text color="gray.600" fontWeight="semibold" fontSize={{ base: "small", md: "small", lg: "md" }}>
            <Link href="/" >
              <a >Home</a>
            </Link>
          </Text>
        </MenuItem>
        <MenuItem minH="48px" display={router.pathname === "/questionBanks" ? "none" : ""}>
          <Text color="gray.600" fontWeight="semibold" fontSize={{ base: "small", md: "small", lg: "md" }}>
            <Link href="/questionBanks">
              <a>Question Bank</a>
            </Link>
          </Text>
        </MenuItem>
        <MenuItem minH="48px" display={router.pathname === "/reviseCurrentAffair" ? "none" : ""}>
          <Text color="gray.600" fontWeight="semibold" fontSize={{ base: "small", md: "small", lg: "md" }}>
            <Link href="/reviseCurrentAffair">
              <a>Current Affairs</a>
            </Link>
          </Text>
        </MenuItem>
        <MenuItem minH="48px">
          <Box>
            <CustomDrawerWithButton>
              <BookFilter setParentProps={updateBookProps}></BookFilter>
            </CustomDrawerWithButton>
          </Box>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
