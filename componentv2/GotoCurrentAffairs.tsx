import { Button } from "@chakra-ui/react";
import React from "react";
import { navigateTo } from "../lib/utils";

const GotoCurrentAffairs = () => {
  return <Button size="md" colorScheme="gray" onClick={() => navigateTo("/dna")}>Editable Current Affairs</Button>;
};

export default GotoCurrentAffairs;
