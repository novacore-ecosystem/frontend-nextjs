import {
  Box,
  Button,
  CTASection,
  FeatureGrid,
  Footer,
  FooterColumn,
  Header,
  HeroSection,
  Link,
  NavigationMenu,
  ProductGrid,
  StatsSection,
  Text,
  TestimonialSection,
  type ProductCardViewModel,
} from "@novacore/frontend-next-mui";

const NAV_ITEMS = [
  { label: "Shop", href: "/mui", active: true },
  { label: "Components", href: "/mui/components" },
  { label: "Theme", href: "/mui/theme" },
];

const PRODUCTS: ProductCardViewModel[] = [
  { id: "1", title: "Aria Lounge Chair", image: "https://picsum.photos/seed/aria/600/600", price: 349, compareAtPrice: 429, currency: "USD", rating: 4.5, reviewCount: 128, badge: "sale" },
  { id: "2", title: "Nomad Backpack", image: "https://picsum.photos/seed/nomad/600/600", price: 129, currency: "USD", rating: 4.8, reviewCount: 64, badge: "new" },
  { id: "3", title: "Orbit Desk Lamp", image: "https://picsum.photos/seed/orbit/600/600", price: 89, currency: "USD", rating: 4.2, reviewCount: 41 },
  { id: "4", title: "Solace Ceramic Mug Set", image: "https://picsum.photos/seed/solace/600/600", price: 45, currency: "USD", rating: 4.9, reviewCount: 203, badge: "bestseller" },
];

export default function MuiHomePage() {
  return (
    <Box>
      <Header
        logo={
          <Text weight="bold" size="bodyLarge">
            NovaCore
          </Text>
        }
        navigation={<NavigationMenu items={NAV_ITEMS} />}
        actions={<Button variant="outline">Sign in</Button>}
        mobileNavigation={<NavigationMenu items={NAV_ITEMS} />}
      />

      <HeroSection
        eyebrow="New season"
        title="Furniture and goods for a calmer home"
        description="Thoughtfully designed pieces, sourced from independent makers. Free shipping on every order over $75."
        actions={
          <>
            <Button size="lg">Shop the collection</Button>
            <Button size="lg" variant="outline">
              Learn more
            </Button>
          </>
        }
      />

      <StatsSection
        items={[
          { value: "12k+", label: "Happy customers" },
          { value: "4.8/5", label: "Average rating" },
          { value: "48h", label: "Average delivery" },
        ]}
      />

      <Box as="section" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ maxWidth: "lg", mx: "auto", px: { xs: 2, md: 4 } }}>
          <Text weight="semibold" size="bodyLarge" sx={{ mb: 3 }}>
            Featured products
          </Text>
          <ProductGrid products={PRODUCTS} />
        </Box>
      </Box>

      <FeatureGrid
        title="Why shop with NovaCore"
        description="Everything you need for a smooth, trustworthy shopping experience."
        items={[
          { title: "Free returns", description: "30-day no-questions-asked return window on every item." },
          { title: "Carbon-neutral shipping", description: "Every order is offset at no extra cost to you." },
          { title: "Secure checkout", description: "PCI-compliant payments with 3-D Secure support." },
        ]}
      />

      <TestimonialSection
        title="Loved by our customers"
        items={[
          { quote: "The quality completely exceeded my expectations.", name: "Priya Shah", role: "Verified buyer" },
          { quote: "Delivery was fast and the packaging was beautiful.", name: "Marcus Lee", role: "Verified buyer" },
          { quote: "Customer support helped me resize my order in minutes.", name: "Elena Petrova", role: "Verified buyer" },
        ]}
      />

      <CTASection
        title="Ready to refresh your space?"
        description="Join thousands of customers who've already found their next favorite piece."
        actions={<Button size="lg">Start shopping</Button>}
      />

      <Footer
        bottomBar={
          <>
            <Text size="bodySmall" color="muted">
              © 2026 NovaCore. All rights reserved.
            </Text>
            <Text size="bodySmall" color="muted">
              Built with @novacore/frontend-next-mui
            </Text>
          </>
        }
      >
        <FooterColumn title="Shop">
          <Link href="#">New arrivals</Link>
          <Link href="#">Best sellers</Link>
          <Link href="#">Sale</Link>
        </FooterColumn>
        <FooterColumn title="Company">
          <Link href="#">About</Link>
          <Link href="#">Careers</Link>
          <Link href="#">Press</Link>
        </FooterColumn>
        <FooterColumn title="Support">
          <Link href="#">Help center</Link>
          <Link href="#">Shipping</Link>
          <Link href="#">Returns</Link>
        </FooterColumn>
        <FooterColumn title="Legal">
          <Link href="#">Privacy</Link>
          <Link href="#">Terms</Link>
        </FooterColumn>
      </Footer>
    </Box>
  );
}
