import {Clipboard, PauseCircle, PlayCircle, Plus} from "lucide-react";
import React from "react";
import {Button} from "./ui/button";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {ThemeToggle} from "@/components/theme-toggle";

const Navbar = () => {
    const isMonitoring = true;
    return (
        <nav className=" backdrop-blur-md border-b dark:border-white/30 px-6 py-3 animate-fade-in">
            <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
                <div className={'flex items-center gap-2'}>
                    <SidebarTrigger/>
                    Copy board
                </div>

                <div className="flex items-center gap-3">
                    {/* Monitor Toggle */}
                    <Button
                        // onClick={onToggleMonitoring}
                        // variant={isMonitoring ? "default" : "outline"}
                        className="gap-2"
                    >
                        {isMonitoring ? (
                            <>
                                <PauseCircle className="w-4 h-4"/>
                                <span className="hidden sm:inline">Monitoring</span>
                            </>
                        ) : (
                            <>
                                <PlayCircle className="w-4 h-4"/>
                                <span className="hidden sm:inline">Monitor Clipboard</span>
                            </>
                        )}
                    </Button>

                    {/* New Clip Button */}
                    <Button
                        // onClick={onNewClip}
                        variant="default"
                        className="gap-2"
                    >
                        <Plus className="w-4 h-4"/>
                        <span className="hidden sm:inline">New Clip</span>
                    </Button>

                    <ThemeToggle/>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
