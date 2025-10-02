import { NextRequest, NextResponse } from "next/server";

interface BatchJobStatus {
  job_id: string;
  status: string;
  total_items: number;
  completed_items: number;
  failed_items: number;
  progress_percentage: number;
  zip_file_ready: boolean;
  zip_file_size?: number;
  errors?: string[];
}

// Get the API server URL from environment variables
const API_SERVER_URL = process.env.API_SERVER_URL || "http://localhost:8000";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json(
        { error: { code: "INVALID_PARAMETER", message: "Job ID is required" } },
        { status: 400 }
      );
    }

    // Call the Python API to get job status
    const response = await fetch(`${API_SERVER_URL}/status/batch/${jobId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: { code: "JOB_NOT_FOUND", message: "Job not found" } },
          { status: 404 }
        );
      }

      const errorData = await response.json();
      return NextResponse.json(
        {
          error: {
            code: "API_ERROR",
            message: errorData.error?.message || "Failed to fetch job status",
          },
        },
        { status: response.status }
      );
    }

    const data: BatchJobStatus = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching job status:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
