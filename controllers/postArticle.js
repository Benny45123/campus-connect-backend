const { Article } = require('../models/articleSchema');
const slugify = require('slugify');
const { generateTags } = require('../utils/generateTags');
const redisClient = require('../config/redis');

// ── Sanitize & validate each block by type ───────────────────────────────────
const sanitizeBlock = (block, index) => {
    const { type, data = {} } = block;

    switch (type) {
        case 'paragraph':
            if (!data.text?.trim()) throw new Error(`Block ${index}: paragraph has empty text`);
            return {
                type,
                data: { text: String(data.text).trim() }
            };

        case 'heading':
            if (!data.text?.trim()) throw new Error(`Block ${index}: heading has empty text`);
            return {
                type,
                data: {
                    text: String(data.text).trim(),
                    level: [1, 2, 3, 4, 5, 6].includes(Number(data.level)) ? Number(data.level) : 2
                }
            };

        case 'image':
            if (!data.url?.trim()) throw new Error(`Block ${index}: image block missing url`);
            return {
                type,
                data: {
                    url: String(data.url).trim(),
                    caption: String(data.caption ?? '').trim(),
                    alt: String(data.alt ?? '').trim()
                }
            };

        case 'code':
            if (!data.code?.trim()) throw new Error(`Block ${index}: code block is empty`);
            return {
                type,
                data: {
                    code: String(data.code).trimEnd(),
                    language: String(data.language ?? 'plaintext').toLowerCase()
                }
            };

        case 'quote':
            if (!data.text?.trim()) throw new Error(`Block ${index}: quote has empty text`);
            return {
                type,
                data: {
                    text: String(data.text).trim(),
                    author: String(data.author ?? '').trim()
                }
            };

        case 'links':
            if (!data.url?.trim()) throw new Error(`Block ${index}: links block missing url`);
            return {
                type,
                data: {
                    url: String(data.url).trim(),
                    title: String(data.title ?? '').trim(),
                    description: String(data.description ?? '').trim()
                }
            };

        default:
            throw new Error(`Block ${index}: unsupported type "${type}"`);
    }
};

// ── Word count across all text-bearing blocks (for read time) ────────────────
const countWords = (blocks) =>
    blocks.reduce((acc, block) => {
        const textTypes = ['paragraph', 'heading', 'quote'];
        if (textTypes.includes(block.type)) {
            const text = block.data?.text ?? '';
            return acc + text.trim().split(/\s+/).filter(Boolean).length;
        }
        return acc;
    }, 0);

// ── Controller ───────────────────────────────────────────────────────────────
const postArticle = async (req, res) => {
    try {
        const { title, content, coverImageUrl = null, tags = null, status } = req.body;

        // 1. Basic field checks
        if (!title?.trim())
            return res.status(400).json({ message: 'Title is required' });
        if (!Array.isArray(content) || content.length === 0)
            return res.status(400).json({ message: 'Content must be a non-empty array of blocks' });
        if (!['draft', 'published'].includes(status))
            return res.status(400).json({ message: 'Status must be "draft" or "published"' });

        // 2. Sanitize every block — returns 400 on any bad block
        let sanitizedContent;
        try {
            sanitizedContent = content.map((block, i) => sanitizeBlock(block, i));
        } catch (blockErr) {
            return res.status(400).json({ message: blockErr.message });
        }

        // 3. Unique slug
        const userName = req.user?.userName || 'Unknown Author';
        const titleSlug = slugify(title.trim(), { lower: true, strict: true });
        let slug = titleSlug;
        let count = 1;
        while (await Article.exists({ slug })) {
            slug = `${titleSlug}-${count++}`;
        }

        // 4. Read time
        const readTime = Math.ceil(countWords(sanitizedContent) / 200) || 1;

        // 5. Tags — merge user-supplied + auto-generated, dedupe, cap at 10
        const normalizeTag = (t) =>
            t.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
        const autoTags = generateTags(sanitizedContent, 5);
        const allTags = Array.from(
            new Set([...(tags || []), ...autoTags].map(normalizeTag))
        ).slice(0, 10);

        // 6. Persist
        const article = await Article.create({
            title:        title.trim(),
            slug,
            author:       req.user?.userId,
            authorName:   userName,
            content:      sanitizedContent,
            coverImageUrl: coverImageUrl || null,
            tags:         allTags,
            status,
            readTime
        });

        // 7. Bust Redis cache on publish
        if (status === 'published') {
            try {
                const keys = await redisClient.keys('articles:*');
                if (keys.length > 0) {
                    await redisClient.del(keys);
                    console.log(`Invalidated ${keys.length} cache entries`);
                }
            } catch (err) {
                console.error('Cache invalidation error:', err);
            }
        }

        res.status(201).json({ message: 'Article posted successfully', article });

    } catch (error) {
        console.error('Error posting article:', error);
        res.status(500).json({ message: 'Error posting article' });
    }
};

module.exports = { postArticle };