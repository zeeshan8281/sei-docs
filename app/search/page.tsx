import React from 'react';
import { SearchClient } from './searchClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Search',
	description: 'Search Sei documentation'
};

export default function SearchPage() {
	return (
		<main className='max-w-3xl mx-auto px-4 py-8'>
			<h1 className='text-3xl font-semibold mb-4'>Search</h1>
			<SearchClient />
		</main>
	);
}
