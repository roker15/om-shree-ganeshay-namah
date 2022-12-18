import { CloseIcon } from "@chakra-ui/icons";
import { Button, Flex, IconButton, Slide, Spacer, useDisclosure, VStack } from "@chakra-ui/react";
// you can use react-swipeable package to add swiping features
const Drawer1 = (props: { children: React.ReactNode; buttonText: string }) => {
  const { isOpen, onToggle } = useDisclosure();
  
  return (
    <>
      <Button onClick={onToggle} variant="outline" rounded={"none"}>
        {props.buttonText}
      </Button>
      {/* Imitation drawer below */}
      <Slide  direction="left" in={isOpen} style={{ height: "100vh", width: "350px", zIndex: 100 }}>
        <VStack bg="brand.50" h="100vh" w="350px" overflowY="auto">
          <Flex w="full" justifyContent={"space-between"}>
            <Spacer />
            <IconButton aria-label="Close Control Panel" icon={<CloseIcon />} onClick={onToggle} size="lg" variant="ghost" />
          </Flex>
          {props.children}
          <br/>
          <br/>
        </VStack>
      </Slide>
    </>
  );
};

export default Drawer1;
