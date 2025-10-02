import { NextRequest, NextResponse } from "next/server";

interface BulkCreateRequest {
  urls: string[];
  zip_filename?: string;
}

interface BatchQRRequest {
  items: Array<{
    content: string;
    qr_type: string;
    filename?: string;
    type_data?: Record<string, unknown>;
  }>;
  size: number;
  color: string;
  bgcolor: string;
  format: string;
  error_correction: string;
  logo?: string;
  margin: number;
  zip_filename?: string;
  index_prefix?: boolean;
}

interface BatchJobResponse {
  job_id: string;
  status: string;
  total_items: number;
  estimated_completion_time?: string;
}

// Get the API server URL from environment variables
const API_SERVER_URL = process.env.API_SERVER_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body: BulkCreateRequest = await request.json();
    const { urls, zip_filename } = body;

    // Validate input
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_PARAMETER",
            message: "URLs array is required and cannot be empty",
          },
        },
        { status: 400 }
      );
    }

    if (urls.length > 100) {
      return NextResponse.json(
        {
          error: {
            code: "BATCH_SIZE_EXCEEDED",
            message: "Maximum 100 URLs allowed per batch",
          },
        },
        { status: 400 }
      );
    }

    // Validate URLs
    const urlRegex = /^https?:\/\/.+/i;
    const invalidUrls = urls.filter((url) => !urlRegex.test(url));

    if (invalidUrls.length > 0) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_PARAMETER",
            message: `Invalid URLs detected: ${invalidUrls.join(", ")}`,
          },
        },
        { status: 400 }
      );
    }

    // Prepare batch request for the Python API
    const batchRequest: BatchQRRequest = {
      items: urls.map((url, index) => ({
        content: url,
        qr_type: "url",
        filename: `url_${index + 1}`,
        type_data: {},
      })),
      size: 256,
      color: "000000",
      bgcolor: "FFFFFF",
      format: "png",
      error_correction: "M",
      margin: 4,
      zip_filename: zip_filename || `bulk_qrcodes_${Date.now()}`,
      index_prefix: true,
    };

    // Call the Python batch API
    const response = await fetch(`${API_SERVER_URL}/generate/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batchRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          error: {
            code: "API_ERROR",
            message:
              errorData.error?.message || "Failed to start batch processing",
          },
        },
        { status: response.status }
      );
    }

    const data: BatchJobResponse = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in bulk-create API:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
