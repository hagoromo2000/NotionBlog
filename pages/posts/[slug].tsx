import { getSinglePost } from "@/lib/notionAPI";
import React from "react";

// URLからslugを取得して、getStaticPropsに渡す
export const getStaticProps = async ({ params }: { params: any }) => {
  const post = await getSinglePost(params.slug);
  return {
    props: {
      post,
    },
    // ISR (Incremental Static Regeneration) 一日ごとに内容を更新する
    revalidate: 60 * 60 * 24,
  };
};

const Post = () => {
  return (
    <section className="container lg:px-2 px-5 h-screen lg:w-2/5 mx-auto mt-20">
      <h2 className="w-full text-2xl font-medium">3回目の投稿です。</h2>
      <div className="border-b-2 w-1/3 mt-1 border-sky-900"></div>
      <span className="text-gray-500">2023/05/05</span>
      <br />
      <p className="text-white bg-sky-900 rounded-xl font-medium mt-2 px-2 inline-block">
        Next.js
      </p>
      <div className="mt-10 font-medium">記事のサンプルです</div>
    </section>
  );
};

export default Post;
