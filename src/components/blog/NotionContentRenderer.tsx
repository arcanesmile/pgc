import { Key, ReactNode } from 'react';
import Image from 'next/image';

interface NotionBlock {
  id: string;
  type: string;
  [key: string]: any;
}

interface Props {
  blocks: NotionBlock[];
}

export default function NotionContentRenderer({ blocks }: Props) {
  const groupedBlocks: ReactNode[] = [];
  let currentList: { type: 'bulleted' | 'numbered'; items: NotionBlock[] } | null = null;

  const flushList = () => {
    if (currentList) {
      const ListTag = currentList.type === 'bulleted' ? 'ul' : 'ol';
      // Create a unique key using first and last item IDs (very unlikely to collide)
      const firstId = currentList.items[0].id;
      const lastId = currentList.items[currentList.items.length - 1].id;
      groupedBlocks.push(
        <ListTag key={`list-${firstId}-${lastId}`}>
          {currentList.items.map((item) => (
            <li key={item.id}>
              {renderRichText(item[item.type].rich_text)}
            </li>
          ))}
        </ListTag>
      );
      currentList = null;
    }
  };

  blocks.forEach((block) => {
    const { type, id } = block;

    // Handle list items
    if (type === 'bulleted_list_item' || type === 'numbered_list_item') {
      const listType = type === 'bulleted_list_item' ? 'bulleted' : 'numbered';
      if (currentList && currentList.type === listType) {
        currentList.items.push(block);
      } else {
        flushList();
        currentList = { type: listType, items: [block] };
      }
      return;
    }

    // For non-list blocks, flush any pending list first
    flushList();

    // Render other block types
    switch (type) {
      case 'paragraph':
        groupedBlocks.push(
          <p key={id}>{renderRichText(block.paragraph.rich_text)}</p>
        );
        break;

      case 'heading_1':
        groupedBlocks.push(
          <h1 key={id}>{renderRichText(block.heading_1.rich_text)}</h1>
        );
        break;

      case 'heading_2':
        groupedBlocks.push(
          <h2 key={id}>{renderRichText(block.heading_2.rich_text)}</h2>
        );
        break;

      case 'heading_3':
        groupedBlocks.push(
          <h3 key={id}>{renderRichText(block.heading_3.rich_text)}</h3>
        );
        break;

      case 'to_do':
        groupedBlocks.push(
          <div key={id} className="todo-item">
            <input
              type="checkbox"
              checked={block.to_do.checked}
              readOnly
              disabled
            />
            <span>{renderRichText(block.to_do.rich_text)}</span>
          </div>
        );
        break;

      case 'image': {
        const imageUrl =
          block.image.type === 'external'
            ? block.image.external.url
            : block.image.file.url;
        groupedBlocks.push(
          <figure key={id} className="image-block">
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
              <Image
                src={imageUrl}
                alt={block.image.caption?.[0]?.plain_text || 'Image'}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            {block.image.caption?.length > 0 && (
              <figcaption>{renderRichText(block.image.caption)}</figcaption>
            )}
          </figure>
        );
        break;
      }

      case 'code':
        groupedBlocks.push(
          <pre key={id} className="code-block">
            <code>{renderRichText(block.code.rich_text)}</code>
          </pre>
        );
        break;

      case 'quote':
        groupedBlocks.push(
          <blockquote key={id} className="quote">
            {renderRichText(block.quote.rich_text)}
          </blockquote>
        );
        break;

      case 'divider':
        groupedBlocks.push(<hr key={id} className="divider" />);
        break;

      case 'callout':
        groupedBlocks.push(
          <div key={id} className="callout">
            {block.callout.icon && <span className="callout-icon">{block.callout.icon.emoji}</span>}
            <div>{renderRichText(block.callout.rich_text)}</div>
          </div>
        );
        break;

      case 'toggle':
        groupedBlocks.push(
          <details key={id} className="toggle-block">
            <summary>{renderRichText(block.toggle.rich_text)}</summary>
            {/* Toggle blocks may contain children – you'd need to recursively render them if the API provides them */}
          </details>
        );
        break;

      default:
        // Attempt to render rich_text if present
        const richText = block[type]?.rich_text;
        if (richText) {
          groupedBlocks.push(
            <div key={id} className="unhandled-block">
              {renderRichText(richText)}
            </div>
          );
        } else {
          console.warn(`Unhandled block type: ${type}`);
          groupedBlocks.push(
            <div key={id} className="unhandled-block">
              [Unsupported block type: {type}]
            </div>
          );
        }
    }
  });

  // Flush any remaining list after loop
  flushList();

  return <div className="notion-content">{groupedBlocks}</div>;
}

// Helper to render rich text with annotations (bold, italic, etc.)
function renderRichText(richText: any[]) {
  if (!richText) return null;
  return richText.map((text, index) => {
    const { plain_text, annotations, href } = text;
    let element = <span key={index}>{plain_text}</span>;

    // Apply annotations
    if (annotations?.bold) {
      element = <strong key={index}>{element}</strong>;
    }
    if (annotations?.italic) {
      element = <em key={index}>{element}</em>;
    }
    if (annotations?.strikethrough) {
      element = <s key={index}>{element}</s>;
    }
    if (annotations?.underline) {
      element = <u key={index}>{element}</u>;
    }
    if (annotations?.code) {
      element = <code key={index}>{element}</code>;
    }
    if (href) {
      element = (
        <a key={index} href={href} target="_blank" rel="noopener noreferrer">
          {element}
        </a>
      );
    }
    return element;
  });
}