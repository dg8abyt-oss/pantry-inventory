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
      if (req.body.name && req.body.quantity && req.body.category) {
        const { data, error } = await supabase
          .from('inventory')
          .insert([
            {
              name: req.body.name,
              quantity: req.body.quantity,
              category: req.body.category
            }
          ]);

        if (error) throw error;

        res.status(201).json(data);
      } else {
        res.status(400).json({ error: 'Missing required fields' });
      }
    } else if (req.method === 'PUT') {
      if (req.body.id && req.body.name && req.body.quantity && req.body.category) {
        const { data, error } = await supabase
          .from('inventory')
          .update({
            name: req.body.name,
            quantity: req.body.quantity,
            category: req.body.category
          })
          .eq('id', req.body.id);

        if (error) throw error;

        res.status(200).json(data);
      } else {
        res.status(400).json({ error: 'Missing required fields' });
      }
    } else if (req.method === 'DELETE') {
      if (req.body.id) {
        const { data, error } = await supabase
          .from('inventory')
          .delete()
          .eq('id', req.body.id);

        if (error) throw error;

        res.status(200).json(data);
      } else {
        res.status(400).json({ error: 'Missing item ID' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};