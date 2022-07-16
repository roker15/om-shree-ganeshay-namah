import { Flex, Container,Image, Heading, Stack, Text, Button, Icon, IconProps, Box } from "@chakra-ui/react";
import EditorForFrontPage from "./EditorForFrontPage";

export default function CallToActionWithIllustration() {
  return (
    <Container maxW={"5xl"}>
      <Stack textAlign={"center"} align={"center"} spacing={{ base: 8, md: 10 }} py={{ base: 20, md: 28 }}>
        <Heading fontWeight={700} fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }} lineHeight={"110%"}>
          Practice Your Answer Writing Right here <br />
          <Text as={"span"} color={"blue.400"}>
            And Edit your Answer till it gets perfect
          </Text>
        </Heading>
        <Text color={"gray.500"} maxW={"3xl"}>
          Create Rich colourful Content and Save to our cloud, you can access your notes even after 10 years.
        </Text>
        <Stack spacing={6} direction={"row"}>
          <Button rounded={"full"} px={6} colorScheme={"orange"} bg={"blue.400"} _hover={{ bg: "orange.500" }}>
            Get started
          </Button>
          <Button rounded={"full"} px={6}>
            Learn more
          </Button>
        </Stack>
        <Flex w={"full"}>
          <Box boxShadow="md">
            <Image
              alt={"Login Image"}
              objectFit={"scale-down"}
              src={
                // "https://hbvffqslxssdbkdxfqop.supabase.co/storage/v1/object/public/notes-images/2d0eb255-5b2e-4112-9260-3a3429858104-ed2.PNG"
                "https://i.imgur.com/olC6Os3.png"
              }
            />
          </Box>
        </Flex>
      </Stack>
    </Container>
  );
}
