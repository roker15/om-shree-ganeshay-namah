import { Button, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { BASE_URL } from "../lib/constants";
import { useAuthContext } from "../state/Authcontext";

export const LoginCard = ({ redirect }: { redirect: string }) => {
  const { signInWithgoogle, signOut, profile } = useAuthContext();
  return (
    <Text color="gray.600" fontSize="md" casing="capitalize">
      Your are not Logged In Please{" "}
      <Button colorScheme={"green"} variant="solid" onClick={() => signInWithgoogle(redirect)}>
        Login
      </Button>{" "}
      To View Content
    </Text>
  );
};
