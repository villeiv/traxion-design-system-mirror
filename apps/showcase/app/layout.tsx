import type {Metadata} from "next";
import "./globals.css";
import {TooltipProvider, Toaster } from "@traxion-global/design-system/react";
import * as React from "react";

export const metadata: Metadata = {
    title: 'Traxión – OSS',
    description: 'Traxión – OSS',
    generator: 'Traxión',
}

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
            <body className={`antialiased`}>
                {/* TooltipProvider */}
                <TooltipProvider>
                    {/* Toaster */}
                    <Toaster position={"top-right"} closeButton={true}/>
                    {children}
                </TooltipProvider>
            </body>
        </html>
    );
}
