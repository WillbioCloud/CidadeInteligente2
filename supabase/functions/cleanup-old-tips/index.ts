// Local: supabase/functions/update-nutrition-tip/index.ts (VERSÃO FINAL COM AUTO-ALIMENTAÇÃO)

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

    let { data: queries, error: queryError } = await supabaseAdmin
      .from('nutrition_queries')
      .select('query');

    if (queryError) throw queryError;
    if (!queries || queries.length === 0) throw new Error("Nenhuma query de nutrição encontrada.");

    const MAX_ATTEMPTS = 5;
    let productData = null;
    let randomQuery = '';

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      console.log(`--- Tentativa ${attempt} de ${MAX_ATTEMPTS} ---`);
      if (queries.length === 0) break;

      const queryIndex = Math.floor(Math.random() * queries.length);
      randomQuery = queries.splice(queryIndex, 1)[0].query;
      console.log(`Passo 2: Query aleatória escolhida:`, randomQuery);

      console.log('Passo 3: Chamando API Open Food Facts...');
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(randomQuery)}&search_simple=1&action=process&json=1`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          productData = data.products.find(p => p.product_name);
          if (productData) {
            console.log(`Produto encontrado: ${productData.product_name}`);
            break;
          }
        }
      }
      console.log(`Tentativa ${attempt} falhou para "${randomQuery}".`);
    }

    if (!productData) throw new Error(`Nenhum produto encontrado após ${MAX_ATTEMPTS} tentativas.`);

    const nutriments = productData.nutriments || {};
    const productName = productData.product_name || 'Alimento';
    const calories = nutriments['energy-kcal_100g'] ?? 0;
    const protein = nutriments.proteins_100g ?? 0;
    const carbs = nutriments.carbohydrates_100g ?? 0;
    const fat = nutriments.fat_100g ?? 0;

    console.log('Passo 4: Formatando a dica...');
    const tipTitle = `Info Nutricional: ${productName}`;
    const tipContent = `Em uma porção de 100g, ${productName} contém aproximadamente ${calories.toFixed(0)} calorias, ${protein.toFixed(1)}g de proteína, ${carbs.toFixed(1)}g de carboidratos e ${fat.toFixed(1)}g de gordura.`;
    const tipExcerpt = `Calorias: ${calories.toFixed(0)} | Proteínas: ${protein.toFixed(1)}g | Carboidratos: ${carbs.toFixed(1)}g`;

    console.log('Passo 5: Salvando na tabela health_info...');
    const { error: upsertError } = await supabaseAdmin
      .from('health_info')
      .upsert({ id: 999, title: tipTitle, excerpt: tipExcerpt, content: tipContent, category: 'Alimentação', read_time: '1 min', image_key: 'alimentacao', source: 'Open Food Facts' }, { onConflict: 'id' });

    if (upsertError) throw upsertError;

    // --- NOVO: Lógica para auto-alimentar a lista de queries ---
    console.log('Passo 6: Buscando novas ideias de queries das categorias do produto...');
    // Pega as categorias do produto, remove prefixos de idioma (ex: "en:") e filtra por tamanho
    const categories = productData.categories_tags
      ?.map(tag => tag.replace(/en:|pt:|fr:/, ''))
      .filter(c => c.length > 3 && c.length < 30);

    if (categories && categories.length > 0) {
      const newIdea = getRandomItem(categories); // Pega uma categoria aleatória
      console.log('Nova ideia de query encontrada:', newIdea);

      // Insere a nova ideia na tabela, ignorando se já existir (graças ao UNIQUE que criamos)
      await supabaseAdmin
        .from('nutrition_queries')
        .insert({ query: newIdea }, { onConflict: 'query' });
    }
    // --- FIM DA NOVA LÓGICA ---

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