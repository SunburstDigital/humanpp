## Pinecone Schema

### Index Name
`sunburst-memory-index`

### Namespaces
- `contact:` → stores long-term memory by phone number
- `listing:` → stores listing embeddings (for buy/lease match)
- `transcript:` → stores full call summaries, searchable

### Vector Payload Format
```json
{
  "id": "contact-{{phone_number}}",
  "values": [embedding],
  "metadata": {
    "name": "Dave Bennett",
    "last_seen": "2025-09-06T13:45:00Z",
    "notes": "Interested in 3x2s in Inglewood, budget 750k"
  }
}
```

### Use Cases
- Inject contact memory into prompt by searching phone number
- Query listings via semantic match (e.g. “pet-friendly 3x2 near Maylands”)
- Store previous transcripts with searchable context (e.g. "wanted pool")
