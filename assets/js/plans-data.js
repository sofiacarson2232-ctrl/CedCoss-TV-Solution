/**
 * CedCoss TV Solution - Centralized Plans & Configuration Data
 * Clean, customizable, and easily maintained
 */

const CEDCOSS_CONFIG = {
  brandName: "CedCoss TV Solution",
  brandTagline: "Next-Gen Entertainment & Real-Time Broadcast Hub",
  currency: "$",
  currencyCode: "USD",
  helpEmail: "info@cedcoss.online",
  supportEmail: "info@cedcoss.online",
  helpHours: "24/7 Priority Streaming Assistance",
  
  // High value streaming packages with genuine savings
  plans: [
    {
      id: "omni-1m",
      name: "Starter Pass",
      durationMonths: 1,
      durationLabel: "1 Month Access",
      price: 11.99,
      originalPrice: 16.99,
      tagline: "Great for testing & short-term viewing",
      popular: false,
      dealEndsAt: null,
      features: [
        "Full High-Definition & 4K streams",
        "Live sports, news & entertainment",
        "Access on 1 active screen at a time",
        "Instant digital setup guide",
        "Standard customer assistance"
      ]
    },
    {
      id: "omni-3m",
      name: "Quarterly Pass",
      durationMonths: 3,
      durationLabel: "3 Months Access",
      price: 28.99,
      originalPrice: 42.99,
      tagline: "Popular for regular sports seasons",
      popular: false,
      dealEndsAt: null,
      features: [
        "Full High-Definition & 4K streams",
        "Everyday live broadcasts & stadiums",
        "Access on 2 simultaneous screens",
        "Anti-buffering stream technology",
        "Priority customer assistance"
      ]
    },
    {
      id: "omni-6m",
      name: "Semi-Annual Pass",
      durationMonths: 6,
      durationLabel: "6 Months Access",
      price: 49.99,
      originalPrice: 74.99,
      tagline: "Best value for dedicated viewers",
      popular: false,
      // Flash deal expiring in 48 hours from dynamic load
      dealEndsAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      features: [
        "Full High-Definition & Ultra HD 4K",
        "All live arenas, events & global shows",
        "Multi-device viewing (TV, tablet, PC)",
        "Zero-contract flexibility",
        "Fast-track setup assistance"
      ]
    },
    {
      id: "omni-1y",
      name: "Annual Elite Pass",
      durationMonths: 12,
      durationLabel: "1 Full Year Access",
      price: 74.99,
      originalPrice: 129.99,
      tagline: "Most chosen by families & streamers",
      popular: true,
      dealEndsAt: new Date(Date.now() + 26 * 3600 * 1000).toISOString(),
      features: [
        "Highest bitrate 4K Ultra HD & 60 FPS",
        "Complete sports, live TV & global package",
        "Multi-screen simultaneous streaming",
        "VIP fast activation within 15 minutes",
        "Dedicated 24/7 priority assistance"
      ]
    },
    {
      id: "omni-2y",
      name: "2-Year Loyalty Pass",
      durationMonths: 24,
      durationLabel: "2 Full Years Access",
      price: 119.99,
      originalPrice: 219.99,
      tagline: "Ultimate long-term savings guarantee",
      popular: false,
      dealEndsAt: null,
      features: [
        "Locked-in rate with zero price increases",
        "Unrestricted access across all compatible devices",
        "All live global broadcasts & sports passes",
        "Dedicated account concierge",
        "Complimentary multi-device setup guidance"
      ]
    }
  ]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = CEDCOSS_CONFIG;
}
