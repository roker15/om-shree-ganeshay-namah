import { Flex } from "@chakra-ui/react";
import React from "react";
import Typewriter from "typewriter-effect";

const AnimatedText = () => {
  return (
    <Flex justifyContent="center">
      <Typewriter
        options={{
          strings: [
            '<span style="color: hsl(199.05882352941174, 100%, 50%); font-size:24px ;font-family: Comic Sans MS ;"> Create , Update and Organise NOTES online <span>',

            '<span style="color: #434743; font-size:24px ;font-family: Comic Sans MS ;" >Collaborate with Friends</span>',
            '<span style="color: #434743; font-size:24px ;font-family: Comic Sans MS ;" >Share with WORLD </span>',
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
