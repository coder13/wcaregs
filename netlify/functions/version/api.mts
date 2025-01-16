import { Octokit } from "octokit";

const octokit = new Octokit();

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

  return file.data as unknown as string;
};
