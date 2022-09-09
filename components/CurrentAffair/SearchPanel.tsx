import { Search2Icon } from "@chakra-ui/icons";
import { Button, Container, Input, InputGroup, InputLeftAddon, InputRightElement } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const SearchPanel = (props: { handledata: (x: string | undefined) => void }) => {
  const [value, setValue] = useState<string>("");
  const [searchKey, setsearchKey] = useState<string>("");

  const handleSubmit = (e?: any) => {
    e.preventDefault();
    // if (e.key === "Enter") {
    setsearchKey(value);
    props.handledata(value);
  };
  // }
  // useEffect(() => {
  //   props.handledata(searchKey);
  // }, [props, searchKey]);

  return (
    <Container maxW="2xl">
   
      <form onSubmit={handleSubmit}>
        <InputGroup boxShadow={"md"}>
          <InputLeftAddon display={["none", "undefined"]} color="white" bg="blackAlpha.500">
            <Search2Icon />
          </InputLeftAddon>
          <Input
            value={value}
            bg="blackAlpha.200"
            focusBorderColor={"blackAlpha.300"}
            // borderColor={"blackAlpha.500"}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Type keywords and 'Press ENTER'"
          />

          <InputRightElement width="7.5rem">
            <Button type="submit" colorScheme={"blackAlpha"}>
              Search Notes
            </Button>
          </InputRightElement>
        </InputGroup>
      </form>
    </Container>
  );
};

export default SearchPanel;
