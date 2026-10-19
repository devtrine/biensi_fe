import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  executeImport,
  type ImportResponseSummary,
} from "../services/import.service"
import { getErrorMessage } from "../lib/api/client"

export function useImportExcel() {
  const queryClient = useQueryClient()
  const [progressStep, setProgressStep] = useState<string | null>(null)
  const [progressPercent, setProgressPercent] = useState<number>(0)

  const mutation = useMutation({
    mutationFn: async ({
      targetKey,
      file,
    }: {
      targetKey: string
      file: File
    }) => {
      setProgressPercent(10)
      setProgressStep("Menginisialisasi unggahan berkas...")

      const result = await executeImport(targetKey, file, (moduleLabel, current, total) => {
        const pct = Math.round((current / total) * 90)
        setProgressPercent(pct)
        setProgressStep(`Memproses: ${moduleLabel} (${current}/${total})...`)
      })

      setProgressPercent(100)
      setProgressStep("Menyelesaikan sinkronisasi data...")
      return result
    },
    onSuccess: (data: ImportResponseSummary) => {
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] })
      queryClient.invalidateQueries({ queryKey: ["employees"] })
      queryClient.invalidateQueries({ queryKey: ["divisions"] })
      queryClient.invalidateQueries({ queryKey: ["departments"] })
      queryClient.invalidateQueries({ queryKey: ["stores"] })
      queryClient.invalidateQueries({ queryKey: ["reportingPeriods"] })
      return data
    },
    onError: (err: unknown) => {
      setProgressStep(null)
      setProgressPercent(0)
      return err
    },
  })

  return {
    ...mutation,
    progressStep,
    progressPercent,
    errorMessage: mutation.error ? getErrorMessage(mutation.error) : null,
  }
}
