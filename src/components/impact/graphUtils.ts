import type { Risk } from "@/data/impactScenarios";

export const riskDot: Record<Risk, string> = {
  high: "bg-risk-high",
  medium: "bg-risk-medium",
  low: "bg-risk-low",
  related: "bg-risk-related",
};

export const riskLabelText: Record<Risk, string> = {
  high: "High risk",
  medium: "Medium risk",
  low: "Low risk",
  related: "Related",
};

export const riskShort: Record<Risk, string> = {
  high: "high risk",
  medium: "medium risk",
  low: "low risk",
  related: "related",
};

