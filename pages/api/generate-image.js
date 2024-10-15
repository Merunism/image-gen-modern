import axios from 'axios';

const apiKey = process.env.TOGETHER_API_KEY;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { prompt } = req.body;

        try {
            const response = await axios.post(
                'https://api.together.xyz/v1/images/generations',
                {
                    model: 'black-forest-labs/FLUX.1-schnell-Free',
                    prompt: prompt,
                    n: 1,
                    size: "512x512"
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                }
            );

            console.log('Full API Response:', JSON.stringify(response.data, null, 2));

            res.status(200).json({ apiResponse: response.data });
        } catch (error) {
            console.error('Error generating image:', error.response?.data || error.message);
            res.status(500).json({ error: 'Error generating image', details: error.response?.data || error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
