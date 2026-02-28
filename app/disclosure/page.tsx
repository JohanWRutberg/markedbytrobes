import { AFFILIATE_DISCLOSURE_FULL } from "@/lib/affiliate";

export const metadata = {
  title: "Affiliate Disclosure - Marked by Trobes",
  description: "Information about our affiliate relationships and disclosures",
};

export default function DisclosurePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-navy dark:text-cream mb-8">
          Affiliate Disclosure
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="font-cinzel text-2xl font-bold text-navy dark:text-cream mb-4">
              Amazon Associates Program
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Marked by Trobes is a participant in the Amazon Services LLC
              Associates Program, an affiliate advertising program designed to
              provide a means for sites to earn advertising fees by advertising
              and linking to Amazon.com.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-navy dark:text-cream mb-4">
              What This Means
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              When you click on an Amazon link on this website and make a
              purchase, I may earn a small commission at no extra cost to you.
              This helps support the blog and allows me to continue creating
              content and sharing book recommendations with you.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-navy dark:text-cream mb-4">
              Our Promise
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-navy dark:text-cream">
                  Honest Reviews:
                </strong>{" "}
                I only recommend books and products I genuinely believe in and
                have either read myself or thoroughly researched. My reviews are
                honest and unbiased.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-navy dark:text-cream">
                  No Extra Cost:
                </strong>{" "}
                Using affiliate links does not increase the price you pay. The
                cost is the same whether you use my link or go directly to
                Amazon.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-navy dark:text-cream">
                  Your Choice:
                </strong>{" "}
                You are never obligated to make a purchase through my affiliate
                links. They are provided for your convenience.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-navy dark:text-cream">
                  Support the Blog:
                </strong>{" "}
                If you find value in my content and choose to shop through my
                links, you're helping to support this blog and the work I do.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-navy dark:text-cream mb-4">
              Questions?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about our affiliate relationships or
              this disclosure, please feel free to contact me at{" "}
              <a
                href="mailto:hello@markedbytrobes.com"
                className="text-navy dark:text-cream hover:underline"
              >
                hello@markedbytrobes.com
              </a>
            </p>
          </section>

          <section className="mt-12 p-6 bg-cream/30 dark:bg-navy/30 rounded-lg">
            <p className="text-sm text-muted-foreground italic">
              Last updated: February 28, 2026
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              This disclosure is provided in accordance with the Federal Trade
              Commission's guidelines concerning the use of endorsements and
              testimonials in advertising.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
