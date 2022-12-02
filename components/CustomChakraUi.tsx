import {
  Button,
  Checkbox,
  CircularProgress,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  IconButton,
  Link,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import router from "next/router";
import React, { ChangeEvent } from "react";
import { IconType } from "react-icons";
import { MdMenu, MdSwitchRight } from "react-icons/md";
import Sticky from "react-sticky-el";

export const CustomIconButton = (props: {
  icon: IconType;
  isLoading: boolean;
  option: unknown | undefined;
  handleClick: () => void;
}) => {
  return (
    <IconButton
      size="xs"
      variant="ghost"
      aria-label="Call Sage"
      fontSize="20px"
      isLoading={props.isLoading}
      onClick={() => props.handleClick()}
      icon={<props.icon />}
    />
  );
};
export const CustomButton = (props: { label: string; state: boolean; changeState: (arg: boolean) => void }) => {
  return (
    <Checkbox
      size="sm"
      isChecked={props.state}
      onChange={(e) => props.changeState(e.target.checked)}
    >
      <Text as="label" casing="capitalize">
        {props.label}
      </Text>
    </Checkbox>
  );
};
export const CustomCheckBox = (props: { label: string; state: boolean; changeState: (arg: boolean) => void }) => {
  return (
    <Checkbox
      size="sm"
      isChecked={props.state}
      onChange={(e) => props.changeState(e.target.checked)}
    >
      <Text as="label" casing="capitalize">
        {props.label}
      </Text>
    </Checkbox>
  );
};

export function CustomSwitch(props: { state: boolean; changeState: (arg0: boolean) => void }) {
  return (
    <Switch
      size="sm"
      colorScheme="green" // defaultChecked={isPostPublic}
      isChecked={props.state as boolean}
      onChange={(e: ChangeEvent<HTMLInputElement>) => props.changeState(e.target.checked)}
    />
  );
}
export function LabelText(props: { label: string | undefined }) {
  return (
    <Text justifyContent="center" as="label" textTransform="capitalize">
      {props.label}
    </Text>
  );
}
export function BoldText(props: { label: string | undefined }) {
  return (
    <Text fontSize="md" as="b" casing="capitalize">
      {props.label}
    </Text>
  );
}
export function SpanTextWithBackground(props: { label: string | undefined }) {
  return (
    <Text p="2" as="span" bg="blackAlpha.700" fontSize="14px" color="gray.100">
      {props.label}
    </Text>
  );
}
export function CustomCircularProgress(props: { size: string }) {
  return <CircularProgress isIndeterminate size={props.size} color="gray.400" />;
}

export const CustomDrawer = (props: { children: React.ReactNode,buttonLabel:string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef(null);

  return (
    <>
      <Sticky>
      <Button
          aria-label="syllabus"
          variant="ghost"
          size="sm"
          leftIcon={<MdSwitchRight />}
          ref={btnRef}
          onClick={onOpen}
        >
          {props.buttonLabel}
        </Button>
      </Sticky>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          {/* <DrawerHeader>Create your account</DrawerHeader> */}

          <DrawerBody>{props.children}</DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
export const CustomDrawerWithButton = (props: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef(null);

  return (
    <>
      
      <Text
        fontWeight="semibold"
        fontSize={{ base: "small", md: "small",lg:"md" }}
        ref={btnRef}
        onClick={onOpen}
        cursor={"pointer"}
       
      >
          Select Syllabus
      </Text>
    
      <Drawer
        preserveScrollBarGap={true} // content will flicker if not use it.
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        size={{ base: "xs", sm: "sm", md: "md", lg: "lg" }}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          {/* <DrawerHeader>Create your account</DrawerHeader> */}

          <DrawerBody>{props.children}</DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
