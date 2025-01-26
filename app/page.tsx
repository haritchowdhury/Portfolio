import { BlogPosts } from "app/components/posts";

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Portfolio
      </h1>
      <p className="mb-4">
        {`Good at relational database management systems, which extends to extracting, transforming, and reloading large datasets.
        Actively exploring web3 and llms. `}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  );
}
