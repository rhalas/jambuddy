import styled from "styled-components";
import { ProgressionDetails } from "../helpers/types/types";
import { Text } from "@radix-ui/themes";
import { ChordInfo } from "../helpers/types/types";
import { useEffect, useRef } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const ProgressionInfoContainer = styled.div`
  width: 1000px;
  margin: auto;
`;

const KeyInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProgressionText = styled.div`
  margin: 0 auto;
`;

const CancelContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 50%;
  border: 2px solid #333;
  background-color: transparent;
`;

const ChordContainer = styled.div`
  margin-bottom: 25px;
`;

const ProgressionContainer = styled.div<{
  isActive: boolean;
  isOnDeck: boolean;
}>`
  opacity: ${(p) => (p.isActive ? "1" : "0.2")};
  background-color: ${(p) =>
    p.isActive ? "white" : p.isOnDeck ? "green" : "#D3D3D3"};
  cursor: pointer;
`;

const SwiperSlideContainer = styled.div``;

type ProgressionInfoProps = {
  progressions: Array<ProgressionDetails>;
  playingIndex: number;
  deleteProgressionCallback: (idx: number) => void;
  queueProgressionCallback: (idx: number) => void;
  loopOnDeck: number;
};

export const ProgressionInfo = (progressionInfoProps: ProgressionInfoProps) => {
  const {
    progressions,
    playingIndex,
    deleteProgressionCallback,
    loopOnDeck,
    queueProgressionCallback,
  } = progressionInfoProps;

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
            <ProgressionContainer
              isActive={i === playingIndex}
              isOnDeck={i === loopOnDeck}
              onClick={() => {
                queueProgressionCallback(i);
              }}
            >
              <KeyInfoContainer>
                <ProgressionText>
                  <Text>
                    {p.rootNote} {p.mode}
                  </Text>
                </ProgressionText>
                <CancelContainer>
                  <Cross2Icon
                    onClick={() => {
                      deleteProgressionCallback(i);
                    }}
                  />
                </CancelContainer>
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
