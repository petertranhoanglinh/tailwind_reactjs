import { pipe } from "lodash/fp";

const setComma = (num: number): string => num.toLocaleString();

const toUpperLower = (str: string, type: "upper" | "lower"): string => {
  return type === "upper" ? str.toUpperCase() : str.toLowerCase();
};

const formatNumber = pipe(setComma);

export { formatNumber, toUpperLower };
