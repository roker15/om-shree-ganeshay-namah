import { Badge, Button, Code, createStandaloneToast, Tag } from "@chakra-ui/react";
import { MdMessage, MdShare } from "react-icons/md";

const toast = createStandaloneToast();
interface CustomtoastProps {
  title: string;
  position?: "bottom-right" | "top" | "top-right" | "top-left" | "bottom" | "bottom-right" | "bottom-left";
  status: "success" | "error" | "warning" | "info";
  variant?: "solid" | "subtle" | "left-accent" | "top-accent";
  duration?: 2000;
  isClosable?: true;
  isUpdating: boolean;
}
export function customToast({ title, position, status, variant, duration, isClosable, isUpdating }: CustomtoastProps) {
  if (isUpdating) {
    return toast({
      title,
      position: "bottom-right",
      status,
      variant,
      duration: 5000,
      isClosable,
      render: () => (
        <Button
          rightIcon={<MdMessage />}
          fontSize={"md"}
          fontFamily="Helvetica"
          fontWeight="normal"
          ml="40"
          mb="16"
          p="2"
          colorScheme={"yellow"}
          borderRadius={"full"}
        >
          {title}
        </Button>
      ),
    });
  }
  return toast({
    title,
    position: "bottom",
    status,
    variant,
    duration: 2000,
    isClosable,
  });
}
