import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import HelpCard from "./help-card";
import logo from "@/assets/logo.png";
import { NavLink } from "react-router-dom";

const SidebarMobile = () => {
  // const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (to: string) => {
    navigate(to);
  };

  return (
    <div className="flex flex-col md:hidden">
      <div className="flex items-center justify-center px-4 h-14">
        <img src={logo} alt="Logo" className="" />
        <h3 className="font-bold bg-gradient-text text-gradient-text bg-clip-text">
          Admin
        </h3>
      </div>
      {/* Navigation and button for mobile sidebar */}
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

      {/* Help card at the bottom */}
      <div className="p-4 mt-20">
        <HelpCard />
      </div>
    </div>
  );
};

export default SidebarMobile;
