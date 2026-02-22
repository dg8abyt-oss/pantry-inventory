const { createClient } = require('@supabase/supabase-js');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

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

      // Create a canvas
      const canvas = createCanvas(800, 600);
      const ctx = canvas.getContext('2d');

      // Set background color
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties
      ctx.fillStyle = '#1f2937';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';

      // Add title
      ctx.fillText('Pantry Inventory', canvas.width / 2, 40);

      // Set table properties
      const tableX = 50;
      const tableY = 80;
      const rowHeight = 40;
      const colWidth = 200;

      // Draw table headers
      ctx.font = 'bold 16px Arial';
      ctx.fillText('Name', tableX + colWidth / 2, tableY + rowHeight / 2);
      ctx.fillText('Quantity', tableX + colWidth * 1.5, tableY + rowHeight / 2);
      ctx.fillText('Category', tableX + colWidth * 2.5, tableY + rowHeight / 2);

      // Draw table rows
      ctx.font = '14px Arial';
      data.forEach((item, index) => {
        const y = tableY + (index + 1) * rowHeight;
        ctx.fillText(item.name, tableX + colWidth / 2, y + rowHeight / 2);
        ctx.fillText(item.quantity.toString(), tableX + colWidth * 1.5, y + rowHeight / 2);
        ctx.fillText(item.category, tableX + colWidth * 2.5, y + rowHeight / 2);
      });

      // Convert canvas to PNG
      const buffer = canvas.toBuffer('image/png');

      // Save PNG to a file
      fs.writeFileSync('inventory.png', buffer);

      // Set response headers
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', 'attachment; filename=inventory.png');

      // Send the PNG file
      res.status(200).send(buffer);
    } else if (req.method === 'POST') {
      // Handle POST request to convert favicon.svg to PNG
      const svgPath = './favicon.svg';
      const pngPath = './favicon.png';

      try {
        // Load the SVG file
        const svg = await loadImage(svgPath);

        // Create a canvas with the same dimensions as the SVG
        const canvas = createCanvas(svg.width, svg.height);
        const ctx = canvas.getContext('2d');

        // Draw the SVG on the canvas
        ctx.drawImage(svg, 0, 0, svg.width, svg.height);

        // Convert canvas to PNG
        const buffer = canvas.toBuffer('image/png');

        // Save PNG to a file
        fs.writeFileSync(pngPath, buffer);

        // Set response headers
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename=favicon.png');

        // Send the PNG file
        res.status(200).send(buffer);
      } catch (error) {
        console.error('Error converting SVG to PNG:', error);
        res.status(500).json({ error: 'Failed to convert SVG to PNG' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};