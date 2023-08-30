const DEV_BASE_URL = "http://127.0.0.1:5000";
const GET_SONG_PATH = "/get_song";

type GetSongResponse = {
  title: string;
  lyrics: Array<string>;
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
      res.lyrics = result["song_lyrics"];
    }
  } catch (error) {
    console.log(error);
  }

  return res;
};
