import type { FormEvent, ReactNode } from "react";
import { Box, Button } from "@mui/material";
import { Clear, Search } from "@mui/icons-material";

interface SearchBoxProps {
  children: ReactNode;
  onSearch: () => void;
  onClear: () => void;
}

/** Filter row: put the filter fields inside; Enter key or the Search button searches. */
export default function SearchBox({ children, onSearch, onClear }: SearchBoxProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3, alignItems: "center" }}
    >
      {children}

      <Button type="submit" variant="contained" startIcon={<Search />}>
        Search
      </Button>

      <Button variant="outlined" startIcon={<Clear />} onClick={onClear}>
        Clear
      </Button>
    </Box>
  );
}
