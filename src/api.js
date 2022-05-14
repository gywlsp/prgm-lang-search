const API_END_POINT =
  "https://wr4a6p937i.execute-api.ap-northeast-2.amazonaws.com/dev";

export const request = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("요청 실패");
  }

  return await res.json();
};

export const fetchLanguages = async (keyword) =>
  request(`${API_END_POINT}/languages?keyword=${keyword}`);
