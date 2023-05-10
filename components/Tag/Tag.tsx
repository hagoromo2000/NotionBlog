import Link from "next/link";
import React from "react";

type Props = {
  tags: string[];
};

const Tag = (props: Props) => {
  const { tags } = props;

  return (
    <div className="mx-4">
      <section className="lg:w-1/2 mb-8 mx-auto bg-sky-200 rounded-md p-5 shadow-2xl ">
        <div className="font-bold mb-4">タグ検索</div>
        <div className="flex flex-wrap gap-5">
          {tags.map((tag: string) => (
            <Link href={`/posts/tag/${tag}/page/1`} key={tag}>
              <span className="cursor-pointer px-2 font-medium pb-1 rounded-xl bg-gray-400 inline-block hover:bg-gray-100">
                {tag}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Tag;
