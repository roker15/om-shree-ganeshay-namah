import { Box, Button, Flex, Heading, Image, Stack, Text, useBreakpointValue } from "@chakra-ui/react";

export default function SplitScreen() {
  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={6} w={"full"} maxW={"lg"}>
          <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
            <Text
              as={"span"}
              position={"relative"}
              _after={{
                content: "''",
                width: "full",
                height: useBreakpointValue({ base: "20%", md: "30%" }),
                position: "absolute",
                bottom: 1,
                left: 0,
                bg: "blue.400",
                zIndex: -1,
              }}
            >
              Practice your Answer writing skill right here
            </Text>
            <br />{" "}
            <Text color={"blue.400"} as={"span"}>
              And keep it editing online - Until it gets perfect
            </Text>{" "}
          </Heading>
          <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
            Practice your answer writing skill with previous year Question Papers. Keep on editing your answer until you get
            it perfect, you can export it to PDF, or Print.
          </Text>
          <Stack direction={{ base: "column", md: "row" }} spacing={4}>
            <Button
              rounded={"full"}
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
            >
              Create Project
            </Button>
            <Button rounded={"full"}>How It Works</Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={4}>
        <Box boxShadow="md">
          <Image alt={"Login Image"} objectFit={"scale-down"} src={"https://hbvffqslxssdbkdxfqop.supabase.co/storage/v1/object/public/notes-images/2d0eb255-5b2e-4112-9260-3a3429858104-ed2.PNG"} />
        </Box>
      </Flex>
    </Stack>
  );
}
