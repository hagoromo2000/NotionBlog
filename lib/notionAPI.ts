import { NUMBER_OF_POSTS_PER_PAGE } from "@/constants/constants";
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
    // 公開済みの記事のみ取得
    filter: {
      property: "Published",
      checkbox: {
        equals: true,
      },
    },
    // 最新投稿順に並び替え
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
    ],
  });

  const allPosts = posts.results;

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

//　ページ番号に応じた記事取得
export const getPostsByPage = async (page: number) => {
  const allPosts = await getAllPosts();

  const startIndex = (page - 1) * NUMBER_OF_POSTS_PER_PAGE;
  const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE;

  return allPosts.slice(startIndex, endIndex);
};

// ぺージ数の取得
export const getNumberOfPages = async () => {
  const allPosts = await getAllPosts();
  const numberOfPages = Math.ceil(allPosts.length / NUMBER_OF_POSTS_PER_PAGE);

  return numberOfPages;
};

// タグに応じた記事の取得
export const getPostsByTagAndPage = async (tagName: string, page: number) => {
  const allPosts = await getAllPosts();
  const posts = allPosts.filter((post) => {
    return post.tags.find((tag: string) => tag === tagName);
  });

  const startIndex = (page - 1) * NUMBER_OF_POSTS_PER_PAGE;
  const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE;

  return posts.slice(startIndex, endIndex);
};

// タグに応じた記事のページ数の取得
export const getNumberOfPagesByTag = async (tagName: string) => {
  const allPosts = await getAllPosts();
  const posts = allPosts.filter((post) => {
    return post.tags.find((tag: string) => tag === tagName);
  });

  const numberOfPages = Math.ceil(posts.length / NUMBER_OF_POSTS_PER_PAGE);
  return numberOfPages;
};

// 全てのタグを取得
export const getAllTags = async () => {
  const allPosts = await getAllPosts();

  const allTagsDuplicationLists = allPosts.flatMap((post) => {
    return post.tags;
  });

  // Setは重複を削除する(タグの重複を消すためにSetを使う)
  const set = new Set(allTagsDuplicationLists);
  const allTagsList = Array.from(set);
  return allTagsList;
};
