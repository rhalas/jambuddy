const DEV_BASE_URL = "http://127.0.0.1:5000";
const GET_SONG_PATH = "/get_song";

type LyricWord = {
  word: string;
  wordNum: number;
};

export type LyricLine = {
  startWord: number;
  endWord: number;
  words: Array<LyricWord>;
};

type GetSongResponse = {
  title: string;
  lyrics: Array<LyricLine>;
};

export const GetSong = async (songTheme: string): Promise<GetSongResponse> => {
  const res: GetSongResponse = { title: "", lyrics: [] };
  try {
    const response = await fetch(`${DEV_BASE_URL}${GET_SONG_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ song_theme: songTheme }),
    });

    const result = await response.json();
    if (Object.prototype.hasOwnProperty.call(result, "song_title")) {
      res.title = result["song_title"];
    }
    if (Object.prototype.hasOwnProperty.call(result, "song_lyrics")) {
      let currentWordNum = 0;
      result["song_lyrics"].forEach((lyric: string) => {
        const lyricLine: LyricLine = {
          startWord: currentWordNum,
          endWord: currentWordNum,
          words: [],
        };

        const splitWords = lyric.split(" ");

        splitWords.forEach((word) => {
          const newWord = { word: word, wordNum: currentWordNum };
          lyricLine.words.push(newWord);
          currentWordNum += 1;
        });

        lyricLine.endWord = currentWordNum - 1;
        res.lyrics.push(lyricLine);
      });
    }
  } catch (error) {
    console.log(error);
  }

  return res;
};