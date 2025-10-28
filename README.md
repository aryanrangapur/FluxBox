
# FluxBox

FluxBox is a cloud-based file storage application built with Next.js, AWS S3, and Clerk. It provides private, isolated file storage for each user, supporting file upload, download, deletion, and folder organization. The application is deployed at:

[https://flux-box.vercel.app/](https://flux-box.vercel.app/)

## Features

* Authentication handled by Clerk
* Upload, download, and delete files
* Create and manage folders
* Each user has a separate storage namespace
* Direct uploads to S3 via presigned URLs
* Responsive and minimal UI built with Tailwind and Shadcn UI

## Tech Stack

* Next.js (App Router)
* TypeScript
* Clerk Authentication
* AWS S3
* Tailwind CSS and Shadcn UI

## Setup

Clone the repository:

```bash
git clone https://github.com/your-username/fluxbox.git
cd fluxbox
```

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```env
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

Configure your S3 bucket CORS:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["http://localhost:3000", "https://flux-box.vercel.app"],
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

Run the development server:

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Storage Structure

Files are stored in S3 under user-specific prefixes:

```
{userID}/
  file.ext
  folder/
    nested.ext
```

## API Overview

All routes require authentication.

| Endpoint               | Method | Description                  |
| ---------------------- | ------ | ---------------------------- |
| `/api/objects?prefix=` | GET    | List files and folders       |
| `/api/upload`          | GET    | Request presigned upload URL |
| `/api/download?key=`   | GET    | Download file                |
| `/api/delete?key=`     | DELETE | Delete file                  |
| `/api/folder`          | POST   | Create folder                |

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

## Troubleshooting

* CORS errors: verify bucket CORS rules and allowed origins
* Missing files: check AWS credentials and region settings
* Authentication issues: confirm Clerk keys and domain configuration









