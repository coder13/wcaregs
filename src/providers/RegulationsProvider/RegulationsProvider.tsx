import { Endpoints } from "@octokit/types";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  fetchGuidelines,
  fetchRegulations,
  fetchReleases,
} from "../../lib/api";
import { buildRegsAndGuidelines, RegsAndGuidelines } from "../../lib/parser";

type Releases =
  Endpoints["GET /repos/{owner}/{repo}/releases"]["response"]["data"];

interface RegulationsContextProps {
  releases: Releases;
  version: string;
  fetchVersion: (ref: string) => void;
  regulationsAndGuidelines: RegsAndGuidelines;
}

export const RegulationsContext = createContext<RegulationsContextProps>({
  releases: [],
  version: "",
  fetchVersion: () => {},
  regulationsAndGuidelines: {
    version: "",
    labels: [],
    articles: [],
  },
});

export const RegulationsProvider = ({ children }) => {
  const [ref, setRef] = useState<string>("");
  const [releases, setReleases] = useState<
    Endpoints["GET /repos/{owner}/{repo}/releases"]["response"]["data"]
  >([]);
  const [regulationsMap, setRegulationsMap] = useState<Map<string, string>>(
    new Map()
  );
  const [guidelinesMap, setGuidelinesMap] = useState<Map<string, string>>(
    new Map()
  );

  useEffect(() => {
    fetchReleases().then(async (releases) => {
      setReleases(releases.data);
      const latest = releases.data[0].tag_name;
      fetchVersion(latest);
    });
  }, []);

  const fetchVersion = useCallback(async (version: string) => {
    setRef(version);
    const regulations = await fetchRegulations(version);
    const guidelines = await fetchGuidelines(version);

    setRegulationsMap((prev) => {
      const next = new Map(prev);
      next.set(version, regulations);
      return next;
    });

    setGuidelinesMap((prev) => {
      const next = new Map(prev);
      next.set(version, guidelines);
      return next;
    });
  }, []);

  const regulationsAndGuidelines = useMemo(() => {
    const regulations = regulationsMap.get(ref);
    const guidelines = guidelinesMap.get(ref);

    if (!regulations || !guidelines) {
      return {
        version: "",
        labels: [],
        articles: [],
      };
    }

    return buildRegsAndGuidelines(regulations, guidelines);
  }, [ref, regulationsMap, guidelinesMap]);

  console.log(49, regulationsAndGuidelines);

  return (
    <RegulationsContext.Provider
      value={{
        releases,
        version: ref,
        fetchVersion,
        regulationsAndGuidelines,
      }}
    >
      {children}
    </RegulationsContext.Provider>
  );
};
