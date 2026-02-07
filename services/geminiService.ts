
import { GoogleGenAI, Type } from "@google/genai";
import { Curriculum, DurationType, Quiz } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCurriculum = async (
  title: string,
  durationType: DurationType,
  durationValue: number,
  targetAudience: string
): Promise<Curriculum> => {
  const prompt = `Generate a highly structured, industry-aligned, OBE-compliant curriculum for a program titled "${title}".
  Duration: ${durationValue} ${durationType}.
  Target Audience: ${targetAudience}.
  
  The curriculum must be divided into ${durationValue} periods, labeled as "${durationType.slice(0, -1)} 1", "${durationType.slice(0, -1)} 2", etc.
  Each period should contain 1-2 courses. Each course must have 3-5 specific topics.
  
  CRITICAL: 
  1. Assign a difficulty level ('Easy', 'Medium', or 'Hard') to EACH topic based on complexity.
  2. For each topic, provide 2-3 high-quality educational resources. 
  
  Include 3-5 OBE outcomes, 3-5 potential job roles, and 1-2 capstone projects.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", // Switched to Flash for speed
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          periods: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                periodLabel: { type: Type.STRING },
                courses: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      courseName: { type: Type.STRING },
                      courseCode: { type: Type.STRING },
                      description: { type: Type.STRING },
                      topics: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
                            resources: {
                              type: Type.ARRAY,
                              items: {
                                type: Type.OBJECT,
                                properties: {
                                  type: { type: Type.STRING, enum: ["video", "article", "blog", "documentation"] },
                                  title: { type: Type.STRING },
                                  url: { type: Type.STRING }
                                },
                                required: ["type", "title", "url"]
                              }
                            }
                          },
                          required: ["id", "title", "description", "difficulty", "resources"]
                        }
                      }
                    },
                    required: ["courseName", "courseCode", "description", "topics"]
                  }
                }
              },
              required: ["periodLabel", "courses"]
            }
          },
          obe_outcomes: { type: Type.ARRAY, items: { type: Type.STRING } },
          job_roles: { type: Type.ARRAY, items: { type: Type.STRING } },
          capstone_projects: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "description", "periods", "obe_outcomes", "job_roles", "capstone_projects"]
      }
    }
  });

  const data = JSON.parse(response.text || '{}');
  return {
    ...data,
    durationType,
    durationValue
  } as Curriculum;
};

export const generateQuizForTopic = async (topicTitle: string): Promise<Quiz> => {
  const prompt = `Generate a professional 5-question multiple choice quiz for the topic: "${topicTitle}".
  Each question must have exactly 4 options.
  Include the correct answer index (0-3) and a brief explanation.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", // Switched to Flash for speed
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topicTitle: { type: Type.STRING },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.NUMBER },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            }
          }
        },
        required: ["topicTitle", "questions"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as Quiz;
};
