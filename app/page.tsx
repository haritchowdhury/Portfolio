import { BlogPosts } from "app/components/posts";
import Image from "next/image";
import Link from "next/link";
export default function Page() {
  return (
    <section className="max-w-4xl mx-auto px-4">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 pt-8">
        <div className="w-256 h-256 relative rounded-full overflow-hidden border-4 border-indigo-100 dark:border-indigo-900 shadow-lg">
          <Image
            src="/1653412326656.jpg"
            alt="Harit Chowdhury"
            width={256}
            height={256}
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text mb-4">
            My Portfolio
          </h1>

          <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
            Software developer with expertise in relational database management
            systems, focused on extracting, transforming, and reloading large
            datasets with optimal efficiency. Currently exploring web3
            technologies and large language models.
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {[
              "SQL",
              "ETL",
              "Data Pipelines",
              "Web3",
              "LLM",
              "Next.js",
              "React.js",
            ].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold tracking-tight mb-6 flex items-center">
          <span className="inline-block w-6 h-6 mr-2 bg-indigo-100 dark:bg-indigo-900 rounded-md flex items-center justify-center">
            <span className="w-3 h-3 bg-indigo-500 rounded-sm transform rotate-45"></span>
          </span>
          Featured Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">
              AI Agents for content retention
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              A host of AI agents working together to maximize content retention
              from the documents of your choice <br />
              by allowing you to chat with them, pointing out the important
              topics from the documents, and enabling you <br />
              to take dynamic quizzes from the topics of your choice from the
              documents.
            </p>
            <div className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 font-medium">
              <Link href={`/blog/${"llm-pdf-chat"}`} className="block group">
                {" "}
                <span>View details</span>
              </Link>

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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold tracking-tight mb-6 flex items-center">
          <span className="inline-block w-6 h-6 mr-2 bg-indigo-100 dark:bg-indigo-900 rounded-md flex items-center justify-center">
            <span className="w-3 h-3 bg-indigo-500 rounded-sm transform rotate-45"></span>
          </span>
          Projects
        </h2>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
          <BlogPosts />
        </div>
      </div>

      {/* Contact Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold tracking-tight mb-6 flex items-center">
          <span className="inline-block w-6 h-6 mr-2 bg-indigo-100 dark:bg-indigo-900 rounded-md flex items-center justify-center">
            <span className="w-3 h-3 bg-indigo-500 rounded-sm transform rotate-45"></span>
          </span>
          Get In Touch
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          ch.harit33@gmail.com <br /> +91-7908839114
        </div>
      </div>
    </section>
  );
}
