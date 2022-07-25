import { Button, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { BASE_URL } from "../lib/constants";
import { useAuthContext } from "../state/Authcontext";

export const LoginCard = ({ redirect }: { redirect: string }) => {
  const { signInWithgoogle, signOut, profile } = useAuthContext();
  return (
    <Button
      colorScheme={"facebook"}
      size="md"
      px={10}
      borderRadius="full"
      variant="solid"
      onClick={() => signInWithgoogle(redirect)}
      // _hover={{
      //   bg: "gray.700",
      //   color:"white"
      // }}
    >
      Login
    </Button>
  );
};
