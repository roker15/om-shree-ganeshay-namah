import { CloseIcon } from "@chakra-ui/icons";
import { Slide, Button, VStack, Box, Flex, Heading, IconButton, useDisclosure, Input } from "@chakra-ui/react";
import { useRef, useState } from "react";

const DesktopMenu = () => {
  const { isOpen, onToggle } = useDisclosure();
  const btnRef = useRef(null);
  return (
    <>
      <div style={{ position: "absolute", left: "5px", top: "5px", zIndex: "100" }}>
        <Button ref={btnRef} colorScheme="teal" onClick={onToggle}>
          Controls
        </Button>
      </div>
      <Slide direction="left" in={isOpen} style={{ height: "100vh", width: "300px", zIndex: 100 }}>
        <Box bg="gray.100" rounded="md" h="100vh" w="300px"  shadow="xl">
          <IconButton mr="2" mt="2" aria-label="Close Control Panel" icon={<CloseIcon />} onClick={onToggle} color="black" />
          <VStack color="black" bg="white">
            <Box p={5} shadow="md" borderWidth="1px" m="5px" >
              <Input></Input>
              <Input></Input>
              <Input></Input>
              <Input></Input>
              <Input></Input>
           
            </Box>

          </VStack>
        </Box>
      </Slide>
    </>
  );
};

export default DesktopMenu;
