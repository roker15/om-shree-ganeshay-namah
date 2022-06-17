import {
  TableContainer,
  Text,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  UnorderedList,
  ListItem,
  Box,
  Wrap,
} from "@chakra-ui/react";
import React from "react";

function LandingPageTable() {
  return (
    <Box maxW="4xl" pb="4">
      {/* <TableContainer overflowX="hidden"> */}
      <Text bg="blackAlpha.700" pl="2" color="white" fontSize="2xl">
        Why you should make your notes online?
      </Text>
      <Table size="lg" variant="striped">
        {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}

        <Tbody>
          <Tr>
            <Td>
              <UnorderedList spacing={"4"}>
                <ListItem>
                  Digital notes becomes better and concise by the time but hard copy remains almost same because it can not
                  be edited.
                </ListItem>
                <ListItem>Digital Notes are easy to store and to carry anywhere.</ListItem>
                <ListItem>
                  Digital Notes can be retrieved even after 10 years but hard copy notes can be lost easily.
                </ListItem>
              
                <ListItem>Maps, Images and videos can be inserted very easily in digital notes.</ListItem>
                <ListItem>
                  Reading and revision of digital notes are super easy with the help of mobile, tablets and computer.
                </ListItem>
              </UnorderedList>
            </Td>
            <Td>
              <UnorderedList spacing={"4"}>
                <ListItem>
                डिजिटल नोट्स समय के साथ बेहतर और संक्षिप्त होते जाते हैं लेकिन हार्ड कॉपी नोट्स समय के साथ लगभग एक जैसे ही रहते हैं
                  क्योंकि इसे एडिट नहीं किया जा सकता है।
                </ListItem>
                <ListItem>डिजिटल नोट्स को स्टोर करना और कहीं भी ले जाना आसान है।</ListItem>
                <ListItem>
                  डिजिटल नोट 10 साल बाद भी प्राप्त किए जा सकते हैं लेकिन हार्ड कॉपी नोट आसानी से खो सकते हैं।
                </ListItem>

                <ListItem>डिजिटल नोट्स में मानचित्र, फोटो और वीडियो को बहुत आसानी से डाला जा सकता है।</ListItem>
                <ListItem>मोबाइल, टैबलेट और लैपटॉप की मदद से डिजिटल नोट्स को पढ़ना और रिवीजन करना बेहद आसान है।</ListItem>
              </UnorderedList>
            </Td>
            {/* <Td isNumeric>25.4</Td> */}
          </Tr>
        </Tbody>
      </Table>
      {/* </TableContainer> */}
    </Box>
  );
}

export default LandingPageTable;
