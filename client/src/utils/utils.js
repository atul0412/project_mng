export default function formatStatus(status) {
  switch (status) {
    case "NOT_STARTED":
      return "Not Started";
    case "IN_PROGRESS":
      return "In Progress";
    case "COMPLETED":
      return "Completed";
    default:
      throw new Error(`Unknown status: ${status}`);
  }
}
