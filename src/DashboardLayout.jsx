import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Search,
  BarChart3,
  FileText,
  Settings,
  Moon,
  Sun
} from "lucide-react";

export default function DashboardLayout({ children }) {

  const [collapsed,setCollapsed] = useState(false);
  const [dark,setDark] = useState(false);

  return (
    <div className={dark ? "dark app" : "app"}>

      {/* Sidebar */}
      <aside className={collapsed ? "sidebar collapsed" : "sidebar"}>

        <div className="logo">
          <div className="logo-circle">U</div>
          {!collapsed && <span>UML Portal</span>}
        </div>

        <nav>

          <SidebarItem icon={<LayoutDashboard size={18}/>} label="Dashboard"/>
          <SidebarItem icon={<Search size={18}/>} label="New Analysis"/>
          <SidebarItem icon={<BarChart3 size={18}/>} label="Results"/>
          <SidebarItem icon={<FileText size={18}/>} label="Reports"/>
          <SidebarItem icon={<Settings size={18}/>} label="Settings"/>

        </nav>

        <button
          className="collapse"
          onClick={()=>setCollapsed(!collapsed)}
        >
          {collapsed ? "→" : "←"}
        </button>

      </aside>


      {/* Main Section */}
      <main className="main">

        {/* Topbar */}
        <header className="topbar">

          <div className="title">
            Maintainability Dashboard
          </div>

          <div className="top-actions">

            <button
              className="theme-btn"
              onClick={()=>setDark(!dark)}
            >
              {dark ? <Sun size={18}/> : <Moon size={18}/>}
            </button>

            <div className="avatar">R</div>

          </div>

        </header>

        {/* Animated Content */}
        <motion.div
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.35}}
          className="content"
        >
          {children}
        </motion.div>

      </main>

    </div>
  );
}



function SidebarItem({icon,label}){

  return(
    <button className="nav-item">

      <span className="icon">{icon}</span>

      <span className="label">{label}</span>

    </button>
  )
}