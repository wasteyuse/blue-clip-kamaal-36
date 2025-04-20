
export default function GuidelinesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Content Guidelines</h1>
      <div className="space-y-8 max-w-3xl">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Quality Standards</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Content must be original and unique</li>
            <li>Maintain professional quality in all submissions</li>
            <li>Focus on providing value to the audience</li>
            <li>Keep content accurate and up-to-date</li>
          </ul>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Content Rules</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>No inappropriate or offensive content</li>
            <li>Respect intellectual property rights</li>
            <li>Follow ethical practices</li>
            <li>Maintain transparency in affiliate relationships</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
