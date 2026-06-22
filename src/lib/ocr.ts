import { createWorker } from "tesseract.js"

export async function recognizeText(image: File | Blob): Promise<string> {
  const worker = await createWorker("eng")
  const result = await worker.recognize(image)
  await worker.terminate()
  return result.data.text.trim()
}
