import React, { useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toastMessage, closeToast } = usePlayer();

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      closeToast();
    }, 3200);
    return () => clearTimeout(timer);
  }, [toastMessage, closeToast]);

  if (!toastMessage) return null;

  const isError = toastMessage.type === 'error';
  const isSuccess = toastMessage.type === 'success';

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-bounce-once flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#282828] text-white shadow-2xl border border-white/10 text-sm font-medium">
      {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#1DB954]" />}
      {isError && <AlertCircle className="w-4 h-4 text-red-500" />}
      {!isSuccess && !isError && <Info className="w-4 h-4 text-blue-400" />}
      <span>{toastMessage.message}</span>
      <button
        onClick={closeToast}
        className="ml-2 text-zinc-400 hover:text-white p-0.5"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

