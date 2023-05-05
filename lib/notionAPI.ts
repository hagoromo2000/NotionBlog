import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

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

  return allPosts.map((post) => {
    return getPageMetaData(post);
  });
};

// メタデータ取得用の関数;
const getPageMetaData = (post: any) => {
  return {
    id: post.id,
    title: post.properties.Name.title[0].plain_text,
    description: post.properties.Description.rich_text[0].plain_text,
    date: post.properties.Date.date.start,
    slug: post.properties.Slug.rich_text[0].plain_text,
  };
};
