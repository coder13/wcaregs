export const fetchReleases = async () => {
  const response = await fetch(
    `https://api.github.com/repos/thewca/wca-regulations/releases`
  );
  const releases = await response.json();
  return releases;
};
