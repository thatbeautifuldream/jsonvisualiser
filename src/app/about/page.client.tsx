"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTheme } from "next-themes";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export function AboutContent() {
  const { theme } = useTheme();

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none"
      >
        <motion.p
          {...fadeInUp}
          className="text-base/7 font-semibold text-primary"
        >
          A Developer&apos;s Journey with JSON
        </motion.p>
        <motion.h1
          {...fadeInUp}
          transition={{ delay: 0.1 }}
          className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-foreground sm:text-5xl"
        >
          From Frustration to Innovation
        </motion.h1>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="mt-10 grid max-w-xl grid-cols-1 gap-8 text-base/7 text-muted-foreground lg:max-w-none lg:grid-cols-2"
        >
          <motion.div variants={fadeInUp}>
            <p>
              Hi, I&apos;m Milind, and this project emerged from my daily
              struggles as a developer. One late night, while debugging a
              particularly complex API response, I found myself lost in a maze
              of nested JSON objects. The standard tools weren&apos;t cutting it
              - they either oversimplified the data or made it even more
              confusing to navigate.
            </p>
            <p className="mt-8">
              I remember thinking, &quot;There has to be a better way.&quot;
              After trying countless JSON viewers and feeling frustrated with
              their limitations, I decided to build something that would
              actually make sense to developers like me who work with complex
              data structures daily.
            </p>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <p>
              What started as a personal tool quickly evolved into something
              more. I focused on creating an interface that I would want to use
              - one that combines the simplicity of a basic JSON viewer with
              powerful features like collapsible sections, intuitive navigation,
              and most importantly, a clean visual hierarchy that helps you
              understand the data structure at a glance.
            </p>
            <p className="mt-8">
              Today, this tool represents my vision of what JSON visualization
              should be - straightforward, powerful, and actually helpful.
              Whether you&apos;re debugging an API, exploring data structures,
              or just trying to make sense of a complex JSON file, I hope this
              tool makes your development journey a little bit easier.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex"
        >
          <Button asChild>
            <Link href="/">Start Visualizing</Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="relative overflow-hidden pt-16 lg:pt-20"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.img
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            alt="JSON Visualizer Interface"
            src={
              theme === "dark"
                ? "https://github.com/user-attachments/assets/b1d2e01d-6385-4ec6-bcc7-fa1657765f29"
                : "https://github.com/user-attachments/assets/e038b166-1187-45fb-ab2e-95fae2223742"
            }
            className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-border"
          />
          <div aria-hidden="true" className="relative">
            <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-background pt-[7%]" />
          </div>
        </div>
      </motion.div>
    </>
  );
}
