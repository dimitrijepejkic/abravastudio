const markdownHome = `# ABRAVA STUDIO

Abrava Studio is building a web presence for its games and community.

## Highlights
- Newsletter signup
- Discord server community
- Upcoming game launch updates

## Discovery
- API catalog: /.well-known/api-catalog
- API docs: /docs/api
- Agent skills index: /.well-known/agent-skills/index.json
`;

export async function onRequest(context) {
    const accept = context.request.headers.get('Accept') || '';

    if (accept.includes('text/markdown')) {
        return new Response(markdownHome, {
            status: 200,
            headers: {
                'Content-Type': 'text/markdown; charset=utf-8',
                'x-markdown-tokens': 'agent-discovery',
                'Cache-Control': 'no-store'
            }
        });
    }

    // Fall through to the static index.html for normal browsers
    return context.next();
}