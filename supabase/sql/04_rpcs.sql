-- RPC for Semantic Search
-- Searches for items based on a query string by converting it to an embedding
-- and finding the most similar items in the database.
create or replace function public.search_items(
    query_embedding vector(1536),
    match_threshold float,
    match_count int,
    query_mode app_mode,
    max_price numeric
)
returns table (
    id bigint,
    title text,
    description text,
    image_url text,
    price numeric(10, 2),
    mode app_mode,
    tags text[],
    created_at timestamp with time zone,
    similarity float
)
language sql stable
as $$
  select
    i.id,
    i.title,
    i.description,
    i.image_url,
    i.price,
    i.mode,
    i.tags,
    i.created_at,
    1 - (i.embedding <=> query_embedding) as similarity
  from public.items i
  where 1 - (i.embedding <=> query_embedding) > match_threshold
    and i.mode = query_mode
    and i.price <= max_price
  order by similarity desc
  limit match_count;
$$;


-- RPC for finding similar items to a given item
create or replace function public.get_similar_items(
    item_id_in bigint,
    match_count int
)
returns setof public.items
language plpgsql
as $$
declare
    query_embedding vector(1536);
begin
    -- Get the embedding of the input item
    select embedding into query_embedding
    from public.items
    where id = item_id_in;

    -- Find and return similar items
    return query
    select * from public.items
    where id != item_id_in -- Exclude the item itself
    order by embedding <=> query_embedding
    limit match_count;
end;
$$;


-- RPC for Admin Dashboard Metrics
create or replace function public.get_system_metrics()
returns json
language sql stable
as $$
  select json_build_object(
      'latency_p95', 120.5, -- Placeholder value
      'latency_p99', 250.0, -- Placeholder value
      'cost_per_1k_recs', 0.05 -- Placeholder value
  );
$$;
-- NOTE: In a real system, latency would be aggregated from logs,
-- and cost would be calculated based on OpenAI and Supabase usage.