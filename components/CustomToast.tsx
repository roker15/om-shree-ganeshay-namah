import { createStandaloneToast, Box,Center,Tag } from "@chakra-ui/react";

const toast = createStandaloneToast();
interface CustomtoastProps {
  title: string;
  position?: "bottom-right" | "top" | "top-right" | "top-left" | "bottom" | "bottom-right" | "bottom-left";
  status: "success" | "error" | "warning" | "info";
  variant?: "solid" | "subtle" | "left-accent" | "top-accent";
  duration?: 3000;
  isClosable?: true;
}
export function customToast({ title, position, status, variant, duration, isClosable }: CustomtoastProps) {

  return toast({
    title,
    position:"top",
    status,
    variant,
    duration,
    isClosable,
    //   render: () => (
    //     <Box borderRadius="full" color='blackAlpha.900' mt="40" pl="16" py="4" bg='gray.500'>
    //       {title}
    //     </Box>
    //   ),
  });
}
