
# Cópia Exata do Projeto Clínica Agenda Flow

Vou replicar todos os arquivos do projeto [Clínica Agenda Flow](/projects/f25a7197-66af-4237-adb9-8e849a6c0a86) neste projeto atual.

## O que será copiado

### Design System e Configuração
- **index.css** — Tema personalizado com cores rosa/azul, fonte Poppins, utilitários glass-panel/glass-card/gradient-text
- **tailwind.config.ts** — Cores customizadas (pink, blue, emerald, slate) e fonte display Poppins

### Integração Supabase
- **src/integrations/supabase/client.ts** — Cliente Supabase configurado com env vars
- **src/integrations/supabase/types.ts** — Tipos gerados (tabela Agendamento_Analia)
- **supabase/migrations/** — Policy de leitura pública e update na tabela Agendamento_Analia

### Lógica de Negócio
- **src/lib/agendamento-date.ts** — Parser de datas brasileiras (dd/MM/yyyy HH:mm), comparação e formatação
- **src/hooks/useAgendamentos.ts** — Hook React Query para buscar e atualizar agendamentos

### Componentes do Calendário
- **CalendarHeader** — Navegação entre mês/semana/dia com botão "Hoje"
- **MonthView** — Visão mensal com grid 7 colunas e eventos coloridos por status
- **WeekView** — Visão semanal com cards por dia
- **DayView** — Visão diária detalhada com lista de eventos
- **EventDetailDialog** — Modal de detalhes do agendamento com edição de anotações
- **UpcomingAppointmentsPanel** — Painel lateral com próximos agendamentos

### Página Principal
- **src/pages/Index.tsx** — Dashboard com 4 cards de estatísticas (Total, Hoje, Confirmados, Pendentes) + calendário + painel lateral

### Dependência adicional
- **framer-motion** — Animações nos componentes

## Conexão Supabase
O projeto original usa Supabase com a tabela `Agendamento_Analia`. Será necessário conectar o mesmo Supabase ou configurar as variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`).
