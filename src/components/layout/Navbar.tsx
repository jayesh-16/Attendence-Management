
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  Users, 
  Book, 
  Settings, 
  Bell,
  BarChart,
  ChevronDown,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Calendar, label: "Attendance", path: "/attendance" },
    { icon: Users, label: "Students", path: "/students" },
    { icon: Book, label: "Classes", path: "/classes" },
    { icon: BarChart, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`;
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <nav className="sticky top-0 z-10 w-full bg-gradient-primary text-white shadow-md h-16 px-4 sm:px-6">
      <div className="h-full flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <div className="flex items-center gap-2 mr-8">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
              <Book size={18} />
            </div>
            <h1 className="text-lg font-semibold text-white hidden sm:block">AttendTrack</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    {
                      "bg-white/20 text-white": isActive,
                      "hover:bg-white/10 text-white/80": !isActive,
                    }
                  )
                }
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* User Menu and Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white/90 hover:text-white hover:bg-white/10 relative"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive animate-pulse"></span>
          </Button>

          {/* Mobile Navigation */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="gap-1 text-white hover:bg-white/10">
                Menu <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Navigation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {navItems.map((item) => (
                <DropdownMenuItem key={item.path} asChild>
                  <NavLink 
                    to={item.path}
                    className="flex items-center gap-2 w-full cursor-pointer"
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full overflow-hidden hover:bg-white/10" size="icon">
                <Avatar className="h-9 w-9 border-2 border-white/20">
                  <AvatarImage src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${getInitials()}&background=random&color=fff`} />
                  <AvatarFallback className="bg-purple-medium text-white">{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {profile?.first_name && profile?.last_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : user?.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2" onSelect={() => navigate('/settings')}>
                <Settings size={16} />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive flex items-center gap-2" onSelect={handleSignOut}>
                <LogOut size={16} />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
