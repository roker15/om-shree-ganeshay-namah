import {
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
import Image from "next/image";
import router from "next/router";
import React, { ReactNode, ReactText } from "react";
import { FaGoogle } from "react-icons/fa";
import { FiBell, FiChevronDown } from "react-icons/fi";
import useSWR from "swr";
import SubjectSearch from "../components/SubjectSearch";
import { useAuthContext } from "../context/Authcontext";
import { useAppContext } from "../context/state";
import { supabase } from "../lib/supabaseClient";
import { Subheading } from "../types/myTypes";

interface LinkItemProps {
  name: string;
  // icon: IconType;
  icon: number;
}
const LinkItems: Array<Subheading> = [];

export default function TopNavbar({ children }: { children: ReactNode }) {
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

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

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

      {/* <Heading color="black">?LOOK<span>&#128512;</span></Heading> */}

      <Heading as="h2" size="md">
        Welcome to Qlook{" "}
      </Heading>
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
                  <Text fontSize="sm">{useAuthContext().username}</Text>
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
