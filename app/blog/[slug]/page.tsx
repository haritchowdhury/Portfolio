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
    // TypeScript doesn't recognize that notFound() prevents further execution
    // Adding a return statement to satisfy TypeScript
    return null;
  }

  // Now TypeScript knows post is defined
  const postSlug = post.slug;

  // Get related posts (excluding current post)
  const relatedPosts = getBlogPosts()
    .filter((p) => p.slug !== postSlug)
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

        {post.metadata.summary && typeof post.metadata.summary === "string" && (
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

          {/* Only render tags if they exist */}
        </div>
      </div>

      {/* Article Content */}
      <div className="flex gap-2 m-2">
        {post.metadata.demo !== "Redacted" && (
          <Link
            href={`${post.metadata.demo}`}
            className="no-underline bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4  rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Live link
          </Link>
        )}
        <Link
          href={`${post.metadata.code}`}
          className="no-underline bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4  rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Code
        </Link>
      </div>

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

          <div className="flex space-x-4">
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                `${baseUrl}/blog/${post.slug}`
              )}&text=${encodeURIComponent(post.metadata.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-blue-400 transition-colors"
            >
              <span className="sr-only">Share on Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                `${baseUrl}/blog/${post.slug}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-blue-700 transition-colors"
            >
              <span className="sr-only">Share on LinkedIn</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
              </svg>
            </a>
          </div>
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
                {relatedPost.metadata.summary &&
                  typeof relatedPost.metadata.summary === "string" && (
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
