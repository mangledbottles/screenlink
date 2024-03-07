"use client";
import { getOS } from "@/app/utils";
import { useState } from "react";
import { toast } from "sonner";
import conffetti from "canvas-confetti";
import Link from "next/link";

const navigation = {
  product: [
    { name: "Download for Desktop", href: "/download" },
    {
      name: "GitHub",
      href: "https://github.com/mangledbottles/screenlink-desktop",
    },
  ],
  support: [
    { name: "Pricing", href: "#pricing" },
    { name: "Sign In", href: "/signin" },
    { name: "Create an Account", href: "/signup" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const handleSubscribe = () => {
    if (!email) return toast.error("Please enter a valid email address");

    const os = getOS();

    fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, os }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          conffetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
          toast.success("Subscribed successfully!");
          setEmail("");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-20 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="grid grid-cols-2 gap-8 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-20">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Product
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Support
                </h3>
                <ul role="list" className="mt-6 space-y-2">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 xl:mt-0">
            <h3 className="text-sm font-semibold leading-6 text-white">
              Subscribe to updates
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              Get notified when we add new features or release new versions
            </p>
            <form
              className="mt-6 sm:flex sm:max-w-md"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                className="w-full min-w-0 appearance-none rounded-md border-0 bg-white/5 px-3 py-1.5 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:w-64 sm:text-sm sm:leading-6 xl:w-full"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  onClick={handleSubscribe}
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 md:flex md:items-center md:justify-between lg:mt-24">
          <p className="mt-8 text-xs leading-5 text-gray-400 md:order-1 md:mt-0">
            <Link
              href="/privacy"
              className="text-indigo-500 hover:text-indigo-400"
            >
              Privacy Policy
            </Link>
          </p>
          <p className="mt-8 text-xs leading-5 text-gray-400 md:mt-0">
            ScreenLink {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
