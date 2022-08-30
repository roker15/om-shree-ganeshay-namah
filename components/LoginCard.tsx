import { Button } from "@chakra-ui/react";
import { useAuthContext } from "../state/Authcontext";

export const LoginCard = ({ redirect }: { redirect: string }) => {
  const { signInWithgoogle, signOut, profile } = useAuthContext();
  return (
    <Button
      colorScheme={"facebook"}
      size="md"
      px={10}
      borderRadius="none"
      variant="solid"
      onClick={() => signInWithgoogle(redirect)}
    >
      Login
    </Button>
  );
};
