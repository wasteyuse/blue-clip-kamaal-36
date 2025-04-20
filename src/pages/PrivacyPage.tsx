
export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <div className="space-y-8 max-w-3xl">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Data Collection</h2>
          <p className="text-gray-600">We collect information necessary to provide our services and improve user experience.</p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Data Usage</h2>
          <p className="text-gray-600">Your data is used to process payments, improve our services, and provide personalized experiences.</p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Data Protection</h2>
          <p className="text-gray-600">We implement industry-standard security measures to protect your personal information.</p>
        </section>
      </div>
    </div>
  );
}
