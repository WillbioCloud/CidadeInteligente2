// Local: supabase/functions/get-nutrition-info/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Configuração de CORS para permitir a comunicação com o app
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Pega o parâmetro 'query' que o app vai enviar (ex: "1 copo de arroz")
    const { query } = await req.json()
    if (!query) {
      throw new Error("O parâmetro 'query' é obrigatório.")
    }

    // Pega a chave da API que guardamos de forma segura nos 'secrets'
    const apiKey = Deno.env.get('NINJAS_API_KEY')
    if (!apiKey) {
        throw new Error("A chave da API-Ninjas não foi encontrada nos segredos.")
    }

    // Chama a API externa de Nutrição
    const response = await fetch(
      // encodeURIComponent garante que espaços e caracteres especiais sejam enviados corretamente
      `https://api.api-ninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`,
      {
        headers: { 'fVW708aNZgoolwDw7Wm//Q==cw8eMtBRWgU0q56T': apiKey },
      }
    )
    
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