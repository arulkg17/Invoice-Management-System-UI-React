import { Chip } from "@mui/material";

type ChipColor = "default" | "primary" | "success" | "warning" | "error" | "info";

const COLORS: Record<string, ChipColor> = {
  Draft: "default",
  Approved: "info",
  PartiallyReceived: "warning",
  Received: "success",
  Posted: "success",
  Cancelled: "error",
  Active: "success",
  Inactive: "default",
};

export default function StatusChip({ status }: { status: string }) {
  return <Chip size="small" label={status} color={COLORS[status] ?? "default"} />;
}
