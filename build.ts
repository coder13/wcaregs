import { Octokit } from "octokit";

const octokit = new Octokit();

// export const fetchReleases = async () => {
//   const response = await fetch(
//     `https://api.github.com/repos/thewca/wca-regulations/releases`
//   );
//   const releases = await response.json();
//   return releases;
// };

async function main() {
  const releases = await octokit.rest.repos.listReleases({
    owner: "thewca",
    repo: "wca-regulations",
  });

  console.log(releases);
}

main();
