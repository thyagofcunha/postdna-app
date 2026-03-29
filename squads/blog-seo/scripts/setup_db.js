require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ Erro: DATABASE_URL não encontrada no arquivo .env");
  process.exit(1);
}

const sql = `
-- 1. Tabela de Posts do Blog
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  summary text,
  content text NOT NULL,
  cover_image_url text,
  keywords text,
  meta_title text,
  meta_description text,
  published boolean DEFAULT false,
  published_at timestamp with time zone,
  scheduled_at timestamp with time zone,
  reading_time_minutes integer,
  category text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. Tabela de Marcas (Brand DNA)
CREATE TABLE IF NOT EXISTS public.brands (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid, -- Relacional com Auth se existir
  name text NOT NULL,
  niche text,
  product_name text,
  product_description text,
  colors jsonb, -- { primary: "#...", secondary: "#..." }
  fonts jsonb, -- { headline: "font-name", body: "font-name" }
  logo_url text,
  onboarding_complete boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Tabela de Ideias Salvas
CREATE TABLE IF NOT EXISTS public.saved_ideas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  title text NOT NULL,
  description text,
  format text, -- ex: 'carrossel', 'story', 'blog'
  created_at timestamp with time zone DEFAULT now()
);

-- 4. Função para atualizar timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para posts
DROP TRIGGER IF EXISTS set_timestamp ON public.posts;
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE PROCEDURE public.handle_updated_at();

-- Trigger para brands
DROP TRIGGER IF EXISTS set_timestamp_brands ON public.brands;
CREATE TRIGGER set_timestamp_brands
BEFORE UPDATE ON public.brands
FOR EACH ROW
EXECUTE PROCEDURE public.handle_updated_at();
`;

async function setup() {
  console.log("🚀 Iniciando configuração do banco de dados no Supabase...");
  
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("✅ Conexão via PostgreSQL estabelecida com sucesso!");
    
    await client.query(sql);
    console.log("✅ Tabelas 'posts', 'brands' e 'saved_ideas' configuradas com sucesso.");
    console.log("✅ Funções e Triggers de automatização criados.");
    
  } catch (err) {
    console.error("❌ Falha na execução do setup:", err.message);
  } finally {
    await client.end();
    console.log("🏁 Operação finalizada.");
  }
}

setup();
