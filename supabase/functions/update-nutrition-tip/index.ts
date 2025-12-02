// Local: supabase/functions/update-nutrition-tip/index.ts (VERSÃO ATUALIZADA PARA OPEN FOOD FACTS)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

serve(async (_req) => {
  console.log('--- Função (Open Food Facts) iniciada ---');
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Buscar queries da nossa tabela
    let { data: queries, error: queryError } = await supabaseAdmin
      .from('nutrition_queries')
      .select('query');

    if (queryError) throw queryError;
    if (!queries || queries.length === 0) throw new Error("Nenhuma query de nutrição encontrada.");

    // Lógica de tentativas para encontrar um produto válido
    const MAX_ATTEMPTS = 5;
    let productData = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      console.log(`--- Tentativa ${attempt} de ${MAX_ATTEMPTS} ---`);
      if (queries.length === 0) break;

      const queryIndex = Math.floor(Math.random() * queries.length);
      const randomQuery = queries.splice(queryIndex, 1)[0].query;
      console.log(`Passo 2: Query aleatória escolhida:`, randomQuery);

      console.log('Passo 3: Chamando API Open Food Facts...');
      // 2. Montar a URL para a nova API
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(randomQuery)}&search_simple=1&action=process&json=1`
      );

      if (response.ok) {
        const data = await response.json();
        // 3. Verificar se a API encontrou produtos
        if (data.products && data.products.length > 0) {
          // Pega o primeiro produto que tenha um nome
          productData = data.products.find(p => p.product_name);
          if (productData) {
            console.log(`Produto encontrado: ${productData.product_name}`);
            break; // Encontrou um produto válido, para de tentar
          }
        }
      }
      console.log(`Tentativa ${attempt} falhou. A API não retornou dados para "${randomQuery}".`);
    }

    if (!productData) throw new Error(`Nenhum produto encontrado após ${MAX_ATTEMPTS} tentativas.`);
    
    // 4. Extrair os dados nutricionais do objeto 'nutriments'
    const nutriments = productData.nutriments || {};
    const productName = productData.product_name || 'Alimento';
    // Usamos '?? 0' para evitar erros se um dado específico não existir
    const calories = nutriments['energy-kcal_100g'] ?? 0;
    const protein = nutriments.proteins_100g ?? 0;
    const carbs = nutriments.carbohydrates_100g ?? 0;
    const fat = nutriments.fat_100g ?? 0;
    
    console.log('Passo 4: Formatando a dica...');
    const tipTitle = `Info Nutricional: ${productName}`;
    const tipContent = `Em uma porção de 100g, ${productName} contém aproximadamente ${calories.toFixed(0)} calorias, ${protein.toFixed(1)}g de proteína, ${carbs.toFixed(1)}g de carboidratos e ${fat.toFixed(1)}g de gordura.`;
    const tipExcerpt = `Calorias: ${calories.toFixed(0)} | Proteínas: ${protein.toFixed(1)}g | Carboidratos: ${carbs.toFixed(1)}g`;

    // 5. Salvar a dica na nossa tabela 'health_info' (esta parte não muda)
    console.log('Passo 5: Salvando na tabela health_info...');
    const { error: upsertError } = await supabaseAdmin
      .from('health_info')
      .upsert({ id: 999, title: tipTitle, excerpt: tipExcerpt, content: tipContent, category: 'Alimentação', read_time: '1 min', image_key: 'alimentacao', source: 'Open Food Facts' }, { onConflict: 'id' });

    if (upsertError) throw upsertError;

    console.log('--- Função concluída com sucesso! ---');
    return new Response(JSON.stringify({ message: "Dica de nutrição atualizada com sucesso!", tip: tipTitle }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('--- ERRO NA EXECUÇÃO DA FUNÇÃO ---', error);
    return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
})