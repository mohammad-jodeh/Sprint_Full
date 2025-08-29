// Gemini AI API integration for AI Chat Assistant
// This file handles communication with Google's Gemini API

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

export const sendToGemini = async (message, projectContext) => {
  // For now, return a mock response if no API key is configured
  if (!GEMINI_API_KEY) {
    console.warn("Gemini API key not configured. Using mock responses.");
    return simulateGeminiResponse(message, projectContext);
  }
  try {
    const systemPrompt = createSystemPrompt(projectContext);

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser Request: ${message}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const aiMessage = data.candidates[0]?.content?.parts[0]?.text;

    // Try to parse JSON response, fall back to text if not JSON
    try {
      return JSON.parse(aiMessage);
    } catch {
      return {
        message: aiMessage,
        suggestedIssues: [],
      };
    }
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    throw error;
  }
};

const createSystemPrompt = (projectContext) => {
  return `You are a project management assistant for the project "${
    projectContext.title
  }". 

Project Description: ${projectContext.description}

Available Epics:
${projectContext.epics
  .map((epic) => `- ${epic.name}: ${epic.description}`)
  .join("\n")}

When users ask for help creating issues or tasks, analyze their request and suggest specific, actionable issues. 
Format your response as JSON with the following structure:
{
  "message": "Your explanation or response to the user",
  "suggestedIssues": [
    {
      "title": "Issue title",
      "description": "Detailed description",
      "storyPoints": 3,
      "epic": "Epic name (must match one from available epics or be null)"
    }
  ]
}

If the user is just asking questions or chatting, only provide the "message" field without "suggestedIssues".

Guidelines for creating issues:
- Keep titles concise but descriptive
- Write detailed descriptions that include acceptance criteria
- Assign appropriate story points (1-21 scale)
- Match epics to existing ones or leave as null
- Break down large features into smaller, manageable tasks
- Consider technical requirements and dependencies`;
};

// Mock response function for when Gemini API is not available
const simulateGeminiResponse = async (message, projectContext) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const isCreatingIssues =
    message.toLowerCase().includes("create") ||
    message.toLowerCase().includes("add") ||
    message.toLowerCase().includes("issue") ||
    message.toLowerCase().includes("task") ||
    message.toLowerCase().includes("feature") ||
    message.toLowerCase().includes("bug");
  if (isCreatingIssues) {
    // Analyze the message to create relevant suggestions
    const suggestions = generateSmartSuggestions(message, projectContext);

    const messageText =
      suggestions.length > 10
        ? `I've created a comprehensive project plan with ${suggestions.length} issues for your plant website project! This includes tasks distributed across your 6-person team: frontend developers, backend developers, and documentation writers. Each issue is designed with appropriate story points and epic assignments.`
        : "I've analyzed your request and created some suggested issues for your project. Please review and modify them as needed before adding to your backlog.";

    return {
      message: messageText,
      suggestedIssues: suggestions,
    };
  } else {
    return {
      message:
        "I'm here to help you manage your project and create issues. You can ask me to create specific features, fix bugs, or generate tasks for your project. Try asking me something like 'Create issues for user authentication' or 'Add tasks for mobile app development'. What would you like me to help you with?",
    };
  }
};

