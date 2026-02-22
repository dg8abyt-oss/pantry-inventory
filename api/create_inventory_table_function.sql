CREATE OR REPLACE FUNCTION create_inventory_table()
RETURNS VOID AS $$
BEGIN
  EXECUTE '
    CREATE TABLE inventory (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  ';
END;
$$ LANGUAGE plpgsql;