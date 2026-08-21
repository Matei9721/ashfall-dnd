from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from docx import Document
from docx.table import Table
from docx.text.paragraph import Paragraph
from docx.oxml.ns import qn

sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'Ashfall_DM_Campaign_Guide_v6.docx'
OUTPUT = ROOT / 'content.js'


def clean(value: str) -> str:
    return re.sub(r'\s+', ' ', value or '').strip()


def slugify(value: str) -> str:
    value = re.sub(r'[^a-z0-9]+', '-', value.lower()).strip('-')
    return value or 'section'


def iter_blocks(document):
    body = document.element.body
    for child in body.iterchildren():
        if child.tag == qn('w:p'):
            yield Paragraph(child, document)
        elif child.tag == qn('w:tbl'):
            yield Table(child, document)


def table_rows(table: Table) -> list[list[str]]:
    rows = []
    for row in table.rows:
        rows.append([clean(cell.text) for cell in row.cells])
    return rows


def is_list_style(style_name: str) -> bool:
    return style_name.lower().startswith('list')


def make_site_content() -> dict:
    document = Document(SOURCE)
    sections = []
    current = {
        'title': 'Campaign overview',
        'slug': 'campaign-overview',
        'blocks': [],
    }

    def start_section(title: str):
        nonlocal current
        if current['blocks'] or not sections:
            sections.append(current)
        current = {'title': title, 'slug': slugify(title), 'blocks': []}

    for block in iter_blocks(document):
        if isinstance(block, Paragraph):
            text = clean(block.text)
            if not text:
                continue
            style = block.style.name
            if style == 'Heading 1':
                start_section(text)
                continue
            if style == 'Heading 2':
                current['blocks'].append({'type': 'h2', 'text': text})
            elif is_list_style(style):
                if current['blocks'] and current['blocks'][-1]['type'] == 'list':
                    current['blocks'][-1]['items'].append(text)
                else:
                    current['blocks'].append({'type': 'list', 'items': [text]})
            else:
                current['blocks'].append({'type': 'p', 'text': text})
        else:
            rows = table_rows(block)
            if not rows:
                continue
            if len(rows) == 1 and len(rows[0]) == 1:
                text = rows[0][0]
                variant = 'readaloud' if current['title'] == 'Read-aloud descriptions' else 'callout'
                current['blocks'].append({'type': 'callout', 'variant': variant, 'text': text})
            else:
                current['blocks'].append({'type': 'table', 'rows': rows})

    if current['blocks']:
        sections.append(current)

    spoiler_sections = {
        'The true story of Ashfall',
        'Elias and the crystal',
        'Earlier adventuring parties',
        'Possible endings',
        'Finale preparation sheet',
    }
    spoiler_headings = {
        'What happened 307 years ago',
        'What they should eventually learn',
        'Hidden truth',
        'DM secret',
        'His preferred ending',
    }

    for section in sections:
        in_spoiler = section['title'] in spoiler_sections
        for block in section['blocks']:
            if block['type'] == 'h2':
                in_spoiler = block['text'] in spoiler_headings or section['title'] in spoiler_sections
                block['spoiler'] = in_spoiler
            else:
                block['spoiler'] = in_spoiler

    return {
        'title': document.core_properties.title,
        'subject': document.core_properties.subject,
        'source': SOURCE.name,
        'sections': sections,
    }


def main() -> None:
    content = make_site_content()
    OUTPUT.write_text(
        'window.ASHFALL_CONTENT = ' + json.dumps(content, ensure_ascii=False, separators=(',', ':')) + ';\n',
        encoding='utf-8',
    )
    print(f'Generated {OUTPUT.name}: {len(content["sections"])} sections')
    print('Sections:', ', '.join(section['title'] for section in content['sections']))


if __name__ == '__main__':
    main()
