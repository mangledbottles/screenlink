"use client";
import { useState } from "react";
import { toast } from "sonner";

interface AuthorizeDeviceProps {
  confirmDevice: () => Promise<void>;
}

export const AuthorizeDevice = ({ confirmDevice }: AuthorizeDeviceProps) => {
  const [isButtonClickable, setIsButtonClickable] = useState(true);
  const handleButtonClick = () => {
    setIsButtonClickable(false);
    toast.promise(confirmDevice, {
      loading: "Authorizing device...",
      success: "Device authorized! Redirecting to desktop application...",
      error: "Failed to authorize device",
    });
  };

  const buttonClasses = `inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
    isButtonClickable ? "bg-indigo-600" : "bg-gray-400 cursor-not-allowed"
  }`;

  return (
    <button
      className={buttonClasses}
      onClick={handleButtonClick}
      disabled={!isButtonClickable}
    >
      Yes! Log me in
    </button>
  );
};
