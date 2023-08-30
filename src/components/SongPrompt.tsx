import { Button, Text, TextField, Separator } from "@radix-ui/themes";
import { useState, useCallback } from "react";
import { GetSong } from "../helpers/api/api";
import ScaleLoader from "react-spinners/ScaleLoader";

import styled from "styled-components";

const SongPromptContainer = styled.div`
  width: 600px;
`;

type SongPromptProps = {
  promptDoneCallback: () => void;
  setSongTitle: (s: string) => void;
  setLyrics: (s: Array<string>) => void;
};

export const SongPrompt = (songPromptProps: SongPromptProps) => {
  const { promptDoneCallback, setSongTitle, setLyrics } = songPromptProps;

  const [songIdea, setSongIdea] = useState("");
  const [waitingOnApi, setWaitingOnApi] = useState(false);

  const doGetSong = useCallback(
    async (songIdea: string) => {
      if (import.meta.env.DEV) {
        setWaitingOnApi(true);
        const res = await GetSong(songIdea);
        setSongTitle(res.title);
        setLyrics(res.lyrics);
      }
      promptDoneCallback();
      setWaitingOnApi(false);
    },
    [promptDoneCallback, setSongTitle, setLyrics]
  );

  return waitingOnApi ? (
    <ScaleLoader
      loading={waitingOnApi}
      height={100}
      width={100}
      color={"rgb(10, 50, 10)"}
    />
  ) : (
    <SongPromptContainer>
      <TextField.Input
        placeholder="What would you like to hear a song about?"
        radius="full"
        onChange={(e) => setSongIdea(e.currentTarget.value)}
      />
      <Separator style={{ width: "100%", margin: "15px 0" }} />
      <Button
        size="3"
        variant="solid"
        onClick={async () => {
          await doGetSong(songIdea);
        }}
      >
        <Text>{songIdea.length === 0 ? "Surprise me" : "Make a song"}</Text>
      </Button>
    </SongPromptContainer>
  );
};
