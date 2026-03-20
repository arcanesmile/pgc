import { ReactNode } from 'react';
import Image from 'next/image';
import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';

type SupportedBlock = Extract<
  BlockObjectResponse,
  {
    type:
      | 'paragraph'
      | 'heading_1'
      | 'heading_2'
      | 'heading_3'
      | 'to_do'
      | 'image'
      | 'code'
      | 'quote'
      | 'divider'
      | 'callout'
      | 'toggle'
      | 'bulleted_list_item'
      | 'numbered_list_item';
  }
>;

type ListBlock = Extract<
  SupportedBlock,
  { type: 'bulleted_list_item' | 'numbered_list_item' }
>;

export type NotionBlock = SupportedBlock;

interface Props {
  blocks: SupportedBlock[];
}

export default function NotionContentRenderer({ blocks }: Props) {
  const groupedBlocks: ReactNode[] = [];
  let currentList: { type: 'bulleted' | 'numbered'; items: ListBlock[] } | null =
    null;

  const flushList = () => {
    if (currentList) {
      const ListTag = currentList.type === 'bulleted' ? 'ul' : 'ol';
      const firstId = currentList.items[0].id;
      const lastId = currentList.items[currentList.items.length - 1].id;
      groupedBlocks.push(
        <ListTag key={`list-${firstId}-${lastId}`}>
          {currentList.items.map((item) => (
            <li key={item.id}>
              {renderRichText(
                item.type === 'bulleted_list_item'
                  ? item.bulleted_list_item.rich_text
                  : item.numbered_list_item.rich_text
              )}
            </li>
          ))}
        </ListTag>
      );
      currentList = null;
    }
  };

  blocks.forEach((block) => {
    const { type, id } = block;

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

    flushList();

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
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
              }}
            >
              <Image
                src={imageUrl}
                alt={block.image.caption?.[0]?.plain_text || 'Image'}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            {block.image.caption?.length ? (
              <figcaption>{renderRichText(block.image.caption)}</figcaption>
            ) : null}
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
        const calloutIcon = block.callout.icon;
        groupedBlocks.push(
          <div key={id} className="callout">
            {calloutIcon?.type === 'emoji' && (
              <span className="callout-icon">{calloutIcon.emoji}</span>
            )}
            <div>{renderRichText(block.callout.rich_text)}</div>
          </div>
        );
        break;
      case 'toggle':
        groupedBlocks.push(
          <details key={id} className="toggle-block">
            <summary>{renderRichText(block.toggle.rich_text)}</summary>
          </details>
        );
        break;
      default: {
        const richText = extractRichText(block);
        if (richText) {
          groupedBlocks.push(
            <div key={id} className="unhandled-block">
              {renderRichText(richText)}
            </div>
          );
        } else {
          groupedBlocks.push(
            <div key={id} className="unhandled-block">
              [Unsupported block type: {type}]
            </div>
          );
        }
      }
    }
  });

  flushList();

  return <div className="notion-content">{groupedBlocks}</div>;
}

function renderRichText(richText?: RichTextItemResponse[]) {
  if (!richText) return null;
  return richText.map((text, index) => {
    const { plain_text, annotations, href } = text;
    let element = <span key={index}>{plain_text}</span>;

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

function extractRichText(
  block: SupportedBlock
): RichTextItemResponse[] | undefined {
  switch (block.type) {
    case 'paragraph':
      return block.paragraph.rich_text;
    case 'heading_1':
      return block.heading_1.rich_text;
    case 'heading_2':
      return block.heading_2.rich_text;
    case 'heading_3':
      return block.heading_3.rich_text;
    case 'to_do':
      return block.to_do.rich_text;
    case 'code':
      return block.code.rich_text;
    case 'quote':
      return block.quote.rich_text;
    case 'callout':
      return block.callout.rich_text;
    case 'toggle':
      return block.toggle.rich_text;
    case 'bulleted_list_item':
      return block.bulleted_list_item.rich_text;
    case 'numbered_list_item':
      return block.numbered_list_item.rich_text;
    case 'image':
      return block.image.caption;
    default:
      return undefined;
  }
}
