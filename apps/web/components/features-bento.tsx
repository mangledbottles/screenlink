"use client";
import { cn } from "@/utils/cn";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconBrandApple,
  IconBrandUbuntu,
  IconBrandWindows,
  IconCode,
  IconCrown,
  IconDevices,
  IconLink,
  IconSettings,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { IconLock } from "@tabler/icons-react";
import { GithubIcon } from "lucide-react";
import { FollowerPointerCard } from "./ui/following-pointer";
import Link from "next/link";

export function FeaturesBento() {
  return (
    <section className="relative mt-20">
      <div className="mx-auto pb-12">
        <h2 className="h2 font-hkgrotesk mb-4 pb-4 text-center">
          Powerful Features
        </h2>

        <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={cn("[&>p:text-lg]", item.className)}
              icon={item.icon}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl   dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
);

const InstantSharingSkeleton = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <FollowerPointerCard>
      <motion.div
        initial="initial"
        whileHover="animate"
        className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2 select-none"
      >
        <motion.div
          variants={variants}
          className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 bg-white dark:bg-black"
        >
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
          <div className="w-full h-5 rounded-full dark:bg-neutral-900">
            <p className="sm:text-sm text-xs font-semibold text-neutral-500 ml-2">
              screenlink.io/view/cltg1xj3
            </p>
          </div>
        </motion.div>
        <motion.div
          variants={variantsSecond}
          className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 w-9/10 ml-auto bg-white dark:bg-black"
        >
          <div className="w-full bg-gray-100 h-5 rounded-full dark:bg-neutral-900">
            <p className="sm:text-sm text-xs font-semibold text-neutral-500 mx-2">
              screenlink.io/view/dtg9s
            </p>
          </div>
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
        </motion.div>
        <motion.div
          variants={variants}
          className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 bg-white dark:bg-black"
        >
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
          <div className="w-full h-5 rounded-full dark:bg-neutral-900">
            <p className="sm:text-sm text-xs font-semibold text-neutral-500 ml-2">
              screenlink.io/view/p93jcn8
            </p>
          </div>
        </motion.div>
      </motion.div>
    </FollowerPointerCard>
  );
};

const CrossPlatformSkeleton = () => {
  const variants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
      },
    },
  };

  const platforms = [
    { name: "MacOS", icon: <IconBrandApple /> },
    { name: "Windows", icon: <IconBrandWindows /> },
    { name: "Linux", icon: <IconBrandUbuntu /> },
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2 items-center justify-center"
    >
      <div className="flex flex-row space-x-4">
        {platforms.map((platform, i) => (
          <Link href="/download" key={platform.name}>
            <motion.div
              key={"platform-" + i}
              variants={variants}
              className="flex flex-col items-center"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 dark:bg-black">
                {platform.icon}
              </div>
              <span className="mt-2 text-sm font-semibold">
                {platform.name}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

const PrivacySkeleton = () => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col space-y-2"
      style={{
        background:
          "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
        backgroundSize: "400% 400%",
      }}
    >
      <motion.div className="h-full w-full rounded-lg"></motion.div>
    </motion.div>
  );
};

const TeamSkeleton = () => {
  const cardVariants = {
    initial: {
      y: 20,
      opacity: 0,
    },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
    hover: {
      scale: 1.05,
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    },
  };

  const roles = [
    {
      name: "Owner",
      color: "red",
      description: "Owner of the project",
      icon: <IconCrown />,
    },
    {
      name: "Admin",
      color: "orange",
      description: "Manage users and billing",
      icon: <IconSettings />,
    },
    {
      name: "Member",
      color: "green",
      description: "Create and share ScreenLinks!",
      icon: <IconUser />,
    },
  ];

  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-4 items-center justify-center"
      >
        {roles.map((role, i) => (
          <motion.div
            key={role.name}
            custom={i}
            variants={cardVariants}
            whileHover="hover"
            className="h-full w-1/3 rounded-2xl bg-white p-6 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center shadow-md"
          >
            <div
              className={
                "w-16 h-16 rounded-full bg-${role.color}-100 dark:bg-${role.color}-900/20 flex items-center justify-center mb-4"
              }
            >
              <span className={"text-${role.color}-600 text-3xl"}>
                {role.icon}
              </span>
            </div>
            <h3 className="text-lg font-semibold">{role.name}</h3>
            <p className="text-sm text-center text-neutral-500 mt-2">
              {role.description}
            </p>
            <p
              className={`border border-${role.color}-500 bg-${role.color}-100 dark:bg-${role.color}-900/20 text-${role.color}-600 text-xs rounded-full px-2 py-0.5 mt-4`}
            >
              {role.name}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};

const OpenSourceSkeleton = () => {
  const iconVariants = {
    initial: {
      scale: 1,
      rotate: 0,
    },
    hover: {
      scale: 1.2,
      rotate: 360,
      transition: {
        duration: 0.5,
      },
    },
  };

  const explodeVariants = {
    hover: {
      opacity: [0, 1, 0],
      scale: [0.3, 1.2, 0.3],
      transition: {
        duration: 1.8,
        times: [0, 0.5, 1],
        delay: 0.2,
      },
    },
  };

  const randomPosition = () => {
    const angle = Math.random() * Math.PI * 2;
    const radius = 60 + Math.random() * 40;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] items-center justify-center overflow-hidden"
    >
      <motion.div variants={iconVariants} className="relative">
        <a href="https://github.com/mangledbottles/screenlink" target="_blank">
          <GithubIcon className="text-6xl text-neutral-700 dark:text-neutral-300 cursor-pointer" />
        </a>
        {[...Array(30)].map((_, index) => (
          <motion.div
            key={index}
            variants={explodeVariants}
            className="absolute top-1/2 left-1/2 opacity-0"
            style={{
              ...randomPosition(),
              originX: "50%",
              originY: "50%",
            }}
          >
            <GithubIcon className="text-xl text-neutral-700 dark:text-neutral-300" />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

const items = [
  {
    title: "Instant Sharing",
    description: (
      <span className="text-sm">
        Get shareable links instantly after recording your screen.
      </span>
    ),
    header: <InstantSharingSkeleton />,
    className: "md:col-span-1",
    icon: <IconLink className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Cross-Platform Support",
    description: (
      <span className="text-sm">
        Record your screen on MacOS, Windows, or Linux seamlessly.
      </span>
    ),
    header: <CrossPlatformSkeleton />,
    className: "md:col-span-1",
    icon: <IconDevices className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Privacy-Focused",
    description: (
      <span className="text-sm">
        No data harvesting. Ensure your recordings remain private and secure.
      </span>
    ),
    header: <PrivacySkeleton />,
    className: "md:col-span-1",
    icon: <IconLock className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Team Collaboration",
    description: (
      <span className="text-sm">
        Collaborate and manage your team with role-based permissions.
      </span>
    ),
    header: <TeamSkeleton />,
    className: "md:col-span-2",
    icon: <IconUsers className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Open Source",
    description: (
      <span className="text-sm">
        Benefit from transparency and security focused development.
      </span>
    ),
    header: <OpenSourceSkeleton />,
    className: "md:col-span-1",
    icon: <IconCode className="h-4 w-4 text-neutral-500" />,
  },
];
