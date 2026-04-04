import { Endpoints } from "@octokit/types";
import { RegsAndGuidelines } from "./parser";

export type ReleasesData =
  Endpoints["GET /repos/{owner}/{repo}/releases"]["response"]["data"];

export const fetchReleases = async (): Promise<ReleasesData> => {
  const cached = localStorage.getItem("releases");
  if (cached) {
    return JSON.parse(cached) as ReleasesData;
  }

  const res = await fetch("/.netlify/functions/versions");
  const releases = await res.json();

  localStorage.setItem("releases", JSON.stringify(releases));

  return releases as unknown as ReleasesData;
};

export const fetchVersion = async (version: string) => {
  const res = await fetch(`/.netlify/functions/version?tag=${version}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ??
        `Failed to fetch version "${version}" (${res.status})`
    );
  }
  return (await res.json()) as RegsAndGuidelines;
};
