import { tool } from "ai"
import { z } from "zod"

const officialGuides = [
  {
    app: "After Effects",
    aliases: ["after effects", "aftereffects", "ae"],
    title: "Animating text in After Effects",
    url: "https://helpx.adobe.com/after-effects/desktop/animating-text/text-animation/animating-text.html",
    topics: ["text", "animate", "animation", "preset", "character", "motion"],
    summary: "Official guide to text animation using presets, text animators, and selectors.",
  },
  {
    app: "After Effects",
    aliases: ["after effects", "aftereffects", "ae"],
    title: "Create and edit text layers",
    url: "https://helpx.adobe.com/after-effects/desktop/add-text/create-and-edit-text-layers/creating-editing-text-layers.html",
    topics: ["text", "layer", "type", "font", "title"],
    summary: "Official guide to creating and editing text layers and animating text properties.",
  },
  {
    app: "Illustrator",
    aliases: ["illustrator", "adobe illustrator"],
    title: "Apply effects in Illustrator",
    url: "https://helpx.adobe.com/illustrator/using/effects.html",
    topics: ["effect", "effects", "appearance", "vector", "style"],
    summary: "Official guide to applying and editing vector and raster effects.",
  },
  {
    app: "Illustrator",
    aliases: ["illustrator", "adobe illustrator"],
    title: "Create type on a path",
    url: "https://helpx.adobe.com/illustrator/using/creating-type-path.html",
    topics: ["text", "type", "path", "curve", "letter"],
    summary: "Official guide to placing, moving, and styling text along a path.",
  },
  {
    app: "Photoshop",
    aliases: ["photoshop", "adobe photoshop"],
    title: "Add and edit layer masks",
    url: "https://helpx.adobe.com/photoshop/desktop/create-masks/layer-masks/add-layer-masks.html",
    topics: ["mask", "layer", "hide", "reveal", "selection"],
    summary: "Official guide to adding masks that hide or reveal parts of a layer.",
  },
  {
    app: "Photoshop",
    aliases: ["photoshop", "adobe photoshop"],
    title: "Create and manage video layers",
    url: "https://helpx.adobe.com/photoshop/desktop/add-video-and-animation/create-animation-frames/create-and-manage-video-layers.html",
    topics: ["video", "animation", "motion", "timeline", "frame"],
    summary: "Official guide to video layers, animation frames, and motion workflows.",
  },
  {
    app: "Alight Motion",
    aliases: ["alight motion", "alightmotion"],
    title: "Alight Motion Quick Start Guide",
    url: "https://support.alightmotion.com/hc/en-us/articles/10536777320337-Alight-Motion-Quick-Start-Guide",
    topics: ["start", "begin", "layer", "animate", "animation", "basic"],
    summary: "Official getting-started guide covering layers, adjustments, and animation.",
  },
  {
    app: "Alight Motion",
    aliases: ["alight motion", "alightmotion"],
    title: "Alight Motion Effects Guide",
    url: "https://support.alightmotion.com/hc/en-us/articles/10536991943569-Effects-Guide",
    topics: ["effect", "effects", "guide", "preset", "visual"],
    summary: "Official guide to finding instructions for Alight Motion effects.",
  },
] as const

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
}

export const officialDocs = tool({
  description:
    "Find relevant official help pages for creative software. Use this for software-specific workflows, effects, and cross-app instructions. The curated list currently covers After Effects, Illustrator, Photoshop, and Alight Motion. These are reference links, not a live search of the full documentation site.",
  inputSchema: z.object({
    software: z
      .array(z.string().max(60))
      .min(1)
      .max(4)
      .describe("The creative apps involved, such as After Effects and Alight Motion"),
    topic: z
      .string()
      .max(160)
      .describe("The effect, task, or workflow the user is asking about"),
  }),
  outputSchema: z.object({
    items: z.array(
      z.object({
        app: z.string(),
        title: z.string(),
        url: z.string().url(),
        summary: z.string(),
      })
    ),
  }),
  execute: async ({ software, topic }) => {
    const apps = software.map(normalize)
    const words = new Set(normalize(topic).split(" ").filter(Boolean))
    const matchingApps = officialGuides.filter((guide) =>
      guide.aliases.some((alias) =>
        apps.some(
          (app) =>
            app.includes(normalize(alias)) || normalize(alias).includes(app)
        )
      )
    )
    const ranked = matchingApps
      .map((guide) => ({
        guide,
        score: guide.topics.filter((word) => words.has(word)).length,
      }))
      .sort((a, b) => b.score - a.score)

    return {
      items: ranked.slice(0, 4).map(({ guide }) => ({
        app: guide.app,
        title: guide.title,
        url: guide.url,
        summary: guide.summary,
      })),
    }
  },
})