// supabase/functions/get-instagram-posts/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

// Endpoint da API do Instagram Graph
const INSTAGRAM_API_ENDPOINT = 'https://graph.instagram.com/v19.0/me/media';
// Campos que queremos buscar de cada post
const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,username,like_count,comments_count';

serve(async (_req) => {
  // Tratamento de CORS
  if (_req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const accessToken = Deno.env.get('INSTAGRAM_ACCESS_TOKEN');
    if (!accessToken) {
      throw new Error('Token de acesso do Instagram não encontrado.');
    }

    const url = `${INSTAGRAM_API_ENDPOINT}?fields=${FIELDS}&limit=5&access_token=${accessToken}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro na API do Instagram: ${JSON.stringify(errorData)}`);
    }

    const { data } = await response.json();

    // Filtra para retornar apenas imagens e vídeos, ignorando carrosséis por simplicidade
    const filteredData = data.filter(post => post.media_type === 'IMAGE' || post.media_type === 'VIDEO');

    return new Response(JSON.stringify(filteredData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Erro na função get-instagram-posts:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})