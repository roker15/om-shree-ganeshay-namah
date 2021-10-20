import {
  Avatar,
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
import Image from "next/image";
import React, { ReactNode, ReactText } from "react";
import { FaGoogle } from "react-icons/fa";
import { FiBell, FiChevronDown } from "react-icons/fi";
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
  if (!data) return <div>loading...</div>;
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
        display={{ base: "none", md: "block" }}
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
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <Box mt={"16"} bg="white" ml={{ base: 0, md: 80 }} p="4">
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
      pb="20"//added by me
      overflowY="scroll"
      {...rest}
    >
      <Flex h="20" alignItems="center" mb="8" mx="8" justifyContent="space-between">
        <Text as="u" color="darkviolet" fontSize="normal"  fontWeight="bold">
          {postContext.currentHeadingname}
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      {LinkItems && LinkItems.length !== 0 ? (
        LinkItems.map((subheading) => (
          <Text
            // bg="ghostwhite"
            lineHeight="shorter"
            fontWeight="bold"
            fontSize="medium"
            fontStyle=""
            key={subheading.id}
            // textShadow="1px 0px 1px " 
            ml="6"
            mt="4"
            mr="2"
            
            pl="2"
            onClick={() => {
              // postContext.updateCurrentSubheadingId(value.id);
              postContext.updateCurrentSubheadingId(subheading.id);
              postContext.updateCurrentSubheading(subheading.topic as string);
            }}

            // href={`/posts/${encodeURIComponent(subheading.id)}`}
          >
            <Link textDecoration="pink">{subheading.topic}</Link>

            {/* </Button> */}
          </Text>
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
      <LinkBox pt="2">
        <LinkOverlay
          _hover={{
            background: "none",
            color: "white",
          }}
          href="/"
        >
          <Image
            priority={true}
            src="/logo-150x150.png"
            alt="Picture of the author"
            width={50}
            height={50}
            // layout="fill"
            // objectFit="scale-down"
          />
        </LinkOverlay>
      </LinkBox>

      {/* <Image  boxSize="50px" objectFit="fill" src="vercel.svg" alt="Segun Adebayo" /> */}
      <Text
        justifyContent={{ base: "space-between", md: "flex" }}
        align="left"
        display={{ base: "flex", md: "flex-start" }}
        fontSize="2xl"
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

        <IconButton
          size="sm"
          variant="outline"
          aria-label="open menu"
          icon={<FiBell />}
        />
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
                  <Avatar
                    size={"sm"}
                    src={
                      "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                    }
                  />
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
              <MenuItem border="0px">Billing</MenuItem>
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
