import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Icon } from "@iconify/react";
import HelpCard from "./help-card";
import { NavLink } from "react-router-dom";

const SidebarMd = () => {
  const navigate = useNavigate();

  const handleClick = (to: string) => {
    navigate(to);
  };

  return (
    <div className="hidden border-r bg-muted md:block">
      <div className="flex flex-col h-full max-h-screen gap-2">
        <div className="flex h-20 items-center px-4 lg:h-[100px] lg:px-10">
          <img src={logo} alt="Logo" />
        </div>

        <nav className="grid items-start p-4 space-y-3 text-sm font-medium">
          <div className="flex items-center justify-center gap-3 px-3 py-2 transition-colors duration-200 rounded-lg">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center w-full gap-3 px-4 py-2 rounded-md transition-all duration-200 ${
                  isActive
                    ? "bg-blue-500 text-white border-blue-700"
                    : "text-gray-700 hover:bg-blue-100 hover:border-blue-500 hover:text-blue-700 border border-transparent"
                }`
              }
              onClick={() => handleClick("/")}
            >
              <Icon icon="solar:shop-linear" className="w-5 h-5 font-bold" />
              Inventory
            </NavLink>
          </div>

          <div className="flex items-center gap-3 px-3 py-2 transition-colors duration-200 rounded-lg">
            <NavLink
              to="/category"
              className={({ isActive }) =>
                `flex items-center w-full gap-3 px-4 py-2 rounded-md transition-all duration-200 ${
                  isActive
                    ? "bg-blue-500 text-white border-blue-700"
                    : "text-gray-700 hover:bg-blue-100 hover:border-blue-500 hover:text-blue-700 border border-transparent"
                }`
              }
              onClick={() => handleClick("/category")}
            >
              <Icon icon="iconoir:lot-of-cash" className="w-5 h-5 font-bold" />
              Categories
            </NavLink>
          </div>

          {/* <div className="flex items-center gap-3 px-3 py-2 transition-colors duration-200 rounded-lg">
          <NavLink
            to="/log"
            className={({ isActive }) =>
              `flex items-center w-full gap-3 px-4 py-2 rounded-md transition-all duration-200 ${
                isActive
                  ? "bg-blue-500 text-white border-blue-700"
                  : "text-gray-700 hover:bg-blue-100 hover:border-blue-500 hover:text-blue-700 border border-transparent"
              }`
            }
            onClick={() => handleClick("/log")}
          >
            <Icon
              icon="solar:clipboard-text-outline"
              className="w-5 h-5 font-bold"
            />
            Logs
          </NavLink>
        </div> */}

          <div className="flex items-center gap-3 px-3 py-2 transition-colors duration-200 rounded-lg">
            <NavLink
              to="#"
              className="flex items-center w-full gap-3 px-4 py-2 rounded-md transition-all duration-200"
            >
              <Icon
                icon="fluent:settings-20-regular"
                className="w-5 h-5 font-bold"
              />
              Log
            </NavLink>
          </div>

          <div className="flex items-center gap-3 px-3 py-2 transition-colors duration-200 rounded-lg">
            <NavLink
              to="#"
              className="flex items-center w-full gap-3 px-4 py-2 rounded-md transition-all duration-200"
            >
              <Icon
                icon="fluent:settings-20-regular"
                className="w-5 h-5 font-bold"
              />
              Settings
            </NavLink>
          </div>
        </nav>

        <div className="p-4 mt-auto">
          <HelpCard />
        </div>
      </div>
    </div>
  );
};

export default React.memo(SidebarMd);
