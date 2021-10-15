import { createContext } from "react";

export const FilterContexts = createContext({
  sortBoards: "best",
  sortComments: "best",
}); // value incase provider is not specified for a component
