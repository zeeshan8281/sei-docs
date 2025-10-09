'use client';

import React, { useEffect, useMemo, useState } from 'react';

type PagefindResult = {
	data: () => Promise<{ url: string; content: string; excerpt: string; meta?: Record<string, any>; title: string }>;
};

declare global {
	interface Window {
		pagefind?: {
			search: (query: string) => Promise<{ results: PagefindResult[] }>;
		};
	}
}

function useQueryParam(name: string): string {
	const [value, setValue] = useState('');
	useEffect(() => {
		const update = () => setValue(new URL(window.location.href).searchParams.get(name) || '');
		update();
		window.addEventListener('popstate', update);
		return () => window.removeEventListener('popstate', update);
	}, [name]);
	return value;
}

export function SearchClient() {
	const initialQ = useQueryParam('q');
	const [q, setQ] = useState(initialQ);
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState<Array<{ title: string; url: string; excerpt: string }>>([]);

	useEffect(() => {
		setQ(initialQ);
	}, [initialQ]);

	useEffect(() => {
		const run = async () => {
			if (!q) {
				setResults([]);
				return;
			}
			setLoading(true);
			try {
				// Pagefind is generated into /public/_pagefind and loaded automatically by the theme when used; fallback to no-op
				if (window.pagefind?.search) {
					const res = await window.pagefind.search(q);
					const full = await Promise.all(
						res.results.slice(0, 20).map(async (r) => {
							const d = await r.data();
							return { title: d.title, url: d.url, excerpt: d.excerpt };
						})
					);
					setResults(full);
				} else {
					setResults([]);
				}
			} finally {
				setLoading(false);
			}
		};
		run();
	}, [q]);

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const url = new URL(window.location.href);
		url.searchParams.set('q', q);
		window.history.pushState({}, '', url.toString());
	};

	return (
		<div>
			<form onSubmit={onSubmit} className='mb-6'>
				<input
					className='w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900'
					placeholder='Search docs...'
					value={q}
					onChange={(e) => setQ(e.target.value)}
					aria-label='Search query'
				/>
			</form>
			{loading && <div className='text-neutral-500'>Searching…</div>}
			{!loading && results.length === 0 && q && <div className='text-neutral-500'>No results found.</div>}
			<ul className='space-y-4'>
				{results.map((r, i) => (
					<li key={i}>
						<a href={r.url} className='text-red-600 dark:text-red-400 hover:underline'>
							{r.title}
						</a>
						<p className='text-sm text-neutral-600 dark:text-neutral-400'>{r.excerpt}</p>
					</li>
				))}
			</ul>
		</div>
	);
}
