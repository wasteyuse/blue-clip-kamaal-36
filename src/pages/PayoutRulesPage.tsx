
export default function PayoutRulesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Payout Rules</h1>
      <div className="space-y-8 max-w-3xl">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Payment Schedule</h2>
          <p className="text-gray-600">Payments are processed monthly for all earnings that meet the minimum threshold.</p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Earning Types</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Content view earnings</li>
            <li>Affiliate commission earnings</li>
            <li>Bonus earnings for high-performing content</li>
          </ul>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Requirements</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Minimum payout threshold: $50</li>
            <li>Valid payment method on file</li>
            <li>Compliance with platform guidelines</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
