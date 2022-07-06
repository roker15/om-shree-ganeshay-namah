import { Checkbox, CircularProgress, Switch, Text } from "@chakra-ui/react";
import React, { ChangeEvent } from "react";

export const CustomCheckBox = (props: { label: string; state: boolean; changeState: (arg: boolean) => void }) => {
  return (
    <Checkbox
      size="sm"
      colorScheme="gray"
      outlineColor={"red.600"}
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
      colorScheme="gray" // defaultChecked={isPostPublic}
      isChecked={props.state as boolean}
      onChange={(e: ChangeEvent<HTMLInputElement>) => props.changeState(e.target.checked)}
    />
  );
}
export function CustomLabelText(props: { label: string }) {
  return (
    <Text justifyContent="center" as="label" textTransform="capitalize">
      {props.label}
    </Text>
  );
}
export function CustomCircularProgress(props: { size: string }) {
  return <CircularProgress isIndeterminate size={props.size} color="gray.400" />;
}