const generateSmartSuggestions = (message, projectContext) => {
  const suggestions = [];
  const msg = message.toLowerCase();

  // Check for comprehensive project planning requests
  const isComprehensiveRequest =
    msg.includes("20 issue") ||
    msg.includes("20issue") ||
    msg.includes("team") ||
    msg.includes("website") ||
    msg.includes("blog") ||
    msg.includes("plant");

  if (isComprehensiveRequest) {
    return generateComprehensiveProjectIssues(message, projectContext);
  }
  // Authentication-related
  if (msg.includes("auth") || msg.includes("login") || msg.includes("user")) {
    suggestions.push({
      title: "Implement user authentication system",
      description:
        "Create a secure authentication system with login, logout, and session management. Include password hashing, JWT tokens, and proper error handling.",
      storyPoints: 8,
      epic: projectContext.epics[0]?.name || null,
      status: "In Development", // This should map to st-3
    });
    suggestions.push({
      title: "Add password reset functionality",
      description:
        "Implement password reset feature with email verification. Include forgot password form, email templates, and secure token generation.",
      storyPoints: 5,
      epic: projectContext.epics[0]?.name || null,
      status: "Ready", // This should map to st-2
    });
  }
  // Dashboard/UI related
  if (
    msg.includes("dashboard") ||
    msg.includes("ui") ||
    msg.includes("interface")
  ) {
    suggestions.push({
      title: "Design responsive dashboard layout",
      description:
        "Create a modern, responsive dashboard with navigation, sidebar, and main content area. Ensure mobile-friendly design and dark mode support.",
      storyPoints: 8,
      epic: projectContext.epics[1]?.name || null,
      status: "Open", // This should map to st-1
    });
    suggestions.push({
      title: "Add data visualization components",
      description:
        "Implement charts and graphs for displaying project metrics. Include pie charts, bar charts, and progress indicators using a charting library.",
      storyPoints: 5,
      epic: projectContext.epics[1]?.name || null,
      status: "Testing", // This should map to st-5
    });
  }
  // API/Backend related
  if (
    msg.includes("api") ||
    msg.includes("backend") ||
    msg.includes("database")
  ) {
    suggestions.push({
      title: "Set up REST API endpoints",
      description:
        "Create RESTful API endpoints for CRUD operations. Include proper error handling, validation, and documentation.",
      storyPoints: 13,
      epic: projectContext.epics[0]?.name || null,
      status: "Code Review", // This should map to st-4
    });
    suggestions.push({
      title: "Implement database schema",
      description:
        "Design and implement database schema with proper relationships, indexes, and constraints. Include migration scripts.",
      storyPoints: 8,
      epic: projectContext.epics[0]?.name || null,
      status: "Completed", // This should map to st-6
    });
  }
  // Testing related
  if (msg.includes("test") || msg.includes("quality")) {
    suggestions.push({
      title: "Add unit tests for core functionality",
      description:
        "Write comprehensive unit tests for business logic components. Achieve at least 80% code coverage.",
      storyPoints: 5,
      epic: null,
      status: "Open", // This should map to st-1
    });
    suggestions.push({
      title: "Set up integration testing",
      description:
        "Implement integration tests for API endpoints and database operations. Include test data setup and teardown.",
      storyPoints: 8,
      epic: null,
      status: "Ready", // This should map to st-2
    });
  }
  // Mobile related
  if (msg.includes("mobile") || msg.includes("app")) {
    suggestions.push({
      title: "Create mobile-responsive design",
      description:
        "Optimize the application for mobile devices with responsive breakpoints, touch-friendly interface, and mobile navigation patterns.",
      storyPoints: 8,
      epic: projectContext.epics[1]?.name || null,
      status: "In Development", // This should map to st-3
    });
    suggestions.push({
      title: "Implement mobile app notifications",
      description:
        "Add push notifications for mobile users. Include notification preferences, delivery scheduling, and read status tracking.",
      storyPoints: 13,
      epic: projectContext.epics[1]?.name || null,
      status: "Testing", // This should map to st-5
    });
  }

  // Bug/Performance related
  if (
    msg.includes("bug") ||
    msg.includes("fix") ||
    msg.includes("performance")
  ) {
    suggestions.push({
      title: "Fix performance bottlenecks",
      description:
        "Identify and resolve performance issues in the application. Optimize database queries, reduce bundle size, and improve loading times.",
      storyPoints: 8,
      epic: null,
    });
    suggestions.push({
      title: "Resolve UI/UX issues",
      description:
        "Fix reported user interface issues and improve user experience. Address accessibility concerns and browser compatibility.",
      storyPoints: 5,
      epic: projectContext.epics[1]?.name || null,
    });
  }

  // Default suggestions if no specific patterns match
  if (suggestions.length === 0) {
    suggestions.push({
      title: "Implement core feature functionality",
      description:
        "Develop the main functionality as requested. Include proper error handling, validation, and user feedback mechanisms.",
      storyPoints: 8,
      epic: projectContext.epics[0]?.name || null,
    });
    suggestions.push({
      title: "Add supporting infrastructure",
      description:
        "Set up necessary infrastructure and supporting components for the requested feature. Include logging, monitoring, and configuration.",
      storyPoints: 5,
      epic: projectContext.epics[0]?.name || null,
    });
  }

  return suggestions.slice(0, 3); // Return max 3 suggestions
};

