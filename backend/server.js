import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execFile, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '../dist')));

// Upload configuration
const uploadDir = join(__dirname, '../executables');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedExt = ['.exe', '.msi', '.bat', '.cmd', '.com'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExt.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only .exe, .msi, .bat, .cmd, and .com files are allowed'));
    }
  },
});

// Routes

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    message: 'File uploaded successfully',
    file: {
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: `/api/download/${req.file.filename}`,
      size: req.file.size,
    },
  });
});

// List uploaded files
app.get('/api/files', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to list files' });
    }
    const fileList = files.map((file) => ({
      name: file,
      path: `/api/download/${file}`,
      size: fs.statSync(join(uploadDir, file)).size,
    }));
    res.json(fileList);
  });
});

// Download file
app.get('/api/download/:filename', (req, res) => {
  const filepath = join(uploadDir, req.params.filename);
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  res.download(filepath);
});

// Run executable with Wine
app.post('/api/run/:filename', (req, res) => {
  const filepath = join(uploadDir, req.params.filename);
  
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  let output = '';
  let errorOutput = '';

  try {
    // Set up virtual display for Wine GUI applications
    const env = { ...process.env, DISPLAY: ':99', WINEARCH: 'win32' };
    
    const proc = spawn('wine', [filepath], {
      env,
      timeout: 60000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    proc.stdout.on('data', (data) => {
      output += data.toString();
    });

    proc.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    proc.on('error', (error) => {
      console.error('Process error:', error);
      return res.status(500).json({
        error: 'Failed to execute file',
        details: error.message,
        compatibility: 'This .exe file may not be compatible with Wine. Try simpler console applications first.',
      });
    });

    proc.on('close', (code) => {
      res.json({
        message: 'Execution completed',
        exitCode: code,
        output: output || '(No output)',
        errors: errorOutput || '(No errors)',
      });
    });

    // Timeout after 60 seconds
    setTimeout(() => {
      if (!proc.killed) {
        proc.kill();
        res.json({
          message: 'Execution timeout - process terminated after 60 seconds',
          output: output || '(No output yet)',
          errors: errorOutput || '(Process timed out)',
        });
      }
    }, 60000);

  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({
      error: 'Failed to execute file',
      details: error.message,
      hint: 'Make sure Wine is installed. Simple console .exe files work best.',
    });
  }
});

// Delete file
app.delete('/api/files/:filename', (req, res) => {
  const filepath = join(uploadDir, req.params.filename);
  
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  fs.unlink(filepath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete file' });
    }
    res.json({ message: 'File deleted successfully' });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', wine: 'Installed' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📁 Upload directory: ${uploadDir}`);
  console.log(`🍷 Wine compatibility layer: Enabled`);
  console.log(`🎮 Ready to run Windows executables!`);
});
