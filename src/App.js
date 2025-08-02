import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    createTheme,
    ThemeProvider,
} from '@mui/material';

// Create a custom Material-UI theme for a dark mode aesthetic
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#38bdf8', // Tailwind's sky-400
        },
        background: {
            default: '#111827', // Tailwind's gray-900
            paper: '#1f2937', // Tailwind's gray-800
        },
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
    },
});

const App = () => {
    const [javaCode, setJavaCode] = useState('');
    const [jsCode, setJsCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    /**
     * Converts the Java code to JavaScript using the Gemini API.
     */
    const convertCode = async () => {
        if (!javaCode.trim()) {
            setError('Please enter some Java code to convert.');
            return;
        }

        setIsLoading(true);
        setJsCode('');
        setError('');

        try {
            const prompt = `Act as an expert Java to JavaScript code converter. Convert the following Java code into idiomatic and modern JavaScript code. Do not include any comments or descriptions in the output, only the code itself.
            
            Java code:
            ${javaCode}`;

            const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };
            const apiKey = "AIzaSyCRO4Xab9M4l531JDVwPMcimRKE4LyUFlI" 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                const convertedCode = text.replace(/```javascript|```/g, '').trim();
                const cleanedCode = convertedCode.split('\n')
                    .filter(line => !line.trim().startsWith('//') && !line.trim().startsWith('/*') && !line.trim().startsWith('*'))
                    .join('\n')
                    .trim();
                setJsCode(cleanedCode);
            } else {
                setError('Conversion failed. Please try again with valid Java code.');
            }
        } catch (error) {
            console.error('Error converting code:', error);
            setError('An error occurred. Please check your network connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Container
                maxWidth="lg"
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.default',
                    py: 4, // Padding on the y-axis
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        backgroundColor: 'background.paper',
                        borderRadius: 4,
                        boxShadow: 24,
                        p: { xs: 3, md: 6 }, // Responsive padding
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            mb: 4,
                            textAlign: 'center',
                            backgroundImage: 'linear-gradient(to right, #38bdf8, #0ea5e9)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Java to JavaScript AI Bot
                    </Typography>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ position: 'fixed', top: 20, zIndex: 1000, width: '90%', maxWidth: 'sm' }}
                        >
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%' }}>
                        <TextField
                            id="java-input"
                            label="Java Code"
                            multiline
                            rows={15}
                            fullWidth
                            variant="filled"
                            placeholder="Paste your Java code here..."
                            value={javaCode}
                            onChange={(e) => setJavaCode(e.target.value)}
                            sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace' } }}
                        />
                        <TextField
                            id="js-output"
                            label="JavaScript Code"
                            multiline
                            rows={15}
                            fullWidth
                            variant="filled"
                            placeholder="Converted JavaScript code will appear here..."
                            value={jsCode}
                            InputProps={{ readOnly: true }}
                            sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace' } }}
                        />
                    </Box>

                    <Button
                        variant="contained"
                        onClick={convertCode}
                        disabled={isLoading}
                        sx={{
                            mt: 4,
                            px: 5,
                            py: 2,
                            borderRadius: '50px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: '1.125rem',
                            backgroundImage: 'linear-gradient(to right, #0ea5e9, #0284c7)',
                            '&:hover': {
                                backgroundImage: 'linear-gradient(to right, #0284c7, #0369a1)',
                            },
                        }}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Convert Code'}
                    </Button>


                    <Typography
                        variant="body2" 
                        component="h1"
                        gutterBottom
                        sx={{
                           
                            mb: 4,
                            textAlign: 'right',          
                            whiteSpace: 'pre-line',      
                            backgroundImage: 'linear-gradient(to right, #38bdf8, #0ea5e9)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            ml: 'auto', 
                            width: 'fit-content' 
                        }}
                        >
                        Developed by{'\n'}Dr.V.Megala
                    </Typography>

                </Box>
                   
            </Container>
 
        </ThemeProvider>
    );
};

export default App;
