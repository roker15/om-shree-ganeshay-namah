import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  FlexProps,
  Heading,
  HStack,
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
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { FaGoogle, FaTelegram, FaWhatsapp } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { BASE_URL } from "../lib/constants";
import { useAuthContext } from "../state/Authcontext";

// const LinkItems: Array<Subheading> = [];

export default function TopNavbar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    //overflowx = hidden is because body was visible in mobile view. test is again and then
    // finalize
    <Box minH="100vh" minW="full" bg="#ffffff">
      <MobileNav onOpen={onOpen} />
      {children}
    </Box>
  );
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { signInWithgoogle, signOut, profile } = useAuthContext();
  return (
    <Flex
      // ml={{ base: 10, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="16"
      alignItems="center"
      // bg={useColorModeValue("#f8f6fa", "#e5e0f1")}
      // bg="#faf8f8"
      borderBottomWidth="0px"
      zIndex={500}
      pos="sticky"
      mt={"0"}
      // boxShadow="md"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex" }}
      {...rest}
    >
      <LinkBox  alignItems="center" display={{ base: "none", sm: "flex" }}>
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
          src="/logo-150x150.png"
          alt="Logo"
          w={{ base: "80px", md: "90px" }}
          // w={{ base: "35px", md: "100px" }}
        />
      </LinkBox>
      <GotoQuestion />

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
              <MenuList border="1px" bg={"pink.50"} borderColor={"pink.100"}>
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
  return (
    <Stack direction={{ base: "column", sm: "row" }} justifyContent={"start"} spacing={{ base: "-0.5", sm: "6" }}>
      <Text as="b" display={router.pathname === "/" ? "none" : ""}>
        <Link href="/">
          <a>Home</a>
        </Link>
      </Text>
      <Text as="b" display={router.pathname === "/questionBanks" ? "none" : ""}>
        <Link href="/questionBanks">
          <a>Question Bank</a>
        </Link>
      </Text>
      <Text as="b" display={router.pathname === "/reviseCurrentAffair" ? "none" : ""}>
        <Link href="/reviseCurrentAffair">
          <a>Current Affair</a>
        </Link>
      </Text>
    </Stack>
  );
}
