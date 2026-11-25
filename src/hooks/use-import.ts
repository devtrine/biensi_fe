import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  executeImport,
  getImportHistory,
  getImportYearlyStatus,
  validateImportFile,
  type ImportResponseSummary,
  type ImportValidationReport,
} from "../services/import.service"
import { getErrorMessage } from "../lib/api/client"

export function useImportYearlyStatus(moduleCode: string, year: number) {
  return useQuery({
    queryKey: ["importYearlyStatus", moduleCode, year],
    queryFn: () => getImportYearlyStatus(moduleCode, year),
    enabled: Boolean(moduleCode) && Boolean(year),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  })
}

export function useImportHistory(moduleCode?: string, year?: number) {
  return useQuery({
    queryKey: ["importHistory", moduleCode, year],
    queryFn: () => getImportHistory(moduleCode, year),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  })
}

export function useValidateImport() {
  const mutation = useMutation({
    mutationFn: async ({
      targetKey,
      file,
    }: {
      targetKey: string
      file: File
    }): Promise<ImportValidationReport> => {
      return await validateImportFile(targetKey, file)
    },
  })

  return {
    ...mutation,
    errorMessage: mutation.error ? getErrorMessage(mutation.error) : null,
  }
}

export function useImportExcel() {
  const queryClient = useQueryClient()
  const [progressStep, setProgressStep] = useState<string | null>(null)
  const [progressPercent, setProgressPercent] = useState<number>(0)

  const mutation = useMutation({
    mutationFn: async ({
      targetKey,
      file,
      resolvedEndpoint,
      confirmStep = 0,
    }: {
      targetKey: string
      file: File
      resolvedEndpoint?: string
      confirmStep?: number
    }) => {
      setProgressPercent(15)
      setProgressStep("Mengirim berkas terverifikasi ke server...")

      const result = await executeImport(
        targetKey,
        file,
        (moduleLabel, current, total) => {
          const pct = Math.round((current / total) * 85)
          setProgressPercent(pct)
          setProgressStep(`Memproses impor: ${moduleLabel} (${current}/${total})...`)
        },
        resolvedEndpoint,
        confirmStep
      )

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
      queryClient.invalidateQueries({ queryKey: ["importYearlyStatus"] })
      queryClient.invalidateQueries({ queryKey: ["importHistory"] })
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
