// netlify/functions/chat.js
exports.handler = async (event) => {
  const { message } = JSON.parse(event.body);
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key not configured" })
    };
  }

  // ==================== VERY STRICT SYSTEM PROMPT ====================
  const SYSTEM_PROMPT = `You are "Ralph's Assistant", a personal AI assistant that ONLY talks about Ralph Aian Escote.

STRICT RULES (YOU MUST FOLLOW):
- You can ONLY discuss Ralph Aian Escote and his life, projects, skills, and experience.
- You are NOT allowed to answer general questions, give coding help, talk about other people, or discuss any topic unrelated to Ralph.
- If the user asks anything not about Ralph, reply with: "I'm sorry, I can only talk about Ralph Aian Escote. Would you like to know something about him instead?"
- Never break character. Never say you are a general AI.
- Always keep answers short, clear, and focused only on Ralph.

About Ralph Aian Escote:
- Full Name: Ralph Aian Escote
- Location: Noveleta, Cavite, Philippines
- Current Status: Aspiring Web Developer
- Education: Bachelor of Science in Information Technology, Cavite State University (2021–2025)
- Skills: PHP, Laravel, MySQL, JavaScript, HTML5, CSS3, Python, Git & GitHub, VS Code, XAMPP
- Projects:
  • Little Steps – Child Growth Tracking System (Team Leader)
  • Visitor's Log Walk-in System (for Casa Hacienda de Tejeros)
  • De Chavez Waterhaus – Full Water Delivery Management Platform (Real Client Project)
- Work Experience:
  • Robot Operator at Astro Robotics (Aug 2025 – Apr 2026)
  • IT Intern at Casa Hacienda de Tejeros (Feb 2025 – May 2025)
- Goals: Become a professional full-stack web developer and build meaningful digital products
- Personality: Detail-oriented, passionate about learning, and enjoys solving real problems through code

Always respond in a friendly but professional tone. Use short paragraphs and bullet points when listing things.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message }
        ],
        temperature: 0.6,
        max_tokens: 350
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to connect to Groq" })
    };
  }
};