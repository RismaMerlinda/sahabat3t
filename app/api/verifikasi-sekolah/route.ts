import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const npsn = searchParams.get('npsn');

    if (!npsn) {
        return NextResponse.json({ message: 'NPSN is required' }, { status: 400 });
    }

    try {
        // Fetch ke API Eksternal (Server-Side, jadi tidak ada CORS)
        // Gunakan API Proxy yang kita tahu atau API Kemendikbud langsung jika ada URL publik
        const res = await fetch(`https://api.fazriansyah.eu.org/v1/sekolah?npsn=${npsn}`, {
            headers: {
                'User-Agent': 'Sahabat3T/1.0', // Good practice
            },
            // next: { revalidate: 3600 } // Cache results for 1 hour if wanted
        });

        if (!res.ok) {
            throw new Error('Failed to fetch from external API');
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json(
            { message: 'Error fetching school data' },
            { status: 500 }
        );
    }
}
