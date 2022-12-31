import { ArrowRightIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import React from "react";
import { navigateTo } from "../lib/utils";

const GotoCurrentAffairs = () => {
  return <Button size="md" fontWeight={"normal"} colorScheme="yellow" onClick={() => navigateTo("/dna")} rightIcon={<ArrowRightIcon/> }>Editable Current Affairs</Button>;
};

export default GotoCurrentAffairs;
