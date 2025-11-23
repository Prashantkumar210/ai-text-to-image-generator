import { useState, useEffect } from 'react'
import axios from 'axios'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const [prompt, setPrompt] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [gallery, setGallery] = useState([])
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setLoading(true)
    setError(null)
    setImage(null)

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      const response = await axios.post(
        `${API_URL}/generate`,
        { prompt: prompt.trim() },
        { headers: { 'Content-Type': 'application/json' }, timeout: 60000 }
      )

      if (response.data?.imageUrl) {
        const newImage = { imageUrl: response.data.imageUrl, prompt: prompt.trim(), timestamp: new Date().toISOString() }
        setImage(response.data.imageUrl)
        setGallery(prev => [newImage, ...prev])
      } else {
        throw new Error('No image URL received from server')
      }
    } catch (err) {
      console.error('Error generating image:', err)
      if (err.code === 'ECONNABORTED') setError('Request timed out. Please try again.')
      else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) setError('Network error. Please check backend URL.')
      else if (err.response) setError(err.response.data?.error || err.response.data?.message || `Server error: ${err.response.status}`)
      else setError(err.message || 'An error occurred while generating the image')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => { if (e.key === 'Enter' && e.ctrlKey) handleGenerate() }
  const handleThumbnailClick = (imageUrl) => { setImage(imageUrl); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const handleDownload = async () => {
    try {
      const response = await fetch(image)
      const blob = await response.blob()
      const img = new Image()
      const objectUrl = URL.createObjectURL(blob)

      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        canvas.toBlob((jpgBlob) => {
          if (jpgBlob) {
            const url = URL.createObjectURL(jpgBlob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'generated-image.jpg'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            URL.revokeObjectURL(objectUrl)
          }
        }, 'image/jpeg', 0.9)
      }

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        setError('Failed to download image')
      }

      img.src = objectUrl
    } catch (err) {
      console.error('Error downloading image:', err)
      setError('Failed to download image')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleDarkMode}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
        </div>

        <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-800 dark:to-indigo-900 p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold text-center">AI Text to Image Generator</h1>
            <p className="text-center text-purple-100 dark:text-purple-200 mt-2 text-sm md:text-base">Transform your words into stunning images</p>
          </div>

          {/* Main Content */}
          <div className="p-6 md:p-8 dark:bg-gray-800">
            {/* Input Section */}
            <div className="mb-6">
              <label htmlFor="prompt" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Enter your prompt</label>
              <textarea
                id="prompt"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 resize-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Describe the image you want to generate... (Press Ctrl+Enter to generate)"
                value={prompt}
                onChange={(e) => { setPrompt(e.target.value); setError(null) }}
                onKeyDown={handleKeyPress}
                rows={4}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Tip: Be descriptive for better results</p>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </span>
              ) : 'Generate Image'}
            </button>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-r-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 dark:text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                  <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && !error && (
              <div className="mt-8 flex flex-col items-center justify-center py-12">
                <LoadingSpinner />
                <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Creating your image...</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">This may take a few moments</p>
              </div>
            )}

            {/* Image Preview */}
            {image && !loading && (
              <div className="mt-8">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-2 border-gray-200 dark:border-gray-600">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Generated Image</h2>
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-inner">
                    <img
                      src={image}
                      alt="Generated"
                      className="w-full h-auto object-contain max-h-[600px] mx-auto"
                      onError={() => { setError('Failed to load the generated image'); setImage(null) }}
                    />
                  </div>
                  <div className="mt-4 flex gap-3">
                    <a href={image} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg text-center transition-colors">Open in New Tab</a>
                    <button onClick={handleDownload} className="flex-1 bg-purple-600 dark:bg-purple-700 hover:bg-purple-700 dark:hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">Download Image</button>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!image && !loading && !error && (
              <div className="mt-8 text-center py-12 text-gray-400 dark:text-gray-500">
                <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p className="text-lg">Your generated image will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        {gallery.length > 0 && (
          <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mt-10">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-800 dark:to-indigo-900 p-6 text-white text-center">
              <h2 className="text-2xl md:text-3xl font-bold">Image Gallery</h2>
              <p className="text-purple-100 dark:text-purple-200 mt-2 text-sm md:text-base">{gallery.length} {gallery.length === 1 ? 'image' : 'images'} generated</p>
            </div>

            <div className="p-6 dark:bg-gray-800">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {gallery.map((item, index) => (
                  <div key={index} className="group relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-lg" onClick={() => handleThumbnailClick(item.imageUrl)}>
                    <img src={item.imageUrl} alt={item.prompt || 'Generated image'} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EFailed to load%3C/text%3E%3C/svg%3E' }} />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center px-2">
                        <p className="text-xs font-medium line-clamp-2">{item.prompt}</p>
                      </div>
                    </div>
                    {image === item.imageUrl && (
                      <div className="absolute top-2 right-2 bg-purple-600 dark:bg-purple-500 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
