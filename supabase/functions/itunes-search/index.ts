const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const requestUrl = new URL(request.url);
  const params = new URLSearchParams({
    term: requestUrl.searchParams.get("term") || "",
    country: requestUrl.searchParams.get("country") || "JP",
    media: requestUrl.searchParams.get("media") || "music",
    entity: requestUrl.searchParams.get("entity") || "song",
    limit: requestUrl.searchParams.get("limit") || "80",
    lang: requestUrl.searchParams.get("lang") || "ja_jp",
  });

  if (!params.get("term")?.trim()) {
    return new Response(JSON.stringify({ resultCount: 0, results: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const appleResponse = await fetch(`https://itunes.apple.com/search?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      "User-Agent": "IntroPost/1.0",
    },
  });

  const body = await appleResponse.text();
  return new Response(body, {
    status: appleResponse.status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
