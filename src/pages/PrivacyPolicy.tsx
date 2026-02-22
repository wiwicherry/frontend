import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-4xl font-semibold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: February 2026</p>
      </div>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
          <p>
            Welcome to Wiwi & Cherry. We collect information you provide directly to us when you create an account, place an order, or communicate with us. This includes your name, email address, shipping address, mobile number, and order history.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
          <p>We use the information we collect primarily to provide, maintain, and improve our services. Specifically, we use it to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Process and fulfill your handmade jewelry orders.</li>
            <li>Send you order confirmations, shipping updates, and OTP verification codes.</li>
            <li>Respond to your customer service requests.</li>
            <li>Protect against fraudulent transactions.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Data Security</h2>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. Your passwords are encrypted, and we do not store raw credit card data on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Sharing of Information</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you (such as payment processors and shipping carriers), so long as those parties agree to keep this information confidential.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at: <br />
            <a href="mailto:wiwicherry5@gmail.com" className="text-[#E5989B] hover:underline font-medium">wiwicherry5@gmail.com</a>
          </p>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Link to="/" className="text-[#E5989B] hover:underline font-medium">
          &larr; Return to Home
        </Link>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
