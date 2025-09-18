import { useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  /**
   * Close the modal when the user presses the Escape key.
   */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Task details"
    >
      {/* Overlay/backdrop – klick här stänger */}
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      {/* Center wrapper */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* Själva dialogen – stoppa klick från att bubbla och stänga */}
        <div
          className="w-full max-w-md rounded-xl bg-neutral-900 p-4 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
