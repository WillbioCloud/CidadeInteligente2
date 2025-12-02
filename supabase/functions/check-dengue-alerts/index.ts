// Local: supabase/functions/check-dengue-alerts/index.ts (VERSÃO CORRIGIDA)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts' // <-- LINHA CORRIGIDA

serve(async (_req) => {
  // ... (O resto do código da função permanece o mesmo)
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const response = await fetch(
      'https://apidadosabertos.saude.gov.br/v1/arboviroses/dengue?uf=52&ano=2025'
    )
    const data = await response.json()

    if (data && data.length > 0) {
      const alertTitle = "Alerta de Monitoramento de Dengue"
      const alertMessage = `Foram detectados ${data.length} registros de casos de dengue em Goiás para 2025. Fique atento e previna-se.`

      const { error } = await supabaseAdmin.from('health_alerts').insert({
        title: alertTitle,
        message: alertMessage,
        severity: 'warning',
        source: 'Ministério da Saúde (API Dados Abertos)',
      })

      if (error) {
        throw new Error(`Erro ao inserir alerta no banco: ${error.message}`)
      }

      return new Response(JSON.stringify({ message: "Alerta verificado e inserido com sucesso." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ message: "Nenhuma condição de alerta encontrada." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})