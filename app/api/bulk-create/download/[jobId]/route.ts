import { NextRequest, NextResponse } from "next/server";

// Get the API server URL from environment variables
const API_SERVER_URL = process.env.API_SERVER_URL || "http://localhost:8000";

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;

    if (!jobId) {
      return NextResponse.json(
        { error: { code: "INVALID_PARAMETER", message: "Job ID is required" } },
        { status: 400 }
      );
    }

    // Call the Python API to get the zip file
    const response = await fetch(`${API_SERVER_URL}/result/batch/${jobId}`, {
      method: "GET",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: { code: "JOB_NOT_FOUND", message: "Job not found" } },
          { status: 404 }
        );
      }

      if (response.status === 202) {
        // Job still processing
        const statusData = await response.json();
        return NextResponse.json(
          {
            error: {
              code: "JOB_PROCESSING",
              message: "Job is still processing",
              status: statusData,
            },
          },
          { status: 202 }
        );
      }

      const errorData = await response.json();
      return NextResponse.json(
        {
          error: {
            code: "API_ERROR",
            message: errorData.error?.message || "Failed to download zip file",
          },
        },
        { status: response.status }
      );
    }

    // Get the zip file as a blob
    const zipBuffer = await response.arrayBuffer();

    // Get the filename from the response headers or use a default
    const contentDisposition = response.headers.get("content-disposition");
    let filename = `qrcodes_${jobId}.zip`;

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Return the zip file
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": zipBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Error downloading zip file:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
