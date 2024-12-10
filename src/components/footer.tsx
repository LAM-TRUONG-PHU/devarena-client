import React from "react";
import Image from "next/image";
import { FaDiscord, FaGithub } from "react-icons/fa";
import Link from "next/link";
export default function Footer() {
    return (
        <footer className="bg-white">
            <div className="container p-6 pr-8 gap-6 flex justify-between pb-6">
                {/* Logo and Social Icons */}
                <div className="flex flex-col items-start">
                    <Image
                        className="dark:invert"
                        src="/logo2.png"
                        alt="DevArena logo"
                        width={150}
                        height={150}
                    />
                    <div className="flex space-x-4 pt-2">
                        <button
                            type="button"
                            className="flex-1 bg-blue_discord text-white p-2 rounded-xl shadow hover:brightness-110"
                        >
                            <FaDiscord className="w-6 h-6 mx-auto" />
                        </button>
                        <button
                            type="button"
                            className="flex-1 bg-gray-800 p-2 rounded-xl text-white  hover:brightness-110"
                        >
                            <FaGithub className="w-6 h-6 mx-auto" />
                        </button>
                        <a
                            href="https://telegram.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-500 hover:text-pink-700"
                        >
                            <i className="fab fa-telegram text-xl"></i>
                        </a>
                        <a
                            href="https://example.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-500 hover:text-pink-700"
                        >
                            <i className="fas fa-globe text-xl"></i>
                        </a>
                    </div>
                </div>

                {/* Help Center Links */}
                <div className="flex gap-20 pt-2">
                    <div className="flex flex-col items-center sm:items-start">
                        <h3 className="font-semibold mb-2">Help Center</h3>
                        <ul className="space-y-1">
                            <li>
                                <Link href="#" className="text-foreground hover:text-pink_primary">
                                    Report an Issue
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-foreground hover:text-pink_primary">
                                    Feedback
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-foreground hover:text-pink_primary">
                                    Terms and Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-foreground hover:text-pink_primary">
                                    GitHub
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Our Services */}
                    <div className="flex flex-col items-center sm:items-start">
                        <h3 className="font-semibold mb-2">Our Services</h3>
                        <ul className="space-y-1">
                            <li>
                                <Link href="#" className="text-foreground hover:text-pink_primary">
                                    Docs
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-foreground hover:text-pink_primary">
                                    Terms of Website
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-foreground hover:text-pink_primary">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="py-6 text-center text-gray-500 text-sm border-t border-gray-500">
                <p>A House of Commons Initiative. Polka Labs Private Limited 2024</p>
                <p>All rights reserved.</p>
            </div>
        </footer>
    );
}
