import { Flex } from "@chakra-ui/react";
import React from "react";
import Typewriter from "typewriter-effect";

const AnimatedText = () => {
  return (
    <Flex justifyContent="center">
      <Typewriter
        options={{
          strings: [
            '<span style="color: #434743; font-size:24px ;font-family: Comic Sans MS ;background-color:#fad186"> Create , Update and Organise NOTES online <span>',

            '<span style="color: #434743; font-size:24px ;font-family: Comic Sans MS ;background-color:#fad186" >Collaborate with Friends</span>',
            '<span style="color: #434743; font-size:24px ;font-family: Comic Sans MS ;background-color:#fad186" >Share with WORLD </span>',
          ],
          autoStart: true,
          loop: true,
          delay: "natural",
        }}
      />
    </Flex>
  );
};

export default AnimatedText;
