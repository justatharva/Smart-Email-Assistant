import { useState } from 'react';
import './App.css';
import {
  Container,
  TextField,
  Typography,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  Button
} from '@mui/material';
import axios from 'axios';

function App() {

  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const response = await axios.post(`${apiUrl}/api/email/generate`, {
        emailContent,
        tone
      });

      setGeneratedReply(
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data)
      );

    } catch (error) {
      setError('Failed to generate email reply. Please try again');
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={darkMode ? 'app dark-mode' : 'app'}>

      {/* Theme Toggle */}
      <Box className="theme-toggle-container">
        <Button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </Button>
      </Box>

      <Container maxWidth="md" className="email-app-container">

        {/* Header */}
        <Box className="email-header">

          <Typography variant="h3" component="h1">
            AI Email Reply Generator
          </Typography>

          <Typography>
            Generate professional email replies using AI
          </Typography>

        </Box>

        {/* Main Card */}
        <Box className="email-card">

          {/* Email Content */}
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            label="Original Email Content"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Tone */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tone (Optional)</InputLabel>

            <Select
              value={tone}
              label="Tone (Optional)"
              onChange={(e) => setTone(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="professional">
                Professional
              </MenuItem>
              <MenuItem value="casual">
                Casual
              </MenuItem>
              <MenuItem value="friendly">
                Friendly
              </MenuItem>
            </Select>
          </FormControl>

          {/* Generate Button */}
          <Button
            className="generate-button"
            variant="contained"
            onClick={handleSubmit}
            disabled={!emailContent || loading}
            fullWidth
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              "Generate Reply"
            )}
          </Button>

        </Box>

        {/* Error */}
        {error && (
          <Typography className="error-message">
            {error}
          </Typography>
        )}

        {/* Generated Reply */}
        {generatedReply && (
          <Box className="generated-section">

            <Typography className="generated-title">
              ✦ Generated Reply
              <span className="ai-badge">
                AI Generated
              </span>
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              value={generatedReply}
              inputProps={{ readOnly: true }}
            />

            <Button
              className="copy-button"
              variant="outlined"
              onClick={() =>
                navigator.clipboard.writeText(generatedReply)
              }
            >
              Copy to Clipboard
            </Button>

          </Box>
        )}

      </Container>

    </Box>
  );
}

export default App;