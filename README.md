# React + Python (rembg) Background Remover

A simple demo project that combines a React (Vite) frontend and a FastAPI Python backend which uses the `rembg` library to remove image backgrounds. The frontend allows users to drag & drop or select an image; the backend processes the uploaded image and returns a PNG with the background removed as a base64 data URL.

## Features

- Drag & drop or click to upload an image from the browser
- Background removal performed server-side using `rembg` (PIL-compatible)
- Processed image returned as a base64 PNG and displayed in the UI
- Download button to save the background-removed image

## Project structure

- `backend/`
  - `main.py` - FastAPI server; receives uploaded images, removes background with `rembg`, returns base64 PNG.
- `frontend/`
  - `index.html` - Vite entry HTML
  - `package.json` - frontend dependencies and scripts (uses Vite + React)
  - `src/`
    - `main.jsx` - React entry point that mounts the app
    - `App.jsx` - Main React component: dropzone, upload logic, display and download of images
    - `App.css` - Basic styling for the UI

## Requirements

Backend (Python):

- Python 3.8+
- FastAPI
- Uvicorn (ASGI server)
- rembg (background removal)
- pillow (PIL)

Frontend (Node):

- Node.js (14+ recommended)
- npm or yarn

Note: If you plan to run `rembg` with the latest backends, additional system-level dependencies or model downloads may be required. Consult the `rembg` documentation for any platform-specific steps.

## How to run (development)

Open two terminals (or two tabs). Use PowerShell on Windows. Replace current working directories as needed.

1) Start the backend (FastAPI)

```powershell
cd backend
# (optional) create and activate a virtual environment
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install fastapi uvicorn rembg pillow
# Run the server
python main.py
```

The backend listens by default on `http://0.0.0.0:8000` and exposes the endpoint `/remove-bg`.

2) Start the frontend (Vite + React)

```powershell
cd frontend
npm install
npm run dev
```

This typically starts the dev server on `http://localhost:5173` (Vite). The frontend is configured to send uploads to `http://localhost:8000/remove-bg`.

## How it works — key files explained

- `backend/main.py`
  - Creates a FastAPI app and enables CORS for the frontend origins (`http://localhost:5173`, `http://localhost:5174`).
  - Exposes POST `/remove-bg` that accepts a file upload (`UploadFile`) and reads the bytes.
  - Loads the uploaded bytes into a PIL `Image` and calls `rembg.remove(input_image)` to remove the background.
  - Saves the result to an in-memory `BytesIO` buffer as PNG, encodes it in base64, and returns a JSON object: `{ "image": "data:image/png;base64,<encoded>" }`.
  - When run directly (`if __name__ == '__main__'`), the app starts with Uvicorn.

- `frontend/src/App.jsx`
  - Uses `react-dropzone` to provide drag & drop file selection.
  - On drop, reads the file locally to preview the original image using `FileReader`.
  - Sends the file as `multipart/form-data` to the backend using `axios.post('http://localhost:8000/remove-bg', formData)`.
  - Displays a processing indicator during upload and processing, then shows the returned base64 PNG in an `<img>` tag.
  - Provides a download button that links to the returned data URL so users can save the PNG.

- `frontend/src/main.jsx` and `frontend/index.html`
  - Standard Vite + React mounting: `main.jsx` mounts `App` into the `#root` div in `index.html`.

- `frontend/src/App.css`
  - Styles for the app, dropzone, image containers, and buttons.

## Important notes & troubleshooting

- rembg model download and runtime: `rembg` may download models or require native dependencies (depending on the version). If background removal fails or raises model-related errors, ensure `rembg` documentation is followed and any additional runtime dependencies are installed.

- CORS: The backend explicitly allows origins `http://localhost:5173` and `http://localhost:5174`. If your frontend runs on a different origin or a deployed domain, update `allow_origins` in `backend/main.py`.

- File sizes: Large images will increase processing time and memory usage. For production, add file size validation and queuing.

- Security: This demo accepts uploads without authentication. For production use, add authentication, input validation, rate-limiting, and scanning.

## Next steps / improvements (suggestions)

- Add error handling on the backend to return structured error messages and status codes.
- Add a progress indicator for uploads and processing.
- Limit accepted file types and sizes in both frontend and backend.
- Containerize the app (Docker) for consistent deployment and to bundle any native rembg dependencies.
- Add tests for the API endpoint and a small UI test for the upload flow.

## License

This repository is provided as-is for demonstration purposes.
