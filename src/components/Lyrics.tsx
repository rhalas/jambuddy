import { Text } from "@radix-ui/themes";
import styled from "styled-components";
import { LyricLine } from "../helpers/api/api";
import { useEffect } from "react";

const LyricLineComponent = styled.div`
  margin-bottom: 30px;
`;

const Word = styled(Text)<{ isActive: boolean }>`
  background: ${(p) => (p.isActive ? "cyan" : "none")};
`;

type LyricsProps = {
  lyrics: Array<LyricLine>;
  songTitle: string;
  currentWord: number;
};

export const Lyrics = (lyricsProps: LyricsProps) => {
  const { lyrics, songTitle, currentWord } = lyricsProps;

  useEffect(() => {
    console.log(currentWord);
  }, [currentWord]);

  return (
    <>
      <Text size="7">{songTitle}</Text>
      {lyrics.map((lyric) => {
        return (
          <LyricLineComponent>
            {lyric.words.map((word) => {
              return (
                <Word isActive={word.wordNum === currentWord}>
                  {word.word}{" "}
                </Word>
              );
            })}
          </LyricLineComponent>
        );
      })}
    </>
  );
};
