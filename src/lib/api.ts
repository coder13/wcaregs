import { Octokit } from "octokit";

const octokit = new Octokit();

export const fetchReleases = () =>
  octokit.rest.repos.listReleases({
    owner: "thewca",
    repo: "wca-regulations",
  });

export const fetchRegulations = async (ref = "master") => {
  const file = await octokit.rest.repos.getContent({
    owner: "thewca",
    repo: "wca-regulations",
    path: "wca-regulations.md",
    ref,
    mediaType: {
      format: "raw",
    },
  });

  // if (file.status !== 200) {
  //   throw new Error("Failed to fetch regulations");
  // }

  return file.data as unknown as string;
};

export const fetchGuidelines = async (ref = "master") => {
  const file = await octokit.rest.repos.getContent({
    owner: "thewca",
    repo: "wca-regulations",
    path: "wca-guidelines.md",
    ref,
    mediaType: {
      format: "raw",
    },
  });

  // if (file.status !== 200) {
  //   throw new Error("Failed to fetch guidelines");
  // }

  return file.data as unknown as string;
};
