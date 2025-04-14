import React from "react";
import MenuItem from "@/components/MenuItem";
import { navigationData } from "@/data/navigation";
import { Rocket } from "lucide-react";
import { NavigationSection } from "@/types/navigation";

export const Sidebar = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <aside
      className={`bg-card border-r border-border h-screen transition-all duration-300 fixed left-0 top-0 z-0 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 py-2 border-b border-border">
        <div className="flex items-center h-12">
          <Rocket className="w-6 h-6 text-primary" />
          {!isCollapsed && (
            <span className="text-2xl font-bold text-primary ml-3">
              co
              <span className="font-extralight text-muted-foreground">
                Launch
              </span>
            </span>
          )}
        </div>
      </div>
      <nav className="mt-4 px-2 space-y-6">
        {navigationData.map((section) => (
          <div key={section.title} className="space-y-2">
            {!isCollapsed && (
              <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item: NavigationSection["items"][0]) => (
                <MenuItem
                  key={item.label}
                  item={item}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};
