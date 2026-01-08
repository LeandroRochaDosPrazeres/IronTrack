# IronTrack Ultra Professional V1

A ferramenta de musculação para iOS, operando como PWA (Progressive Web App).

## 🚀 Features

- **Gestão de Treinos**: Hierarquia Programa > Fichas > Exercícios > Séries
- **Modo Treino**: Interface otimizada com cronômetro inteligente
- **Calculadora de Anilhas**: Calcula combinação de anilhas para peso desejado
- **Analytics**: Gráficos de progressão e mapa de calor muscular
- **Offline-First**: Funciona sem internet com sincronização automática
- **PWA**: Instalável como app nativo no iOS

## 📱 Tech Stack

- React 18 + TypeScript
- Vite + PWA Plugin
- Supabase (Auth + Database)
- Zustand (State)
- Dexie (IndexedDB)
- Recharts

## 🛠️ Setup

1. Clone o repositório
2. Copie `.env.example` para `.env` e configure:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Instale dependências:
   ```bash
   npm install
   ```
4. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 🗄️ Supabase Setup

Execute o seguinte SQL no Supabase para criar as tabelas:

```sql
-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Programs
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workout Templates
CREATE TABLE workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  day_of_week INTEGER,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercises
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  muscle_groups TEXT[],
  equipment TEXT,
  movement_pattern TEXT,
  image_url TEXT,
  instructions TEXT,
  is_custom BOOLEAN DEFAULT false
);

-- Template Exercises
CREATE TABLE template_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id),
  order_index INTEGER,
  rest_seconds INTEGER DEFAULT 90,
  notes TEXT,
  target_sets INTEGER DEFAULT 3,
  target_reps TEXT DEFAULT '8-12',
  set_type TEXT DEFAULT 'normal'
);

-- Workout Sessions
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  template_id UUID REFERENCES workout_templates(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  notes TEXT,
  energy_level INTEGER,
  total_volume DECIMAL
);

-- Set Logs
CREATE TABLE set_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id),
  set_number INTEGER,
  weight DECIMAL,
  reps INTEGER,
  rpe DECIMAL,
  rir INTEGER,
  set_type TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE set_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own programs" ON programs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own templates" ON workout_templates FOR ALL USING (program_id IN (SELECT id FROM programs WHERE user_id = auth.uid()));
CREATE POLICY "Anyone can view system exercises" ON exercises FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "Users can manage own exercises" ON exercises FOR ALL USING (user_id = auth.uid());
```

## 📲 Instalação no iOS

1. Abra o app no Safari
2. Toque no botão Compartilhar
3. Selecione "Adicionar à Tela de Início"
4. Toque em "Adicionar"

## 📄 License

MIT
