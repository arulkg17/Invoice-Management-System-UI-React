import { useRef } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

interface PdfPreviewDialogProps {
  open: boolean;
  title: string;
  url: string | null;
  fileName: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
}

export default function PdfPreviewDialog({
  open,
  title,
  url,
  fileName,
  actionLabel,
  onAction,
  onClose,
}: PdfPreviewDialogProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {url && (
          <iframe
            ref={frameRef}
            src={url}
            title="PDF preview"
            style={{ width: "100%", height: "70vh", border: 0 }}
          />
        )}
      </DialogContent>

      <DialogActions>
        {url && (
          <Button
            component="a"
            href={url}
            download={fileName}
            startIcon={<DownloadIcon />}
          >
            Download
          </Button>
        )}

        <Button
          startIcon={<PrintIcon />}
          onClick={() => frameRef.current?.contentWindow?.print()}
        >
          Print
        </Button>

        <Button onClick={onClose}>Close</Button>

        {actionLabel && onAction && (
          <Button variant="contained" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
