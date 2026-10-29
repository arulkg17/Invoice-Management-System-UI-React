import { Box, Typography } from "@mui/material";

import type { Totals } from "../../utils/money";
import { formatMoney } from "../../utils/apiHelpers";

export default function DocumentTotals({ totals }: { totals: Totals }) {
  return (
    <Box sx={{ ml: "auto", width: 280, mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>Sub Total</Typography>
        <Typography>{formatMoney(totals.subTotal)}</Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>Tax</Typography>
        <Typography>{formatMoney(totals.taxAmount)}</Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid",
          borderColor: "divider",
          mt: 0.5,
          pt: 0.5,
        }}
      >
        <Typography sx={{ fontWeight: "bold" }}>Total</Typography>
        <Typography sx={{ fontWeight: "bold" }}>{formatMoney(totals.totalAmount)}</Typography>
      </Box>
    </Box>
  );
}
