export const GetImageUrl = (url) => {
  const match = url.match(/\/o\/(.+?)\?/);
  if (match) {
    const imagePath = decodeURIComponent(match[1]);
    return imagePath;
  }
  return null;
};
