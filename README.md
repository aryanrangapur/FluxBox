# FluxBox

A secure cloud storage web application built with Next.js, AWS S3, and Clerk authentication. FluxBox provides users with their own isolated file management system, allowing them to upload, download, organize, and manage files and folders in the cloud.

## Features

- **User Authentication**: Secure login and session management via Clerk
- **File Management**: Upload, download, and delete files
- **Folder Management**: Create folders and organize files hierarchically
- **User Isolation**: Each user has their own private storage space
- **Modern UI**: Clean, responsive interface built with Tailwind CSS and Shadcn UI
- **Real-time Updates**: File list refreshes automatically after operations

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: Clerk
- **Storage**: AWS S3
- **UI**: React, Tailwind CSS, Shadcn UI, Lucide Icons
- **Language**: TypeScript

## Prerequisites

- Node.js 18+ and npm
- AWS Account with S3 bucket
- Clerk Account for authentication
- TypeScript

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/fluxbox.git
cd fluxbox
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 4. AWS S3 Setup

1. Create an S3 bucket in AWS (e.g., `fluxbox`)
2. Configure CORS on your bucket with the following policy:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://your-production-domain.com"
    ],
    "ExposeHeaders": [
      "ETag",
      "x-amz-request-id",
      "x-amz-id-2",
      "Content-Length",
      "Content-Type"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

3. Set bucket region in API routes (currently set to `ap-south-2`)

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### File Storage Structure

Files are organized in S3 using the following structure:

```
user_123/
  ├── file1.pdf
  ├── file2.jpg
  └── folder1/
      └── file3.docx
```

Each user's files are prefixed with their unique Clerk user ID, ensuring complete data isolation between users.

### Authentication Flow

1. User visits the application
2. Clerk middleware checks authentication status
3. Unauthenticated users are redirected to the Clerk sign-in page
4. After authentication, users gain access to their personal storage

### File Operations

**Upload**:
- User clicks "Upload File" button
- System requests presigned URL from backend
- Client uploads file directly to S3 using PUT request
- File list automatically refreshes

**Download**:
- User clicks download icon on a file
- Backend retrieves file from S3
- File is streamed to the client with appropriate headers

**Delete**:
- User clicks delete icon
- Confirmation dialog appears
- File is removed from S3
- File list refreshes

**Create Folder**:
- User enters folder name
- Empty object is created in S3 with folder path
- Folder appears in the file browser
- Users can upload files directly into folders

## Project Structure

```
fluxbox/
├── app/
│   ├── api/
│   │   ├── objects/route.ts      # List files and folders
│   │   ├── upload/route.ts       # Get presigned URL for uploads
│   │   ├── download/route.ts    # Download files from S3
│   │   ├── delete/route.ts      # Delete files from S3
│   │   └── folder/route.ts      # Create new folders
│   ├── layout.tsx                # Root layout with Clerk provider
│   └── page.tsx                  # Main application page
├── components/
│   └── ui/
│       ├── file-browser.tsx      # File and folder browser component
│       ├── nav.tsx               # Navigation bar
│       └── button.tsx             # Reusable button component
├── lib/
│   └── utils.ts                  # Utility functions
├── middleware.ts                  # Clerk authentication middleware
└── public/                       # Static assets
```

## API Endpoints

All endpoints require authentication via Clerk.

**GET /api/objects?prefix={path}**
- Lists files and folders for the current user
- Optionally filters by folder prefix
- Returns: `{ files: FileItem[], folders: string[] }`

**GET /api/upload?key={key}&contentType={type}**
- Generates presigned URL for file upload
- Returns: `{ url: string }`

**GET /api/download?key={key}**
- Downloads file from S3
- Returns: File stream with appropriate headers

**DELETE /api/delete?key={key}**
- Deletes file from S3
- Returns: `{ success: boolean }`

**POST /api/folder**
- Creates a new folder
- Body: `{ folderPath: string, parentPath?: string }`
- Returns: `{ success: boolean, path: string }`

## Security Features

- **User Isolation**: All file operations are scoped to authenticated user ID
- **Direct S3 Upload**: Files upload directly to S3 using presigned URLs
- **Authentication Required**: All API routes require valid Clerk session
- **Path Sanitization**: Folder names are sanitized to prevent directory traversal
- **Error Handling**: Comprehensive error handling and validation

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to add the production URL to your:
- Clerk dashboard (allowed origins)
- AWS S3 CORS configuration

## Troubleshooting

**Upload fails with CORS error**
- Verify CORS configuration on your S3 bucket includes your domain
- Check that allowed methods include PUT

**Files not appearing after upload**
- Verify user authentication status
- Check AWS credentials in environment variables
- Review browser console for errors

**Authentication issues**
- Verify Clerk keys in environment variables
- Check Clerk dashboard for correct configuration
- Ensure middleware is properly set up

