
export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-6 max-w-3xl">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">How do I get started?</h2>
          <p className="text-gray-600">Apply through our creator application process. Once approved, you can start uploading content and earning.</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">How do earnings work?</h2>
          <p className="text-gray-600">Earn through content views and affiliate marketing. Payments are processed monthly.</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">What content can I create?</h2>
          <p className="text-gray-600">We welcome educational and informative content that follows our content guidelines.</p>
        </div>
      </div>
    </div>
  );
}
