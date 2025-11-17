// Wrapper around Nextra Callout to add "example" type for user documentation
import { Callout as NextraCallout } from 'nextra/components'

type CalloutProps = React.ComponentProps<typeof NextraCallout> & {
  type?: 'default' | 'info' | 'warning' | 'error' | 'success' | 'example'
}

export function Callout({ type, children, ...props }: CalloutProps) {
  if (type === 'example') {
    return (
      <NextraCallout type="info" {...props}>
        <strong>Example:</strong> {children}
      </NextraCallout>
    )
  }
  return <NextraCallout type={type as any} {...props}>{children}</NextraCallout>
}
