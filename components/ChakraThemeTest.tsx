import { SearchIcon } from "@chakra-ui/icons";
import { Button, Checkbox, Flex, Heading, IconButton, Select, Text } from "@chakra-ui/react";
import React from "react";
import { MdShare } from "react-icons/md";

interface ChakraThemeTestProps {}

export const ChakraThemeTest: React.FunctionComponent<ChakraThemeTestProps> = ({}) => {
  return (
    <Flex m="24" gap="4" alignItems="center" direction="column" bg="#F7F5F2">
      <IconButton
        variant="icong"
        aria-label="Search database"
        // onClick={() => hellobhaidisdfsdfsdfsdfdhee()}
        icon={<MdShare />}
      />
      <br />
      <Button variant="solid">Theme</Button>
      <Checkbox>Checkbox</Checkbox>

      <Button>Theme2</Button>
      <Select>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </Select>
      <Heading as="h3">Heading</Heading>
      <Text as="i">Italic</Text>
      <IconButton aria-label="Search database" icon={<SearchIcon />} />
      <br />
      <Button>Theme</Button>
      <Button variant="outline">Outline</Button>
      <Select>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </Select>
      <Heading as="h3">Heading</Heading>
      <Text as="i">Italic</Text>
      <br />
    </Flex>
  );
};


function hellobhaidisdfsdfsdfsdfdhee(): void {
  throw new Error("Function not implemented.");
}

