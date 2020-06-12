import {
  Item,
  Article,
  Book,
  Chapter,
  ItemValidator,
  ErrorMessages,
  ErrorMessage,
} from "@types";

import { validateSlug, getSlugErrorMessage } from "@utils/slug-helper";

const validateInvalidSlug: ItemValidator = {
  isCritical: true,
  getMessage: (item: Article | Book) => getSlugErrorMessage(item.slug),
  isInvalid: (item: Article | Book) => !validateSlug(item.slug),
};

const validateMissingTitle: ItemValidator = {
  isCritical: true,
  getMessage: (item: Item) => "title（タイトル）を入力してください",
  isInvalid: (item: Item) => !item.title?.length,
};

const validateArticleType: ItemValidator = {
  isCritical: true,
  getMessage: (item: Article) =>
    'type（記事のタイプ）にtechもしくはideaを指定してください。技術記事の場合はtechを指定してください<br/><a href="https://zenn.dev/tech-or-idea" target="_blank">詳細はこちら →</a>',
  isInvalid: (item: Article) => {
    return !item.type || !(item.type === "tech" || item.type === "idea");
  },
};

const validateEmojiFormat: ItemValidator = {
  isCritical: true,
  getMessage: (item: Article) =>
    "不正なemoji（絵文字）が指定されています（絵文字は1文字のみ使用できます）",
  isInvalid: (item: Article) => {
    const emojiRegex = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])$/;
    return item.emoji && !item.emoji.match(emojiRegex);
  },
};

const validateMissingEmoji: ItemValidator = {
  getMessage: (item: Article) =>
    'アイキャッチとなるemoji（絵文字）を指定してください<br/><a href="https://getemoji.com/" target="_blank">絵文字を探す→</a>',
  isInvalid: (item: Article) => !item.emoji,
};

const validateMissingTopics: ItemValidator = {
  isCritical: true,
  getMessage: (item: Article | Book) =>
    'topics（記事に関連する言語や技術）を配列で指定してください。例）["react", "javascript"]',
  isInvalid: (item: Article | Book) =>
    !item.topics?.length || !Array.isArray(item.topics),
};

const validateTooManyTopis: ItemValidator = {
  isCritical: true,
  getMessage: (item: Article | Book) => "topicsは最大5つまで指定できます",
  isInvalid: (item: Article | Book) =>
    Array.isArray(item.topics) && item.topics.length > 5,
};

const validateInvalidTopicLetters: ItemValidator = {
  getMessage: (item: Article | Book) =>
    "topicsに記号やスペースを使用することはできません。例えばC++は「cpp」、C#は「csharp」と記載してください",
  isInvalid: (item: Article | Book) =>
    Array.isArray(item.topics) &&
    !!item.topics.find((t) => t.match(/[ -\/:-@\[-`{-~]/g)),
};

const validateUseTags: ItemValidator = {
  getMessage: (item: Article | Book) => "tagではなくtopicsを使ってください",
  isInvalid: (item: any) => item.tags?.length,
};

const validateBookSummary: ItemValidator = {
  isCritical: true,
  getMessage: (item: Book) => "summary（本の説明）の記載は必須です",
  isInvalid: (item: Book) => !item.summary?.length,
};

const validateBookPriceType: ItemValidator = {
  isCritical: true,
  getMessage: (item: Book) =>
    'price（本の価格）は文字列ではなく数字で指定してください（"で囲まないでください）',
  isInvalid: (item: Book) => typeof item.price !== "number",
};

const validateBookPriceRange: ItemValidator = {
  isCritical: true,
  getMessage: (item: Book) =>
    "price（本の価格）を有料にする場合、200〜5000の間で指定してください",
  isInvalid: (item: Book) =>
    item.price && item.price !== 0 && (item.price > 5000 || item.price < 200),
};

const validateBookPriceFraction: ItemValidator = {
  isCritical: true,
  getMessage: (item: Book) => "price（本の価格）は100円単位で指定してください",
  isInvalid: (item: Book) => item.price && item.price % 100 !== 0,
};

const validateMissingBookCover: ItemValidator = {
  getMessage: (item: Book) =>
    `本のカバー画像（cover.pngもしくはcover.jpg）を「/books/${item.slug}」ディレクトリ内に配置してください`,
  isInvalid: (item: Book) => !item.coverDataUrl,
};

const validateChapterFormat: ItemValidator = {
  isCritical: true,
  getMessage: (item: Book) =>
    "各チャプターのファイル名は0から始めることはできません。1.mdのように1〜50の数字にしてください",
  isInvalid: (item: Chapter) => {
    return !!item.position.match(/^0/);
  },
};

const validateChapterPosition: ItemValidator = {
  isCritical: true,
  getMessage: (item: Chapter) =>
    "各チャプターのファイル名は「1.md」のように「1〜50の半角数字.md」としてください",
  isInvalid: (item: Chapter) => {
    const positionNum = Number(item.position);
    return Number.isNaN(positionNum) || positionNum < 1 || positionNum > 50;
  },
};

const getErrors = (item: Item, validators: ItemValidator[]): ErrorMessages => {
  let messages: ErrorMessages = [];
  validators.forEach((validator) => {
    if (validator.isInvalid(item)) {
      const errorMessage: ErrorMessage = {
        isCritical: !!validator.isCritical,
        message: validator.getMessage(item),
      };
      messages.push(errorMessage);
    }
  });
  return messages;
};

export const getArticleErrors = (article: Article): ErrorMessages => {
  const validators = [
    validateInvalidSlug,
    validateMissingTitle,
    validateArticleType,
    validateEmojiFormat,
    validateMissingEmoji,
    validateMissingTopics,
    validateUseTags,
    validateInvalidTopicLetters,
    validateTooManyTopis,
  ];
  return getErrors(article, validators);
};

export const getBookErrors = (book: Book): ErrorMessages => {
  const validators = [
    validateInvalidSlug,
    validateMissingTitle,
    validateMissingTopics,
    validateUseTags,
    validateInvalidTopicLetters,
    validateTooManyTopis,
    validateBookSummary,
    validateBookPriceType,
    validateBookPriceRange,
    validateBookPriceFraction,
    validateMissingBookCover,
  ];
  return getErrors(book, validators);
};

export const getChapterErrors = (chapter: Chapter): ErrorMessages => {
  const validators = [
    validateChapterPosition,
    validateChapterFormat,
    validateMissingTitle,
  ];
  return getErrors(chapter, validators);
};