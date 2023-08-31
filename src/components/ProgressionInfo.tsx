import styled from "styled-components";
import { ProgressionDetails } from "../helpers/types/types";
import { Text } from "@radix-ui/themes";
import { ChordInfo } from "../helpers/types/types";
import { useEffect, useRef } from "react";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const ProgressionInfoContainer = styled.div`
  width: 1000px;
  margin: auto;
`;
const KeyInfoContainer = styled.div``;
const ChordContainer = styled.div`
  margin-bottom: 25px;
`;

const ProgressionContainer = styled.div<{ isActive: boolean }>`
  opacity: ${(p) => (p.isActive ? "1" : "0.2")};
  filter: grayscale(100%);
  background-color: ${(p) => (p.isActive ? "white" : "#D3D3D3")};
`;

const SwiperSlideContainer = styled.div``;

type ProgressionInfoProps = {
  progressions: Array<ProgressionDetails>;
  playingIndex: number;
};

export const ProgressionInfo = (progressionInfoProps: ProgressionInfoProps) => {
  const { progressions, playingIndex } = progressionInfoProps;

  const sliderRef = useRef<Carousel>(null);

  useEffect(() => {
    if (playingIndex > 0 && sliderRef.current && sliderRef.current.state) {
      sliderRef.current.goToSlide(playingIndex);
    }
  }, [playingIndex]);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <ProgressionInfoContainer>
      <Carousel
        centerMode={true}
        responsive={responsive}
        showDots={true}
        ref={sliderRef}
      >
        {progressions.map((p, i) => (
          <SwiperSlideContainer key={i}>
            <ProgressionContainer isActive={i === playingIndex}>
              <KeyInfoContainer>
                <Text>
                  {p.rootNote} {p.mode}
                </Text>
              </KeyInfoContainer>
              <ChordContainer>
                <Text>
                  {p.progression &&
                    p.progression.map((c: ChordInfo) => c.position).join(" - ")}
                </Text>
                <div>
                  <Text>
                    {p.progression &&
                      p.progression
                        .map((c: ChordInfo) => c.chordName)
                        .join(" - ")}
                  </Text>
                </div>
              </ChordContainer>
            </ProgressionContainer>
          </SwiperSlideContainer>
        ))}
      </Carousel>
    </ProgressionInfoContainer>
  );
};
