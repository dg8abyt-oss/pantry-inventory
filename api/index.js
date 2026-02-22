const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('inventory')
      .select('*');

    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json(data);
    }
  } else if (req.method === 'POST') {
    const { name, quantity, category } = req.body;

    const { data, error } = await supabase
      .from('inventory')
      .insert([{ name, quantity, category }]);

    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json(data);
    }
  } else if (req.method === 'PUT') {
    const { id, name, quantity, category } = req.body;

    const { data, error } = await supabase
      .from('inventory')
      .update({ name, quantity, category })
      .eq('id', id);

    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json(data);
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.body;

    const { data, error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json(data);
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};