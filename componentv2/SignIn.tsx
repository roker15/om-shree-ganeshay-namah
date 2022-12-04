import { Center, Button, Text } from "@chakra-ui/react";
import React from "react";
import { AvatarMenu } from "../layout/AvatarMenu";
import { BASE_URL } from "../lib/constants";
import { navigateTo } from "../lib/utils";
import { useAuthContext } from "../state/Authcontext";

export const SignIn = () => {
  const { profile, signInWithgoogle } = useAuthContext();
  return (
    <div>
      {" "}
      <Center  gap="2">
        <Button size="md" colorScheme={"yellow"} bg="#FAF089" onClick={() => navigateTo("/")}>
          Create Notes
        </Button>
        {!profile ? (
          <Text
            cursor={"pointer"}
            onClick={() => {
              signInWithgoogle(`${BASE_URL}/manageSyllabus`);
            }}
            color="#ffffff"
          >
            Sign In
          </Text>
        ) : (
          <AvatarMenu />
        )}
      </Center>
    </div>
  );
};

export default SignIn;
