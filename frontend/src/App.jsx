import { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState(''); // State to hold user input
  const [messages, setMessages] = useState([]); // State to hold chat messages
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [isSubmitting, setIsSubmitting] = useState(false); // State to manage submission status

  const fetchNews = async (userQuery) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8083/api/v1/news', {
        method: 'POST', // Assuming your backend expects a POST request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q: userQuery }), // Send user query as JSON
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // Handle non-2xx responses
      }

      const data = await response.json();
      const newsMessages = data.result.map((item) => item.title); // Extract titles from the response
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: userQuery, sender: 'user' }, // Add user message
        ...newsMessages.map((text) => ({ text, sender: 'bot' })), // Add bot replies
      ]);
    } catch (error) {
      console.error('Error fetching news:', error); // Log the error
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Error fetching news.', sender: 'bot' }, // Add error message
      ]);
    } finally {
      setLoading(false); // Set loading to false after fetching
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    // Prevent multiple submissions
    if (isSubmitting) return;

    setIsSubmitting(true); // Set submitting state
    fetchNews(query); // Call the fetch function with the user query
    setQuery(''); // Clear the input field
  };

  return (
    
    <div className="chat-container">NEWS BOT
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender}>
            {msg.text}
          </div> // Render chat messages
        ))}
        {loading && <div className="loading">Loading...</div>} {/* Show loading message */}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Update query state
          placeholder="Type your query..."
          required
        />
        <button type="submit" disabled={isSubmitting}>Send</button> {/* Disable button while submitting */}
      </form>
    </div>
  );
}

export default App;



