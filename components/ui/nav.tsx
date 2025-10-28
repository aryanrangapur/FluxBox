'use client'

import * as React from "react";
import { UserButton } from "@clerk/nextjs";
import { Box } from "lucide-react";


const NavBar: React.FC = () => {

    return (
        <nav className="bg-gradient-to-r from-white-600 to-white-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-black/10 p-2 rounded-lg backdrop-blur-sm">
                            <Box className="h-6 w-6 text-black-50" strokeWidth={0.75} />
                        </div>
                        <div>
                            <h1 className="text-2xl text-black tracking-tight">
                                Flux Box
                            </h1>
                            <p className="text-xs text-black/80 font-medium">
                            Store now. Get it later.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <UserButton 
                            appearance={{
                                elements: {
                                    avatarBox: "h-20 w-20"
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
};
export default NavBar;