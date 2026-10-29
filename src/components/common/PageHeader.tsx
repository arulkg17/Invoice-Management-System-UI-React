import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

interface PageHeaderProps {
  title: string;
  children?: ReactNode; // buttons shown on the right
}

export default function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 2,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
        {title}
      </Typography>

      <Box sx={{ display: "flex", gap: 1 }}>{children}</Box>
    </Box>
  );
}
