import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SettingsProvider } from "../../contexts/settings-context";
import { UserProvider } from "../../contexts/user-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TopNav } from "@/components/top-nav";
import { Sidebar } from "@/components/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <SettingsProvider>
        <TooltipProvider delayDuration={0}>
          <SidebarProvider>
            <Sidebar />
            <SidebarInset>
              <TopNav />
              <div className="mx-auto">
                <main className="w-full">{children}</main>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </SettingsProvider>
    </UserProvider>
  );
}
