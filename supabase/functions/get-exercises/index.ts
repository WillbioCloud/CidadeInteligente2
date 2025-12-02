// Local: supabase/functions/get-exercises/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // O Supabase exige esta configuração para permitir chamadas do seu app
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Pega o parâmetro 'muscle' que o app vai enviar
    const { muscle } = await req.json()
    if (!muscle) {
      throw new Error("O parâmetro 'muscle' é obrigatório.")
    }

    // Pega a chave da API que guardamos de forma segura
    const apiKey = Deno.env.get('fVW708aNZgoolwDw7Wm//Q==cw8eMtBRWgU0q56T')

    // Chama a API externa (API-Ninjas)
    const response = await fetch(
      `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`,
      {
        headers: { 'X-Api-Key': apiKey },
      }
    )

    // Verifica se a chamada à API-Ninjas foi bem sucedida
    if (!response.ok) {
      throw new Error(`Erro na API externa: ${response.statusText}`)
    }

    const data = await response.json()

    // Retorna os dados para o seu aplicativo
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})