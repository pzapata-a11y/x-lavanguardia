-- Tabla de autores
create table if not exists authors (
  slug text primary key,
  name text not null,
  photo_url text,
  bio text,
  author_page_url text,
  last_checked_at timestamptz
);

-- Tabla de artículos
create table if not exists articles (
  id bigint generated always as identity primary key,
  url text unique not null,
  title text not null,
  section text,
  image_url text,
  author_slug text references authors(slug),
  published_at timestamptz,
  first_seen_at timestamptz default now()
);

-- Para consultas rápidas ordenadas por fecha
create index if not exists articles_published_at_idx on articles (published_at desc);
