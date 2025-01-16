import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchReleases, fetchVersion, ReleasesData } from "../../lib/api";
import { RegsAndGuidelines } from "../../lib/parser";
import { useLocation } from "react-router-dom";

interface RegulationsContextProps {
  releases: ReleasesData;
  version: string;
  fetchVersion: (ref: string) => void;
  regulationsAndGuidelines: RegsAndGuidelines;
}

const emptyRegulationsAndGuidelines = {
  version: "",
  labels: [],
  articles: [],
};

export const RegulationsContext = createContext<RegulationsContextProps>({
  releases: [],
  version: "",
  fetchVersion: () => {},
  regulationsAndGuidelines: emptyRegulationsAndGuidelines,
});

export const RegulationsProvider = ({ children }) => {
  const [ref, setRef] = useState<string>("");
  const [releases, setReleases] = useState<ReleasesData>([]);
  const [regulationsAndGuidelinesMap, setRegulationsAndGuidelinesMap] =
    useState<Map<string, RegsAndGuidelines>>(new Map());

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const version = searchParams.get("version");

  useEffect(() => {
    fetchReleases().then(async (releases) => {
      setReleases(releases);
    });
  }, []);

  useEffect(() => {
    if (!releases?.length) {
      return;
    }

    if (version) {
      setRef(version);
    } else {
      const latest = releases[0].tag_name;
      setRef(latest);
    }
  }, [releases, version]);

  useEffect(() => {
    if (ref) {
      getVersion(ref);
    }
  }, [ref]);

  const getVersion = useCallback(async (versionTag: string) => {
    setRef(versionTag);
    const version = await fetchVersion(versionTag);
    setRegulationsAndGuidelinesMap(
      (prev) => new Map(prev.set(versionTag, version))
    );
  }, []);

  const regulationsAndGuidelines = useMemo(
    () => regulationsAndGuidelinesMap.get(ref) || emptyRegulationsAndGuidelines,
    [regulationsAndGuidelinesMap, ref]
  );

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
