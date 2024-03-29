import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Flex,
  FlexProps,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Image,
  Link as L,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { FaTelegram } from "react-icons/fa";
import DesktopMenu from "../components/chakraTemplate/Customdrawer";
import { CustomDrawerWithButton } from "../components/CustomChakraUi";
import BookFilter from "../components/syllabus/BookFilter";
import BookFilterForMangeSyllabus from "../componentv2/BookFilterForMangeSyllabus";
import RequestDrawer from "../componentv2/RequestDrawer";
import SignIn from "../componentv2/SignIn";
import { useAuthContext } from "../state/Authcontext";
import { BookResponse } from "../types/myTypes";

// const LinkItems: Array<Subheading> = [];

export default function TopNavbar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    //overflowx = hidden is because body was visible in mobile view. test is again and then
    // finalize
    <Box>
      <Flex h="12" bg="gray.900" justify="end" align="center">
        <SignIn />
      </Flex>
      <MobileNav onOpen={onOpen} />
      <Box p="2">{children}</Box>
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
    <Grid minH="32" top={"0"} shadow={"md"} templateColumns={{ base: "repeat(3, 1fr)", lg: "repeat(9, 1fr)" }}>
      <GridItem colSpan={2} display={{ base: "none", lg: "flex" }}>
        <LinkBox alignItems="center">
          <LinkOverlay
            _hover={{
              background: "none",
            }}
            href="/"
          ></LinkOverlay>
          <Image loading="eager" src="/logo-blue.png" alt="Logo" w="90px" />
        </LinkBox>
      </GridItem>
      <GridItem colSpan={5}>
        {/* <GotoQuestion /> */}

        <BookFilterForMangeSyllabus />
      </GridItem>
      {/* <Box display={{ base: "none", sm: "initial" }}> */}
      {/* </Box> */}

      <GridItem colSpan={2} display={{ base: "none", lg: "flex" }}>
        <Flex w="full" wrap="wrap" alignItems="end" justifyContent="end" direction="row">
          {JoinTelegram}
          <RequestDrawer buttonType={"md"} />
        </Flex>
      </GridItem>
    </Grid>
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
      display={{ base: "none", sm: "flex" }}
    >
      <Text
        fontWeight="semibold"
        fontSize={{ base: "small", md: "small", lg: "md" }}
        display={router.pathname === "/" ? "none" : "block"}
      >
        <Link href="/">
          <a>Home</a>
        </Link>
      </Text>
      <Text
        fontWeight="semibold"
        fontSize={{ base: "small", md: "small", lg: "md" }}
        display={router.pathname === "/questionBanks" ? "none" : "block"}
      >
        <Link href="/questionBanks">
          <a>Question Bank</a>
        </Link>
      </Text>
      <Text
        fontWeight="semibold"
        fontSize={{ base: "small", md: "small", lg: "md" }}
        display={router.pathname === "/reviseCurrentAffair" ? "none" : "block"}
      >
        <Link href="/reviseCurrentAffair">
          <a>Search Notes</a>
        </Link>
      </Text>
      <Box>
        {/* <CustomDrawerWithButton>
          <BookFilter setParentProps={updateBookProps}></BookFilter>
        </CustomDrawerWithButton> */}
        <DesktopMenu />
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
    <Menu>
      <MenuButton as={IconButton} aria-label="Options" icon={<HamburgerIcon />} variant="ghost" />
      <MenuList bg="gray.50">
        <MenuItem minH="48px" display={router.pathname === "/" ? "none" : ""}>
          <Text fontWeight="semibold" fontSize={{ base: "small", md: "small", lg: "md" }}>
            <Link href="/">
              <a>Home</a>
            </Link>
          </Text>
        </MenuItem>
        <MenuItem minH="48px" display={router.pathname === "/questionBanks" ? "none" : ""}>
          <Text fontWeight="semibold" fontSize={{ base: "small", md: "small", lg: "md" }}>
            <Link href="/questionBanks">
              <a>Question Bank</a>
            </Link>
          </Text>
        </MenuItem>
        <MenuItem minH="48px" display={router.pathname === "/reviseCurrentAffair" ? "none" : ""}>
          <Text fontWeight="semibold" fontSize={{ base: "small", md: "small", lg: "md" }}>
            <Link href="/reviseCurrentAffair">
              <a>Search Notes</a>
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
