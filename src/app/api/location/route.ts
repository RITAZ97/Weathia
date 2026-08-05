interface IpLocationResult {
  success: boolean;
  city?: string;
  country_code?: string;
}

const decodeHeader = (value: string | null) => {
  if (!value) return '';

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export async function GET(request: Request) {
  const vercelCity = decodeHeader(request.headers.get('x-vercel-ip-city'));
  const vercelCountry = request.headers.get('x-vercel-ip-country') || '';

  if (vercelCity) {
    return Response.json({
      city: vercelCountry ? `${vercelCity},${vercelCountry}` : vercelCity,
      source: 'vercel-ip',
    });
  }

  const forwardedIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const lookupUrl = forwardedIp && forwardedIp !== '::1' && forwardedIp !== '127.0.0.1'
    ? `https://ipwho.is/${encodeURIComponent(forwardedIp)}`
    : 'https://ipwho.is/';

  try {
    const response = await fetch(lookupUrl, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3500),
    });
    if (!response.ok) throw new Error('IP location request failed');

    const result = await response.json() as IpLocationResult;
    if (!result.success || !result.city) throw new Error('IP location unavailable');

    return Response.json({
      city: result.country_code ? `${result.city},${result.country_code}` : result.city,
      source: 'public-ip',
    });
  } catch {
    return Response.json(
      { error: 'Unable to detect your city. Please search for a location.' },
      { status: 503 }
    );
  }
}
