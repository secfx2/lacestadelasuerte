import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const filePath = path.join(process.cwd(), 'src', 'pages', 'numbers', 'numbers.json');
    const { phone } = req.body;

    // Crear la carpeta si no existe
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    // Leer el archivo existente o inicializar un array vacío
    const data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];

    // Añadir el nuevo número
    data.push({ phone, timestamp: new Date().toISOString() });

    // Guardar los datos en el archivo
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return res.status(200).json({ success: true });
  }

  res.status(405).json({ message: 'Method not allowed' });
}
