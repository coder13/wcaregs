import { RequestError } from "@octokit/request-error";
import { fetchRegulations, fetchGuidelines } from "./api.mts";
import { buildRegsAndGuidelines } from "./parser.mts";

export default async (request: Request) => {
  const url = new URL(request.url);

  const tag = url.searchParams.get("tag");

  if (!tag) {
    return;
  }

  try {
    const [regulations, guidelines] = await Promise.all([
      fetchRegulations(tag),
      fetchGuidelines(tag),
    ]);

    const regulationsAndGuidelines = buildRegsAndGuidelines(
      regulations,
      guidelines
    );

    const response = new Response(JSON.stringify(regulationsAndGuidelines));

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    response.headers.set("Content-Type", "application/json");

    response.headers.set("Cache-Control", "max-age=86400");

    return response;
  } catch (error) {
    if (error instanceof RequestError && error.status === 404) {
      return new Response(
        JSON.stringify({
          error: "Not Found",
          message: `Tag "${tag}" does not correspond to a git ref containing regulation markdown files. This release may only include a PDF asset.`,
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    return new Response((error as Error).toString(), {
      status: 500,
    });
  }
};
