export const youtubeHighlightDuration = 50;

export const setYouTubeStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
  .vocably-word {
    cursor: pointer;
  }
  .vocably-word:hover {
    text-decoration: underline;
    text-decoration-thickness: 1px;
  }
  .vocably-selectable-captions .ytp-caption-segment {
    transition: text-shadow ${youtubeHighlightDuration}ms ease-in-out;
  }
  .vocably-selectable-captions-highlighted .ytp-caption-segment {
    text-shadow: 0 0 5px #28a5ff, 0 0 10px #28a5ff, 0 0 20px #28a5ff,
      0 0 40px #28a5ff !important;
  }
`;
  document.head.appendChild(style);
};
