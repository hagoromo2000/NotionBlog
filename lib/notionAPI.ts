import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// NotionToMarkdownのインスタンスを作成
const n2m = new NotionToMarkdown({ notionClient: notion });

export const getAllPosts = async () => {
  // NOTION_DATABASE_IDが空であればエラーを返すことで、
  // database_id: process.env.NOTION_DATABASE_IDの型エラーを防ぐ
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error(
      "NOTION_DATABASE_ID is not set in the environment variables"
    );
  }
  const posts = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    page_size: 100,
  });

  const allPosts = posts.results;

  // return allPosts;
  return allPosts.map((post) => {
    return getPageMetaData(post);
  });
};

// メタデータ取得用の関数;
const getPageMetaData = (post: any) => {
  const getTags = (tags: any) => {
    const allTags = tags.map((tag: any) => {
      return tag.name;
    });

    return allTags;
  };

  return {
    id: post.id,
    title: post.properties.Name.title[0].plain_text,
    description: post.properties.Description.rich_text[0].plain_text,
    date: post.properties.Date.date.start,
    slug: post.properties.Slug.rich_text[0].plain_text,
    tags: getTags(post.properties.Tags.multi_select),
  };
};

// 動的ルーティングのための関数
export const getSinglePost = async (slug: string) => {
  // NOTION_DATABASE_IDが空であればエラーを返すことで、
  // database_id: process.env.NOTION_DATABASE_IDの型エラーを防ぐ
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error(
      "NOTION_DATABASE_ID is not set in the environment variables"
    );
  }

  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: "Slug",
      formula: {
        string: {
          equals: slug,
        },
      },
    },
  });

  const page = response.results[0];
  const metadata = getPageMetaData(page);
  // console.log(metadata);
  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdBlocks);
  // console.log(mdString);

  return {
    metadata,
    markdown: mdString,
  };
};

// トップページ用の記事の取得（4つの記事を取得）
export const getPostsForTopPage = async (pageSize = 4) => {
  const allPosts = await getAllPosts();
  const fourPosts = allPosts.slice(0, pageSize);

  return fourPosts;
};
