import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Middleware to serve static files
app.use(express.static('public'));

// Disable caching
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

// Home route
app.get('/', (req, res) => {
    res.render('index', { data: null, error: null }); // Default values
});

// Route to fetch and render market data
app.get('/market-data', async (req, res) => {
    try {
        const marketSymbol = 'BTC-USD'; // Market symbol
        const response = await axios.get(`https://api.blockchain.com/v3/exchange/tickers/${marketSymbol}`, {
            headers: {
                'X-API-Token': 'your-api-key-here' // Replace with your actual API key
            }
        });

        console.log('API Response:', response.data); // Log the API response

        // Check if the API response has the necessary data
        if (response.data) {
            res.render('index', { data: response.data, error: null });
        } else {
            res.render('index', { error: 'No market data available', data: null });
        }
    } catch (error) {
        console.error(`Error fetching market data: ${error.message}`);
        res.render('index', { error: 'Error fetching market data. Please try again later.', data: null });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
