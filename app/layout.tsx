import React from 'react';

import { getPageMap } from 'nextra/page-map';
import { Toaster } from 'sonner';
import { Metadata } from 'next';
import Script from 'next/script';

import DocsProviders from '../src/providers/DocsProviders';

import '@radix-ui/themes/styles.css';
import 'nextra-theme-docs/style.css';
import './globals.css';
import 'katex/dist/katex.min.css';

export const metadata: Metadata = {
	title: {
		default: 'Sei Documentation | Developer Guides & Resources',
		template: '%s | Sei Docs'
	},
	description:
		'Documentation for Sei. Providing comprehensive guides, tutorials, and resources for developers building on Sei. Learn about the EVM, smart contracts, tokenization standards (ERC20, ERC721, ERC1155), and advanced features of the Sei ecosystem to accelerate your blockchain development journey.',
	category: 'technology',
	openGraph: {
		// Make sure not to specify `title` or description` as they are automatically generated from the main description and title template
		url: 'https://docs.sei.io',
		siteName: 'Sei Docs',
		locale: 'en_US',
		images: [
			{
				url: 'https://www.docs.sei.io/assets/docs-banner.png',
				alt: 'Sei Docs'
			}
		],
		type: 'article'
	},
	twitter: {
		// Make sure not to specify `title` or description` as they are automatically generated from the main description and title template
		card: 'summary_large_image',
		creator: '@SeiNetwork',
		images: ['https://www.docs.sei.io/assets/docs-banner.png']
	},
	referrer: 'origin-when-cross-origin',
	keywords: ['Sei', 'Sei Network', 'Sei Blockchain', 'Sei Docs', 'Sei Documentation', 'EVM', 'ERC20', 'ERC721'],
	creator: 'Sei Network',
	publisher: 'Sei Network',
	formatDetection: {
		email: false,
		address: false,
		telephone: false
	},
	robots: {
		index: true,
		follow: true,
		nocache: false,
		googleBot: {
			index: true,
			follow: true,
			noimageindex: false,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1
		}
	},
	icons: {
		icon: '/icon.png',
		apple: '/apple-icon.png'
	}
};

export default async function RootLayout({ children }) {
	return (
		<html lang='en' dir='ltr' suppressHydrationWarning style={{ width: '100%', height: '100%' }}>
			<head>
				<meta name='color-scheme' content='dark light' />
				<link rel='canonical' href='https://docs.sei.io' />
				{/* Performance: avoid early preconnects to heavy third-parties */}
				<Script id='ld-organization' type='application/ld+json' strategy='afterInteractive'>
					{JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'Organization',
						name: 'Sei Network',
						url: 'https://docs.sei.io',
						logo: 'https://docs.sei.io/icon.png'
					})}
				</Script>
				<Script id='ld-website' type='application/ld+json' strategy='afterInteractive'>
					{JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebSite',
						name: 'Sei Docs',
						url: 'https://docs.sei.io',
						potentialAction: {
							'@type': 'SearchAction',
							target: 'https://docs.sei.io/search?q={search_term_string}',
							'query-input': 'required name=search_term_string'
						}
					})}
				</Script>
			</head>
			<body style={{ width: '100%', height: '100%' }}>
				<Toaster position='bottom-left' />
				<DocsProviders pageMap={await getPageMap()}>{children}</DocsProviders>
			</body>
			{/* Google Analytics: lazy-load after window load */}
			<Script src='https://www.googletagmanager.com/gtag/js?id=G-G33FDB53X5' strategy='lazyOnload' />
			<Script id='ga-init' strategy='lazyOnload'>
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', 'G-G33FDB53X5', { anonymize_ip: true });
				`}
			</Script>
		</html>
	);
}
