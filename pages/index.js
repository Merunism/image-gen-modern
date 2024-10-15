import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setImageUrl('');

        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate image');
            }

            if (data.apiResponse.data && data.apiResponse.data.length > 0) {
                setImageUrl(data.apiResponse.data[0].url);
            } else {
                setError('No image generated. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Failed to generate image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Head>
                <title>AI Image Generator</title>
                <link rel="icon" href="/favicon.ico" />
                <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
            </Head>

            <main className="container mx-auto px-4 py-12">
                <h1 className="text-5xl font-bold mb-12 text-center font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    AI Image Generator
                </h1>
                <form onSubmit={handleSubmit} className="mb-12 max-w-2xl mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Enter your prompt"
                            className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            required
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-md transition-all duration-300 ease-in-out hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                </form>
                {error && <p className="text-red-500 mb-8 text-center">{error}</p>}
                {imageUrl && (
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold mb-6 font-orbitron">Generated Image:</h2>
                        <img src={imageUrl} alt="Generated image" className="max-w-full h-auto mx-auto rounded-lg shadow-lg" />
                    </div>
                )}
            </main>

            <style jsx global>{`
        body {
          background: black;
          font-family: 'Arial', sans-serif;
        }
        .font-orbitron {
          font-family: 'Orbitron', sans-serif;
        }
      `}</style>
        </div>
    );
}