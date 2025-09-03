/**
 * Helper functions for file handling in different environments
 */

/**
 * Get array buffer from File object, handling both browser and Node.js environments
 */
export async function getArrayBufferFromFile(file: File): Promise<ArrayBuffer> {
  // Browser environment - File has arrayBuffer method
  if (typeof file.arrayBuffer === 'function') {
    return await file.arrayBuffer()
  }
  
  // Node.js environment - need to use different approach
  // This handles the case where File is a polyfill or mock
  if ('buffer' in file && file.buffer instanceof ArrayBuffer) {
    return file.buffer
  }
  
  // If file has stream method (browser File API)
  if (typeof file.stream === 'function') {
    const stream = file.stream()
    const reader = stream.getReader()
    const chunks: Uint8Array[] = []
    
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
      }
    } finally {
      reader.releaseLock()
    }
    
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
    const result = new Uint8Array(totalLength)
    let offset = 0
    
    for (const chunk of chunks) {
      result.set(chunk, offset)
      offset += chunk.length
    }
    
    return result.buffer
  }
  
  // Fallback: try to get data from the file object itself
  if (file instanceof Uint8Array) {
    return file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength)
  }
  
  // Last resort: throw error
  throw new Error('Unable to extract ArrayBuffer from File object in this environment')
}