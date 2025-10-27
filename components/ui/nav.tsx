'use client'
 

import * as React from "react";
import {UserButton} from "@clerk/nextjs";

const NavBar: React.FC = () => {
    return (
    <nav className="p-4 justify-between flex items-center">
        <div>
            <h1>Flux Box</h1>
        </div>
        <div className="">
        <UserButton />
        </div>
    </nav>
    );
};

export default NavBar;