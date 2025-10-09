import { generateStaticParamsFor, importPage } from 'nextra/pages';
import { useMDXComponents as getMDXComponents } from '../../mdx-components';
import Script from 'next/script';

export const generateStaticParams = generateStaticParamsFor('mdxPath');

export async function generateMetadata(props) {
	const params = await props.params;
	const { metadata } = await importPage(params.mdxPath);
	return metadata;
}

const Wrapper = getMDXComponents().wrapper;

export default async function Page(props) {
	const params = await props.params;
	const result = await importPage(params.mdxPath);
	const { default: MDXContent, toc, metadata } = result;
	const segments = Array.isArray(params?.mdxPath) ? params.mdxPath.filter(Boolean) : [];
	const isHome = segments.length === 0 || (segments.length === 1 && segments[0] === 'index');
	const path = isHome ? '/' : '/' + segments.join('/');
	const baseUrl = 'https://docs.sei.io';
	const pageUrl = isHome ? baseUrl : baseUrl + path;

	const titleFromSlug = (slug) =>
		slug
			.split('-')
			.map((s) => (s.length ? s[0].toUpperCase() + s.slice(1) : s))
			.join(' ');

	const computedTitle = metadata?.title || (segments.length ? titleFromSlug(segments[segments.length - 1]) : 'Sei Documentation');
	const computedDescription = metadata?.description || 'Documentation for Sei. Guides, tutorials, and references for building on the Sei Network.';
	const heroImage = 'https://docs.sei.io/assets/docs-banner.png';
	const articleType = segments[0] === 'learn' ? 'Article' : 'TechArticle';

	const articleLd = {
		'@context': 'https://schema.org',
		'@type': articleType,
		headline: computedTitle,
		description: computedDescription,
		url: pageUrl,
		mainEntityOfPage: pageUrl,
		image: heroImage,
		author: { '@type': 'Organization', name: 'Sei Network' },
		publisher: {
			'@type': 'Organization',
			name: 'Sei Network',
			logo: { '@type': 'ImageObject', url: 'https://docs.sei.io/icon.png' }
		}
	};

	const breadcrumbItems = [];
	breadcrumbItems.push({ '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl });
	segments.forEach((seg, idx) => {
		const name = titleFromSlug(seg);
		const itemUrl = baseUrl + '/' + segments.slice(0, idx + 1).join('/');
		breadcrumbItems.push({ '@type': 'ListItem', position: idx + 2, name, item: itemUrl });
	});
	const breadcrumbLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: breadcrumbItems
	};

	const faqLd = Array.isArray(metadata?.faq)
		? {
				'@context': 'https://schema.org',
				'@type': 'FAQPage',
				mainEntity: metadata.faq
					.filter((qa) => qa && qa.question && qa.answer)
					.map((qa) => ({
						'@type': 'Question',
						name: qa.question,
						acceptedAnswer: { '@type': 'Answer', text: qa.answer }
					}))
			}
		: null;
	return (
		<Wrapper toc={toc} metadata={metadata}>
			<Script id='ld-article' type='application/ld+json' strategy='afterInteractive'>
				{JSON.stringify(articleLd)}
			</Script>
			<Script id='ld-breadcrumbs' type='application/ld+json' strategy='afterInteractive'>
				{JSON.stringify(breadcrumbLd)}
			</Script>
			{faqLd && (
				<Script id='ld-faq' type='application/ld+json' strategy='afterInteractive'>
					{JSON.stringify(faqLd)}
				</Script>
			)}
			<MDXContent {...props} params={params} />
		</Wrapper>
	);
}
