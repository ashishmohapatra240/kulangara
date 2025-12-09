import { Card, CardContent } from "@/app/components/ui/card";

export const ContactSection = () => (
  <div className="w-full p-4 lg:pt-1">
    <h1 className="text-2xl font-normal mb-8">Contact Us</h1>
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Customer Support</h2>
            <p className="text-muted-foreground">
              Email: contact.kulangara@gmail.com
              <br />
              Phone: +91 9938616555
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Business Hours</h2>
            <p className="text-muted-foreground">
              Monday to Saturday
              <br />
              10:00 AM to 7:00 PM
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export const AboutSection = () => (
  <div className="w-full p-4 lg:pt-1">
    <h1 className="text-2xl font-normal mb-8">About Us</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-muted-foreground leading-relaxed">
          Kulangara is a chain of retail stores owned by Trent Limited, a subsidiary
          of the Tata Group. The company operates a chain of retail stores across
          India offering a wide range of apparel, accessories, cosmetics and home
          products.
        </p>
      </CardContent>
    </Card>
  </div>
);

export const TermsSection = () => (
  <div className="w-full p-4 lg:pt-1">
    <h1 className="text-2xl font-normal mb-8">Terms of Use</h1>
    <Card>
      <CardContent className="p-6">
        <div className="prose max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            These terms and conditions outline the rules and regulations for the use
            of Kulangara&apos;s Website.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);

export const PrivacySection = () => (
  <div className="w-full p-4 lg:pt-1">
    <h1 className="text-2xl font-normal mb-8">Privacy Policy</h1>
    <Card>
      <CardContent className="p-6">
        <div className="prose max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            This Privacy Policy describes how your personal information is collected,
            used, and shared when you visit or make a purchase from our website.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
); 