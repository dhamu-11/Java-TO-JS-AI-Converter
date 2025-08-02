import React, { useState } from "react";
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
  Grid,
} from "@mui/material";

// Create a custom Material-UI theme for a dark mode aesthetic
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#38bdf8",
    },
    background: {
      default: "#111827",
      paper: "#1f2937",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
});

const App = () => {
  const [javaCode, setJavaCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [conversionTime, setConversionTime] = useState(null);

  const sampleJavaCode = `
public class LinearSearchExample {
    public static void main(String[] args) {
        int[] numbers = {12, 45, 67, 23, 89};
        int target = 23;
        boolean found = false;

        for (int i = 0; i < numbers.length; i++) {
            if (numbers[i] == target) {
                System.out.println("Element found at index: " + i);
                found = true;
                break;
            }
        }

        if (!found) {
            System.out.println("Element not found in the array.");
        }
    }
}


`;

  const convertCode = async () => {
    if (!javaCode.trim()) {
      setError("Please enter some Java code to convert.");
      return;
    }

    setIsLoading(true);
    setJsCode("");
    setError("");
    setConversionTime(null);

    const startTime = performance.now();

    try {
      const prompt = `Act as an expert Java to JavaScript code converter. Convert the following Java code into idiomatic and modern JavaScript code. Do not include any comments or descriptions in the output, only the code itself.

            Java code:
            ${javaCode}`;

      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = { contents: chatHistory };
      const apiKey = "AIzaSyCRO4Xab9M4l531JDVwPMcimRKE4LyUFlI";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        const text = result.candidates[0].content.parts[0].text;
        const convertedCode = text.replace(/```javascript|```/g, "").trim();
        const cleanedCode = convertedCode
          .split("\n")
          .filter(
            (line) =>
              !line.trim().startsWith("//") &&
              !line.trim().startsWith("/*") &&
              !line.trim().startsWith("*")
          )
          .join("\n")
          .trim();
        setJsCode(cleanedCode);
      } else {
        setError("Conversion failed. Please try again with valid Java code.");
      }
    } catch (error) {
      console.error("Error converting code:", error);
      setError(
        "An error occurred. Please check your network connection and try again."
      );
    } finally {
      setIsLoading(false);
      const endTime = performance.now();
      const seconds = ((endTime - startTime) / 1000).toFixed(2);
      setConversionTime(seconds);
    }
  };

  const handleClear = () => {
    setJavaCode("");
    setJsCode("");
    setConversionTime(null);
    setError("");
  };

  const handleLoadExample = () => {
    setJavaCode(sampleJavaCode);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "background.default",
          py: 4,
        }}
      >
        <Box
          sx={{
            width: "100%",
            backgroundColor: "background.paper",
            borderRadius: 4,
            boxShadow: 24,
            p: { xs: 3, md: 6 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Title Row */}
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%", mb: 2 }}
          >
            <Grid item>
              <Button
                variant="outlined"
                size="small"
                onClick={handleLoadExample}
                sx={{ fontWeight: "bold" }}
              >
                Load Example
              </Button>
            </Grid>
            <Grid item>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  backgroundImage:
                    "linear-gradient(to right, #38bdf8, #0ea5e9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Java to JavaScript AI Bot
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={handleClear}
                sx={{ fontWeight: "bold" }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
              {error}
            </Alert>
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              width: "100%",
            }}
          >
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
              sx={{ "& .MuiInputBase-input": { fontFamily: "monospace" } }}
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
              sx={{ "& .MuiInputBase-input": { fontFamily: "monospace" } }}
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
              borderRadius: "50px",
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "1.125rem",
              backgroundImage: "linear-gradient(to right, #0ea5e9, #0284c7)",
              "&:hover": {
                backgroundImage: "linear-gradient(to right, #0284c7, #0369a1)",
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Convert Code"
            )}
          </Button>

          {conversionTime && (
            <Typography variant="subtitle2" sx={{ mt: 2, color: "#38bdf8" }}>
              Converted in {conversionTime} seconds
            </Typography>
          )}

          <Typography
            variant="body2"
            gutterBottom
            sx={{
              mt: 5,
              textAlign: "right",
              whiteSpace: "pre-line",
              backgroundImage: "linear-gradient(to right, #38bdf8, #0ea5e9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              ml: "auto",
              width: "fit-content",
            }}
          >
            Developed by{"\n"}Dr.V.Megala
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
