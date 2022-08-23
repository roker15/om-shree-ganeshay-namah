import { Button } from "@chakra-ui/react";
import { useAuthContext } from "../state/Authcontext";

export const LoginCard = ({ redirect }: { redirect: string }) => {
  const { signInWithgoogle, signOut, profile } = useAuthContext();
  return (
    <Button
      colorScheme={"gray"}
      size="md"
      px={10}
      borderRadius="full"
      variant="outline"
      onClick={() => signInWithgoogle(redirect)}
    >
      Login
    </Button>
  );
};
