import { Button, createStandaloneToast } from "@chakra-ui/react";
import { MdMessage } from "react-icons/md";

const { ToastContainer, toast } = createStandaloneToast();
interface CustomtoastProps {
  title: string;
  status: "success" | "error" | "warning" | "info";
  isUpdating?: boolean;
}
export function customToast({ title, status, isUpdating }: CustomtoastProps) {
  if (isUpdating) {
    return toast({
      title,
      position: "top",
      status,
      variant: "solid",
      duration: 5000,
      isClosable: true,
      render: () => (
        <Button
          rightIcon={<MdMessage />}
          fontSize={"md"}
          fontFamily="Helvetica"
          fontWeight="normal"
          ml="40"
          mb="16"
          p="2"
          borderRadius={"full"}
        >
          {title}
        </Button>
      ),
    });
  }
  return toast({
    title,
    position: "top",
    status,
    duration: 3000,
  });
}
