import {
  Avatar,
  Box, HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList, Text
} from "@chakra-ui/react";
import React from "react";
import { useAuthContext } from "../state/Authcontext";
import { FiChevronDown } from "react-icons/fi";

export const AvatarMenu = () => {
  const { profile, signOut } = useAuthContext();

  return (
    <Menu boundary="clippingParents">
      <MenuButton border="0px" py={2} transition="all 0.3s" _focus={{ boxShadow: "none" }}>
        <HStack>
          {!profile?.avatar_url ? (
            <Avatar size={"sm"} src="https://bit.ly/broken-link" />
          ) : (
            <Avatar
              size={"sm"}
              src={profile?.avatar_url! // change this to url from database avatar
              } />
          )}

          <Box display={{ base: "none", md: "flex" }}>
            <FiChevronDown />
          </Box>
        </HStack>
      </MenuButton>
      {profile && (
        <MenuList bg={"gray.50"}>
          <Text pl="4">{profile?.username}</Text>
          <Text as="label" pl="4">
            {profile?.email}
          </Text>

          <div>
            {" "}
            <MenuDivider />
            <MenuItem pl="4" border="0px" onClick={() => signOut("vv")}>
              Sign out
            </MenuItem>
          </div>
        </MenuList>
      )}
    </Menu>
  );
};
