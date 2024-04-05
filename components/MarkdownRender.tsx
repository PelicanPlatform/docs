import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks'

const MarkdownRender: React.FC<{ content: string }> = ({ content }) => {
    return (
        <Markdown 
            remarkPlugins={[remarkBreaks]}
            children={content}
        />
    );
};

export default MarkdownRender;