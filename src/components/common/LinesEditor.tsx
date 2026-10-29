import { Controller, useFieldArray, useWatch } from "react-hook-form";
import type { Control, UseFormSetValue } from "react-hook-form";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

import type { Itemmaster } from "../../models";
import { calcLine, num } from "../../utils/money";
import { formatMoney } from "../../utils/apiHelpers";
import { FormNumber } from "./FormFields";

export interface LineValues {
  itemmasterId: number | "";
  quantity: number | "";
  rate: number | "";
  discountAmount: number | "";
  taxPercent: number | "";
}

/** The part of the PO / Sales Invoice form that this editor works with. */
export interface LinesFormValues {
  details: LineValues[];
}

export const EMPTY_LINE: LineValues = {
  itemmasterId: "",
  quantity: 1,
  rate: 0,
  discountAmount: 0,
  taxPercent: 0,
};

interface LinesEditorProps {
  control: Control<LinesFormValues>;
  setValue: UseFormSetValue<LinesFormValues>;
  items: Itemmaster[];
  readOnly: boolean;
  /** itemId -> quantity on hand. When given, an early "not enough stock" warning is shown. */
  stock?: Map<number, number>;
  /** Message under the table (for example "Add at least one line"). */
  error?: string;
}

export default function LinesEditor({
  control,
  setValue,
  items,
  readOnly,
  stock,
  error,
}: LinesEditorProps) {
  const { fields, append, remove } = useFieldArray({ control, name: "details" });
  const lines = useWatch({ control, name: "details" }) ?? [];

  // total quantity asked for per item (the same item may be on several lines)
  const demand = new Map<number, number>();

  for (const line of lines) {
    if (line?.itemmasterId) {
      const id = Number(line.itemmasterId);

      demand.set(id, (demand.get(id) ?? 0) + num(line.quantity));
    }
  }

  const onItemPicked = (index: number, itemId: number) => {
    const item = items.find((i) => i.id === itemId);

    // default the rate from the item master when no rate was typed yet
    if (item?.rate && num(lines[index]?.rate) === 0) {
      setValue(`details.${index}.rate`, item.rate, { shouldDirty: true });
    }
  };

  return (
    <Box>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ "& th": { fontWeight: "bold" } }}>
            <TableCell sx={{ width: 40 }}>#</TableCell>
            <TableCell sx={{ minWidth: 220 }}>Item</TableCell>
            <TableCell sx={{ width: 110 }}>Qty</TableCell>
            <TableCell sx={{ width: 120 }}>Rate</TableCell>
            <TableCell sx={{ width: 120 }}>Discount</TableCell>
            <TableCell sx={{ width: 90 }}>Tax %</TableCell>
            <TableCell align="right">Tax</TableCell>
            <TableCell align="right">Total</TableCell>
            {!readOnly && <TableCell sx={{ width: 50 }} />}
          </TableRow>
        </TableHead>

        <TableBody>
          {fields.map((field, index) => {
            const line = lines[index];
            const amounts = calcLine(
              line?.quantity,
              line?.rate,
              line?.discountAmount,
              line?.taxPercent,
            );

            const itemId = line?.itemmasterId ? Number(line.itemmasterId) : 0;
            const onHand = stock && itemId ? (stock.get(itemId) ?? 0) : null;
            const short = onHand !== null && (demand.get(itemId) ?? 0) > onHand;

            return (
              <TableRow key={field.id} sx={{ verticalAlign: "top" }}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>
                  <Controller
                    control={control}
                    name={`details.${index}.itemmasterId`}
                    render={({ field: { ref, ...f }, fieldState }) => (
                      <TextField
                        {...f}
                        inputRef={ref}
                        select
                        size="small"
                        fullWidth
                        disabled={readOnly}
                        value={f.value ?? ""}
                        onChange={(event) => {
                          const id = Number(event.target.value);

                          f.onChange(id);
                          onItemPicked(index, id);
                        }}
                        error={!!fieldState.error}
                        helperText={
                          fieldState.error?.message ??
                          (onHand !== null ? `On hand: ${onHand}` : undefined)
                        }
                        slotProps={{
                          formHelperText: short
                            ? { sx: { color: "error.main", fontWeight: 600 } }
                            : undefined,
                        }}
                      >
                        {items.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.itemCode} - {item.itemName}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </TableCell>

                <TableCell>
                  <FormNumber control={control} name={`details.${index}.quantity`} label="Qty" size="small" disabled={readOnly} />
                </TableCell>

                <TableCell>
                  <FormNumber control={control} name={`details.${index}.rate`} label="Rate" size="small" disabled={readOnly} />
                </TableCell>

                <TableCell>
                  <FormNumber control={control} name={`details.${index}.discountAmount`} label="Disc." size="small" disabled={readOnly} />
                </TableCell>

                <TableCell>
                  <FormNumber control={control} name={`details.${index}.taxPercent`} label="Tax %" size="small" max={100} disabled={readOnly} />
                </TableCell>

                <TableCell align="right">{formatMoney(amounts.taxAmount)}</TableCell>
                <TableCell align="right">{formatMoney(amounts.lineTotal)}</TableCell>

                {!readOnly && (
                  <TableCell>
                    <Tooltip title="Remove line">
                      <IconButton color="error" onClick={() => remove(index)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      {!readOnly && (
        <Button
          startIcon={<Add />}
          sx={{ mt: 1 }}
          onClick={() => append({ ...EMPTY_LINE })}
        >
          Add line
        </Button>
      )}
    </Box>
  );
}
