import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="conatiner">
      <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            href="/"
            className="flex items-center hover:text-blue-700 font-medium text-2xl"
          >
            Taichiのブログ
          </Link>
          <div className="block w-auto" id="navbar-dropdown">
            <ul className="flex font-medium  border-gray-100 rounded-lg flex-row space-x-8 mt-0 border-0 bg-white ">
              <li>
                <Link
                  href="https://twitter.com/Arisato_Asumi"
                  className="block py-2 pl-3 pr-4 text-gray-600 rounded hover:bg-gray-100 hover:bg-transparent border-0 hover:text-blue-700 p-0"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/hagoromo2000"
                  className="block py-2 pl-3 pr-4 text-gray-600 rounded hover:bg-gray-100 hover:bg-transparent border-0 hover:text-blue-700 p-0"
                >
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
