import { Octokit } from "octokit";

const octokit = new Octokit();

export default async () => {
  try {
    const releases = await octokit.rest.repos.listReleases({
      owner: "thewca",
      repo: "wca-regulations",
    });

    const response = new Response(JSON.stringify(releases.data));

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    response.headers.set("Content-Type", "application/json");

    response.headers.set("Cache-Control", "max-age=86400");

    return response;
  } catch (error) {
    return new Response((error as Error).toString(), {
      status: 500,
    });
  }
};
