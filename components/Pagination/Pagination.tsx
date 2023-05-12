import { getPageLink } from "@/lib/blog-helper";
import Link from "next/link";
import React from "react";

type Props = {
  numberOfPage: number;
  tag: string;
  currentPage: string;
};

const Pagination = (props: Props) => {
  const { numberOfPage, tag, currentPage } = props;

  let pages: number[] = [];
  for (let i = 1; i <= numberOfPage; i++) {
    pages.push(i);
  }
  const currentPageToNumber = parseInt(currentPage, 10);

  return (
    <section className="mb-8 lg:w-1/2 mx-auto rounded-md p-5">
      <ul className="flex items-center justify-center gap-4">
        {pages.map((page) => (
          <Link key={page} href={getPageLink(tag, page)}>
            {/* pageとcurrentPageが一致したらbg-sky-400にする */}
            <li
              className={`${
                page == currentPageToNumber ? "bg-sky-400" : "bg-sky-900"
              } rounded-lg w-6 h-8 relative hover:bg-sky-400`}
            >
              <div className="text-xs absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 text-gray-100 ">
                {page}
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </section>
  );
};

export default Pagination;
