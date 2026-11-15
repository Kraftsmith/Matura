import React from 'react';
import { hasNoteMarkup, parseNote, type Inline } from './noteMarkup';

const renderInline = (parts: Inline[]): React.ReactNode =>
  parts.map((p, i) =>
    p.kind === 'text' ? (
      <React.Fragment key={i}>{p.text}</React.Fragment>
    ) : p.kind === 'bold' ? (
      <strong key={i} className="font-semibold">
        {renderInline(p.children)}
      </strong>
    ) : (
      <em key={i}>{renderInline(p.children)}</em>
    ),
  );

/** A note's text with its markup rendered; a note without markup is one pre-wrapped paragraph, as before. */
export const NoteText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  if (!hasNoteMarkup(text)) return <p className={`break-words whitespace-pre-wrap ${className}`}>{text}</p>;
  return (
    <div className={`grid gap-2 break-words ${className}`}>
      {parseNote(text).map((block, b) =>
        block.kind === 'paragraph' ? (
          <p key={b}>
            {block.lines.map((line, i) => (
              <React.Fragment key={i}>
                {i > 0 && <br />}
                {renderInline(line)}
              </React.Fragment>
            ))}
          </p>
        ) : block.ordered ? (
          <ol key={b} className="list-decimal pl-6">
            {block.items.map((item, i) => (
              <li key={i}>{renderInline(item)}</li>
            ))}
          </ol>
        ) : (
          <ul key={b} className="list-disc pl-6">
            {block.items.map((item, i) => (
              <li key={i}>{renderInline(item)}</li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
};
