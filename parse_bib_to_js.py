#!/usr/bin/env python3
"""
Parse BibTeX bibliography file and generate JavaScript papersDatabase array.
"""

import re
import json
from pathlib import Path

def clean_latex(text):
    """Clean LaTeX formatting from text."""
    if not text:
        return ""
    # Remove braces
    text = re.sub(r'\{|\}', '', text)
    # Handle LaTeX special characters
    text = text.replace('\\textquotesingle', "'")
    text = text.replace("\\'", "'")
    text = text.replace('\\"', '"')
    text = text.replace('\\&', '&')
    text = text.replace('\\%', '%')
    text = text.replace('\\#', '#')
    text = text.replace('\\c{s}', 'ş')
    text = text.replace('\\c{S}', 'Ş')
    text = text.replace("\\={a}", "ā")
    text = text.replace("\\={o}", "ō")
    text = text.replace("\\={u}", "ū")
    text = text.replace("\\={i}", "ī")
    text = text.replace("\\d{h}", "ḥ")
    text = text.replace('\\"o', 'ö')
    text = text.replace('\\"u', 'ü')
    text = text.replace('\\"a', 'ä')
    text = text.replace("\\'{a}", "á")
    text = text.replace("\\'{e}", "é")
    text = text.replace("\\'{i}", "í")
    text = text.replace("\\'{o}", "ó")
    text = text.replace("\\~n", "ñ")
    text = text.replace('--', '–')
    text = text.replace('---', '—')
    # Remove remaining backslash commands
    text = re.sub(r'\\[a-zA-Z]+', '', text)
    # Clean up extra spaces
    text = re.sub(r'\s+', ' ', text).strip()
    # Escape quotes for JavaScript
    text = text.replace('"', '\\"')
    return text

def parse_bibtex_entry(entry_text):
    """Parse a single BibTeX entry and extract fields."""
    # Extract entry type and key
    match = re.match(r'@(\w+)\s*\{\s*([^,\s]+)', entry_text, re.IGNORECASE)
    if not match:
        return None
    
    entry_type = match.group(1).lower()
    entry_key = match.group(2)
    
    # Extract fields
    fields = {}
    # Match field = value patterns, handling multiline values
    field_pattern = r'(\w+)\s*=\s*(?:\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}|"([^"]*)"|(\d+))'
    
    for m in re.finditer(field_pattern, entry_text, re.IGNORECASE):
        field_name = m.group(1).lower()
        field_value = m.group(2) or m.group(3) or m.group(4) or ""
        fields[field_name] = clean_latex(field_value.strip())
    
    return {
        'type': entry_type,
        'key': entry_key,
        'fields': fields
    }

