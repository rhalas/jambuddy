import { Text } from "@radix-ui/themes";
import styled from "styled-components";

const LyricLine = styled.div`
  margin-bottom: 30px;
`;

type LyricsProps = {
  lyrics: Array<string>;
  songTitle: string;
};

export const Lyrics = (lyricsProps: LyricsProps) => {
  const { lyrics, songTitle } = lyricsProps;

  return (
    <>
      <Text size="7">{songTitle}</Text>
      {lyrics.map((lyric) => {
        return (
          <LyricLine>
            <Text>{lyric}</Text>
          </LyricLine>
        );
      })}
    </>
  );
};
