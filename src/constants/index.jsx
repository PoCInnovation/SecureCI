import { Lock } from "lucide-react";
import { Scan } from "lucide-react";
import { AreaChart } from "lucide-react";
import { Bell } from "lucide-react";
import { History } from "lucide-react";
import { BarChart } from "lucide-react";

export const navItems = [
  { label: "Features", href: "#" },
  { label: "Workflow", href: "#" },
  { label: "Testimonials", href: "#" },
];

export const testimonials = [
    {
      user: "Markus Schmidt",
      company: "TechGuard Inc.",
      text: "Secure-CI has been integral in maintaining the security of our codebase. Their automated scanning and detailed reports help us identify and fix vulnerabilities swiftly.",
    },
    {
      user: "Sophie Li",
      company: "ByteSec Solutions",
      text: "We've seen a significant improvement in our code security since implementing Secure-CI. Their tools make it easy to collaborate on security issues and ensure our projects stay protected.",
    },
    {
      user: "Alexandra Lopez",
      company: "CyberDefend Labs",
      text: "Secure-CI's commitment to security is exceptional. Their continuous monitoring and real-time alerts have been invaluable in safeguarding our applications against threats.",
    },
    {
      user: "Chris Taylor",
      company: "CodeShield Technologies",
      text: "Choosing Secure-CI was one of the best decisions we made for our development team. Their comprehensive security checks and historical tracking keep us proactive in managing vulnerabilities.",
    },
  ];

export const features = [
    {
      icon: <Scan />,
      text: "Automated Code Scanning",
      description:
        "Ensure your code is free from vulnerabilities with automated scans on every push.",
    },
    {
      icon: <AreaChart/>,
      text: "Comprehensive Reports",
      description:
        "Receive detailed reports on detected issues, helping you understand and fix vulnerabilities quickly.",
    },
    {
      icon: <Bell />,
      text: "Real-Time Alerts",
      description:
        "Get instant notifications about security issues in your code directly in your workflow.",
    },
    {
      icon: <Lock />,
      text: "Secure Authentication",
      description:
        "Connect securely to GitHub with OAuth, ensuring your repositories are protected.",
    },
    {
      icon: <History />,
      text: "Security History Tracking",
      description:
        "Keep a detailed record of past security issues and their resolutions to track progress and maintain accountability.",
    },
    {
      icon: <BarChart />,
      text: "Analytics Dashboard",
      description:
        "Track and monitor your project's security status over time with an integrated analytics dashboard.",
    },
  ];

export const checklistItems = [
  {
    title: "Effortless Code Merging",
    description:
      "Easily merge code changes with built-in checks to ensure security and quality.",
  },
  {
    title: "Worry-Free Code Reviews",
    description:
      "Review code confidently knowing that potential vulnerabilities are flagged for you.",
  },
  {
    title: "Consistent Security Checks",
    description:
      "Perform regular security checks to identify and fix vulnerabilities promptly.",
  },
  {
    title: "Quick Sharing and Collaboration",
    description:
      "Share analysis reports and collaborate with your team in minutes.",
  },
];

export const pricingOptions = [
  {
    title: "Free",
    price: "$0",
    features: [
      "Private board sharing",
      "5 Gb Storage",
      "Web Analytics",
      "Private Mode",
    ],
  },
  {
    title: "Pro",
    price: "$10",
    features: [
      "Private board sharing",
      "10 Gb Storage",
      "Web Analytics (Advance)",
      "Private Mode",
    ],
  },
  {
    title: "Enterprise",
    price: "$200",
    features: [
      "Private board sharing",
      "Unlimited Storage",
      "High Performance Network",
      "Private Mode",
    ],
  },
];

export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Documentation" },
  { href: "#", text: "Tutorials" },
  { href: "#", text: "API Reference" },
  { href: "#", text: "Community Forums" },
];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Supported Devices" },
  { href: "#", text: "System Requirements" },
  { href: "#", text: "Downloads" },
  { href: "#", text: "Release Notes" },
];

export const communityLinks = [
  { href: "#", text: "Events" },
  { href: "#", text: "Meetups" },
  { href: "#", text: "Conferences" },
  { href: "#", text: "Hackathons" },
  { href: "#", text: "Jobs" },
];