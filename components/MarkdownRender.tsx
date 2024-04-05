import React from 'react';
import Markdown from 'react-markdown';
import { useTheme } from '@mui/material';
import { Typography, List, ListItem, Box } from '@mui/material';
import { CodeBlockProps, PreProps } from '../utils/types';


const MarkdownRender: React.FC<{ content: string }> = ({ content }) => {
    const theme = useTheme();

    // Define components directly within the components prop to ensure type alignment
    return (
        <Markdown
            children={content}
            components={{
                // Inline code
                code: ({node, inline, className, children, ...props}: CodeBlockProps) => {
                    // Define inline code style
                    const inlineStyle: React.CSSProperties = {
                        backgroundColor: theme.palette.mode == "dark" ? '#19222d' : '#e5f0fe',
                        borderRadius: '4px',
                        padding: '1px 3px',
                        color: theme.palette.mode == "dark" ? "#e5f0fe" : '#19222d',
                        fontWeight: 'bold',
                    };
                    // If not wrapped by `pre`, it's inline code
                    if (!node?.parent || node.parent.tagName !== 'pre') {
                        return <code style={inlineStyle} {...props}>{children}</code>;
                    }
                    // For code blocks, just return children without additional wrapping
                    // This assumes that `pre` component will handle the styling
                    return <>{children}</>;
                },
                // Block-level code
                pre: ({children, ...props}: PreProps) => {
                    // Define block-level code style
                    const blockStyle: React.CSSProperties = {
                        backgroundColor: theme.palette.mode == "dark" ? '#19222d' : '#e5f0fe',
                        borderRadius: '4px',
                        padding: '10px',
                        overflowX: 'auto',
                        margin: '10px 0',
                    };
                    return <pre style={blockStyle} {...props}>{children}</pre>;
                },
                img: ({node, src, alt}) => <img style={{maxWidth: "100%", height: "auto"}} src={src} alt={alt} />,
                li: ({node, children}) => <ListItem disablePadding sx={{display:"list-item"}}>{children}</ListItem>,
                ul: ({node, children}) => <List sx={{ listStyleType: 'disc' }} style={{paddingLeft: "1rem"}}>{children}</List>,
                a: ({children, href}) => <Typography component="a" href={href} style={{ color: "#0885ff" }} target='_blank' >{children}</Typography>,
                strong: ({node, children}) => <Box component="span" display="inline" fontWeight="bold">{children}</Box>,
                text: ({ node, children }) => <Typography variant="body1" display="inline">{children}</Typography>,
                div: ({node, children}) => <Box>{children}</Box>,
            }}
        />
    );
};

export default MarkdownRender;
