import { Flex, Link, Tag, VStack, Text } from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import SimpleImageSlider from "react-simple-image-slider";

const images = [
  { url: "https://i.imgur.com/ac8opj9.png" },
  { url: "https://i.imgur.com/KgGRcvk.png" },
];

const AnimatedText = () => {
  const [imageDes, setImageDes] = useState("Create Notes");
  const onClickBullets = useCallback((idx: number) => {
    switch (idx) {
      case 0:
        setImageDes("Create & Edit notes Anytime");
        break;
      case 1:
        setImageDes("Read notes");
        break;

      default:
        break;
    }
    // alert(`[App onClickBullets] ${idx}`);
  }, []);

  const onStartSlide = useCallback((idx: number, length: number) => {
    // alert(idx,length) 
    switch (idx) {
      case 1:
        setImageDes("Create & Edit notes Anytime");
        break;
      case 2:
        setImageDes("Read notes");
        break;

      default:
        break;
    }
    // alert(`[App onClickBullets] ${idx}`);
  }, []);
 
  return (
    <Flex justifyContent="center" py="10px">
      <VStack>
        <Text as="u" fontSize="lg" color="green.400">{imageDes}</Text>
        <div>
          <SimpleImageSlider
            onClickBullets={onClickBullets}
            onStartSlide={onStartSlide}
            width={896}
            height={504}
            images={images}
            showBullets={true}
            showNavs={true}
            autoPlay={true}
            autoPlayDelay={5.0}
          />
        </div>
      </VStack>
    </Flex>
  );
};

export default AnimatedText;
