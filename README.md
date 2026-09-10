# EXE Runner - Codespaces Edition

Run `.exe` files and games directly in GitHub Codespaces with a web-based interface. Upload, execute, and interact with Windows executables without leaving your browser.

## Features

- 🚀 **One-Click Launch**: Create a Codespace and start immediately
- 📤 **File Upload**: Upload `.exe` files or game executables
- 🎮 **Web Interface**: Play games and run applications through your browser
- 💻 **Full Environment**: Access to 4 cores in GitHub Codespaces
- 📁 **File Management**: Organize and manage your executables
- 🔒 **Isolated**: Safe, sandboxed environment

## Quick Start

### Option 1: Launch via Codespaces (Recommended)
1. Click the green **"Code"** button on this repository
2. Select **"Codespaces"** tab
3. Click **"Create codespace on main"**
4. Wait for the environment to initialize
5. Access the web interface at the provided URL

### Option 2: Local Setup
```bash
git clone https://github.com/notMKwolfie2011/exe-runner-codespaces.git
cd exe-runner-codespaces
npm install
npm start
```

## Usage

1. **Open the Web Interface**
   - The application will be available at `http://localhost:3000` (or the Codespaces URL)

2. **Upload an Executable**
   - Click "Upload File"
   - Select your `.exe` file
   - File will be stored in the `/executables` directory

3. **Run the Executable**
   - Select from your uploaded files
   - Click "Run" to execute
   - Interact with the application through the web interface

4. **Manage Files**
   - View all uploaded executables
   - Delete files you no longer need
   - Monitor resource usage

## System Requirements

- GitHub Account (for Codespaces)
- Any `.exe` or Windows executable
- Modern web browser

## Architecture

```
├── backend/              # Node.js/Express server
│   ├── server.js         # Main server
│   ├── fileHandler.js    # File upload/management
│   └── processRunner.js  # Execute .exe files
├── frontend/             # React web interface
│   ├── App.jsx
│   ├── components/
│   │   ├── FileUpload.jsx
│   │   ├── FileList.jsx
│   │   └── Viewer.jsx
│   └── styles/
├── executables/          # Uploaded .exe files storage
└── .devcontainer/        # Codespaces configuration
```

## Development

### Technologies Used
- **Backend**: Node.js, Express.js
- **Frontend**: React, Axios
- **Execution**: Child Process (Windows executables via WSL2/Proton)
- **Server**: Vite + HMR

### Build & Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Limitations & Notes

⚠️ **Important Considerations:**
- Executables are run in a Linux environment (Codespaces), so Windows `.exe` files may require Wine or Proton compatibility
- Some games/applications with specific hardware requirements may not work
- Network access from executables is sandboxed
- Files are temporary and will be lost when Codespaces session ends

## Performance

Codespaces provides:
- **4 CPU cores** (generous for web applications)
- **16 GB RAM** (sufficient for most applications)
- **Storage**: Up to 32 GB

## Security & Privacy

- All executables run in an isolated Codespaces environment
- Files are not shared between users
- Codespaces sessions auto-terminate after inactivity
- No data is stored permanently

## Contributing

Feel free to submit issues, fork, and create pull requests for improvements!

## License

MIT License - See LICENSE file for details

## Troubleshooting

**Q: My executable won't run**
- A: Windows `.exe` files need compatibility layers (Wine/Proton) in Linux
- Solution: Check the file is a valid Windows executable

**Q: Can I upload large files?**
- A: Yes, up to available Codespaces storage (~32GB)

**Q: Do files persist between sessions?**
- A: No, Codespaces are ephemeral. Export files before closing.

**Q: Can multiple people use the same Codespace?**
- A: Codespaces are per-user. Each person gets their own environment.

---

**Made with ❤️ for the gaming and dev community**
