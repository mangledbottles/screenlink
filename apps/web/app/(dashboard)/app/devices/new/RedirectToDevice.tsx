"use client";
import { navigate } from "@/actions";
import { useEffect } from "react";

interface RedirectToDeviceProps {
  deviceCode: string;
}

export const RedirectToDevice = ({ deviceCode }: RedirectToDeviceProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`screenlinkDesktop://deviceCode=${deviceCode}`);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative">
      <div className="relative max-w-6xl mx-auto ">
        <div className="bg-[#0E131D] shadow sm:rounded-lg">
          <p className="mt-6 text-lg leading-8 text-gray-400">
            Success! You can now close this window
          </p>
        </div>
      </div>
    </section>
  );
};
