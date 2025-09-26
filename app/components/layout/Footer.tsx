import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-20">
        <div className="flex flex-col md:flex-row gap-8 justify-between">
          <div>
            <h3 className="text-lg font-bold mb-4">About Kulangara</h3>
            <p className="text-gray-400 max-w-sm">
              Premium quality t-shirts for those who appreciate minimalist
              design and superior comfort.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-40">
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/profile/about">About Us</Link>
                </li>
                <li>
                  <Link href="/profile/contact">Contact</Link>
                </li>
                <li>
                  <Link href="/shipping">Shipping Info</Link>
                </li>
                <li>
                  <Link href="/returns">Returns</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
                <li>
                  <Link href="/size-guide">Size Guide</Link>
                </li>
                <li>
                  <Link href="/profile/orders">Track Order</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Follow Us</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="https://www.instagram.com/">Instagram</Link>
                </li>
                <li>
                  <Link href="https://www.facebook.com/">Facebook</Link>
                </li>
                <li>
                  <Link href="https://x.com/">Twitter</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 flex flex-row justify-between">
          <p>&copy; 2025 Kulangara. All rights reserved.</p>
          <p>
            <Link href="/profile/privacy">Privacy Policy</Link> |{" "}
            <Link href="/profile/terms">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
