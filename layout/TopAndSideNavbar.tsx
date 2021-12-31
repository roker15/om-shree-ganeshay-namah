import {
  Avatar, Box,
  BoxProps,
  Button, Center, CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps, FormLabel, HStack,
  IconButton, Image, Link,
  LinkBox,
  LinkOverlay, ListItem,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList, Spinner, Switch, Text,
  UnorderedList,
  useColorModeValue,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
// import Image from "next/image";
import React, { ChangeEvent, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { FiChevronDown, FiMenu } from "react-icons/fi";
import ErrorAlert from "../components/ErrorAlert";
import { useGetSubheadingsFromHeadingId } from "../customHookes/useUser";
import { BASE_URL } from "../lib/constants";
import { useAuthContext } from "../state/Authcontext";
import { usePostContext } from "../state/PostContext";
import { useAppContext } from "../state/state";
import { Subheading } from "../types/myTypes";

const LinkItems: Array<Subheading> = [];

export default function TopAndSideNavbar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hideSidebar, setHideSidebar] = useState(false);
  const { currentHeadingId, updateCurrentHeadingId } = usePostContext();
  const { data, isLoading, supError, swrError } = useGetSubheadingsFromHeadingId(currentHeadingId);


  if (swrError)
    return (
      <Box minH="100vh" bg="white.100">
        <ErrorAlert description={"Failed to load, check network connection!!"} alertType={"error"}></ErrorAlert>
      </Box>
    );
  if (!data) {
    return (
      <Box minH="100vh" bg="white.100">
        <Center h="100vh">
          <Spinner />
        </Center>
      </Box>
    );
  }
  if (supError) {
    console.log("SUP_TOPANDSIDENAVBAR_1", supError); //for debug
    return <ErrorAlert description={"Server error, Error code: SUP_TOPANDSIDENAVBAR_1"} alertType={"error"}></ErrorAlert>;
  }
  LinkItems.length = 0;
  if (data && data.length !== 0) {
    data.map((x) => {
      LinkItems.push(x);
    });
  }

  return (
    <Box
      minH="100vh"
      // bg={useColorModeValue("blue.100", "blue")} // this is for toggling dark mode
      bg="green.100"
    >
      {/* mobilenav */}
      <TopBar setHideSidebar={setHideSidebar} onOpen={onOpen} hideSidebar={hideSidebar} />

      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: hideSidebar ? "none" : "table" }}
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

      <Box mt={"16"} bg="white" ml={{ base: 0, md: hideSidebar ? 0 : "80" }} p="4">
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
      pb="36" //added by me
      overflowY="scroll"
      {...rest}
    >
      <Flex h="20" alignItems="center" mt="8" mb="8" mx="2" >
        <Text  p="4" mx="2" color="blue.600" bg="blue.50" fontSize="lg" fontWeight="medium">
          {postContext.currentHeadingname}
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      {LinkItems && LinkItems.length !== 0 ? (
        LinkItems.sort((a, b) => a.sequence! - b.sequence!).map((subheading) => (
          <UnorderedList key={subheading.id}>
            <ListItem ml="6">
              <Text
                fontWeight="medium"
                mt="4"
                mr="2"
                pl="2"
                onClick={() => {
                  // postContext.updateCurrentSubheadingId(value.id);
                  postContext.updateCurrentSubheadingProps(subheading.id, subheading.topic as string);
                  postContext.updateCurrentSubheadingId(subheading.id);
                  postContext.updateCurrentSubheading(subheading.topic as string);
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

interface MobileProps extends FlexProps {
  onOpen: () => void;
  setHideSidebar: Dispatch<SetStateAction<boolean>>;
  hideSidebar: boolean;
}

const TopBar = ({ hideSidebar, setHideSidebar, onOpen, ...rest }: MobileProps) => {
  const { profile, signInWithgoogle, signOut } = useAuthContext();
  const postContext = usePostContext();
  return (
    <Flex
      // ml={{ base: 10, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="16"
      width="full"
      alignItems="center"
      // bg={useColorModeValue("#f8f6fa", "#e5e0f1")}
      bg="white"
      borderBottomWidth="1px"
      zIndex={40}
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
      <HStack>
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
              alt="logo"
              boxSize={{ base: "0px", md: "50px" }}
              objectFit="contain"
            />
          </LinkOverlay>
        </LinkBox>
        <Box display={{ base: "none", md: "inline-flex" }}>
          <FormLabel fontSize="sm" fontStyle="normal" htmlFor="email-alerts" mb="0">
            {hideSidebar ? "Show side panel" : "Hide Side Panel"}
          </FormLabel>
          <Switch
            size="sm"
            colorScheme="blue"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setHideSidebar(e.target.checked)}
            id="email-alerts"
          >
            {/* Hide side bar */}
          </Switch>
        </Box>
      </HStack>

      {/* <Image  boxSize="50px" objectFit="fill" src="vercel.svg" alt="Segun Adebayo" /> */}
      <Text
        isTruncated
        // noOfLines={1}
        justifyContent={{ base: "space-between", md: "flex" }}
        align="left"
        display={{ base: "flex", md: "flex-start" }}
        fontSize={{ base: "sm", md: "xl" }}
        // fontFamily="monospace"
        fontWeight="bold"
        color="gray.600"
        mx="2"
      >
        {postContext.currentPapername}
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        {/* <button onClick={() => setLanguage("jp")}>sign in</buttonb> */}
        {!profile ? (
          <Button
            border="0px"
            colorScheme="google"
            leftIcon={<FaGoogle />}
            variant="ghost"
            onClick={() => signInWithgoogle(BASE_URL)}
          >
            Sign in
          </Button>
        ) : null}

        {/* <IconButton size="sm" variant="outline" aria-label="open menu" icon={<FiBell />} /> */}
        <Flex border="0px" alignItems={"center"}>
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
      </HStack>
    </Flex>
  );
};
