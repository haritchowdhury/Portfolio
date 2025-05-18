import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { formatDate, getBlogPosts } from "app/blog/utils";
import { baseUrl } from "app/sitemap";
import Image from "next/image";
import Link from "next/link";

export async function generateStaticParams() {
  let posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug);
  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function Blog({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  // Get related posts (excluding current post)
  const relatedPosts = getBlogPosts()
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1;
      }
      return 1;
    })
    .slice(0, 3);

  return (
    <section className="max-w-3xl mx-auto px-4">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: "My Portfolio",
            },
          }),
        }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex text-sm items-center space-x-1 text-neutral-500 dark:text-neutral-400 mb-8 mt-4">
        <Link
          href="/"
          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          Home
        </Link>
        <span>/</span>
        <Link
          href="/blog"
          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          Blog
        </Link>
        <span>/</span>
        <span className="truncate max-w-[200px]">{post.metadata.title}</span>
      </nav>

      {/* Featured Image */}
      {post.metadata.image && (
        <div className="relative w-full h-64 sm:h-80 md:h-96 mb-8 rounded-xl overflow-hidden">
          <Image
            src={post.metadata.image}
            alt={post.metadata.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Article Header */}
      <div className="mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text mb-4">
          {post.metadata.title}
        </h1>

        {post.metadata.summary && (
          <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
            {post.metadata.summary}
          </p>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="w-10 h-10 relative rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                MP
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                My Portfolio
              </p>
              <time className="text-sm text-neutral-500 dark:text-neutral-400">
                {formatDate(post.metadata.publishedAt)}
              </time>
            </div>
          </div>

          {post.metadata.tags && (
            <div className="flex flex-wrap gap-2">
              {post.metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table of Contents (optional) */}
      {post.metadata.showToc && (
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-6 mb-8 border border-neutral-200 dark:border-neutral-800">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
            Table of Contents
          </h2>
          <div className="prose prose-sm dark:prose-invert">
            {/* This would be populated by your MDX component */}
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="prose prose-lg dark:prose-invert prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-headings:tracking-tight prose-headings:scroll-mt-20 prose-img:rounded-lg prose-code:rounded-md prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800 prose-code:px-1 prose-code:py-0.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none max-w-none mb-12">
        <CustomMDX source={post.content} />
      </article>

      {/* Article Footer */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 mb-12">
        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to All Posts
          </Link>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold tracking-tight mb-6 flex items-center">
            <span className="inline-block w-6 h-6 mr-2 bg-indigo-100 dark:bg-indigo-900 rounded-md flex items-center justify-center">
              <span className="w-3 h-3 bg-indigo-500 rounded-sm transform rotate-45"></span>
            </span>
            Related Articles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/blog/${relatedPost.slug}`}
                className="block group bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-lg text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 mb-2 transition-colors">
                  {relatedPost.metadata.title}
                </h3>
                <time className="text-sm text-neutral-500 dark:text-neutral-400">
                  {formatDate(relatedPost.metadata.publishedAt, false)}
                </time>
                {relatedPost.metadata.summary && (
                  <p className="text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-2">
                    {relatedPost.metadata.summary}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
