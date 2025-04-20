
export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <div className="space-y-8 max-w-3xl">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Platform Usage</h2>
          <p className="text-gray-600">By using our platform, you agree to comply with our terms and guidelines.</p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Content Rights</h2>
          <p className="text-gray-600">You retain rights to your content while granting us license to display and distribute it.</p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Account Responsibilities</h2>
          <p className="text-gray-600">Users are responsible for maintaining account security and following platform guidelines.</p>
        </section>
      </div>
    </div>
  );
}
