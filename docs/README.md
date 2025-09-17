# Create a README.md file that indexes all included markdown files

readme_content = """# 📚 Human++ AI – Project Documentation Index

Welcome to the documentation hub for the Sunburst Digital AI (Human++) project. Below is an index of all core `.md` documents bundled in this release.

## ✅ Core Docs

- [Client Onboarding Guide](client-onboarding.md)
- [Project Checklist](project-checklist.md)
- [System Prompts](system-prompts.md)
- [Roadmap](roadmap.md)
- [AI Testbed Setup](ai-testbed.md)

## 🧠 AI + Prompt Infrastructure

- [AI Outbound Call Policy](ai-outbound-call-policy.md)
- [eSIM Call Routing Policy](esim-call-routing-policy.md)
- [GPT Realtime Integration](gpt-realtime-integration.md)
- [Pinecone Schema Reference](pinecone-schema.md)
- [Calendar Sync Guide](calendar-sync-guide.md)
- [Messaging & Channel Guide](messaging-guide.md)

---

All documents above are managed as part of the `/docs` directory in your GitHub repo.
"""

# Write README.md to the docs folder before zipping again
readme_path = zip_dir / "README.md"
readme_path.write_text(readme_content)

# Recreate the ZIP file including the new README
zip_path_final = "/mnt/data/humanpp_docs_bundle_with_readme.zip"
shutil.make_archive(zip_path_final.replace(".zip", ""), 'zip', zip_dir)

zip_path_final
