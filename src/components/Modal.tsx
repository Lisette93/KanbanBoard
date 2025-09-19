import { useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  // Close on Escape
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Task details"
    >
      {/* Backdrop */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-white/60"
      />

      {/* Dialog */}
      <div
        className="relative w-full max-w-lg sm:max-w-xl rounded-2xl bg-peachBlossom/60 p-4 sm:p-5 shadow-2xl
                    backdrop-blur-md
                   animate-[fadeIn_.15s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full px-2 py-1 text-brownSugar hover:text-brownSugar"
          aria-label="Close dialog"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
