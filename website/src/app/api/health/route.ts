import { NextResponse } from 'next/server'

/**
 * Health check endpoint for Docker container monitoring
 * Used by Docker healthcheck to verify container is running
 */
export async function GET() {
  return NextResponse.json(
    { status: 'ok', timestamp: new Date().toISOString() },
    { status: 200 }
  )
}


