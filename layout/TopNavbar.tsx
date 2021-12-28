import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  BoxProps,
  Button,
  CloseButton,
  Flex,
  FlexProps,
  Heading,
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
import useSWR from "swr";
import { useAuthContext } from "../state/Authcontext";
import { useAppContext } from "../state/state";
import { supabase } from "../lib/supabaseClient";
import { Subheading } from "../types/myTypes";
import { BASE_URL } from "../lib/constants";

// const LinkItems: Array<Subheading> = [];

export default function TopNavbar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const shareContext = useAppContext();
  //**************************useSWR******************************************888 */
  // `data` will always be available as it's in `fallback`.
  // const { data, error } = useSWR(
  //   ["/headingId", shareContext.postHeadingId],
  //   async () => await supabase.from<Subheading>("subheadings").select("*").eq("main_topic_id", shareContext.postHeadingId)
  // );

  // if (error)
  //   return (
  //     <Box minH="100vh" bg="white.100">
  //       <div>
  //         <Alert status="error">
  //           <AlertIcon />
  //           <AlertTitle mr={2}>There is some Problem!</AlertTitle>
  //           <AlertDescription>Please try again after some time.</AlertDescription>
  //           <CloseButton position="absolute" right="8px" top="8px" />
  //         </Alert>
  //       </div>
  //     </Box>
  //   );
  // if (!data) return <div>loading...</div>;
  // LinkItems.length = 0;
  // if (data.data && data.data.length !== 0) {
  //   data.data!.map((x) => {
  //     LinkItems.push(x);
  //   });
  // }
  return (
    <Box minH="100vh" bg="white.500">
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
      bg={useColorModeValue("#f8f6fa", "#e5e0f1")}
      borderBottomWidth="1px"
      zIndex={1}
      pos="sticky"
      top={0}
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex" }}
      {...rest}
    >
      <LinkBox>
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
            boxSize={{ base: "35px", md: "50px" }}
          />
        </LinkOverlay>
      </LinkBox>

      <Heading as="h2" size="md" display={{ base: "none", md: "block" }}>
        Welcome to Qlook{" "}
      </Heading>
      <HStack spacing={{ base: "0", md: "6" }}>
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
                  <Avatar
                    size={"sm"}
                    src={
                      profile.avatar_url // change this to url from database avatar
                    }
                  />
                )}

                <VStack display={{ base: "none", md: "flex" }} alignItems="flex-start" spacing="1px" ml="2">
                  <Text fontSize="sm">{useAuthContext().profile?.email}</Text>
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
