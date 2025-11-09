import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { FixedPlugin, Layout } from "@/components";
import { UserProvider } from "@/contexts/UserContext";
import { ErrorBoundary } from "@/components/error-boundary";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PAATA.AI - Your Perfect Homework Buddy App",
  description:
    "PAATA.AI is your intelligent homework assistant powered by advanced AI. Get instant, step-by-step solutions to your homework questions, track your learning progress, and excel in your studies with our personalized learning platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
          integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script
          id="MathJax-script"
          async
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.MathJax = {
                tex: {
                  inlineMath: [['$', '$'], ['\\(', '\\)']],
                  displayMath: [['$$', '$$'], ['\\[', '\\]']],
                  processEscapes: true,
                  processEnvironments: true,
                  packages: {
                    '[+]': ['base', 'ams', 'noerrors', 'noundefined', 'physics', 'mhchem']
                  },
                  macros: {
                    // Physics macros
                    '\\vec': '\\overrightarrow{#1}',
                    '\\hat': '\\widehat{#1}',
                    '\\dot': '\\dot{#1}',
                    '\\ddot': '\\ddot{#1}',
                    '\\partial': '\\frac{\\partial}{\\partial #1}',
                    '\\grad': '\\nabla',
                    '\\div': '\\nabla \\cdot',
                    '\\curl': '\\nabla \\times',
                    '\\laplacian': '\\nabla^2',
                    '\\unit': '\\,\\text{#1}',
                    '\\units': '\\,\\text{#1}',
                    // Chemistry macros
                    '\\chem': '\\ce{#1}',
                    '\\molecule': '\\ce{#1}',
                    '\\ion': '\\ce{#1}',
                    '\\reaction': '\\ce{#1}',
                    // Scientific notation
                    '\\sci': '\\times 10^{#1}',
                    '\\scientific': '#1 \\times 10^{#2}',
                    // Units
                    '\\meter': '\\,\\text{m}',
                    '\\kilogram': '\\,\\text{kg}',
                    '\\second': '\\,\\text{s}',
                    '\\ampere': '\\,\\text{A}',
                    '\\kelvin': '\\,\\text{K}',
                    '\\mole': '\\,\\text{mol}',
                    '\\candela': '\\,\\text{cd}',
                    '\\newton': '\\,\\text{N}',
                    '\\joule': '\\,\\text{J}',
                    '\\watt': '\\,\\text{W}',
                    '\\pascal': '\\,\\text{Pa}',
                    '\\volt': '\\,\\text{V}',
                    '\\ohm': '\\,\\Omega',
                    '\\farad': '\\,\\text{F}',
                    '\\henry': '\\,\\text{H}',
                    '\\tesla': '\\,\\text{T}',
                    '\\weber': '\\,\\text{Wb}',
                    '\\coulomb': '\\,\\text{C}',
                    '\\siemens': '\\,\\text{S}',
                    '\\hertz': '\\,\\text{Hz}',
                    '\\becquerel': '\\,\\text{Bq}',
                    '\\gray': '\\,\\text{Gy}',
                    '\\sievert': '\\,\\text{Sv}',
                    '\\katal': '\\,\\text{kat}',
                    // Common constants
                    '\\pi': '\\pi',
                    '\\e': 'e',
                    '\\i': 'i',
                    '\\hbar': '\\hbar',
                    '\\hslash': '\\hbar',
                    '\\infty': '\\infty',
                    '\\alpha': '\\alpha',
                    '\\beta': '\\beta',
                    '\\gamma': '\\gamma',
                    '\\delta': '\\delta',
                    '\\epsilon': '\\varepsilon',
                    '\\zeta': '\\zeta',
                    '\\eta': '\\eta',
                    '\\theta': '\\theta',
                    '\\iota': '\\iota',
                    '\\kappa': '\\kappa',
                    '\\lambda': '\\lambda',
                    '\\mu': '\\mu',
                    '\\nu': '\\nu',
                    '\\xi': '\\xi',
                    '\\omicron': '\\omicron',
                    '\\rho': '\\rho',
                    '\\sigma': '\\sigma',
                    '\\tau': '\\tau',
                    '\\upsilon': '\\upsilon',
                    '\\phi': '\\phi',
                    '\\chi': '\\chi',
                    '\\psi': '\\psi',
                    '\\omega': '\\omega'
                  }
                },
                options: {
                  skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
                  ignoreHtmlClass: 'tex2jax_ignore',
                  processHtmlClass: 'tex2jax_process'
                },
                startup: {
                  ready: function () {
                    MathJax.startup.defaultReady();
                    console.log('MathJax is ready for scientific expressions!');
                  }
                }
              };
            `,
          }}
        />
        <link rel="icon" href="/image/Paata_logo.png" type="image/png" />
        <link rel="shortcut icon" href="/image/Paata_logo.png" type="image/png" />
      </head>
      <body className={roboto.className}>
        <ErrorBoundary>
          <UserProvider>
            <Layout>
              {children}
              <FixedPlugin />
            </Layout>
          </UserProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
