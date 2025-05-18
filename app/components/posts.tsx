import Link from "next/link";
import { formatDate, getBlogPosts } from "app/blog/utils";

export function BlogPosts() {
  let allBlogs = getBlogPosts();

  return (
    <div className="space-y-6">
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1;
          }
          return 1;
        })
        .map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block group"
          >
            <div className="flex flex-col space-y-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 p-4 rounded-lg transition-colors">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <h3 className="font-medium text-lg text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {post.metadata.title}
                </h3>
                <time className="text-sm text-neutral-500 dark:text-neutral-400 tabular-nums mt-1 md:mt-0">
                  {formatDate(post.metadata.publishedAt, false)}
                </time>
              </div>

              {post.metadata.summary && (
                <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {post.metadata.summary}
                </p>
              )}

              <div className="flex items-center text-xs font-medium mt-2">
                <span className="text-indigo-600 dark:text-indigo-400 flex items-center ml-auto group-hover:translate-x-0.5 transition-transform">
                  Read more
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}
