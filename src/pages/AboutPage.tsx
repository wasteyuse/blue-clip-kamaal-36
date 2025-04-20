
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">About Us</h1>
      <div className="space-y-8 max-w-3xl">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p className="text-gray-600">BlueHustle empowers Indian creators to monetize their content and build sustainable online businesses through our innovative platform.</p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Vision</h2>
          <p className="text-gray-600">To become the leading platform for content creators in India, providing opportunities for growth and success in the digital economy.</p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Values</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Innovation in creator empowerment</li>
            <li>Transparency in operations</li>
            <li>Quality content promotion</li>
            <li>Fair compensation</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
