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
    <Box minH="100vh" minW="full" bg="yellow.50" >
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
      bg="#faf8f8"
      borderBottomWidth="0px"
      zIndex={500}
      pos="sticky"
      mt={"0"}
      boxShadow="md"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex" }}
      {...rest}
    >
      <LinkBox>
        <LinkOverlay
          _hover={{
            background: "none",
            // color: "white",
          }}
          href="/"
        >
          <Image
            p="2"
            // bg="blackAlpha.100"
            // priority={true}
            loading="eager"
            src="/logo-150x150.png"
            alt="Logo"
            w={{ base: "80px", md: "110px" }}
            // w={{ base: "35px", md: "100px" }}
          />
        </LinkOverlay>
      </LinkBox>
      <Heading fontSize="xl" ml="16" as="em" size="md" color="blackAlpha.800" display={{ base: "none", md: "block" }}>
        {`India's first Online 📝Notes making Platform`}
      </Heading>{" "}
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
              <MenuList
                border="1px"
                bg={"pink.50"}
                borderColor={"pink.100"}
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
        )}
      </HStack>
    </Flex>
  );
};

const JoinTelegram = (
  <HStack alignItems={"center"} mx="2" px="2" py="0.5" bg="telegram.300">
    {" "}
    <Link color="white" href="https://t.me/+Rhiv7nfLc_pkZDM1" isExternal>
      Join Telegram
    </Link>
    <FaTelegram color="white" />
  </HStack>
);
