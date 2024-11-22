import React, { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
// import ThemeToggle from "./theme-toggle";
import SideBarMd from "./side-bar-md";
import SidebarMobile from "./side-bar-mobile";
import ThemeToggle from "./theme-toggle";
import { useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation(); // Get the current route location
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarOpen = () => setIsSidebarOpen(true);

  const getHeaderText = (path: string) => {
    switch (path) {
      case "/":
        return "Inventory";
      case "/category":
        return "Category Management";
      case "/log":
        return "Logs";
      // Add other routes here as needed
      default:
        return "Inventory"; // Default text
    }
  };

  return (
    <header className="flex h-20 items-center gap-4 border-b px-6 lg:h-[90px] lg:px-10">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
            onClick={handleSidebarOpen} // Open sidebar
          >
            <Menu className="w-5 h-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <SideBarMd />
          <SidebarMobile />
        </SheetContent>
      </Sheet>

      <h4 className="text-xl font-semibold text-gray-800 dark:text-[#F4F6FF]">
        {getHeaderText(location.pathname)}
      </h4>

      <Button
        size="icon"
        variant={"ghost"}
        className="w-8 h-8 ml-auto shadow-none bg-inherit"
      >
        <Bell className="w-5 h-5" color="#333333" />
        <span className="sr-only">Toggle notifications</span>
      </Button>

      <Separator className="h-8" orientation="vertical" />

      <ThemeToggle />
      <Separator className="h-8" orientation="vertical" />
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              {" "}
              <div className="flex items-center justify-center w-10 h-10 m-1 rounded-full">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full hover:bg-secondary/50"
                >
                  <Icon
                    icon="bxs:user"
                    width="17"
                    height="17"
                    className="text-primary/50"
                  />
                </Button>
              </div>
              <span className="hidden pl-2 text-muted-foreground md:block">
                Big Tech
              </span>{" "}
            </NavigationMenuTrigger>

            <NavigationMenuContent className="w-[100px] p-4 py-2 space-y-1 flex flex-col justify-center items-center">
              <NavigationMenuLink className="text-black hover:text-primary w-[100px] text-nowrap text-center text-sm">
                My Account
              </NavigationMenuLink>
              <Separator />
              <NavigationMenuLink className="text-sm text-center text-muted-foreground hover:text-primary">
                Settings
              </NavigationMenuLink>
              <Separator />
              <NavigationMenuLink className="text-sm text-center text-muted-foreground hover:text-primary">
                Support
              </NavigationMenuLink>
              <Separator />
              <NavigationMenuLink className="text-sm text-center text-muted-foreground hover:text-primary">
                Logout
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

export default Header;
