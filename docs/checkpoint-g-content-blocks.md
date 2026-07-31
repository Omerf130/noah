# Checkpoint G — Admin Content Blocks

Checkpoint G delivers the admin-only Rich Text content block system for lessons. Video, student rendering, and additional block types are intentionally deferred.

## Current scope (G1–G4 complete)

- Standalone `ContentBlock` MongoDB collection
- `richText` block type only
- Strongly typed TipTap/ProseMirror JSON storage
- Full ownership: `courseId`, `moduleId`, `lessonId`
- Gap-based ordering (100, 200, 300…)
- Admin create, edit, move up/down, delete
- Server-side validation and HTML preview
- Computed lesson `blockCount` from ContentBlock queries
- No block-level publication (lesson `status` controls visibility)

## Transitional legacy rule (`Lesson.blocks`)

The embedded `Lesson.blocks` array remains in the schema as **deprecated and read-only**. During transition:

1. **Counts and publish checks** prefer ContentBlock documents when any exist for a lesson.
2. Otherwise fall back to legacy `Lesson.blocks.length`.
3. **Never double-count** both sources for the same lesson.
4. **Lesson deletion** is blocked if either ContentBlock documents exist **or** legacy embedded blocks are non-empty.
5. **Course deletion** still scans legacy embedded blocks for video/file asset references until those types migrate to ContentBlock.

Do not remove `Lesson.blocks` from the schema until a dedicated data migration confirms zero production usage.

Implementation reference: `lib/courses/services/content-block-counts.ts`.

## Deferred features (not started)

The following are intentionally postponed until real product content and infrastructure are available:

| Feature | Status |
|---------|--------|
| Bunny Stream integration | Deferred |
| Video ContentBlock type | Deferred |
| VideoAsset provider integration | Deferred |
| Real video upload / progress / processing | Deferred |
| Video preview/player | Deferred |
| PDF blocks | Deferred |
| Image blocks | Deferred |
| Download/file blocks | Deferred |
| Quizzes | Deferred |
| Drag-and-drop reorder | Deferred |
| Soft delete / trash | Deferred |
| Autosave | Deferred |
| Unsaved-change navigation guards | Deferred |
| Student lesson rendering | Deferred |
| Progress tracking | Deferred |

**No placeholders** — do not add VideoAsset models, Bunny env vars, upload packages, or mock video infrastructure until video work is explicitly approved and production content exists.

## Recommended future work

When video is approved:

1. Add video ContentBlock type and VideoAsset integration (separate checkpoint).
2. Extend course-deletion asset scan to ContentBlock documents.
3. Migrate or retire legacy embedded `Lesson.blocks` after data audit.
4. Add student rendering in a dedicated checkpoint (outside G).

## Performance notes

- Lesson list `blockCount`: single batch aggregation per module (no N+1).
- Lesson edit `blockCount`: `$lookup` + `$count` in one aggregation (no full block fetch).
- Content list: indexed `{ lessonId, order }` sort; preview HTML generated server-side in DTO mapping.

No application-level caching is required at current scale.

## Admin routes

| Route | Purpose |
|-------|---------|
| `.../lessons/[lessonId]/content` | Block list |
| `.../content/blocks/new` | Create Rich Text |
| `.../content/blocks/[blockId]/edit` | Edit Rich Text |

All routes require admin role via `requireAdmin`.
