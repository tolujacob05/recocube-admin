import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/navbar";
import SideBarMd from "./components/side-bar-md";
import Inventory from "./components/routes/inventory";
import Category from "./components/routes/categories";
// import Log from "./components/routes/log";

function App() {
  return (
    <Router>
      <div className="grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] h-40">
        {/* Sidebar */}
        <SideBarMd />

        <div className="flex flex-col w-full">
          {/* Header */}
          <Header />

          {/* Main content area */}
          <div className="p-4">
            <Routes>
              {/* Landing Page Route */}
              <Route path="/" element={<Inventory />} />
              <Route path="/category" element={<Category />} />
              {/* <Route path="/log" element={<Log />} /> */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
