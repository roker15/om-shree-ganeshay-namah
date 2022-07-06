import { Button, Text } from "@chakra-ui/react";
import { BASE_URL } from "../lib/constants";
import { useAuthContext } from "../state/Authcontext";
export function LoginCard() {
  const { signInWithgoogle, signOut, profile } = useAuthContext();
  return (
    <Text color="gray.600" fontSize="md" casing="capitalize">
      Your are not Logged In Please{" "}
      <Button colorScheme={"green"} variant="solid" onClick={() => signInWithgoogle(BASE_URL)}>
        Login
      </Button>{" "}
      To View Content
    </Text>
  );
}
