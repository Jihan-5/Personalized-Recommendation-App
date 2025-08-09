-- Create indexes for performance

-- Index for filtering items by mode and price
create index idx_items_mode_price on public.items (mode, price);

-- Index for user_events table
create index idx_user_events_user_id on public.user_events (user_id);
create index idx_user_events_item_id on public.user_events (item_id);

-- Create a vector index for efficient similarity search
-- ivfflat is a good balance between speed and accuracy for many use cases.
-- The number of lists should be sqrt(N) where N is the number of rows.
-- Let's assume we start with up to 1M items, so sqrt(1,000,000) = 1000.
create index on public.items using ivfflat (embedding vector_l2_ops)
  with (lists = 100);

-- If you had more than a few million rows, you might consider HNSW:
-- create index on public.items using hnsw (embedding vector_l2_ops);