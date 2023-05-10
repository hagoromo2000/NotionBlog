import Pagination from "@/components/Pagination/Pagination";
import SinglePost from "@/components/SinglePost";
import Tag from "@/components/Tag/Tag";
import {
  getAllTags,
  getNumberOfPagesByTag,
  getPostsByTagAndPage,
} from "@/lib/notionAPI";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

export const getStaticPaths: GetStaticPaths = async () => {
  const allTags = await getAllTags();

  let params: any = [];

  // getAllTagsが非同期処理なので、Promise.allを使って、全ての処理が終わるまで待たないと正しくparamsが作成されない
  await Promise.all(
    allTags.map((tag: string) => {
      return getNumberOfPagesByTag(tag).then(
        (getNumberOfPagesByTag: number) => {
          for (let i = 1; i <= getNumberOfPagesByTag; i++) {
            params.push({ params: { tag: tag, page: i.toString() } });
          }
        }
      );
    })
  );

  // console.log(params);
  //  → 以下のような配列ができる
  // [
  //   { params: { tag: 'JavaScirpt', page: '1' } },
  //   { params: { tag: 'Blog', page: '1' } },
  //   { params: { tag: 'Blog', page: '2' } },
  //   { params: { tag: 'Blog', page: '3' } },
  //   { params: { tag: 'Next.js', page: '1' } },
  //   { params: { tag: 'Tailwind', page: '1' } },
  //   { params: { tag: 'Tailwind', page: '2' } },
  //   { params: { tag: 'TypeScript', page: '1' } }
  // ]
  return {
    paths: params,
    fallback: "blocking", // 404ページを表示するまで待つ
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  let currentPage = context.params?.page;
  // currentPageがundefinedの場合は、1ページ目を表示する
  if (!currentPage) {
    currentPage = "1";
  }

  let currentTag = context.params?.tag;
  // currentTagがundefinedの場合は、blogを表示する
  if (!currentTag) {
    currentTag = "Blog";
  }

  currentPage = currentPage.toString();

  currentTag = currentTag.toString();
  // currentTagの先頭を大文字にする
  const upperCaseCurrentTag =
    currentTag.charAt(0).toUpperCase() + currentTag.slice(1);

  const posts = await getPostsByTagAndPage(
    upperCaseCurrentTag,
    parseInt(currentPage, 10)
  );

  const numberOfPagesByTag: number = await getNumberOfPagesByTag(
    upperCaseCurrentTag
  );

  const allTags = await getAllTags();

  return {
    props: {
      posts,
      numberOfPagesByTag,
      currentTag,
      allTags,
    },
    // ISR (Incremental Static Regeneration) 1分ごとに内容を更新する
    revalidate: 60,
  };
};

const BlogTagPageList = ({
  posts,
  numberOfPagesByTag,
  currentTag,
  allTags,
}: {
  posts: any;
  numberOfPagesByTag: number;
  currentTag: string;
  allTags: string[];
}) => {
  return (
    <div className="container h-full w-full mx-auto">
      <Head>
        <title>Notion-Blog</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">Notion Blog</h1>
        <section className="sm:grid grid-cols-2 w-5/6 gap-3 mx-auto">
          {posts.map((post: any) => (
            <div key={post.id}>
              <SinglePost
                title={post.title}
                description={post.description}
                date={post.date}
                tags={post.tags}
                slug={post.slug}
                isPaginationPage={true}
              />
            </div>
          ))}
        </section>
        <Pagination numberOfPage={numberOfPagesByTag} tag={currentTag} />
        <Tag tags={allTags} />
      </main>
    </div>
  );
};

export default BlogTagPageList;