def categorize_paper(entry):
    """Categorize paper based on content."""
    fields = entry['fields']
    title = fields.get('title', '').lower()
    abstract = fields.get('abstract', '').lower()
    content = title + ' ' + abstract
    
    # Default values
    pillar = "Disciplines"
    domain = "Arabic Language and NLP"
    topic = "General"
    keywords = []
    
    # Quran-related
    if any(term in content for term in ['quran', "qur'an", 'quranic', "qur'anic", 'tafsir', 'tajweed', 'tajwid', 'recitation']):
        pillar = "Foundations"
        domain = "Qur'an"
        if any(term in content for term in ['benchmark', 'evaluation', 'eval', 'assess']):
            topic = "Benchmarks"
            keywords.extend(["Quran", "Benchmark", "Evaluation"])
        elif any(term in content for term in ['dataset', 'corpus', 'collection']):
            topic = "Corpus Building"
            keywords.extend(["Quran", "Corpus", "Dataset"])
        elif any(term in content for term in ['retrieval', 'search', 'ir ']):
            topic = "Search / IR"
            keywords.extend(["Quran", "Retrieval", "Search"])
        elif any(term in content for term in ['rag', 'retrieval-augmented', 'retrieval augmented']):
            topic = "RAG and Evidence"
            keywords.extend(["Quran", "RAG", "Retrieval"])
        elif any(term in content for term in ['speech', 'audio', 'recitation', 'pronunciation', 'asr']):
            topic = "Speech/Audio"
            keywords.extend(["Quran", "Speech", "Audio"])
        elif any(term in content for term in ['image', 'ocr', 'calligraphy', 'manuscript']):
            topic = "Image-text"
            keywords.extend(["Quran", "Image", "OCR"])
        elif any(term in content for term in ['extract', 'ner', 'named entity']):
            topic = "Extraction"
            keywords.extend(["Quran", "Extraction", "NLP"])
        elif any(term in content for term in ['question answer', 'qa ', 'q&a']):
            topic = "Question Answering"
            keywords.extend(["Quran", "QA", "NLP"])
        else:
            topic = "General"
            keywords.extend(["Quran", "NLP"])
    
    # Hadith-related
    elif any(term in content for term in ['hadith', 'hadīth', 'sunnah', 'isnad', 'matn', 'prophet']):
        pillar = "Foundations"
        domain = "Hadith"
        if any(term in content for term in ['benchmark', 'evaluation', 'eval']):
            topic = "Benchmarks"
            keywords.extend(["Hadith", "Benchmark", "Evaluation"])
        elif any(term in content for term in ['dataset', 'corpus', 'collection']):
            topic = "Corpus Building"
            keywords.extend(["Hadith", "Corpus", "Dataset"])
        elif any(term in content for term in ['verification', 'authentication', 'classification']):
            topic = "Classification"
            keywords.extend(["Hadith", "Classification", "Authentication"])
        else:
            topic = "General"
            keywords.extend(["Hadith", "NLP"])
    
    # Fiqh/Islamic Law
    elif any(term in content for term in ['fatwa', 'fiqh', 'inheritance', 'mawarith', 'legal', 'sharia', 'shariah', 'islamic law', 'zakat', 'hajj', 'halal']):
        pillar = "Disciplines"
        domain = "Fiqh (Islamic Jurisprudence)"
        if any(term in content for term in ['benchmark', 'evaluation', 'eval']):
            topic = "Benchmarks"
            keywords.extend(["Fiqh", "Benchmark", "Islamic Law"])
        elif any(term in content for term in ['inheritance', 'mawarith']):
            topic = "Inheritance"
            keywords.extend(["Fiqh", "Inheritance", "Islamic Law"])
        elif any(term in content for term in ['fatwa']):
            topic = "Fatwa Generation"
            keywords.extend(["Fiqh", "Fatwa", "Islamic Law"])
        elif any(term in content for term in ['rag', 'retrieval']):
            topic = "RAG and Evidence"
            keywords.extend(["Fiqh", "RAG", "Retrieval"])
        else:
            topic = "General"
            keywords.extend(["Fiqh", "Islamic Law"])
    
    # Aqidah/Theology
    elif any(term in content for term in ['theology', 'aqidah', 'belief', 'kalam', 'creed']):
        pillar = "Foundations"
        domain = "Aqidah (Theology)"
        topic = "General"
        keywords.extend(["Aqidah", "Theology", "Islamic"])
    
    # Sufism
    elif any(term in content for term in ['sufi', 'sufism', 'tasawwuf', 'spiritual', 'mysticism']):
        pillar = "Disciplines"
        domain = "Sufism (Tasawwuf)"
        topic = "General"
        keywords.extend(["Sufism", "Spirituality", "Tasawwuf"])
    
    # Arabic NLP / LLM
    elif any(term in content for term in ['arabic', 'llm', 'language model', 'benchmark', 'bert', 'gpt', 'transformer']):
        pillar = "Disciplines"
        domain = "Arabic Language and NLP"
        if any(term in content for term in ['benchmark', 'evaluation', 'eval', 'mmlu']):
            topic = "Benchmarks"
            keywords.extend(["Arabic", "LLM", "Benchmark"])
        elif any(term in content for term in ['bias', 'fairness', 'stereotyp']):
            topic = "Bias and Fairness"
            keywords.extend(["Arabic", "Bias", "Fairness"])
        elif any(term in content for term in ['hallucination', 'faithful', 'truthful']):
            topic = "Hallucination Detection"
            keywords.extend(["Arabic", "Hallucination", "LLM"])
        elif any(term in content for term in ['safety', 'harmful', 'toxic']):
            topic = "Safety"
            keywords.extend(["Arabic", "Safety", "LLM"])
        elif any(term in content for term in ['embedding', 'representation']):
            topic = "Embeddings"
            keywords.extend(["Arabic", "Embeddings", "NLP"])
        elif any(term in content for term in ['dataset', 'corpus']):
            topic = "Corpus Building"
            keywords.extend(["Arabic", "Corpus", "Dataset"])
        elif any(term in content for term in ['dialect', 'msa', 'dialectal']):
            topic = "Dialectal Arabic"
            keywords.extend(["Arabic", "Dialect", "NLP"])
        else:
            topic = "General"
            keywords.extend(["Arabic", "NLP", "LLM"])
    
    # Education
    elif any(term in content for term in ['education', 'learning', 'teaching', 'school', 'student', 'pedagogy']):
        pillar = "Disciplines"
        domain = "Islamic Education"
        topic = "Educational Technology"
        keywords.extend(["Education", "Learning", "Islamic"])
    
    # Ethics and Values
    elif any(term in content for term in ['ethic', 'moral', 'value', 'alignment']):
        pillar = "Disciplines"
        domain = "Islamic Ethics"
        topic = "Value Alignment"
        keywords.extend(["Ethics", "Moral", "Values"])
    
    # Cultural
    elif any(term in content for term in ['cultural', 'culture', 'heritage', 'tradition']):
        pillar = "Disciplines"
        domain = "Cross-Cultural AI"
        topic = "Cultural Awareness"
        keywords.extend(["Culture", "Heritage", "AI"])
    
    # History
    elif any(term in content for term in ['history', 'historical', 'sira', 'biography']):
        pillar = "Disciplines"
        domain = "History and Prophetic Biography (Sira)"
        topic = "General"
        keywords.extend(["History", "Sira", "Islamic"])
    
    # Remove duplicate keywords
    keywords = list(dict.fromkeys(keywords))[:5]
    
    return pillar, domain, topic, keywords

