interface DocumentHeadOptions {
  title: string;
  description: string;
}

/**
 * Build the document head object for a page.
 */
export function buildDocumentHead({ title, description }: DocumentHeadOptions) {
  return {
    title: title,
    author: "Lab. Informatika UMM",
    meta: [
      {
        name: "description",
        content: description,
      },
      // Open Graph
      {
        property: "og:title",
        content: title,
      },
      {
        property: "og:description",
        content: description,
      },
      {
        property: "og:type",
        content: "website",
      },
    ],
  };
}
