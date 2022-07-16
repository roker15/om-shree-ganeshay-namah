import { Flex, Link, Tag, VStack, Text } from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import SimpleImageSlider from "react-simple-image-slider";

const images = [
  { url: "https://i.imgur.com/ac8opj9.png" },
  { url: "https://i.imgur.com/q4mJbbt.png" },
  { url: "https://i.imgur.com/1iq8nHX.png" },
  { url: "https://i.imgur.com/KgGRcvk.png" },
  { url: "https://i.imgur.com/0tFId7l.png" },
];

const AnimatedText = () => {
  const [imageDes, setImageDes] = useState("Create & Edit notes Syllabus wise");
  const onClickBullets = useCallback((idx: number) => {
    switch (idx) {
      case 0:
        setImageDes("Create & Edit notes Syllabus wise");
        break;
      case 1:
        setImageDes("Maths and Equation Support");
        break;
      case 2:
        setImageDes("Image Support");
        break;
      case 3:
        setImageDes("Table Support");
        break;
      case 4:
        setImageDes("Filter Current Affair Notes Topic Wise");
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
        setImageDes("Create & Edit notes Syllabus wise");
        break;
      case 2:
        setImageDes("Maths and Equation Support");
        break;
      case 3:
        setImageDes("Image Support");
        break;
      case 4:
        setImageDes("Table Support");
        break;
      case 5:
        setImageDes("Filter Current Affair Notes Topic Wise");
        break;

      default:
        break;
    }
    // alert(`[App onClickBullets] ${idx}`);
  }, []);

  return (
    <Flex justifyContent="center" py="2" pb="16">
      <VStack>
        <Text p="0.5" px="6" fontSize="lg" bg="brand.300" color="white">
          {imageDes}
        </Text>
        <Flex>
          <SimpleImageSlider
            onClickBullets={onClickBullets}
            onStartSlide={onStartSlide}
            // width={896}
            // height={504}
            width={700}
            height={350}
            images={images}
            showBullets={true}
            showNavs={true}
            autoPlay={true}
            autoPlayDelay={7.0}
            navStyle={2}
            useGPURender={true}
            style={{ margin: '0 auto', marginTop: '5px',boxShadow: '0.5px 0.5px 1px 1px #ffceb4' }}

          />
        </Flex>
      </VStack>
    </Flex>
  );
};

export default AnimatedText;
