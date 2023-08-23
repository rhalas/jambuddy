import styled from "styled-components";
import { ProgressionDetails } from "../helpers/types/types";
import { Text } from "@radix-ui/themes";
import { ChordInfo } from "../helpers/types/types";

import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide, SwiperRef } from "swiper/react";
import { useEffect, useRef } from "react";

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

const CarouselBox = styled(Swiper)``;

const SwiperSlideContainer = styled(SwiperSlide)``;

type ProgressionInfoProps = {
  progressions: Array<ProgressionDetails>;
  playingIndex: number;
};

export const ProgressionInfo = (progressionInfoProps: ProgressionInfoProps) => {
  const { progressions, playingIndex } = progressionInfoProps;
  const sliderRef = useRef<SwiperRef>(null);

  useEffect(() => {
    if (playingIndex > 0 && sliderRef.current && sliderRef.current.swiper) {
      sliderRef.current.swiper.slideTo(playingIndex);
    }
  }, [playingIndex]);

  return (
    <ProgressionInfoContainer>
      <CarouselBox
        slidesPerView={5}
        centeredSlides={true}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        ref={sliderRef}
      >
        {progressions.map((p, i) => (
          <SwiperSlideContainer>
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
      </CarouselBox>
    </ProgressionInfoContainer>
  );
};
