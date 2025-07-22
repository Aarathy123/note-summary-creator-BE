# Note Summary Creator Backend

A Node.js backend server that processes documents, URLs, and text to generate various types of summaries and visual content using AI services. The application supports multiple output formats including visual notes, flash cards, infographics, key points, and social media posts.

## Features

- **PDF Processing**: Upload and process PDF documents
- **URL Processing**: Extract and summarize content from URLs
- **Text Processing**: Generate summaries from plain text input
- **Multiple Output Types**:
  - Visual Notes
  - Flash Cards
  - Infographics
  - Key Points
  - Smart Summary
  - Social Media Posts
- **File Storage**: Automatic file upload to DigitalOcean Spaces
- **History Tracking**: Store and retrieve processing history
- **AI Integration**: Uses OpenAI and Google Gemini APIs

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **File Upload**: Multer
- **Storage**: DigitalOcean Spaces (S3-compatible)
- **AI Services**: OpenAI API, Google Gemini API
- **Development**: Nodemon, env-cmd

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- DigitalOcean Spaces account
- OpenAI API key
- Google Gemini API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd note-summary-creator-be
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `config` directory with the following variables:
   ```env
   MONGODB_URL=mongodb://127.0.0.1:27017/note-taker
   PORT=3000
   OPENAI_API_KEY=your_openai_api_key
   GEMINI_API_KEY=your_gemini_api_key
   SECRET_KEY=your_secret_key
   ACCESS_KEY_ID=your_digitalocean_access_key
   BUCKET_NAME=your_bucket_name
   DIGITAL_OCEAN_URL=https://nyc3.digitaloceanspaces.com
   DIGITAL_OCEAN_REGION=nyc3
   DIGITAL_OCEAN_TAIL=nyc3.digitaloceanspaces.com
   ```

4. **Start MongoDB**
   ```bash
   # If running locally
   mongod
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 3000 (or the port specified in your environment variables).

## API Endpoints

### PDF Processing
- **POST** `/pdf/process`
  - Upload and process PDF files
  - Supports multiple output types
  - File size limit: 5MB

### URL Processing
- **POST** `/url/process`
  - Extract and summarize content from URLs
  - Supports multiple output types

### Text Processing
- **POST** `/text/process`
  - Generate summaries from plain text
  - Supports multiple output types

### History
- **GET** `/history`
  - Retrieve processing history

## Output Types

The application supports the following output types:

1. **visual-notes**: Generate visual note representations
2. **flash-cards**: Create flash cards for learning
3. **info-graphics**: Generate infographic content
4. **key-points**: Extract key points from content
5. **smart-summary**: Generate intelligent summaries
6. **social-media-post**: Create social media ready content

## File Storage

All processed files are automatically uploaded to DigitalOcean Spaces and accessible via URLs. The system stores:
- Original uploaded files
- Generated images and content
- Processing metadata

## Database Schema

The application uses MongoDB with the following schema:

```javascript
{
  type: String,           // Output type
  inputUrl: String,       // Original file URL
  resultUrl: [String],    // Generated content URLs
  result: String,         // Text-based results
  timestamps: true        // Created/updated timestamps
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URL` | MongoDB connection string | Yes |
| `PORT` | Server port | No (default: 3000) |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `SECRET_KEY` | Application secret key | Yes |
| `ACCESS_KEY_ID` | DigitalOcean Spaces access key | Yes |
| `BUCKET_NAME` | DigitalOcean Spaces bucket name | Yes |
| `DIGITAL_OCEAN_URL` | DigitalOcean Spaces endpoint | Yes |
| `DIGITAL_OCEAN_REGION` | DigitalOcean region | Yes |
| `DIGITAL_OCEAN_TAIL` | DigitalOcean Spaces tail | Yes |

## Project Structure

```
src/
├── ai/              # AI service integrations
├── db/              # Database configuration
├── models/          # MongoDB schemas
├── prompt/          # AI prompt templates
├── routes/          # API route handlers
├── storage/         # File storage utilities
├── app.js           # Express app configuration
└── index.js         # Server entry point

config/
└── dev.env          # Development environment variables

uploads/             # Temporary file storage
```

## Development

### Adding New Output Types

1. Create a new prompt template in `src/prompt/`
2. Add the new type to the Item model enum
3. Implement the processing logic in the route handlers
4. Update the frontend to support the new type

### Adding New AI Services

1. Create a new service file in `src/ai/`
2. Implement the service interface
3. Update the route handlers to use the new service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License

## Support

For support and questions, please open an issue in the repository. 