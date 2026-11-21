import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Yes/No confirmation popup.
 * Props: open, title, message, confirmText, cancelText, danger, loading, onConfirm, onCancel
 */
export function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Yes, delete",
  cancelText = "No",
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus(); // safe default: focus "No"
    const onKey = (e) => e.key === "Escape" && !loading && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  const s = {
    overlay: {
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 16,
    },
    box: {
      background: "#fff", borderRadius: 14, padding: 24, width: "100%",
      maxWidth: 400, boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
    },
    title: { margin: 0, fontSize: 20, fontWeight: 700, color: "#16213e" },
    msg: { margin: "10px 0 22px", color: "#4b5563", fontSize: 15, lineHeight: 1.5 },
    row: { display: "flex", justifyContent: "flex-end", gap: 10 },
    no: {
      padding: "10px 18px", borderRadius: 10, border: "1px solid #d1d5db",
      background: "#fff", color: "#111827", fontWeight: 600, cursor: "pointer",
    },
    yes: {
      padding: "10px 18px", borderRadius: 10, border: "none",
      background: danger ? "#dc2626" : "#0f766e", color: "#fff",
      fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1,
    },
  };

  return (
    <div style={s.overlay} onClick={() => !loading && onCancel()} role="presentation">
      <div
        style={s.box}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-title" style={s.title}>{title}</h3>
        <p style={s.msg}>{message}</p>
        <div style={s.row}>
          <button ref={cancelRef} style={s.no} onClick={onCancel} disabled={loading}>
            {cancelText}
          </button>
          <button style={s.yes} onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook that keeps track of what is waiting for confirmation.
 *   const { target, ask, cancel, confirm, loading } = useConfirmDelete(deleteFn);
 *   ask(item)  -> opens dialog
 *   confirm()  -> runs deleteFn(item), then closes
 */
export function useConfirmDelete(deleteFn) {
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(false);

  const ask = useCallback((item) => setTarget(item), []);
  const cancel = useCallback(() => setTarget(null), []);
  const confirm = useCallback(async () => {
    if (!target) return;
    setLoading(true);
    try {
      await deleteFn(target);
    } finally {
      setLoading(false);
      setTarget(null);
    }
  }, [target, deleteFn]);

  return { target, ask, cancel, confirm, loading };
}
