import { useMemo } from 'react'
import { TransactionsContext } from '../contexts/TransactionsContext'
import { useContextSelector } from 'use-context-selector'

export function useSummary() {
  const transactions = useContextSelector(TransactionsContext, (context) => {
    return context.transactions
  })
  // Variavel summary só será recriada quando de fato transactions for alterado, evitando que o summary seja recriado passando por calculo extenso novamente
  const summary = useMemo(
    () => {
      return transactions.reduce(
        (acc, transaction) => {
          if (transaction.type === 'income') {
            acc.income += transaction.price
            acc.total += transaction.price
          } else {
            acc.outcome += transaction.price
            acc.total -= transaction.price
          }

          return acc
        },
        { income: 0, outcome: 0, total: 0 },
      )
    },
    [transactions], // Variaveis externas do useMemo que estamos usando dentro
  )
  return summary
}
