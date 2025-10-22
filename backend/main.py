from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
from PIL import Image
import io
import base64

app = FastAPI()

# Enable CORS for frontend-backend communication (adjust origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "http://localhost:5174"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/remove-bg")
async def remove_background(file: UploadFile = File(...)):

    image_data = await file.read()
    input_image = Image.open(io.BytesIO(image_data))
    
    output_image = remove(input_image)
    
    output_buffer = io.BytesIO()
    output_image.save(output_buffer, format="PNG")
    output_base64 = base64.b64encode(output_buffer.getvalue()).decode("utf-8")
    
    return {"image": f"data:image/png;base64,{output_base64}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)