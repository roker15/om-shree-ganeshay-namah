import { Container } from "@chakra-ui/react";
import Home from ".";
import All from "../components/chakraTemplate/All";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import PageWithLayoutType from "../types/pageWithLayout";

const SyllabusSwitch: React.FunctionComponent = () => {
  return (
    <>
      <Container maxW={"full"} py={12} bg="white">
        <All />
      </Container>
    </>
  );
};

(SyllabusSwitch as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default SyllabusSwitch;
