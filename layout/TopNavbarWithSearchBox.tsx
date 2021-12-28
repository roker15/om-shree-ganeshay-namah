import {
  Avatar,
  Box,
  Button,
  Flex,
  FlexProps,
  HStack,
  Image,
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
import React, { ReactNode } from "react";
import { FaGoogle } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import SubjectSearch from "../components/SubjectSearch";
import { BASE_URL } from "../lib/constants";
import { supabase } from "../lib/supabaseClient";
import { useAuthContext } from "../state/Authcontext";
import { useAppContext } from "../state/state";

// const LinkItems: Array<Subheading> = [];

export default function TopNavbarWithSearchBox({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const shareContext = useAppContext();

  return (
    <Box minH="100vh" bg="white.100">
      <MobileNav onOpen={onOpen} />
      {children}
    </Box>
  );
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { signIn, signInWithgoogle, signOut, profile } = useAuthContext();
  return (
    <Flex
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
            loading="eager"
            src="/logo-150x150.png"
            alt="Picture of the author"
            boxSize={{ base: "0px", md: "50px" }}
            objectFit="contain"
          />
        </LinkOverlay>
      </LinkBox>
      <Box bg="lavender" p="0.5" m="2" w="xl">
        <SubjectSearch />
      </Box>
      <HStack spacing={{ base: "0", md: "6" }}>
        {supabase.auth.session() === null ? (
          <Button
            border="0px"
            colorScheme="google"
            leftIcon={<FaGoogle />}
            variant="ghost"
            onClick={() => signInWithgoogle(BASE_URL)}
          >
            Sign in
          </Button>
        ) : (
          ""
        )}
        <Flex border="0px" alignItems={"center"}>
          <Menu boundary="clippingParents">
            <MenuButton border="0px" py={2} transition="all 0.3s" _focus={{ boxShadow: "none" }}>
              <HStack>
                {!profile ? (
                  <Avatar size={"sm"} src="https://bit.ly/broken-link" />
                ) : (
                  <Avatar size={"sm"} src={profile.avatar_url} />
                )}

                <VStack display={{ base: "none", md: "flex" }} alignItems="flex-start" spacing="1px" ml="2">
                  {profile ? <Text fontSize="sm">{profile.email}</Text> : null}
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
