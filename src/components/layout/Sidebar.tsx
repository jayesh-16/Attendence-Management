
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  Users, 
  Book, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  Bell,
  BarChart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [expanded, setExpanded] = useState(true);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Calendar, label: "Attendance", path: "/attendance" },
    { icon: Users, label: "Students", path: "/students" },
    { icon: Book, label: "Classes", path: "/classes" },
    { icon: BarChart, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  if (isMobile && expanded) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={toggleSidebar}>
        <aside
          className={cn(
            "h-full w-64 flex flex-col bg-sidebar border-r border-sidebar-border p-4 animate-slide-in",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <SidebarContent expanded={expanded} toggleSidebar={toggleSidebar} navItems={navItems} />
        </aside>
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex-shrink-0 border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
        expanded ? "w-64" : "w-20",
        className
      )}
    >
      <SidebarContent expanded={expanded} toggleSidebar={toggleSidebar} navItems={navItems} />
    </aside>
  );
};

interface SidebarContentProps {
  expanded: boolean;
  toggleSidebar: () => void;
  navItems: { icon: any; label: string; path: string }[];
}

const SidebarContent = ({ expanded, toggleSidebar, navItems }: SidebarContentProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8 mt-2 px-2">
        {expanded ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <span className="font-bold text-lg">A+</span>
            </div>
            <h1 className="text-lg font-semibold text-foreground">AttendTrack</h1>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white mx-auto">
            <span className="font-bold text-lg">A+</span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
          {expanded ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      <nav className="space-y-1 px-2 flex-1">
        <TooltipProvider delayDuration={100}>
          {navItems.map((item) => (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                      {
                        "bg-sidebar-accent text-sidebar-accent-foreground": isActive,
                        "hover:bg-sidebar-accent/50": !isActive,
                        "justify-center": !expanded,
                      }
                    )
                  }
                >
                  <item.icon size={20} />
                  {expanded && <span>{item.label}</span>}
                </NavLink>
              </TooltipTrigger>
              {!expanded && (
                <TooltipContent side="right">{item.label}</TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>

      <div className="mt-auto pt-4 border-t border-sidebar-border">
        {expanded ? (
          <div className="px-3 py-2 flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://ui-avatars.com/api/?name=Sarah+Teacher" />
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Sarah Teacher</p>
              <p className="text-xs text-muted-foreground truncate">Math Department</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://ui-avatars.com/api/?name=Sarah+Teacher" />
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
