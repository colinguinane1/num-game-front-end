"use client";
import Link from "next/link";
import { MdLeaderboard } from "react-icons/md";
import { IoHome } from "react-icons/io5";
import { GoHistory } from "react-icons/go";
import { useState, useEffect, useRef } from "react";
import { CiUser } from "react-icons/ci";
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";
import { AvatarFallback, Avatar } from "@/components/ui/avatar";

export default function Header() {
  const { user } = useUser();
  const Navigation = [
    { name: "Play", href: "/", icon: <IoHome size={20} /> },
    { name: "History", href: "/history", icon: <GoHistory size={20} /> },
    {
      name: "Leaderboard",
      href: "/leaderboard",
      icon: <MdLeaderboard size={20} />,
    },
    {
      name: user ? "User" : "Login",
      href: "/account",
      icon: user ? (
        <Avatar className="w-[20px] h-[20px]">
          <AvatarFallback className="w-[20px] h-[20px] text-xs">
            {user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ) : (
        <CiUser size={20} />
      ),
    },
  ];
  const [currentTab, setCurrentTab] = useState(0);
  const [hoveredTab, setHoveredTab] = useState(0);
  const [tabWidths, setTabWidths] = useState<number[]>([]);

  const tabsRef = useRef<(HTMLAnchorElement | HTMLDivElement | null)[]>([]);
  const GAP_SIZE = 4;

  useEffect(() => {
    const widths = tabsRef.current.map((ref) => ref?.offsetWidth || 0);
    setTabWidths(widths);
  }, []);

  const getTabOffset = (index: number) => {
    return tabWidths
      .slice(0, index)
      .reduce((sum, width) => sum + width + GAP_SIZE, 0);
  };

  return (
    <header className="w-screen fixed bottom-4 z-10">
      <section className="w-full  p-4 flex   items-center justify-between">
        <div className="flex items-center gap-2">
          {/* <Link href="/" className="font-extrabold ">
            <Image src="/icon.png" alt="logo" width={40} height={40} />
          </Link> */}
        </div>
        <div className="items-center justify-center border relative rounded-full bg-secondary/20 backdrop-blur-sm flex gap-1">
          {Navigation.map((nav, index) => (
            <Link
              ref={(el) => {
                tabsRef.current[index] = el;
              }}
              href={nav.href}
              onMouseEnter={() => setHoveredTab(index)}
              onClick={() => setCurrentTab(index)}
              className={`flex items-center gap-1 p-2 px-4 rounded-full relative z-10 hover:text-primary transition-all duration-300 ${
                index === currentTab ? "text-primary" : "text-primary/50"
              }`}
              key={nav.name}
            >
              {nav.icon}
              <p className="text-sm hidden md:block">{nav.name}</p>
            </Link>
          ))}{" "}
          <motion.div
            className="absolute inset-0 bg-secondary/70 rounded-full z-0"
            animate={{
              width: tabWidths[currentTab],
              x: getTabOffset(currentTab),
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <motion.div
            className="absolute inset-0 bg-secondary/40 rounded-full z-0"
            animate={{
              width: tabWidths[hoveredTab],
              x: getTabOffset(hoveredTab),
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>{" "}
        <div></div>
        {/* <UserIcon /> */}
      </section>
    </header>
  );
}
