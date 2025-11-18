import type { CSSProperties, ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
};

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

const styles: { overlay: CSSProperties; modal: CSSProperties; closeBtn: CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    minWidth: "300px",
    maxWidth: "500px",
    position: "relative",
  },
  closeBtn: {
    marginTop: "20px",
  },
};
