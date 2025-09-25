# Bulk QR Code Generator

This feature allows users to generate multiple QR codes from a list of URLs and download them as a zip file.

## Features

- **URL Input**: Multi-line textarea for entering URLs (one per line)
- **URL Validation**: Automatic validation of URL format
- **Batch Processing**: Asynchronous processing of multiple QR codes
- **Real-time Status**: Live progress updates with polling
- **Download**: Automatic zip file download when processing is complete
- **Error Handling**: Comprehensive error handling with user-friendly messages

## How it Works

1. **User Input**: User enters URLs in the textarea (one per line)
2. **Validation**: URLs are validated for proper format
3. **API Call**: NextJS API calls the Python batch API
4. **Processing**: Python API processes URLs asynchronously
5. **Polling**: Frontend polls for status updates every 2 seconds
6. **Download**: When complete, user can download the zip file

## API Endpoints

### POST /api/bulk-create

Creates a new batch job for QR code generation.

**Request Body:**

```json
{
  "urls": ["https://example.com", "https://google.com"],
  "zip_filename": "my_qrcodes"
}
```

**Response:**

```json
{
  "job_id": "uuid-string",
  "status": "processing",
  "total_items": 2,
  "estimated_completion_time": "2024-01-01T12:00:00"
}
```

### GET /api/bulk-create/status/[jobId]

Gets the current status of a batch job.

**Response:**

```json
{
  "job_id": "uuid-string",
  "status": "completed",
  "total_items": 2,
  "completed_items": 2,
  "failed_items": 0,
  "progress_percentage": 100.0,
  "zip_file_ready": true,
  "zip_file_size": 12345,
  "errors": []
}
```

### GET /api/bulk-create/download/[jobId]

Downloads the generated zip file.

**Response:**

- **200**: Zip file download
- **202**: Job still processing
- **404**: Job not found

## Configuration

Set the following environment variable to configure the Python API server:

```bash
API_SERVER_URL=http://localhost:8000
```

## Usage

1. Navigate to `/free-tools/bulk-create`
2. Enter URLs in the textarea (one per line)
3. Click "Generate QR Codes"
4. Monitor progress in real-time
5. Download the zip file when complete

## Error Handling

The feature includes comprehensive error handling for:

- Invalid URL formats
- API server connectivity issues
- Batch processing failures
- Network timeouts
- File download errors

## Status Values

- **processing**: Job is currently being processed
- **completed**: All QR codes generated successfully
- **completed_with_errors**: Some QR codes failed, but others succeeded
- **failed**: All QR codes failed to generate

## Limitations

- Maximum 100 URLs per batch
- 5-minute polling timeout
- Files are stored temporarily (24-hour cleanup on Python API side)
