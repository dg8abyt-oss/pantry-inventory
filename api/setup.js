const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupDatabase() {
  try {
    // Create inventory table
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('inventory')
      .select('*')
      .limit(1);

    if (inventoryError && inventoryError.code === 'PGRST114') {
      // Table doesn't exist, create it
      const { data: createData, error: createError } = await supabase
        .rpc('create_inventory_table');

      if (createError) throw createError;

      console.log('Inventory table created successfully');
    } else if (inventoryError) {
      throw inventoryError;
    } else {
      console.log('Inventory table already exists');
    }

    // Create a function to create the inventory table
    const { data: functionData, error: functionError } = await supabase
      .rpc('create_inventory_table_function');

    if (functionError && functionError.code !== 'PGRST114') {
      throw functionError;
    }

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();