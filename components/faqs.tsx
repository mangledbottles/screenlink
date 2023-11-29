export default function Faqs() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 md:pb-20">
            <h2 className="h2 font-hkgrotesk">FAQs</h2>
          </div>
          {/* Columns */}
          <div className="md:flex md:space-x-12 space-y-8 md:space-y-0">
            {/* Column */}
            <div className="w-full md:w-1/2 space-y-8">
              {/* Item */}
              <div className="space-y-2">
                <h4 className="text-xl font-hkgrotesk font-medium">
                  What is the difference between the Free and Paid versions?
                </h4>
                <p className="text-slate-500">
                  Our Free Plan allows you to record and share up to 10 videos,
                  perfect for occasional users. The Pro and Growth plans offer
                  more usage which is ideal for frequent use and professional
                  needs.
                </p>
              </div>
              {/* Item */}
              <div className="space-y-2">
                <h4 className="text-xl font-hkgrotesk font-medium">
                  Do you have student or non-profit discounts?
                </h4>
                <p className="text-slate-500">
                  Currently, we do not offer specific discounts for students or
                  non-profit organizations. However, our Free Plan is designed
                  to be accessible to all users, including educational and
                  non-profit purposes.
                </p>
              </div>
              {/* Item */}
              <div className="space-y-2">
                <h4 className="text-xl font-hkgrotesk font-medium">
                  How is the price determined?
                </h4>
                <p className="text-slate-500">
                  The pricing is based on a per-user model to provide
                  flexibility and scalability. It's designed to offer value for
                  both individual users and teams, ensuring access to full
                  features without restrictions.
                </p>
              </div>
            </div>
            {/* Column */}
            <div className="w-full md:w-1/2 space-y-8">
              {/* Item */}
              <div className="space-y-2">
                <h4 className="text-xl font-hkgrotesk font-medium">
                  Do I need coding knowledge to use this product?
                </h4>
                <p className="text-slate-500">
                  No coding knowledge is required. ScreenLink is designed with a
                  user-friendly interface, making it easy for anyone to start
                  recording and sharing their demos with just a few clicks.
                </p>
              </div>
              {/* Item */}
              <div className="space-y-2">
                <h4 className="text-xl font-hkgrotesk font-medium">
                  Is there a way to become an Affiliate reseller?
                </h4>
                <p className="text-slate-500">
                  We are always open to partnerships. If you're interested in
                  becoming an Affiliate reseller, please contact us directly for
                  more information about our affiliate program and partnership
                  opportunities.
                </p>
              </div>
              {/* Item */}
              <div className="space-y-2">
                <h4 className="text-xl font-hkgrotesk font-medium">
                  What forms of payment do you accept?
                </h4>
                <p className="text-slate-500">
                  We accept various forms of payment, including major credit
                  cards and online payment systems. For detailed information on
                  payment options, please visit our payment information page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