// New function to generate comprehensive project issues
const generateComprehensiveProjectIssues = (message, projectContext) => {
  const msg = message.toLowerCase();

  // Plant/Blog Website specific issues
  const plantWebsiteIssues = [
    // Frontend Issues (2 developers)
    {
      title: "Design and implement homepage layout",
      description:
        "Create an attractive homepage with hero section, featured plants, and navigation. Include responsive design for mobile and desktop views.",
      storyPoints: 8,
      epic: "Frontend Development",
    },
    {
      title: "Build plant catalog page with filtering",
      description:
        "Develop a comprehensive plant catalog with search, filtering by type/season/difficulty, and pagination. Include plant cards with images and basic info.",
      storyPoints: 13,
      epic: "Frontend Development",
    },
    {
      title: "Create plant detail pages",
      description:
        "Design detailed plant information pages with care instructions, images gallery, growing tips, and related plants suggestions.",
      storyPoints: 8,
      epic: "Frontend Development",
    },
    {
      title: "Implement blog listing and article pages",
      description:
        "Build blog section with article listings, categories, tags, and individual article pages with rich content display.",
      storyPoints: 8,
      epic: "Frontend Development",
    },
    {
      title: "Add user account and profile functionality",
      description:
        "Create user registration, login, profile editing, and plant wishlist/favorites functionality with proper form validation.",
      storyPoints: 13,
      epic: "Frontend Development",
    },
    {
      title: "Develop responsive navigation and footer",
      description:
        "Implement site-wide navigation with mobile hamburger menu, search functionality, and comprehensive footer with links and contact info.",
      storyPoints: 5,
      epic: "Frontend Development",
    },

    // Backend Issues (2 developers)
    {
      title: "Set up database schema for plants and users",
      description:
        "Design and implement database tables for plants, users, blog posts, categories, and relationships. Include proper indexing and constraints.",
      storyPoints: 8,
      epic: "Backend Development",
    },
    {
      title: "Create REST API for plant data management",
      description:
        "Develop API endpoints for CRUD operations on plants, including search, filtering, and pagination. Implement proper error handling and validation.",
      storyPoints: 13,
      epic: "Backend Development",
    },
    {
      title: "Implement user authentication and authorization",
      description:
        "Build secure user registration, login, password reset, and JWT-based authentication system with role-based access control.",
      storyPoints: 8,
      epic: "Backend Development",
    },
    {
      title: "Develop blog content management API",
      description:
        "Create API endpoints for blog posts, categories, tags, and comments. Include admin functionality for content management.",
      storyPoints: 8,
      epic: "Backend Development",
    },
    {
      title: "Add image upload and storage system",
      description:
        "Implement secure image upload for plant photos and blog images. Include image resizing, optimization, and cloud storage integration.",
      storyPoints: 13,
      epic: "Backend Development",
    },
    {
      title: "Create admin panel API endpoints",
      description:
        "Develop API for admin dashboard to manage plants, users, blog posts, and site statistics. Include data analytics endpoints.",
      storyPoints: 8,
      epic: "Backend Development",
    },

    // Documentation Issues (2 technical writers)
    {
      title: "Write comprehensive API documentation",
      description:
        "Create detailed API documentation with OpenAPI/Swagger specification, including examples, error codes, and authentication details.",
      storyPoints: 5,
      epic: "Documentation",
    },
    {
      title: "Develop user guide and plant care content",
      description:
        "Write user-friendly guides for website features, plant care basics, and create seed content for the blog section.",
      storyPoints: 8,
      epic: "Documentation",
    },
    {
      title: "Create developer setup and deployment guide",
      description:
        "Document development environment setup, coding standards, Git workflow, and production deployment procedures.",
      storyPoints: 5,
      epic: "Documentation",
    },
    {
      title: "Write plant database content and descriptions",
      description:
        "Research and write detailed plant descriptions, care instructions, and growing tips for the initial plant database.",
      storyPoints: 13,
      epic: "Documentation",
    },

    // General/Cross-team Issues
    {
      title: "Set up development environment and CI/CD",
      description:
        "Configure development environment, version control, automated testing, and deployment pipeline for the team.",
      storyPoints: 8,
      epic: "Infrastructure",
    },
    {
      title: "Implement search functionality across site",
      description:
        "Add comprehensive search for plants and blog posts with autocomplete, suggestions, and advanced filtering options.",
      storyPoints: 13,
      epic: "Features",
    },
    {
      title: "Add email notification system",
      description:
        "Implement email notifications for new blog posts, plant care reminders, and user account activities using email service integration.",
      storyPoints: 8,
      epic: "Features",
    },
    {
      title: "Implement analytics and tracking",
      description:
        "Add Google Analytics, user behavior tracking, and admin dashboard with site statistics and popular content metrics.",
      storyPoints: 5,
      epic: "Analytics",
    },
    {
      title: "Create comprehensive testing suite",
      description:
        "Develop unit tests, integration tests, and end-to-end tests for both frontend and backend components with good coverage.",
      storyPoints: 13,
      epic: "Testing",
    },
  ];

  // Add realistic status assignments to provide variety in testing
  const statusOptions = [
    "Open",
    "Ready",
    "In Development",
    "Code Review",
    "Testing",
    "Completed",
  ];

  // Assign statuses to issues for testing purposes
  plantWebsiteIssues.forEach((issue, index) => {
    // Assign different statuses based on epic and type for realistic testing
    if (issue.epic === "Frontend Development") {
      const frontendStatuses = ["Ready", "In Development", "Code Review"];
      issue.status = frontendStatuses[index % frontendStatuses.length];
    } else if (issue.epic === "Backend Development") {
      const backendStatuses = ["Open", "In Development", "Testing"];
      issue.status = backendStatuses[index % backendStatuses.length];
    } else if (issue.epic === "Documentation") {
      const docStatuses = ["Open", "Ready", "Completed"];
      issue.status = docStatuses[index % docStatuses.length];
    } else {
      // General issues
      issue.status = statusOptions[index % statusOptions.length];
    }
  });

  return plantWebsiteIssues.slice(0, 20); // Return exactly 20 issues as requested
};

export default { sendToGemini };
