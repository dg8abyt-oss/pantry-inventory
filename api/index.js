const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Handle preflight request
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('inventory')
        .select('*');

      if (error) throw error;

      res.status(200).json(data);
    } else if (req.method === 'POST') {
      const { name, quantity, category } = req.body;

      const { data, error } = await supabase
        .from('inventory')
        .insert([{ name, quantity, category }]);

      if (error) throw error;

      res.status(200).json(data);
    } else if (req.method === 'PUT') {
      const { id, name, quantity, category } = req.body;

      const { data, error } = await supabase
        .from('inventory')
        .update({ name, quantity, category })
        .eq('id', id);

      if (error) throw error;

      res.status(200).json(data);
    } else if (req.method === 'DELETE') {
      const { id } = req.body;

      const { data, error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;

      res.status(200).json(data);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};