"use client";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  QrCode,
  Layers,
  Image,
  Palette,
  Type,
} from "lucide-react";
import React from "react";
import { ThemeToggleButton } from "./theme-toggle-button";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  freeTools,
  getActiveTools,
  getComingSoonTools,
} from "@/config/free-tools";

const iconMap = {
  QrCode,
  Layers,
  Image,
  Palette,
  Type,
};

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="bg-background/50 fixed z-20 w-full border-b backdrop-blur-3xl"
      >
        <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                {/* <Logo /> */}
                <span>
                  <h1 className="text-2xl font-bold">JustProImages</h1>
                </span>
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>

              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm">
                  <li>
                    {isMounted ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger className="text-muted-foreground hover:text-accent-foreground flex items-center gap-1 duration-150">
                          <span>Free Tools</span>
                          <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-64">
                          {getActiveTools().map((tool) => {
                            const IconComponent = tool.icon
                              ? iconMap[tool.icon as keyof typeof iconMap]
                              : null;
                            return (
                              <DropdownMenuItem key={tool.id} asChild>
                                <Link
                                  href={tool.href}
                                  className="flex items-center gap-2"
                                >
                                  {IconComponent && (
                                    <IconComponent className="h-4 w-4" />
                                  )}
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {tool.name}
                                    </span>
                                    {tool.description && (
                                      <span className="text-xs text-muted-foreground">
                                        {tool.description}
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              </DropdownMenuItem>
                            );
                          })}
                          {getComingSoonTools().length > 0 && (
                            <>
                              <DropdownMenuSeparator />
                              {getComingSoonTools().map((tool) => {
                                const IconComponent = tool.icon
                                  ? iconMap[tool.icon as keyof typeof iconMap]
                                  : null;
                                return (
                                  <DropdownMenuItem
                                    key={tool.id}
                                    disabled
                                    className="opacity-50"
                                  >
                                    <div className="flex items-center gap-2">
                                      {IconComponent && (
                                        <IconComponent className="h-4 w-4" />
                                      )}
                                      <div className="flex flex-col">
                                        <span className="font-medium">
                                          {tool.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          Coming Soon
                                        </span>
                                      </div>
                                    </div>
                                  </DropdownMenuItem>
                                );
                              })}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <span className="text-muted-foreground hover:text-accent-foreground flex items-center gap-1 duration-150">
                        <span>Free Tools</span>
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    )}
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-foreground">
                      Free Tools
                    </h3>
                    <ul className="space-y-3">
                      {getActiveTools().map((tool) => {
                        const IconComponent = tool.icon
                          ? iconMap[tool.icon as keyof typeof iconMap]
                          : null;
                        return (
                          <li key={tool.id}>
                            <Link
                              href={tool.href}
                              className="text-muted-foreground hover:text-accent-foreground flex items-center gap-3 duration-150"
                              onClick={() => setMenuState(false)}
                            >
                              {IconComponent && (
                                <IconComponent className="h-5 w-5" />
                              )}
                              <div className="flex flex-col">
                                <span className="font-medium">{tool.name}</span>
                                {tool.description && (
                                  <span className="text-sm text-muted-foreground">
                                    {tool.description}
                                  </span>
                                )}
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                      {getComingSoonTools().map((tool) => {
                        const IconComponent = tool.icon
                          ? iconMap[tool.icon as keyof typeof iconMap]
                          : null;
                        return (
                          <li key={tool.id} className="opacity-50">
                            <div className="flex items-center gap-3">
                              {IconComponent && (
                                <IconComponent className="h-5 w-5" />
                              )}
                              <div className="flex flex-col">
                                <span className="font-medium">{tool.name}</span>
                                <span className="text-sm text-muted-foreground">
                                  Coming Soon
                                </span>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button asChild variant="outline" size="sm">
                  <Link href="/login" onClick={() => setMenuState(false)}>
                    <span>Login</span>
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup" onClick={() => setMenuState(false)}>
                    <span>Sign Up</span>
                  </Link>
                </Button>
                <ThemeToggleButton />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
