import { SearchIcon } from "@chakra-ui/icons";
import { Button, Checkbox, Flex, Heading, IconButton, Radio, RadioGroup, Select, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { MdShare } from "react-icons/md";

interface ChakraThemeTestProps {}

const ChakraThemeTest: React.FunctionComponent<ChakraThemeTestProps> = ({}) => {
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
      <RadioGroup >
      <Stack direction='row'>
        <Radio value='1'>First</Radio>
        <Radio value='2'>Second</Radio>
        <Radio value='3'>Third</Radio>
      </Stack>
    </RadioGroup>
      <Button>Theme2</Button>
     
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
      
      
      <br />
    </Flex>
  );
};

export default ChakraThemeTest;