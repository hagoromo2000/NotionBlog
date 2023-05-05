import { getAllPosts, getSinglePost } from "@/lib/notionAPI";
import React from "react";

export const getStaticPaths = async () => {
  const allPosts = await getAllPosts();
  const paths = allPosts.map(({ slug }: { slug: any }) => ({
    params: { slug },
  }));

  return {
    // paths: pathsと同じ意味
    paths,
    fallback: "blocking", // 404ページを表示するまで待つ
  };
};

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

const Post = ({ post }: { post: any }) => {
  return (
    <section className="container lg:px-2 px-5 h-screen lg:w-2/5 mx-auto mt-20">
      <h2 className="w-full text-2xl font-medium">{post.metadata.title}</h2>
      <div className="border-b-2 w-1/3 mt-1 border-sky-900"></div>
      <span className="text-gray-500">Posted date at {post.metadata.date}</span>
      <br />
      {post.metadata.tags.map((tag: string) => (
        <p
          key={tag}
          className="text-white bg-sky-900 rounded-xl font-medium mt-2 px-2 inline-block mr-1"
        >
          {tag}
        </p>
      ))}
      <div className="mt-10 font-medium">{post.markdown}</div>
    </section>
  );
};

export default Post;
