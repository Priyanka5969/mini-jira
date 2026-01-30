import { useState, useEffect } from "react";

export default function ErrorNotification({ error, onRetry, onDismiss }) {
  const [show, setShow] = useState(!!error);

  useEffect(() => {
    setShow(!!error);
  }, [error]);

  if (!show || !error) return null;

  const isBackendDown = 
    error.message?.includes('timeout') ||
    error.message?.includes('network') ||
    error.code === 'ERR_NETWORK' ||
    error.code === 'ECONNABORTED' ||
    !error.response;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-red-800 font-semibold mb-1">
              {isBackendDown ? "Backend is Starting Up" : "Error"}
            </h3>
            <p className="text-red-700 text-sm mb-2">
              {isBackendDown 
                ? "The server is waking up (this may take up to 60 seconds). Please wait..."
                : error.message || "Something went wrong. Please try again."}
            </p>
            {onRetry && (
              <button
                onClick={() => {
                  onRetry();
                  setShow(false);
                }}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 mr-2"
              >
                Retry
              </button>
            )}
            <button
              onClick={() => {
                setShow(false);
                if (onDismiss) onDismiss();
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

