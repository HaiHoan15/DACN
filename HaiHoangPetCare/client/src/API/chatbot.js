export async function sendMessageToAI(message) {
  const res = await fetch("https://haihoanpetcare.online/petcare_api/chat.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  return data.reply;
}
