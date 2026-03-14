import { Link } from "react-router-dom";
import { ShoppingBag, User, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="font-heading text-2xl font-semibold tracking-wide text-foreground">
          Wiwi & Cherry
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/shop" className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors">
            Shop
          </Link>

          {userInfo?.isAdmin && (
            <Link to="/admin/dashboard">
              <Button variant="rose" size="sm" className="gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </Link>
          )}

          <Link to="/cart" className="relative">
            <ShoppingBag className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Link>

          {userInfo ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              {/* NEW: Updated Dropdown Content to look like a profile card */}
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1.5">
                    <p className="text-sm font-medium leading-none text-foreground">
                      {userInfo.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userInfo.email}
                    </p>
                    {userInfo.mobile && (
                      <p className="text-xs leading-none text-muted-foreground">
                        +91 {userInfo.mobile}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;