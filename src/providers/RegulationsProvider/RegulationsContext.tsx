import { createContext, useContext } from "react";
import { ReleasesData } from "../../lib/api";
import { RegsAndGuidelines } from "../../lib/parser";

export interface RegulationsContextProps {
  releases: ReleasesData;
  version: string;
  fetchVersion: (ref: string) => void;
  regulationsAndGuidelines: RegsAndGuidelines;
}

export const emptyRegulationsAndGuidelines = {
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

export const useRegulations = () => useContext(RegulationsContext);
