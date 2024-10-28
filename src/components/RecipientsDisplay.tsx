import React, { useState, useEffect, useRef } from 'react'

interface RecipientsDisplayProps {
  recipients: string[]
}

const RecipientsDisplay: React.FC<RecipientsDisplayProps> = ({
  recipients,
}) => {
  const [visibleRecipients, setVisibleRecipients] = useState<string[]>([])
  const [hiddenCount, setHiddenCount] = useState<number>(0)
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const calculateVisibleRecipients = () => {
      if (!containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const recipientWidths: number[] = []
      let cumulativeWidth = 0

      const dummyDiv = document.createElement('div')
      dummyDiv.style.visibility = 'hidden'
      dummyDiv.style.position = 'absolute'
      dummyDiv.style.whiteSpace = 'nowrap'
      document.body.appendChild(dummyDiv)

      recipients.forEach(recipient => {
        dummyDiv.innerHTML = recipient
        const width = dummyDiv.offsetWidth + 10 // Approximation for spacing
        recipientWidths.push(width)
      })

      document.body.removeChild(dummyDiv)

      const newVisibleRecipients: string[] = []
      let index = 0

      while (
        index < recipients.length &&
        cumulativeWidth + recipientWidths[index] < containerWidth
      ) {
        cumulativeWidth += recipientWidths[index]
        newVisibleRecipients.push(recipients[index])
        index++
      }

      if (index < recipients.length) {
        if (newVisibleRecipients.length > 0) {
          newVisibleRecipients[newVisibleRecipients.length - 1] += ', ...'
        }
        setHiddenCount(recipients.length - newVisibleRecipients.length)
      } else {
        setHiddenCount(0)
      }

      setVisibleRecipients(newVisibleRecipients)
    }

    calculateVisibleRecipients()
    window.addEventListener('resize', calculateVisibleRecipients)

    return () =>
      window.removeEventListener('resize', calculateVisibleRecipients)
  }, [recipients])

  const handleMouseEnter = () => {
    setTooltipVisible(true)
  }

  const handleMouseLeave = () => {
    setTooltipVisible(false)
  }

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    } as React.CSSProperties,
    list: {
      flexGrow: 1,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    } as React.CSSProperties,
    badge: {
      marginLeft: '8px',
      backgroundColor: '#666',
      color: '#f0f0f0',
      borderRadius: '50%',
      padding: '4px 8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
    } as React.CSSProperties,
    tooltip: {
      position: 'fixed',
      top: '8px',
      right: '8px',
      padding: '8px 16px',
      backgroundColor: '#666',
      color: '#f0f0f0',
      borderRadius: '24px',
      display: 'flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',
    } as React.CSSProperties,
  }

  return (
    <div style={styles.container} ref={containerRef}>
      <div style={styles.list}>{visibleRecipients.join(', ')}</div>
      {hiddenCount > 0 && (
        <div
          style={styles.badge}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          +{hiddenCount}
        </div>
      )}
      {tooltipVisible && (
        <div style={styles.tooltip}>{recipients.join(', ')}</div>
      )}
    </div>
  )
}

export default RecipientsDisplay
