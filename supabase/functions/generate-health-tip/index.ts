// supabase/functions/generate-health-tip/index.ts (VERSÃO COM CONTEÚDO ESTRUTURADO)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Lista de tópicos expandida para incluir mais receitas
const topics = ["hidratação", "sono de qualidade", "receita de salada detox", "exercícios de respiração para ansiedade", "receita de suco verde", "dica de postura no home office", "como montar uma horta em apartamento", "receita de lanche pré-treino"];

const systemPrompt = `
Você é uma assistente de saúde multidisciplinar altamente qualificada, atuando como nutricionista, personal trainer, psicóloga, médica, fisioterapeuta e cozinheira funcional. Suas respostas devem ser sempre práticas, acolhedoras e didáticas.
`;

const getRandomTopic = () => topics[Math.floor(Math.random() * topics.length)];
const normalizeKey = (str: string) => str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, '_').replace(/s$/, '') || 'default';

serve(async (_req) => {
  try {
    const supabaseAdmin = createClient( Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' );
    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    const topic = getRandomTopic();
    
    // --- PROMPT DINÂMICO ---
    // Agora, o prompt muda dependendo do tópico escolhido
    let userPrompt = '';
    if (topic.includes('receita')) {
        // Se o tópico for uma receita, pedimos ingredientes e modo de preparo
        userPrompt = `Crie uma receita prática sobre "${topic}". Retorne APENAS o JSON com a seguinte estrutura: {"title": "Nome da Receita", "excerpt": "Uma frase curta e atrativa sobre a receita.", "category": "Receitas Saudáveis", "content": "Uma breve introdução sobre os benefícios da receita.", "ingredients": ["lista de ingredientes como array de strings"], "instructions": ["passo a passo do modo de preparo como array de strings"], "image_query": "sugestão de 3 a 4 palavras para buscar uma foto desta receita em um banco de imagens"}`;
    } else {
        // Se for uma dica, pedimos um passo a passo
        userPrompt = `Crie uma dica de saúde prática sobre "${topic}". Retorne APENAS o JSON com a seguinte estrutura: {"title": "Um título criativo", "excerpt": "Um resumo curto da dica.", "category": "Escolha uma categoria adequada", "content": "O texto principal da dica com 2 parágrafos.", "steps": ["passo a passo da dica como array de strings, se aplicável"], "image_query": "sugestão de 3 a 4 palavras para buscar uma foto desta dica em um banco de imagens"}`;
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: userPrompt }] }] 
        }) 
      }
    );
    
    if (!geminiResponse.ok) throw new Error(`Erro na API do Gemini: ${await geminiResponse.text()}`);

    const geminiData = await geminiResponse.json();
    const tipJsonString = geminiData.candidates[0].content.parts[0].text;
    const jsonMatch = tipJsonString.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON inválido da IA.");
    const tip = JSON.parse(jsonMatch[0]);

    // --- SALVANDO OS DADOS ESTRUTURADOS ---
    // Agora salvamos os novos campos (ingredients, instructions, steps) no banco
    const { error: insertError } = await supabaseAdmin.from('health_info').insert({
      title: tip.title, 
      excerpt: tip.excerpt, 
      content: tip.content,
      category: tip.category,
      // Novos campos sendo salvos:
      ingredients: tip.ingredients, // Será salvo como JSONB
      instructions: tip.instructions, // Será salvo como JSONB
      steps: tip.steps, // Será salvo como JSONB
      image_query: tip.image_query, // A sugestão de imagem
      // Campos antigos
      read_time: '3 min', 
      image_key: normalizeKey(tip.category),
      source: 'Gerado por IA (Gemini)'
    });

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ message: "Nova dica estruturada gerada com sucesso!" }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro na função generate-health-tip:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
})