def get_venue(entry):
    """Get venue from entry."""
    fields = entry['fields']
    if entry['type'] == 'article':
        return fields.get('journal', 'Journal')
    elif entry['type'] in ['inproceedings', 'conference']:
        return fields.get('booktitle', 'Conference')
    elif entry['type'] == 'book':
        return fields.get('publisher', 'Book')
    elif entry['type'] in ['incollection', 'inbook']:
        return fields.get('booktitle', fields.get('publisher', 'Collection'))
    elif entry['type'] == 'techreport':
        return fields.get('institution', 'Technical Report')
    elif entry['type'] == 'misc':
        return fields.get('howpublished', fields.get('publisher', 'Preprint'))
    else:
        return fields.get('journal', fields.get('booktitle', 'Publication'))

def extract_arxiv_id(url):
    """Extract arXiv ID from URL."""
    if not url:
        return None
    match = re.search(r'arxiv\.org/(?:abs|pdf)/(\d+\.\d+)', url)
    if match:
        return match.group(1)
    # Check if journal field contains arXiv ID
    match = re.search(r'(\d{4}\.\d{4,5})', url)
    if match:
        return match.group(1)
    return None

def parse_bibliography(bib_path):
    """Parse entire bibliography file."""
    with open(bib_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split into entries
    entries = []
    # Match @type{key, ... }
    entry_pattern = r'@(\w+)\s*\{([^@]*?)(?=\n@|\Z)'
    
    for match in re.finditer(entry_pattern, content, re.DOTALL):
        entry_type = match.group(1)
        entry_body = match.group(2)
        full_entry = f"@{entry_type}{{{entry_body}"
        
        parsed = parse_bibtex_entry(full_entry)
        if parsed:
            entries.append(parsed)
    
    return entries

def generate_papers_database(entries):
    """Generate JavaScript papersDatabase array."""
    papers = []
    
    for entry in entries:
        fields = entry['fields']
        
        # Get basic info
        paper_id = entry['key']
        title = fields.get('title', 'Untitled')
        
        # Get authors
        authors = fields.get('author', 'Unknown')
        # Clean up author formatting
        authors = re.sub(r'\s+and\s+', ', ', authors)
        authors = re.sub(r'\s+', ' ', authors).strip()
        
        # Get year
        year = fields.get('year', '2025')
        try:
            year = int(year)
        except:
            year = 2025
        
        # Get venue
        venue = get_venue(entry)
        
        # Get abstract
        abstract = fields.get('abstract', f"Research paper on {title}.")
        if len(abstract) > 500:
            abstract = abstract[:497] + "..."
        
        # Get URL
        url = fields.get('url', '')
        
        # Get DOI
        doi = fields.get('doi', None)
        
        # Get arXiv ID
        arxiv = extract_arxiv_id(url) or extract_arxiv_id(fields.get('journal', ''))
        
        # Categorize
        pillar, domain, topic, keywords = categorize_paper(entry)
        
        paper = {
            'id': paper_id,
            'title': title,
            'authors': authors,
            'year': year,
            'venue': venue,
            'abstract': abstract,
            'url': url if url else None,
            'arxiv': arxiv,
            'doi': doi,
            'pillar': pillar,
            'domain': domain,
            'topic': topic,
            'keywords': keywords
        }
        
        papers.append(paper)
    
    return papers

def format_js_value(value):
    """Format value for JavaScript."""
    if value is None:
        return 'null'
    elif isinstance(value, bool):
        return 'true' if value else 'false'
    elif isinstance(value, int):
        return str(value)
    elif isinstance(value, list):
        items = ', '.join(f'"{item}"' for item in value)
        return f'[{items}]'
    else:
        # Escape special characters for JavaScript string
        value = str(value)
        value = value.replace('\\', '\\\\')
        value = value.replace('"', '\\"')
        value = value.replace('\n', ' ')
        value = value.replace('\r', '')
        return f'"{value}"'

def generate_js_output(papers):
    """Generate JavaScript code for papersDatabase."""
    output = []
    output.append("// Papers Page JavaScript")
    output.append("// Handles loading, filtering, and displaying papers")
    output.append("")
    output.append("// Comprehensive papers database with details from bibliography")
    output.append("const papersDatabase = [")
    
    for i, paper in enumerate(papers):
        output.append("    {")
        output.append(f'        id: {format_js_value(paper["id"])},')
        output.append(f'        title: {format_js_value(paper["title"])},')
        output.append(f'        authors: {format_js_value(paper["authors"])},')
        output.append(f'        year: {paper["year"]},')
        output.append(f'        venue: {format_js_value(paper["venue"])},')
        output.append(f'        abstract: {format_js_value(paper["abstract"])},')
        output.append(f'        url: {format_js_value(paper["url"])},')
        output.append(f'        arxiv: {format_js_value(paper["arxiv"])},')
        output.append(f'        doi: {format_js_value(paper["doi"])},')
        output.append(f'        pillar: {format_js_value(paper["pillar"])},')
        output.append(f'        domain: {format_js_value(paper["domain"])},')
        output.append(f'        topic: {format_js_value(paper["topic"])},')
        output.append(f'        keywords: {format_js_value(paper["keywords"])}')
        
        if i < len(papers) - 1:
            output.append("    },")
        else:
            output.append("    }")
    
    output.append("];")
    
    return '\n'.join(output)

def main():
    bib_path = Path(__file__).parent / "bibliography" / "bibliography.bib"
    output_path = Path(__file__).parent / "static" / "js" / "papers-database.js"
    
    print(f"Parsing {bib_path}...")
    entries = parse_bibliography(bib_path)
    print(f"Found {len(entries)} entries")
    
    print("Generating papers database...")
    papers = generate_papers_database(entries)
    print(f"Generated {len(papers)} paper entries")
    
    print("Creating JavaScript output...")
    js_code = generate_js_output(papers)
    
    # Write to file
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(js_code)
    
    print(f"Output written to {output_path}")
    
    # Also print stats
    pillars = {}
    domains = {}
    for p in papers:
        pillars[p['pillar']] = pillars.get(p['pillar'], 0) + 1
        domains[p['domain']] = domains.get(p['domain'], 0) + 1
    
    print("\nPillar distribution:")
    for k, v in sorted(pillars.items()):
        print(f"  {k}: {v}")
    
    print("\nDomain distribution:")
    for k, v in sorted(domains.items()):
        print(f"  {k}: {v}")

if __name__ == "__main__":
    main()
