const API_URL = "http://20.244.56.144/evaluation-service/logs";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzaGFzaHdhdG1pbGFuMTQzQGdtYWlsLmNvbSIsImV4cCI6MTc1MjQ3MTQxMiwiaWF0IjoxNzUyNDcwNTEyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMWE0YzY5MmEtMzA3MS00NDhlLThjOTYtYjgyNzcyYjQ2YjcwIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2hhc2h3YXQgZGVvIiwic3ViIjoiMDMyNTQ3ZTItNzU2Ni00MTc4LTgzYTEtNjZlMTk3NGZhMjU2In0sImVtYWlsIjoic2hhc2h3YXRtaWxhbjE0M0BnbWFpbC5jb20iLCJuYW1lIjoic2hhc2h3YXQgZGVvIiwicm9sbE5vIjoiMTIyMTYxNDUiLCJhY2Nlc3NDb2RlIjoiQ1p5cFFLIiwiY2xpZW50SUQiOiIwMzI1NDdlMi03NTY2LTQxNzgtODNhMS02NmUxOTc0ZmEyNTYiLCJjbGllbnRTZWNyZXQiOiJ5enptWFJrVmpBZnBHcnllIn0.b0I84Vsa307AIfHqZmwu9v8eXUF1ot3upM8RKWY_NX4"; 

export async function logEvent({ stack, level, pkg, message }) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        stack,    
        level,     
        package: pkg, 
        message
      })
    });

    const data = await response.json();
    console.log("✅ Logged:", data);
  } catch (error) {
    console.error("❌ Logging Failed:", error);
  }
}
