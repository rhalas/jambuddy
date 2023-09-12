import styled from "styled-components";
import { ProgressionDetails } from "../helpers/types/types";
import { Text } from "@radix-ui/themes";
import { ChordInfo } from "../helpers/types/types";
import { useEffect, useRef } from "react";
import { Cross2Icon, Pencil2Icon, CheckIcon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction } from "react";
import { ModeSelector } from "./ModeSelector";
import { RootSelector } from "./RootSelector";

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

const PencilContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: transparent;
  margin-left: 5px;
`;

const CancelContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: transparent;
  margin-right: 5px;
`;

const ChordContainer = styled.div``;

const ChordText = styled.span<{
  isActive: boolean;
}>`
  background-color: ${(p) => (p.isActive ? `var(--accent-6)` : "")};
`;

const CarouselContainer = styled(Carousel)`
  overflow: inherit;
`;

const ProgressionContainer = styled.div<{
  isActive: boolean;
  isOnDeck: boolean;
  isEditing: boolean;
}>`
  opacity: ${(p) => (p.isActive ? "1" : "0.2")};
  background-color: ${(p) =>
    p.isEditing
      ? "orange"
      : p.isActive
      ? "white"
      : p.isOnDeck
      ? "green"
      : "#D3D3D3"};
  cursor: pointer;
  border: groove;
  margin-bottom: 20px;
`;

const SwiperSlideContainer = styled.div``;

type ProgressionInfoProps = {
  progressions: Array<ProgressionDetails>;
  playingIndex: number;
  deleteProgressionCallback: (idx: number) => void;
  queueProgressionCallback: (idx: number) => void;
  loopOnDeck: number;
  currentChordPosition: number;
  editModeIndex: number;
  setEditModeIndex: Dispatch<SetStateAction<number>>;
  updateLoop: (
    progressionUpdateIndex?: number,
    newMode?: string,
    newRoot?: string
  ) => void;
};

export const ProgressionInfo = (progressionInfoProps: ProgressionInfoProps) => {
  const {
    progressions,
    playingIndex,
    deleteProgressionCallback,
    loopOnDeck,
    queueProgressionCallback,
    currentChordPosition,
    editModeIndex,
    setEditModeIndex,
    updateLoop,
  } = progressionInfoProps;

  const sliderRef = useRef<Carousel>(null);

  useEffect(() => {
    if (
      playingIndex > 0 &&
      sliderRef.current &&
      sliderRef.current.state &&
      editModeIndex >= 0
    ) {
      sliderRef.current.goToSlide(playingIndex);
    }
  }, [playingIndex, editModeIndex]);

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
      <CarouselContainer
        responsive={responsive}
        showDots={true}
        ref={sliderRef}
      >
        {progressions.map((p, i) => (
          <SwiperSlideContainer key={i}>
            <ProgressionContainer
              isActive={i === playingIndex}
              isOnDeck={i === loopOnDeck}
              isEditing={i === editModeIndex}
              onClick={() => {
                queueProgressionCallback(i);
              }}
            >
              <KeyInfoContainer>
                <PencilContainer>
                  {editModeIndex === i ? (
                    <CheckIcon
                      onClick={() => {
                        setEditModeIndex(-1);
                      }}
                    />
                  ) : (
                    <Pencil2Icon
                      onClick={() => {
                        setEditModeIndex(i);
                      }}
                    />
                  )}
                </PencilContainer>
                <ProgressionText>
                  <RootSelector
                    currentRoot={p.rootNote}
                    editModeEnabled={editModeIndex === i}
                    setNewRoot={(root: string) => {
                      updateLoop(i, "", root);
                    }}
                  />
                  <ModeSelector
                    currentMode={p.mode}
                    editModeEnabled={editModeIndex === i}
                    setNewMode={(mode: string) => {
                      updateLoop(i, mode);
                    }}
                  />
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
                    p.progression.map((c: ChordInfo, idx: number) => {
                      return (
                        <>
                          <ChordText
                            isActive={
                              idx === currentChordPosition && i === playingIndex
                            }
                          >
                            {` ${c.position} `}
                          </ChordText>
                          {idx !== p.progression.length - 1 ? "-" : ""}
                        </>
                      );
                    })}
                </Text>
                <div>
                  <Text>
                    {p.progression &&
                      p.progression.map((c: ChordInfo, idx: number) => {
                        return (
                          <>
                            <ChordText
                              isActive={
                                idx === currentChordPosition &&
                                i === playingIndex
                              }
                            >
                              {` ${c.chordName} `}
                            </ChordText>
                            {idx !== p.progression.length - 1 ? "-" : ""}
                          </>
                        );
                      })}
                  </Text>
                </div>
              </ChordContainer>
            </ProgressionContainer>
          </SwiperSlideContainer>
        ))}
      </CarouselContainer>
    </ProgressionInfoContainer>
  );
};
