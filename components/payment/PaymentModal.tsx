'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'

declare global {
  interface Window { Razorpay: any }
}

interface PaymentModalProps {
  toolType: 'plagiarism' | 'ai-detect' | 'ai_detector' | 'paraphraser'
  toolName: string
  onSuccess: (checkToken: string) => void
  onCancel: () => void
}

export function PaymentModal({ toolType, toolName, onSuccess, onCancel }: PaymentModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const initiatePayment = async () => {
    setLoading(true)
    setError('')
    try {
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolType, userId: user?.uid }),
      })

      if (!orderRes.ok) {
        const err = await orderRes.json()
        throw new Error(err.error || 'Failed to create order')
      }

      const { orderId, amount, keyId } = await orderRes.json()

      const options = {
        key: keyId,
        amount,
        currency: 'INR',
        name: 'Pay&Plag',
        description: `${toolName} — ₹19`,
        order_id: orderId,
        theme: { color: '#00E5FF' },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            })
            const data = await verifyRes.json()
            if (!verifyRes.ok) throw new Error(data.error || 'Verification failed')
            onSuccess(data.checkToken)
          } catch (e: any) {
            console.error('Verify error:', e)
            setError(e.message || 'Payment verification failed. Contact support.')
          }
        },
        modal: { ondismiss: onCancel },
        prefill: {},
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => setError('Payment failed. Please try again.'))
      rzp.open()
    } catch (e: any) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="payment-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      >
        <motion.div
          className="payment-modal-card"
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="payment-icon">💳</div>
          <h2 className="payment-title">One-Time Check</h2>
          <p className="payment-desc">
            You&apos;re about to run a <strong>{toolName}</strong>.
            Single use — no subscription.
          </p>

          <div className="payment-price">
            <span className="price-amount">₹19</span>
            <span className="price-label">one-time · instant access</span>
          </div>

          <div className="payment-methods">
            {['UPI', 'GPay', 'PhonePe', 'Paytm', 'Card', 'NetBanking'].map(m => (
              <span key={m}>{m}</span>
            ))}
          </div>

          {error && (
            <p style={{ color: 'var(--accent-danger)', fontSize: '0.85rem', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <button className="btn-primary btn-full" onClick={initiatePayment} disabled={loading}>
            {loading ? <span className="loading-spinner" /> : <>Pay ₹19 &amp; Check →</>}
          </button>

          <button className="btn-ghost btn-sm" onClick={onCancel}>
            Cancel
          </button>

          <p className="payment-security">🔒 Secured by Razorpay · PCI DSS Compliant</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
