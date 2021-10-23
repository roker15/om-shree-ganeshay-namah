import {
  Image,
  Avatar,
  Badge,
  Box,
  BoxProps,
  Button,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  HStack,
  IconButton,
  Link,
  LinkBox,
  LinkOverlay,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Tag,
  Text,
  UnorderedList,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
// import Image from "next/image";
import React, { ReactNode, ReactText } from "react";
import { FaGoogle } from "react-icons/fa";
import { FiBell, FiChevronDown, FiMenu } from "react-icons/fi";
import styled from "styled-components";
import useSWR from "swr";
import { useAuthContext } from "../context/Authcontext";
import { usePostContext } from "../context/PostContext";
import { useAppContext } from "../context/state";
import { supabase } from "../lib/supabaseClient";
import { Subheading } from "../types/myTypes";

interface LinkItemProps {
  name: string;
  // icon: IconType;
  icon: number;
}
const RedLink = styled.a`
  /* background-color: #f44336; */
  color: #181717;
  /* padding: 14px 25px; */
  /* text-align: center; */
  text-decoration: none !important;
  /* display: inline-block; */
  &:hover {
    color: #080808;
    background-color: #ffffff;
    text-decoration: none !important;
  }
`;
const LinkItems: Array<Subheading> = [];

export default function TopAndSideNavbar({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [subheading, setSubheading] = useState(0);
  const { postHeadingId } = useAppContext();
  const { signUp, signOut, signIn } = useAuthContext();
  // setSubheading(shareContext.postHeadingId);
  //**************************useSWR******************************************888 */
  // `data` will always be available as it's in `fallback`.
  const { currentHeadingId, updateCurrentHeadingId } = usePostContext();
  console.log("current heading is ", currentHeadingId);

  const { data, error } = useSWR(
    currentHeadingId == undefined ? null : ["/headingId", currentHeadingId],
    async () =>
      await supabase
        .from<Subheading>("subheadings")
        .select("*")
        .eq("main_topic_id", currentHeadingId)
    // { refreshInterval: 1000 }
  );

  // return <h1>{data.title}</h1>;
  if (error)
    return (
      <Box minH="100vh" bg="white.100">
        <div>failed to load</div>
      </Box>
    );
  if (!data) {
    // updateCurrentHeadingId(
    //   Number(
    //     // JSON.parse(
    //       window.localStorage.getItem("currentSubheadingId") as string
    //     // )
    //   )
    // )
    return <div>loading...</div>;
  }
  LinkItems.length = 0;
  if (data.data && data.data.length !== 0) {
    data.data!.map((x) => {
      LinkItems.push(x);
      console.log("subheadings are ", x);
    });
  }

  return (
    <Box
      minH="100vh"
      // bg={useColorModeValue("blue.100", "blue")} // this is for toggling dark mode
      bg="green.100"
    >
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />

      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "table" }}
        _hover={{ display: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent mt={"16"}>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <Box mt={"16"} bg="white" ml={{ base: 0, md: "80" }} p="4">
        {children}
        {/* {shareContext.postHeadingId} */}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const postContext = usePostContext();
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: "80" }}
      pos="fixed"
      h="full"
      pb="20" //added by me
      overflowY="scroll"
      {...rest}
    >
      <Flex
        h="20"
        alignItems="center"
        mb="8"
        mx="8"
        justifyContent="space-between"
      >
        <Text as="u" color="darkviolet" fontSize="normal" fontWeight="bold">
          {postContext.currentHeadingname}
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      {LinkItems && LinkItems.length !== 0 ? (
        LinkItems.map((subheading) => (
          <UnorderedList key={subheading.id}>
            <ListItem ml="6">
              <Text
                // bg="InactiveCaptionText"
                lineHeight="shorter"
                fontWeight="bold"
                fontSize="medium"
                fontStyle=""
                // textShadow="1px 0px 1px "
                // ml="6"
                mt="4"
                mr="2"
                pl="2"
                onClick={() => {
                  // postContext.updateCurrentSubheadingId(value.id);
                  postContext.updateCurrentSubheadingId(subheading.id);
                  postContext.updateCurrentSubheading(
                    subheading.topic as string
                  );
                  onClose();
                }}

                // href={`/posts/${encodeURIComponent(subheading.id)}`}
              >
                <Link>{subheading.topic}</Link>

                {/* </Button> */}
              </Text>
            </ListItem>
          </UnorderedList>
        ))
      ) : (
        <div>no data</div>
      )}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  // icon: IconType;
  icon: number;
  children: ReactText;
}
// const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
//   return (
//     <Link href={`/blog/${encodeURIComponent(post.slug)}`}>
//       <a>{post.title}</a>
//     </Link>
//   );
// };

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { signIn, signUp, signOut } = useAuthContext();
  const postContext = usePostContext();
  return (
    <Flex
      // ml={{ base: 10, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="16"
      width="full"
      alignItems="center"
      bg={useColorModeValue("#f8f6fa", "#e5e0f1")}
      borderBottomWidth="1px"
      zIndex={9999}
      pos="fixed"
      top={0}
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex" }}
      {...rest}
    >
      {/* this portion is for navigation close button of side bar */}
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <LinkBox pt="2">
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
            boxSize={{ base: "0px", md: "50px" }}
            // w={{ base : "50", md: "40" }}
            // h={{ base: 50, md: 40 }}
            // layout="fill"
            objectFit="contain"
          />
        </LinkOverlay>
      </LinkBox>

      {/* <Image  boxSize="50px" objectFit="fill" src="vercel.svg" alt="Segun Adebayo" /> */}
      <Text
        isTruncated
        // noOfLines={1}
        justifyContent={{ base: "space-between", md: "flex" }}
        align="left"
        display={{ base: "flex", md: "flex-start" }}
        fontSize={{ base: "large", md: "xl" }}
        // fontFamily="monospace"
        fontWeight="bold"
        color="gray.600"
      >
        {postContext.currentPapername}
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        {/* <button onClick={() => setLanguage("jp")}>sign in</buttonb> */}
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

        {/* <IconButton size="sm" variant="outline" aria-label="open menu" icon={<FiBell />} /> */}
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
