// supabase/functions/complete-mission/index.ts

import { createClient } from 'jsr:@supabase/supabase-js@^2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      }
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ 
      error: true, 
      message: 'Método de requisição inválido. Use POST.' 
    }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { mission_id } = await req.json();

    if (!mission_id) {
      return new Response(JSON.stringify({ 
        error: true, 
        message: 'ID da missão é obrigatório' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: { 
            Authorization: req.headers.get('Authorization') || '' 
          }
        }
      }
    );

    const { data, error } = await supabaseClient.rpc('complete_mission', { 
      p_mission_id: mission_id 
    });

    if (error) {
      console.error('Mission completion error:', error);
      return new Response(JSON.stringify({ 
        error: true, 
        message: error.message || 'Erro ao completar missão',
        details: error
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      error: false,
      message: 'Missão completada com sucesso',
      data: data
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (catchError) {
    console.error('Unexpected error:', catchError);
    return new Response(JSON.stringify({ 
      error: true, 
      message: 'Erro interno do servidor',
      details: catchError.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});