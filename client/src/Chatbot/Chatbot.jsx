import React, { useState } from 'react';
import './Chatbot.css';
import Navbar from '../Navbar/Navbar.js';

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your Gemini API key as an environment variable
const genAI = new GoogleGenerativeAI('AIzaSyAdPIoqQ8hC6TmeMMPL9LLxhH8P2HtTEqE');

console.log(process.env.GEMINI_API_KEY)
const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');
  const [userMessages, setUserMessages] = useState([]);

  const handleRequest = async () => {
    if (!userInput.trim()) return; // If input is empty or contains only whitespace, return
    setUserMessages([...userMessages, userInput]); // Add user input to userMessages state

    try {
      // Get the generative model from Google Generative AI
      const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Replace with appropriate chatbot model
      const prompt = userInput; // Use user input as prompt for generating content

      // Generate content based on user prompt
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      // Set the generated text as the response
      setResponse(text);
    } catch (error) {
      console.error('Error generating content:', error);
      setResponse('Error generating content');
    }

    setUserInput(''); // Clear input field after submitting request
  }

  return (
    <div className='chatbot-bg'>
      <div className='chat-nav'>
        <Navbar />
      </div>
      <div className='chat-content'>
        <div className='conversation'>
          {response && <div className='ai-response'>{response}</div>}
          {userMessages.map((message, index) => (
            <div key={`user-${index}`} className='user-message'>{message}</div>
          ))}
          
        </div>
        <div className='user-request-field'>
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => {if (e.key === 'Enter') handleRequest()}}
            placeholder='Type your message...'
            className='user-input-chatbot'
          />
          <button onClick={handleRequest}>Send</button>
        </div>
      </div>
    </div>
  )
}

export default Chatbot;
