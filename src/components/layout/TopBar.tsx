
import { Bell, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TopBarProps {
  className?: string;
}

const TopBar = ({ className }: TopBarProps) => {
  return (
    <header
      className={cn(
        "h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm",
        className
      )}
    >
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search students, classes..."
          className="pl-10 h-9 bg-muted/50 w-full focus-visible:bg-background transition-colors"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground relative"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive animate-pulse"></span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings size={20} />
        </Button>
        <Avatar className="h-9 w-9 ml-2">
          <AvatarImage src="https://ui-avatars.com/api/?name=Sarah+Teacher" />
          <AvatarFallback>ST</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default TopBar;
