# Signals and Events

## SIGINT Signal

- Triggered on CTRL+C
- Often used by developers to interrupt the process
- Should handle cleanup operations

## SIGTERM Signal

- Standard termination signal (kill -SIGTERM/-15 <PID>)
- Often sent by process managers (PM2, Docker, etc.)
- Should handle cleanup operations

## SIGQUIT Signal

- Similar to SIGINT but triggered by CTRL+\ (on Unix-like systems)
- Usually used for harder termination requests

## SIGKILL Signal

- Forces immediate process termination (unresponsive applications, not responding to other signals)
- Bypasses any graceful shutdown mechanisms
  Cannot Be Caught or Handled

## exit event

- Emitted when the process is about to exit
- Only synchronous operations work in the callback operation

## beforeExit event

- Emitted when Node.js event loop is empty
- Won't be emitted if process exits explicitly
- Opportunity to add more async operations
