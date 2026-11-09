import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Blog posts: the text version of the social-media "atoms" (Spec - Landing §7.6). */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().default('Zespół Matura Angielski'),
    /** Exam parts and CKE topics, e.g. "srodki-jezykowe", "czlowiek". */
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    /** Id of the social-media atom the post comes from. */
    atomId: z.string().optional(),
    /** Where to practise this: a site path. */
    practice: z.object({ label: z.string(), href: z.string() }).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
