
import { GoogleGenAI, Type } from "@google/genai";
import { BlockType } from "../types";

const ARCHITECT_SYSTEM_PROMPT = `You are the World Architect for a mini Minecraft game.
Your job is to help users build structures by providing block coordinates.
When asked to build something, return a JSON list of block positions and their types.
Coordinate system: (x, y, z). The ground is at y=0.

Available blocks: 
- dirt, grass: Ground and landscape.
- cobblestone, stone: Foundations and heavy walls.
- log, wood, plank: Walls, supports, and flooring.
- glass: Windows and modern elements.
- leaves: Decoration and tree tops.

Focus on structural integrity and aesthetics. 
Adjust material choice to match the user's requested style:
- Modern: Heavy use of glass, stone, and planks.
- Medieval: Cobblestone, logs, and planks.
- Fantasy: Mixed materials, tall thin structures.
- Rustic: Log, wood, and dirt.
- Futuristic: Glass and stone in clean shapes.

Return ONLY valid JSON in the format: [{"pos": [x, y, z], "texture": "blocktype"}].`;

export const getArchitectAdvice = async (prompt: string, style: string = 'None'): Promise<{pos: [number, number, number], texture: BlockType}[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const fullPrompt = style !== 'None' 
    ? `Style: ${style}. Building Request: ${prompt}. Build a complete but small structure.` 
    : prompt;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
      config: {
        systemInstruction: ARCHITECT_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              pos: {
                type: Type.ARRAY,
                items: { type: Type.NUMBER },
                description: '3D coordinate [x, y, z]',
              },
              texture: {
                type: Type.STRING,
                description: 'The type of block to place',
              },
            },
            required: ["pos", "texture"],
          },
        },
      },
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Architect failed:", error);
    return [];
  }
};
