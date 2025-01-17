import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchReleases, fetchVersion, ReleasesData } from "../../lib/api";
import { RegsAndGuidelines } from "../../lib/parser";
import { useLocation } from "react-router-dom";
import {
  emptyRegulationsAndGuidelines,
  RegulationsContext,
} from "./RegulationsContext";

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

  const getVersion = useCallback(async (versionTag: string) => {
    setRef(versionTag);
    const version = await fetchVersion(versionTag);
    setRegulationsAndGuidelinesMap(
      (prev) => new Map(prev.set(versionTag, version))
    );
  }, []);

  useEffect(() => {
    if (ref) {
      getVersion(ref);
    }
  }, [getVersion, ref]);

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
